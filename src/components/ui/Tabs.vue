<template>
    <div class="main">
        <div class="tabs">
            <h2
                class="tab"
                :class="{selected: selectedTabLabel === label}"
                @click="setSelected(label)"
                v-for="(label, index) in tabLabels"
                :key="index"
            >
                {{ label }}
            </h2>
        </div>

        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Tabs",
    props: {
        selected: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            tabLabels: [],
            selectedTabLabel: this.selected,
        };
    },
    provide() {
        return {
            registerTab: this.registerTab,
        };
    },
    methods: {
        registerTab(label) {
            this.tabLabels.push(label);
        },
        setSelected(label) {
            this.selectedTabLabel = label;
        },
    },
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    height: 85%;
    position: relative;
}

.tabs {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-family: Satoshi-Regular;
    font-size: 0.7rem;
    border-bottom: 2px solid var(--color-border-line);
}

.tab {
    flex-basis: 0;
    flex-grow: 1;
    text-align: center;
    user-select: none;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    padding-bottom: 10px;
    transition: color 250ms ease, font-weight 250ms ease, border-color 250ms ease;
}

.tab:hover {
    color: var(--color-secondary-text);
    border-color: var(--color-secondary-text);
}

.selected {
    color: var(--color-primary-text);
    font-weight: 900;
    border-color: var(--color-primary-text);
}
</style>
