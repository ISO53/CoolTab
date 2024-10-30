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
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);

            // Calculate the alpha value
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
                        color: this.settingsStore.colors.color_secondary_text,
                    };
                case "Transparent":
                    return {
                        background: "transparent",
                        border: "2px solid transparent",
                        color: this.settingsStore.colors.color_secondary_text,
                    };
                case "Blur":
                    return {
                        background: this.makeColorTransparent(
                            this.settingsStore.colors.color_secondary_background,
                            0.2
                        ),
                        backdropFilter: "blur(10px)",
                        border: "2px solid transparent",
                        color: this.settingsStore.colors.color_secondary_text,
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
}
</style>
