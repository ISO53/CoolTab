<template>
    <div v-if="isOpen && hoveredName" class="wallpaper-name">{{ hoveredName }}</div>
    <Transition name="slide">
        <div v-if="isOpen" class="gallery" v-click-outside="close">
            <div class="page-indicator">Page {{ page + 1 }} / {{ totalPages }}</div>
            <button class="nav-btn" @click="prev" :disabled="page === 0">
                <Svg :class_name="'material-icons-outlined'" :name="'chevron_left'"></Svg>
            </button>

            <div class="previews">
                <template v-for="wp in visibleWallpapers">
                    <div
                        v-if="wp"
                        :key="wp._id"
                        class="thumb"
                        @mouseenter="onHover(wp)"
                        @mouseleave="onLeave"
                    >
                        <img :src="wp.preview_url" />
                        <button v-if="hoveredId === wp._id" class="apply-btn" @click.stop="apply(wp)">Apply</button>
                    </div>
                    <div v-else class="thumb loading-thumb">
                        <div class="loader"></div>
                    </div>
                </template>
            </div>

            <button class="nav-btn" @click="next" :disabled="isLastPage || loading">
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
            totalItems: 0,
            loading: false,
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
        totalPages() {
            return Math.ceil(this.totalItems / PAGE_SIZE) || 1;
        },
        isLastPage() {
            return this.page + 1 >= this.totalPages;
        },
    },
    watch: {
        page(newVal) {
            if (this.settingsStore.rememberWallpaperPage) {
                localStorage.setItem("last-wallpaper-page", newVal);
            }
        },
    },
    methods: {
        async toggle() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.savedImage = this.settingsStore.backgroundImage;
                if (this.settingsStore.rememberWallpaperPage) {
                    this.page = parseInt(localStorage.getItem("last-wallpaper-page")) || 0;
                } else {
                    this.page = 0;
                }
                if (!this.wallpapers.length || !this.wallpapers[this.page * PAGE_SIZE]) {
                    const apiPage = Math.floor((this.page * PAGE_SIZE) / 20) + 1;
                    await this.fetchWallpapers(apiPage);
                }
            } else {
                this.restoreBackground();
            }
        },
        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            this.restoreBackground();
        },
        async fetchWallpapers(p = 1) {
            if (this.loading) return;
            this.loading = true;
            try {
                const res = await fetch(`https://cool-tab-api.vercel.app/api/search-wallpapers?limit=20&page=${p}`);
                const data = await res.json();

                const startIndex = (p - 1) * 20;
                // Fill gaps if any
                if (this.wallpapers.length < startIndex) {
                    for (let i = this.wallpapers.length; i < startIndex; i++) {
                        this.wallpapers[i] = null;
                    }
                }
                this.wallpapers.splice(startIndex, data.wallpapers.length, ...data.wallpapers);

                this.totalItems = data.totalItems;
            } catch (e) {
                console.error("Failed to fetch wallpapers:", e);
            } finally {
                this.loading = false;
            }
        },
        prev() {
            if (this.page > 0) {
                this.page--;
                if (!this.wallpapers[this.page * PAGE_SIZE]) {
                    const apiPage = Math.floor((this.page * PAGE_SIZE) / 20) + 1;
                    this.fetchWallpapers(apiPage);
                }
            }
        },
        next() {
            if (this.isLastPage || this.loading) return;

            const nextLocalPage = this.page + 1;
            const nextStart = nextLocalPage * PAGE_SIZE;

            if (this.wallpapers[nextStart]) {
                this.page = nextLocalPage;
            } else {
                const nextApiPage = Math.floor(nextStart / 20) + 1;
                this.fetchWallpapers(nextApiPage).then(() => {
                    this.page = nextLocalPage;
                });
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

.page-indicator {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--color-primary-background), transparent 40%);
    backdrop-filter: blur(10px);
    color: var(--color-primary-text);
    border: 2px solid var(--color-border-line);
    border-radius: 20px;
    padding: 4px 12px;
    font-family: Satoshi-Bold;
    font-size: 0.8rem;
    white-space: nowrap;
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
    transition: border-color 200ms ease, opacity 200ms ease;
}

.nav-btn:hover:not(:disabled) {
    border-color: var(--color-secondary-text);
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.nav-btn i {
    font-size: 26px;
    color: var(--color-secondary-text);
}

.previews {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 632px; /* 5 * 120 + 4 * 8 + 2 * 2 (borders) */
    justify-content: center;
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

.loading-thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--color-primary-background), transparent 60%);
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border-line);
    border-top: 2px solid var(--color-primary-text);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
