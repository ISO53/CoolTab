<template>
    <div class="widget" :style="getwidgetStyle">
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
    methods: {
        makeColorTransparent(color, percentage) {
            const r = parseInt(color.substring(1, 3), 16);
            const g = parseInt(color.substring(3, 5), 16);
            const b = parseInt(color.substring(5, 7), 16);
            const alpha = 1 - percentage;

            // Convert RGBA to a hex format with alpha
            const alphaHex = Math.round(alpha * 255)
                .toString(16)
                .padStart(2, "0");

            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
                .toString(16)
                .padStart(2, "0")}${alphaHex}`;
        },
    },
    computed: {
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
                        background: this.makeColorTransparent(
                            this.settingsStore.colors.color_secondary_background,
                            0.8
                        ),
                        backdropFilter: "blur(30px)",
                        border: "2px solid transparent",
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
</style>
