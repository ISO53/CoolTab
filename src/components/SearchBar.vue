<template>
    <div class="search-bar">
        <img class="search-logo" src="@/components/icons/search.svg" />

        <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search..." class="search-input" />

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
            searchQuery: ""
        };
    },
    methods: {
        handleSearch() {},
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
    width: 100%;
    padding: 8px;
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    transition: color 250ms ease;
    user-select: none;
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
