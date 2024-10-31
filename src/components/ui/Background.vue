<template>
    <div
        class="background"
        :style="{
            backgroundImage: 'url(' + settingsStore.backgroundImage + ')',
            backgroundSize: settingsStore.backgroundSize,
            backgroundColor: settingsStore.colors.color_primary_background,
        }"
    ></div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "Background",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
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
    background-repeat: no-repeat;
    background-position: center;
}
</style>
