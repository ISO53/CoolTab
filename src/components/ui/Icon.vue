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
/* No default width/height here: sizing belongs to each call site's CSS and
   must not compete with it. Unsized icons use the svg's intrinsic 24px. */
.icon {
    flex-shrink: 0;
    user-select: none;
}
</style>
