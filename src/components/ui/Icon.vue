<template>
    <component v-if="icon" :is="icon" class="icon" />
</template>

<script>
import {ICONS} from "@/utils/icons";

// Renders a registered icon as an inline SVG. Names resolve through the
// central registry in icons.js.
export default {
    name: "Icon",
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        icon() {
            const icon = ICONS[this.name];
            if (!icon && import.meta.env.DEV) {
                console.warn(`[Icon] Unknown icon name: "${this.name}"`);
            }
            return icon || null;
        },
    },
};
</script>

<style scoped>
.icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    user-select: none;
}
</style>
