<template>
    <div
        class="quick-links"
        :class="settingsStore.quickLinks.orientation === 'Vertical' ? 'vertical' : 'horizontal'"
            :style="{ '--n': count, '--gap': GAP }"
    >
        <a
            v-for="site in visibleSites"
            :key="site.url"
            :href="site.url"
            :target="settingsStore.quickLinks.open_link_in === 'New Tab' ? '_blank' : '_self'"
            rel="noopener noreferrer"
            :title="site.title"
        >
            <Widget class="tile">
                <img
                    v-if="faviconSrcs[site.url]"
                    :src="faviconSrcs[site.url]"
                    alt="favicon"
                    class="link"
                />
                <Icon v-else name="globe" class="link placeholder" />
            </Widget>
        </a>
    </div>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";
import {getTopSites} from "@/utils/omnibox";
import {getFavicon} from "@/utils/favicons";

// Gap between tiles as a fraction of a grid unit, shared with CSS via --gap.
const GAP = 0.15;

export default {
    name: "QuickLinks",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore, GAP};
    },
    data() {
        return {
            sites: [],
            faviconSrcs: {},
        };
    },
    computed: {
        // Tiles span the short axis; N * short + (N - 1) * GAP <= long yields the count.
        count() {
            const widget = this.settingsStore.widgets.find((w) => w.name === "QuickLinks");
            if (!widget) return 0;
            const long = Math.max(widget.width, widget.height);
            const short = Math.min(widget.width, widget.height);
            return Math.floor((long + GAP) / (short + GAP));
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
.quick-links a {
    all: unset;
    display: flex;
    cursor: pointer;
}

.quick-links a::after {
    /* base.css animates an underline bar onto every link */
    display: none;
}

.quick-links {
	width: 100%;
	height: 100%;
    display: flex;
    container-type: size;
    justify-content: center;
    align-items: center;
}

.vertical {
    flex-direction: column;
}

/* Slots fund their share of the gaps: flex gap on the container itself can't use container units. */
.vertical a {
    width: 100%;
    height: calc((100cqh - (var(--n) - 1) * var(--gap) * 100cqw) / var(--n));
    margin-bottom: calc(var(--gap) * 100cqw);
    justify-content: center;
}

.vertical a:last-child {
    margin-bottom: 0;
}

.vertical a .tile {
    width: 100cqw;
    height: 100cqw;
}

.horizontal {
    flex-direction: row;
}

.horizontal a {
    width: calc((100cqw - (var(--n) - 1) * var(--gap) * 100cqh) / var(--n));
    height: 100%;
    margin-right: calc(var(--gap) * 100cqh);
    justify-content: center;
}

.horizontal a:last-child {
    margin-right: 0;
}

.horizontal a .tile {
    width: 100cqh;
    height: 100cqh;
}

/* Each tile is a full <Widget> so the widget background setting applies per site. */
.quick-links a .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.link {
    width: 65%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 50%;
    filter: grayscale(100%);
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
