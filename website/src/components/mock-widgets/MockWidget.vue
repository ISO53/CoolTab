<template>
    <div :class="['mock-widget glass-panel', `size-${size}`]">
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
    size: {
        type: String,
        default: '1x1', // '1x1', '2x1', '1x2', '2x2'
    }
});
</script>

<style scoped>
.mock-widget {
    border-radius: 20px;
    padding: 0;
    overflow: hidden;
    background: rgba(30, 30, 30, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    container-type: size;
}

/* Base unit size for the grid, e.g., 200px */
.size-1x1 {
    width: 200px;
    height: 200px;
}

.size-2x1 {
    width: 420px; /* 200 + 200 + 20px gap */
    height: 200px;
}
</style>
