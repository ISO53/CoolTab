<template>
    <Widget style="height: unset" class="widget">
        <div class="search-bar">
            <Svg class="search-logo" :name="'search'"></Svg>

            <input
                type="text"
                v-model="searchQuery"
                @keypress.enter="handleSearch"
                placeholder="Search..."
                class="search-input"
            />

            <Svg :name="'close'" v-if="searchQuery" @click="searchQuery = ''" class="clear-button"></Svg>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "SearchBar",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            searchQuery: "",
        };
    },
    methods: {
        handleSearch() {
            const searchEngines = new Map([
                ["Google", "https://www.google.com/search?q="],
                ["Bing", "https://www.bing.com/search?q="],
                ["DuckDuckGo", "https://duckduckgo.com/?q="],
                ["Yahoo", "https://search.yahoo.com/search?p="],
                ["Ecosia", "https://www.ecosia.org/search?q="],
                ["Yandex", "https://yandex.com/search/?text="],
                ["Startpage", "https://www.startpage.com/do/dsearch?query="],
                ["Swisscows", "https://swisscows.com/web?query="],
            ]);

            const request = searchEngines.get(this.settingsStore.searchEngine) + encodeURIComponent(this.searchQuery);

            if (this.settingsStore.openSearchResultIn === "New Tab") {
                window.open(request, "_blank");
            } else {
                window.location.href = request; // Current Tab
            }
        },
    },
};
</script>

<style scoped>
.search-bar {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px;
    transition: color 250ms ease;
}

.search-logo {
    height: 100%;
}

.search-input {
    width: 100%;
    border: none;
    background-color: transparent;
    color: var(--color-secondary-text);
    padding: 0 8px 0 8px;
    font-size: 1rem;
}

.search-input::placeholder {
    color: var(--color-tertiary-text);
}

.search-input:focus {
    outline: none;
}

.clear-button {
    height: 100%;
    cursor: pointer;
    transition: color 250ms ease;
}

.clear-button:hover {
    color: var(--color-primary-text);
}
</style>
