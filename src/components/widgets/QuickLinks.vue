<template>
    <Widget style="height: unset;">
        <div
            class="quick-links"
            :class="settingsStore.quickLinks.orientation === 'Vertical' ? 'vertical' : 'horizontal'"
        >
            <base href="/" />
            <a
                v-for="(link, index) in settingsStore.quickLinks.links"
                :key="link"
                :href="'https://' + link"
                :target="settingsStore.quickLinks.open_link_in === 'New Tab' ? '_blank' : '_self'"
                rel="noopener noreferrer"
            >
                <img :src="faviconUrls[link]" alt="favicon" class="link" />
            </a>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";
import { getItem, setItem } from "@/utils/db";

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
            faviconUrls: {},
        };
    },
    mounted() {
        this.loadFavicons();
    },
    beforeUnmount() {
        // Revoke all favicon object URLs to free memory
        Object.values(this.faviconUrls).forEach((url) => {
            if (url && url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        });
    },
    methods: {
        async loadFavicons() {
            const urls = this.settingsStore.quickLinks.links;
            const newFaviconUrls = { ...this.faviconUrls };
            let updated = false;

            for (const url of urls) {
                try {
                    let blob = await getItem(`favicon-${url}`);
                    if (!blob) {
                        // Fetch if not in cache
                        const request = `https://cool-tab-api.vercel.app/api/favicon?hostname=${url}`;
                        const response = await fetch(request);
                        blob = await response.blob();
                        await setItem(`favicon-${url}`, blob);
                    }
                    
                    if (blob instanceof Blob) {
                        newFaviconUrls[url] = URL.createObjectURL(blob);
                        updated = true;
                    }
                } catch (error) {
                    console.error(`Error loading favicon for ${url}:`, error);
                }
            }

            if (updated) {
                this.faviconUrls = newFaviconUrls;
            }
        },
    },
};
</script>

<style scoped>
.quick-links {
    padding: 8px 12px 8px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.quick-links a {
    width: 30px;
    height: 30px;
    object-fit: contain;
    overflow: hidden;
}

.vertical {
    width: 50px;
    height: 100%;
    flex-direction: column;
    row-gap: 10px;
}

.horizontal {
    width: 100%;
    height: 50px;
    flex-direction: row;
    column-gap: 10px;
}

.link {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: contain;
    filter: grayscale(100%);
    transition: filter 250ms ease;
}

.link:hover {
    filter: grayscale(0%);
}
</style>
