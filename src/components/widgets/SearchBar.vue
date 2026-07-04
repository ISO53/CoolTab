<template>
    <Widget>
        <div class="search-bar">
            <Svg class="search-logo" :class_name="'material-icons-outlined'" :name="'search'"></Svg>

            <input
                type="text"
                v-model="searchQuery"
                @keypress.enter="handleSearch"
                :placeholder="$t('search.placeholder')"
                class="search-input"
            />

            <Svg
                :class_name="'material-icons-outlined'"
                :name="'close'"
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="clear-button"
            ></Svg>
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

            let baseUrl = "";
            if (this.settingsStore.searchEngine === "Custom") {
                baseUrl = this.settingsStore.customSearchEngineUrl || "https://www.google.com/search?q=";
            } else {
                baseUrl = searchEngines.get(this.settingsStore.searchEngine) || "https://www.google.com/search?q=";
            }

            let request = "";
            const queryPlaceholder = /{query}/i;
            if (queryPlaceholder.test(baseUrl)) {
                request = baseUrl.replace(queryPlaceholder, encodeURIComponent(this.searchQuery));
            } else {
                request = baseUrl + encodeURIComponent(this.searchQuery);
            }

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
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1cqh;
    container-type: size;
}

.search-logo {
    height: 100cqh;
}

.search-input {
    width: 100%;
    border: none;
    background-color: transparent;
    color: var(--color-secondary-text);
    margin-left: 5cqh;
    font-size: 60cqh;
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
    transition: color 200ms ease;
}

.clear-button:hover {
    color: var(--color-primary-text);
}
</style>
