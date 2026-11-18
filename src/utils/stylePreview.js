/**
 * Style preview thumbnails.
 *
 * A preview is a small JPEG snapshot of a design, stored as a Blob in IndexedDB under
 * `style-preview-${id}`; the style itself only carries a `hasPreview` flag in localStorage.
 * Two generation paths:
 * - captureCurrentDesign(): screenshots the live page; used when saving a style.
 * - renderStylePreview(style): re-renders a saved style snapshot in an off-screen Vue
 *   app and captures it; used to backfill previews for styles saved before previews
 *   existed (and for imported community styles).
 */
import {createApp} from "vue";
import {createPinia} from "pinia";
import {getItem} from "./db";
import {clickOutside} from "./clickOutside";
import StyleRenderRoot from "@/components/ui/StyleRenderRoot.vue";
import Svg from "@/components/ui/Svg.vue";

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_QUALITY = 0.85;

// UI overlays (sidebar, action buttons) that are open when a style is saved but
// are not part of the design itself
const LIVE_CAPTURE_EXCLUDE = [".overlay", ".slide", "#Buttons"];

/**
 * Screenshot the live page (with UI overlays removed) as a thumbnail Blob.
 * @returns {Promise<Blob|null>} null when the capture fails
 */
export async function captureCurrentDesign() {
    const element = document.querySelector(".app");
    if (!element) return null;

    try {
        const {snapdom} = await import("@zumer/snapdom");
        const result = await snapdom(element, {
            exclude: LIVE_CAPTURE_EXCLUDE,
            excludeMode: "remove",
            // The palette may have been changed through :root without a DOM signal snapdom can see
            invalidate: true,
        });
        const {useSettingsStore} = await import("@/settings");
        return await result.toBlob({
            format: "jpeg",
            quality: THUMBNAIL_QUALITY,
            width: THUMBNAIL_WIDTH,
            dpr: 1,
            backgroundColor: useSettingsStore().colors.color_primary_background,
        });
    } catch (e) {
        console.error("Failed to capture style preview:", e);
        return null;
    }
}

/**
 * Re-render a saved style snapshot off-screen and capture it as a thumbnail Blob.
 * The snapshot is rendered in a dedicated Vue app with its own Pinia store, seeded
 * from the snapshot, so the live page's state, :root CSS variables and storage are
 * never touched.
 * @param {Object} style a saved style ({id, settings})
 * @returns {Promise<Blob|null>} null when the capture fails
 */
export async function renderStylePreview(style) {
    const container = document.createElement("div");
    container.style.cssText =
        "position:fixed;left:-10000px;top:0;width:100vw;height:100vh;overflow:hidden;pointer-events:none;z-index:-1;";
    applyColorVariables(container, style?.settings?.colors);
    document.body.appendChild(container);

    const pinia = createPinia();
    const app = createApp(StyleRenderRoot);
    app.component("Svg", Svg);
    app.directive("click-outside", clickOutside);
    app.use(pinia);

    let objectUrl = null;
    try {
        const {useSettingsStore} = await import("@/settings");
        objectUrl = await seedStoreFromSnapshot(useSettingsStore(pinia), style);
        app.mount(container);

        // Give widgets a moment to mount and images/fonts to settle before capturing
        await new Promise((resolve) => setTimeout(resolve, 400));

        const {snapdom} = await import("@zumer/snapdom");
        const result = await snapdom(container.firstElementChild);
        return await result.toBlob({
            format: "jpeg",
            quality: THUMBNAIL_QUALITY,
            width: THUMBNAIL_WIDTH,
            dpr: 1,
            backgroundColor: style?.settings?.colors?.color_primary_background || "#000000",
        });
    } catch (e) {
        console.error("Failed to render style preview:", e);
        return null;
    } finally {
        app.unmount();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        container.remove();
    }
}

/**
 * Scope the style's palette to the render container: widgets resolve var(--color-*)
 * from the nearest ancestor, so overriding them here applies the style's colors
 * without touching :root on the live page.
 */
function applyColorVariables(element, colors) {
    if (!colors) return;
    for (const key in colors) {
        if (Object.hasOwn(colors, key)) {
            element.style.setProperty(`--${key.replaceAll("_", "-")}`, colors[key]);
        }
    }
}

/**
 * Copy a style snapshot into a fresh store instance. State is assigned directly —
 * never through the store's setters — because the setters persist to the live
 * user's localStorage and IndexedDB (e.g. setBackgroundImage writes the global
 * "background-image" key).
 * @returns {Promise<String|null>} the background object URL created for the capture (caller revokes it)
 */
async function seedStoreFromSnapshot(store, style) {
    const s = style?.settings || {};
    store.backgroundImageFileName = s.backgroundImageFileName ?? null;
    store.backgroundSize = s.backgroundSize ?? "Cover";
    store.widgetBackground = s.widgetBackground ?? "Color";
    store.colorPalette = JSON.parse(JSON.stringify(s.colorPalette ?? {theme: "Dark"}));
    store.widgets = JSON.parse(JSON.stringify(s.widgets ?? []));
    store.widgetAreaColumns = s.widgetAreaColumns ?? 33;
    store.analogClockStyle = s.analogClockStyle ?? "Minimal";
    if (s.colors) store.colors = JSON.parse(JSON.stringify(s.colors));

    // Background: prefer the style's own copy in IndexedDB, fall back to the snapshot's
    // remote URL (community imports keep their wallpaper as a URL, not a local blob).
    let objectUrl = null;
    try {
        const blob = await getItem(`style-image-${style.id}`);
        if (blob) {
            objectUrl = URL.createObjectURL(blob);
        } else if (typeof s.backgroundImage === "string" && s.backgroundImage.trim() && !s.backgroundImage.startsWith("blob:")) {
            const response = await fetch(s.backgroundImage);
            objectUrl = URL.createObjectURL(await response.blob());
        }
    } catch (e) {
        console.error("Failed to load style background for preview:", e);
    }
    store.backgroundImage = objectUrl;
    return objectUrl;
}
