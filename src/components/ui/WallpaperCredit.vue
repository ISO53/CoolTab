<template>
    <div v-if="visible" class="wallpaper-credit" :title="settingsStore.dailyWallpaper?.description || ''">
        Photo by
        <a :href="credit.profileUrl" target="_blank" rel="noopener noreferrer">{{ credit.name }}</a>
        on
        <a :href="credit.unsplashUrl" target="_blank" rel="noopener noreferrer">Unsplash</a>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "WallpaperCredit",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    computed: {
        visible() {
            return (
                this.settingsStore.dailyWallpapers === "Enabled" &&
                !!this.settingsStore.dailyWallpaper?.credit
            );
        },
        credit() {
            return this.settingsStore.dailyWallpaper.credit;
        },
    },
};
</script>

<style scoped>
.wallpaper-credit {
    position: fixed;
    right: 12px;
    bottom: 8px;
    z-index: 1000;
    font-size: 0.7rem;
    font-family: Satoshi-Light, sans-serif;
    color: var(--color-secondary-text);
    opacity: 0.7;
    transition: opacity 200ms ease;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    user-select: none;
}

.wallpaper-credit:hover {
    opacity: 1;
}

.wallpaper-credit a {
    color: var(--color-secondary-text);
    text-decoration: none;
    font-weight: bold;
}
</style>
