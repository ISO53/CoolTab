import { useSettingsStore } from "@/settings";
import { getPaletteColors } from "@/utils/colorPaletteData";

const API_URL = "https://cool-tab-api.vercel.app/api";
const ROTATION_LOCK_KEY = "daily-wallpaper-lock";
const ROTATION_LOCK_MS = 30000;

/** Local calendar date string (YYYY-MM-DD) — the rotation clock. */
function localDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Builds the display URL from the photo's raw base (ixid intact). Width is
 * bucketed to 320px steps so the URL is stable across sessions — the CDN
 * serves each variant with a one-year browser cache.
 */
function buildDisplayUrl(rawUrl) {
    const screenWidth = window.screen.width * (window.devicePixelRatio || 1);
    const width = Math.min(Math.max(Math.round(screenWidth / 320) * 320, 1280), 3840);
    return `${rawUrl}&w=${width}&q=80&fm=jpg&fit=max`;
}

/**
 * Runs one rotation if it is due. Safe to call on every tab open: it exits
 * early when today's wallpaper is already applied, and a short-lived
 * localStorage lock keeps simultaneously restored tabs from racing.
 * @param {Object} [options]
 * @param {Boolean} [options.force] Rotate even if today is already applied
 *   (used right after enabling the feature, or after a palette/theme change).
 */
export async function rotateDailyWallpaper({ force = false } = {}) {
    const settingsStore = useSettingsStore();

    if (settingsStore.dailyWallpapers !== "Enabled") return;

    const today = localDate();
    if (!force && settingsStore.dailyWallpaper?.date === today) return;

    // Cross-tab lock: another tab restored alongside this one may already
    // be rotating (browser restart, multiple new tabs at once).
    const lockedAt = parseInt(localStorage.getItem(ROTATION_LOCK_KEY));
    if (Date.now() - (lockedAt || 0) < ROTATION_LOCK_MS) return;
    localStorage.setItem(ROTATION_LOCK_KEY, String(Date.now()));

    try {
        await rotate(settingsStore, today, force);
    } catch (e) {
        console.error("Daily wallpaper rotation failed:", e);
    } finally {
        localStorage.removeItem(ROTATION_LOCK_KEY);
    }
}

async function rotate(settingsStore, today, force) {
    const theme = settingsStore.colorPalette?.theme === "Light" ? "Light" : "Dark";
    // "Keep my palette" restricts the cell to the user's chosen family;
    // "Follow wallpaper" accepts any family in the user's theme.
    const family =
        settingsStore.wallpaperColors === "Keep my palette"
            ? settingsStore.colors?.name
            : null;

    const params = new URLSearchParams({ theme });
    if (family) params.set("palette", family);

    const response = await fetch(`${API_URL}/wallpaper-pool?${params.toString()}`);
    if (!response.ok) return; // server hiccup: keep yesterday's wallpaper
    const data = await response.json();
    const candidates = Array.isArray(data.wallpapers) ? data.wallpapers : [];

    if (candidates.length === 0) {
        // Starved cell — the palette filter left nothing to show. Keep
        // yesterday's (which matches by construction) and tell the server
        // so pool sizing can be tuned from the request logs.
        reportFallback(theme, family, "empty");
        return;
    }

    // Exclude the currently applied photo so the day is actually fresh.
    const currentId = force ? null : settingsStore.dailyWallpaper?.id;
    const fresh = currentId ? candidates.filter((photo) => photo.id !== currentId) : candidates;
    if (fresh.length === 0) {
        reportFallback(theme, family, "excluded");
        return;
    }

    const photo = fresh[Math.floor(Math.random() * fresh.length)];

    if (settingsStore.wallpaperColors === "Follow wallpaper" && photo.palette) {
        const palette = getPaletteColors(photo.palette, theme);
        if (palette) {
            settingsStore.setColorPalette({color: photo.palette, theme});
            settingsStore.setColors(palette);
        }
    }

    settingsStore.setDailyWallpaper({
        id: photo.id,
        url: buildDisplayUrl(photo.url),
        color: photo.color,
        description: photo.description,
        palette: photo.palette,
        credit: photo.credit,
        download_location: photo.download_location,
        date: today,
    });

    // Mandatory Unsplash download tracking, routed through our proxy so the
    // access key stays server-side. Fire-and-forget.
    if (photo.download_location) {
        fetch(`${API_URL}/track-wallpaper-download`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: photo.download_location}),
        }).catch(() => {});
    }
}

/** Fire-and-forget analytics ping the admin dashboard aggregates per cell. */
function reportFallback(theme, family, reason) {
    const params = new URLSearchParams({
        theme,
        palette: family || "any",
        reason,
    });
    fetch(`${API_URL}/wallpaper-fallback?${params.toString()}`, {method: "POST"}).catch(() => {});
}
