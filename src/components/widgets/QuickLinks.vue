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
                <img :src="settingsStore.quickLinks.images[index]" alt="favicon" class="link" />
            </a>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "QuickLinks",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    mounted() {
        this.setFavicons();
    },
    methods: {
        setFavicons() {
            if (
                !this.settingsStore.quickLinks.images ||
                this.settingsStore.quickLinks.images.length === 0 ||
                this.settingsStore.quickLinks.links.length !== this.settingsStore.quickLinks.images.length ||
                this.settingsStore.quickLinks.images[0] === ""
            ) {
                const urls = this.settingsStore.quickLinks.links;

                const fetchFavicon = async (url) => {
                    const request = `https://cool-tab-api.vercel.app/api/favicon?hostname=${url}`;
                    const response = await fetch(request);
                    const buffer = await response.arrayBuffer();
                    const base64data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                    return `data:image/x-icon;base64,${base64data}`;
                };

                const fetchPromises = urls.map((url) => fetchFavicon(url));

                Promise.all(fetchPromises)
                    .then((faviconImages) => {
                        const curr = this.settingsStore.quickLinks;
                        curr.images = faviconImages;
                        this.settingsStore.setQuickLinks(curr);
                    })
                    .catch((error) => console.error("Error fetching favicons:", error));
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
