<template>
    <div class="search-wrapper">
        <div class="dropdown-select" @click="toggleDropdown" v-click-outside="closeDropdown">
            <input
                class="form-input"
                type="text"
                v-model="inputValue"
                @input="debouncedSearch"
                :placeholder="isOpen ? 'Search ticker...' : modelValue.length + ' stocks selected.'"
                @click.stop="openDropdown"
            />
            <ul v-if="isOpen" class="dropdown-options" @click.stop>
                <template v-if="inputValue && isSearching">
                    <li class="dropdown-option"><p class="loading">Searching...</p></li>
                </template>
                <template v-else-if="inputValue && searchResults.length">
                    <li
                        v-for="(result, index) in searchResults"
                        :key="'res-' + index"
                        class="dropdown-option search-result"
                        @click="addValue(result.symbol)"
                    >
                        <div class="result-info">
                            <p class="symbol">{{ result.symbol }}</p>
                            <p class="shortname">{{ result.shortname || result.longname || result.typeDisp }}</p>
                        </div>
                        <span class="exchange">{{ result.exchDisp }}</span>
                    </li>
                </template>
                <template v-else-if="inputValue">
                    <li class="dropdown-option"><p class="loading">No results found.</p></li>
                </template>
                <template v-else>
                    <li v-for="(value, index) in modelValue" :key="'sel-' + index" class="dropdown-option">
                        <p>{{ value }}</p>
                        <button @click="removeValue(index)" class="delete-button">
                            <i class="material-icons-outlined">close</i>
                        </button>
                    </li>
                    <li v-if="!modelValue.length" class="dropdown-option">
                        <p class="loading">No stocks selected.</p>
                    </li>
                </template>
            </ul>
            <i class="material-icons-outlined arrow-logo" :class="{rotate: isOpen}">keyboard_arrow_down</i>
        </div>
    </div>
</template>

<script>
import {YAHOO_QUERY2_BASE, fetchYahoo} from "@/utils/api";

export default {
    name: "StockSearch",
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        onSelect: {
            type: Function,
        },
    },
    data() {
        return {
            isOpen: false,
            inputValue: "",
            searchResults: [],
            isSearching: false,
            searchTimeout: null,
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
            if (!this.isOpen) {
                this.inputValue = "";
                this.searchResults = [];
            }
        },
        closeDropdown() {
            this.isOpen = false;
            this.inputValue = "";
            this.searchResults = [];
        },
        openDropdown() {
            this.isOpen = true;
        },
        debouncedSearch() {
            if (this.searchTimeout) clearTimeout(this.searchTimeout);

            if (!this.inputValue.trim()) {
                this.searchResults = [];
                this.isSearching = false;
                return;
            }

            this.isSearching = true;
            this.searchTimeout = setTimeout(this.performSearch, 500);
        },
        async performSearch() {
            try {
                const data = await fetchYahoo(
                    `${YAHOO_QUERY2_BASE}/v1/finance/search?q=${encodeURIComponent(this.inputValue.trim())}`,
                );
                this.searchResults = data.quotes || [];
            } catch (error) {
                console.error("Yahoo Finance search error:", error);
                this.searchResults = [];
            } finally {
                this.isSearching = false;
            }
        },
        addValue(symbol) {
            if (symbol && !this.modelValue.includes(symbol)) {
                const updatedValues = [...this.modelValue, symbol];
                this.$emit("update:modelValue", updatedValues);
                this.inputValue = "";
                this.searchResults = [];
                if (this.onSelect) this.onSelect(updatedValues);
            } else {
                this.inputValue = "";
                this.searchResults = [];
            }
        },
        removeValue(index) {
            const updatedValues = [...this.modelValue];
            updatedValues.splice(index, 1);
            this.$emit("update:modelValue", updatedValues);
            if (this.onSelect) this.onSelect(updatedValues);
        },
    },
};
</script>

<style scoped>
.search-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.dropdown-select {
    position: relative;
    background-color: var(--color-secondary-background);
    width: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid var(--color-border-line);
    transition: border-color 250ms ease;
    user-select: none;
    font-size: 1rem;
    font-family: Satoshi-Regular;
}

.arrow-logo {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    transition: transform 250ms ease;
    color: var(--color-secondary-text);
}

.rotate {
    transform: translateY(-50%) rotate(180deg);
}

.form-input {
    width: 90%;
    height: 100%;
    background-color: transparent;
    border: none;
    font-family: Satoshi-Medium;
    color: var(--color-secondary-text);
}

.form-input::placeholder {
    color: var(--color-tertiary-text);
}

.form-input:focus {
    outline: none;
}

.delete-button {
    background-color: transparent;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: var(--color-tertiary-text);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition:
        background-color 250ms ease,
        color 250ms ease;
}

.delete-button i {
    font-size: 1.2rem;
}

.delete-button:hover {
    background-color: var(--color-tertiary-background);
    color: var(--color-primary-text);
}

.dropdown-options {
    position: absolute;
    top: 100%;
    left: -2px;
    width: calc(100% + 4px);
    list-style: none;
    padding: 5px;
    margin-top: 5px;
    max-height: 220px;
    overflow-y: auto;
    background-color: var(--color-secondary-background);
    border-radius: 10px;
    border: 2px solid var(--color-border-line);
    z-index: 50;
}

.dropdown-option {
    padding: 8px 10px;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary-text);
}

.search-result {
    cursor: pointer;
    transition: background-color 150ms ease;
    position: relative;
}

.search-result:hover {
    background-color: var(--color-tertiary-background);
}

.search-result:hover .exchange {
    opacity: 1;
}

.result-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
}

.symbol {
    font-family: Satoshi-Bold;
    font-size: 0.95rem;
    margin: 0;
}

.shortname {
    font-size: 0.8rem;
    color: var(--color-secondary-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 2px 0 0 0;
    width: 100%;
}

.exchange {
    position: absolute;
    right: 8px;
    bottom: 6px;
    font-size: 0.7rem;
    color: var(--color-tertiary-text);
    background-color: var(--color-primary-background);
    padding: 1px 4px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 150ms ease;
    pointer-events: none;
}

.loading {
    color: var(--color-tertiary-text);
    font-size: 0.9rem;
    font-style: italic;
    margin: 0;
    padding: 4px 0;
}
</style>
