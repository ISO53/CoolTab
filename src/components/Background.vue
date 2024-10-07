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
    width: 100vw;
    height: 100vh;
    margin: 0;
    object-position: center;
}
</style>
