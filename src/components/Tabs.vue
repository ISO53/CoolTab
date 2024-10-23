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
    font-size: 0.8rem;
    border-bottom: 2px solid rgb(50, 50, 50);
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
    color: rgb(200, 200, 200);
    border-color: rgb(200, 200, 200);
}

.selected {
    color: white;
    font-weight: 900;
    border-color: white;
}
</style>
