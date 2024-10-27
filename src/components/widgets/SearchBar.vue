<template>
    <div class="search-bar">
        <img class="search-logo" src="@/components/icons/search.svg" />

        <input
            type="text"
            v-model="searchQuery"
            @keypress.enter="handleSearch"
            placeholder="Search..."
            class="search-input"
        />

        <img v-if="searchQuery" class="clear-button" src="@/components/icons/exit.svg" @click="searchQuery = ''" />
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "SearchBar",
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
    background-color: rgb(20, 20, 20);
    padding: 8px;
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    transition: color 250ms ease;
    user-select: none;
}

.search-bar:has(> .search-input:focus) {
    border-color: #fafafa;
}

.search-logo {
    height: 100%;
}

.search-input {
    width: 100%;
    border: none;
    background-color: transparent;
    color: rgb(200, 200, 200);
    padding: 0 8px 0 8px;
    font-size: 1rem;
}

.search-input:focus {
    outline: none;
}

.clear-button {
    height: 100%;
    cursor: pointer;
    transition: filter 250ms ease;
}

.clear-button:hover {
    filter: brightness(150%);
}
</style>
