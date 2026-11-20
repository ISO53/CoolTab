<template>
    <Widget>
        <button
            ref="trigger"
            type="button"
            class="search-bar"
            title="Search"
            aria-label="Search"
            @click="openPopover"
        >
            <Icon class="search-logo" name="search" />
            <span class="search-hint">Search...</span>
        </button>

        <SearchPopover ref="popover" :open="popoverOpen" :launcher="triggerElement" @close="closePopover" />
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import SearchPopover from "./SearchPopover.vue";

export default {
    name: "SearchBar",
    components: {
        Widget,
        SearchPopover,
    },
    data() {
        return {
            popoverOpen: false,
            triggerElement: null,
        };
    },
    mounted() {
        this.triggerElement = this.$refs.trigger;
    },
    methods: {
        openPopover() {
            this.popoverOpen = true;
            this.$refs.popover?.focusInput();
        },
        closePopover() {
            this.popoverOpen = false;
            this.$refs.trigger?.focus();
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
    align-items: center;
    padding: 1cqh;
    container-type: size;
    background: transparent;
    border: none;
    font-family: Satoshi-Regular;
    cursor: text;
    text-align: left;
}

.search-bar:focus {
    outline: none;
}

.search-logo {
    width: 100cqh;
    height: 100cqh;
    flex-shrink: 0;
}

.search-hint {
    margin-left: 5cqh;
    font-size: 60cqh;
    color: var(--color-tertiary-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
