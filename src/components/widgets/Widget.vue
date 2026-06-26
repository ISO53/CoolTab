<template>
    <div class="widget" :class="{'widget--glass': isGlass}" :style="getwidgetStyle">
        <slot></slot>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "Widget",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    computed: {
        isGlass() {
            return this.settingsStore.widgetBackground === "Glass";
        },
        getwidgetStyle() {
            switch (this.settingsStore.widgetBackground) {
                case "Color":
                    return {
                        background: this.settingsStore.colors.color_secondary_background,
                        border: "2px solid " + this.settingsStore.colors.color_border_line,
                    };
                case "Transparent":
                    return {
                        background: "transparent",
                        border: "2px solid transparent",
                    };
                case "Blur":
                    return {
						background:
							this.settingsStore.colorPalette.theme === 'Dark' ?
								`color-mix(in srgb, var(--color-secondary-background), transparent 80%)`
								:
								`color-mix(in srgb, var(--color-secondary-background), transparent 40%)`,
                        backdropFilter: "blur(30px)",
                        border: "2px solid transparent",
                    };
                case "Glass":
                    return {
                        position: "relative",
                        border: "none",
                        overflow: "hidden",
                        willChange: "transform",
                        isolation: "isolate",
                        backdropFilter: "blur(18px) saturate(1.4) brightness(1.05)",
                        webkitBackdropFilter: "blur(18px) saturate(1.4) brightness(1.05)",

                        // Dynamic tint adaptation (CSS approximation using color-mix)
                        background: `linear-gradient(
                            165deg,
                            color-mix(in srgb, var(--color-secondary-background), transparent 88%) 0%,
                            color-mix(in srgb, var(--color-secondary-background), transparent 94%) 50%,
                            color-mix(in srgb, var(--color-secondary-background), transparent 90%) 100%
                        )`,

                        // Layered depth: drop shadows and inset top/bottom edges
                        boxShadow: `
                            0 8px 32px rgba(0, 0, 0, 0.25),
                            0 2px 8px rgba(0, 0, 0, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.15),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.08)
                        `
                    };
                default:
                    return {};
            }
        },
    },
};
</script>

<style scoped>
.widget {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    user-select: none;
    font-family: Satoshi-Regular;
    overflow: hidden;
    color: var(--color-secondary-text);
}

.widget--glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: -1;

    /* Directional border — light comes from upper-left. */
    border-top: 1px solid rgba(255, 255, 255, 0.45);
    border-left: 1px solid rgba(255, 255, 255, 0.28);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    /* Specular highlight layers */
    background:
        /* Primary specular — top-left hotspot shifted close to corner */
        radial-gradient(
            ellipse 55% 35% at 8% 0%,
            rgba(255, 255, 255, 0.20) 0%,
            rgba(255, 255, 255, 0.07) 40%,
            transparent 70%
        ),
        /* Secondary — wide top sweep */
        linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.09) 0%,
            rgba(255, 255, 255, 0.03) 25%,
            transparent 40%
        );
}

/* Subtle inner glow */
.widget--glass::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: -2;

    background:
        radial-gradient(
            ellipse at 50% 25%,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0.025) 45%,
            transparent 75%
        );

    box-shadow: inset 0 -2px 8px rgba(0, 0, 0, 0.06);
}
</style>
