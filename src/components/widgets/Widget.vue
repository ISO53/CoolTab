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
                        background: `color-mix(in srgb, var(--color-secondary-background), transparent 80%)`,
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
