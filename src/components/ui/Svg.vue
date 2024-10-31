<template>
    <i class="material-icons-outlined svg" draggable="false">{{ name }}</i>
</template>

<script>
export default {
    name: "Svg",
    props: {
        name: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.svg {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    font-size: 1.8rem;
    color: var(--color-secondary-text);
}
</style>
