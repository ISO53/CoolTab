<template>
    <div class="background" :style="{ backgroundColor: backgroundTint }">
        <Transition name="wallpaper">
            <div
                :key="backgroundUrl || 'none'"
                class="wallpaper-layer"
                :style="{
                    backgroundImage: backgroundUrl ? 'url(' + backgroundUrl + ')' : 'none',
                    backgroundSize: settingsStore.backgroundSize,
                }"
            ></div>
        </Transition>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "Background",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    computed: {
        backgroundUrl() {
            if (this.settingsStore.dailyWallpapers === "Enabled" && this.settingsStore.dailyWallpaper?.url) {
                return this.settingsStore.dailyWallpaper.url;
            }
            return this.settingsStore.backgroundImage;
        },
        // While the daily photo loads, the background sits on the photo's
        // average color (from the API) instead of flashing the theme base.
        backgroundTint() {
            if (this.settingsStore.dailyWallpapers === "Enabled" && this.settingsStore.dailyWallpaper?.color) {
                return this.settingsStore.dailyWallpaper.color;
            }
            return this.settingsStore.colors.color_primary_background;
        },
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
    z-index: -1000;
    overflow: hidden;
    transition: background-color 400ms ease;
}

.wallpaper-layer {
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-position: center;
}

.wallpaper-enter-active, .wallpaper-leave-active {
    transition: opacity 600ms ease;
}

.wallpaper-enter-active {
    z-index: 1;
}

.wallpaper-enter-from, .wallpaper-leave-to {
    opacity: 0;
}
</style>
