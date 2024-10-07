<template>
    <div class="background" style="background-image: 'url(${image})'; object-fit: '${objectFit}'"></div>
</template>

<script>
export default {
    name: "Background",
    data() {
        return {
            image: null,
            objectFit: "contain",
        };
    },
};
</script>

<style scoped>
.background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    object-position: center;
    z-index: -1000;
    overflow: hidden;
}
</style>
