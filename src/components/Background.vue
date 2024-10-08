<template>
    <div class="background" :style="{ backgroundImage: 'url(' + image + ')', backgroundSize: size }"></div>
</template>

<script>
export default {
    name: "Background",
    data() {
        return {
            image: null,
            size: null,
        };
    },
    created() {
        const backgroundImage = localStorage.getItem("background-image");
        if (backgroundImage) this.image = backgroundImage;

        const backgroundImageFit = localStorage.getItem("background-image-fit");
        if (backgroundImageFit) this.size = backgroundImageFit;
    }
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
    background-repeat: no-repeat;
    background-position: center;
}
</style>
