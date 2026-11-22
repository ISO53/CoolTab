<template>
    <Widget>
        <div
            class="quick-links"
            :class="settingsStore.quickLinks.orientation === 'Vertical' ? 'vertical' : 'horizontal'"
            :style="{ '--n': count }"
        >
            <a
                v-for="site in visibleSites"
                :key="site.url"
                :href="site.url"
                :target="settingsStore.quickLinks.open_link_in === 'New Tab' ? '_blank' : '_self'"
                rel="noopener noreferrer"
                :title="site.title"
            >
                <div class="tile">
                    <img
                        v-if="faviconSrcs[site.url]"
                        :src="faviconSrcs[site.url]"
                        alt="favicon"
                        class="link"
                    />
                    <Icon v-else name="globe" class="link placeholder" />
                </div>
            </a>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";
import {getTopSites} from "@/utils/omnibox";
import {getFavicon} from "@/utils/favicons";

export default {
    name: "QuickLinks",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            sites: [],
            faviconSrcs: {},
        };
    },
    computed: {
        // The widget only resizes along one axis (horizontal/vertical resize
        // mode), so its long axis holds one tile per grid cell.
        count() {
            const widget = this.settingsStore.widgets.find((w) => w.name === "QuickLinks");
            if (!widget) return 0;
            return Math.max(widget.width, widget.height);
        },
        visibleSites() {
            return this.sites.slice(0, this.count);
        },
    },
    watch: {
        visibleSites: {
            handler: "loadFavicons",
        },
    },
    async mounted() {
        this.sites = await getTopSites();
    },
    beforeUnmount() {
        // Revoke all favicon object URLs to free memory
        Object.values(this.faviconSrcs).forEach((url) => {
            if (url?.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        });
    },
    methods: {
        async loadFavicons() {
            for (const site of this.visibleSites) {
                if (site.url in this.faviconSrcs) continue;
                // Placeholder while resolving; null means "no favicon"
                this.faviconSrcs[site.url] = null;
                this.faviconSrcs[site.url] = await getFavicon(site.url);
            }
        },
    },
};
</script>

<style scoped>
.quick-links :deep(a) {
    all: unset;
    display: block;
    cursor: pointer;
}

.quick-links :deep(a::after) {
    display: none;
}

.quick-links {
	width: 100%;
	height: 100%;
    display: flex;
    container-type: size;
    padding: 5px;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.vertical {
    flex-direction: column;
}

.vertical a {
    width: calc(min(100cqw, 100cqh / var(--n)) - 10px);
    height: calc(min(100cqw, 100cqh / var(--n)) - 10px);
}

.horizontal {
    flex-direction: row;
}

.horizontal a {
    width: calc(min(100cqh, 100cqw / var(--n)) - 10px);
    height: calc(min(100cqh, 100cqw / var(--n)) - 10px);
}

.tile {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    box-sizing: border-box;
}

.link {
    width: 55%;
    filter: grayscale(100%);
    transition: filter 200ms ease;
}

.link:hover {
    filter: grayscale(0%);
}

.placeholder {
    width: 45%;
    height: 45%;
    opacity: 0.5;
}
</style>
