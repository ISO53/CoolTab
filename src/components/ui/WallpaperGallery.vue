<template>
    <div v-if="isOpen && hoveredName" class="wallpaper-name">{{ hoveredName }}</div>
    <Transition name="slide">
        <div v-if="isOpen" class="gallery" v-click-outside="close">
            <button class="nav-btn" @click="prev">
                <Svg :class_name="'material-icons-outlined'" :name="'chevron_left'"></Svg>
            </button>

            <div class="previews">
                <div
                    v-for="wp in visibleWallpapers"
                    :key="wp._id"
                    class="thumb"
                    @mouseenter="onHover(wp)"
                    @mouseleave="onLeave"
                >
                    <img :src="wp.preview_url" />
                    <button v-if="hoveredId === wp._id" class="apply-btn" @click.stop="apply(wp)">Apply</button>
                </div>
            </div>

            <button class="nav-btn" @click="next">
                <Svg :class_name="'material-icons-outlined'" :name="'chevron_right'"></Svg>
            </button>
        </div>
    </Transition>
</template>

<script>
import {useSettingsStore} from "@/settings";
import {setItem} from "@/utils/db";

const PAGE_SIZE = 5;

export default {
    name: "WallpaperGallery",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            isOpen: false,
            wallpapers: [],
            page: 0,
            hoveredId: null,
            hoveredName: null,
            savedImage: null,
        };
    },
    computed: {
        visibleWallpapers() {
            const start = this.page * PAGE_SIZE;
            return this.wallpapers.slice(start, start + PAGE_SIZE);
        },
    },
    methods: {
        async toggle() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.savedImage = this.settingsStore.backgroundImage;
                if (!this.wallpapers.length) await this.fetchWallpapers();
            } else {
                this.restoreBackground();
            }
        },
        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            this.restoreBackground();
        },
        async fetchWallpapers() {
            try {
                const seed = new Date().toISOString().slice(0, 10);
                const res = await fetch(`https://cool-tab-api.vercel.app/api/search-wallpapers?seed=${seed}&limit=20&page=1`);
                this.wallpapers = await res.json();
                this.page = 0;
            } catch (e) {
                console.error("Failed to fetch wallpapers:", e);
            }
        },
        prev() {
            if (this.page > 0) this.page--;
        },
        next() {
            this.page++;
            if ((this.page + 1) * PAGE_SIZE >= this.wallpapers.length) this.loadMore();
        },
        async loadMore() {
            try {
                const seed = new Date().toISOString().slice(0, 10);
                const apiPage = Math.floor(this.wallpapers.length / 20) + 1;
                const res = await fetch(
                    `https://cool-tab-api.vercel.app/api/search-wallpapers?seed=${seed}&limit=20&page=${apiPage}`,
                );
                const more = await res.json();
                if (more.length) this.wallpapers.push(...more);
            } catch (e) {
                console.error("Failed to load more wallpapers:", e);
            }
        },
        onHover(wp) {
            if (wp.image_url) {
                this.hoveredId = wp._id;
                this.hoveredName = wp.name;
                this.settingsStore.backgroundImage = wp.image_url;
            }
        },
        onLeave() {
            this.hoveredId = null;
            this.hoveredName = null;
            this.settingsStore.backgroundImage = this.savedImage;
        },
        async apply(wp) {
            if (wp.image_url) {
                try {
                    const blob = await this.fetchImageAsBlob(wp.image_url);
                    await this.settingsStore.setBackgroundImage(blob, true);
                } catch {
                    this.settingsStore.backgroundImage = wp.image_url;
                    await setItem("background-image", wp.image_url);
                }
                this.savedImage = this.settingsStore.backgroundImage;
                this.isOpen = false;
            }
        },
        fetchImageAsBlob(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    canvas.toBlob((blob) => (blob ? resolve(blob) : reject()), "image/jpeg", 0.95);
                };
                img.onerror = reject;
                img.src = url;
            });
        },
        restoreBackground() {
            this.hoveredId = null;
            this.hoveredName = null;
            if (this.savedImage) {
                this.settingsStore.backgroundImage = this.savedImage;
            } else {
                this.settingsStore.backgroundImage = null;
            }
        },
    },
};
</script>

<style scoped>
.gallery {
    position: absolute;
    bottom: 2vh;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 9000;
}

.nav-btn {
    background: color-mix(in srgb, var(--color-primary-background), transparent 40%);
    border: 2px solid var(--color-border-line);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    transition: border-color 200ms ease;
}

.nav-btn:hover {
    border-color: var(--color-secondary-text);
}

.nav-btn i {
    font-size: 26px;
    color: var(--color-secondary-text);
}

.previews {
    display: flex;
    gap: 8px;
    align-items: center;
}

.thumb {
    position: relative;
    width: 120px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid var(--color-border-line);
    cursor: pointer;
    transition: border-color 200ms ease;
}

.thumb:hover {
    border-color: var(--color-secondary-text);
}

.thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.apply-btn {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    background: color-mix(in srgb, var(--color-primary-background), transparent 20%);
    backdrop-filter: blur(10px);
    color: var(--color-primary-text);
    border: 2px solid var(--color-border-line);
    border-radius: 6px;
    padding: 6px 16px;
    font-family: Satoshi-Bold;
    font-size: 0.9rem;
    cursor: pointer;
}

.wallpaper-name {
    position: absolute;
    top: 2vh;
    left: 50%;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--color-primary-background), transparent 40%);
    backdrop-filter: blur(10px);
    color: var(--color-primary-text);
    border: 2px solid var(--color-border-line);
    border-radius: 8px;
    padding: 6px 16px;
    font-family: Satoshi-Bold;
    font-size: 0.9rem;
    white-space: nowrap;
    z-index: 9000;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 300ms ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translate(-50%, 150px);
    opacity: 0;
}
</style>
