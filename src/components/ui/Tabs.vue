<template>
    <div class="tabs-layout">
        <!-- Vertical icon rail -->
        <nav class="tab-rail">
            <button
                v-for="tab in registeredTabs"
                :key="tab.label"
                class="rail-btn"
                :class="{ active: selectedTabLabel === tab.label }"
                @click="setSelected(tab.label)"
            >
                <i class="material-icons-outlined">{{ tab.icon }}</i>
                <span class="rail-tooltip">{{ tab.label }}</span>
            </button>
            <div class="rail-spacer"></div>
            <slot name="rail-footer"></slot>
        </nav>

        <!-- Content area -->
        <div class="tab-content">
            <slot></slot>
        </div>
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
            registeredTabs: [],
            selectedTabLabel: this.selected,
        };
    },
    provide() {
        return {
            registerTab: this.registerTab,
        };
    },
    methods: {
        registerTab(tabInfo) {
            this.registeredTabs.push(tabInfo);
        },
        setSelected(label) {
            this.selectedTabLabel = label;
        },
    },
};
</script>

<style scoped>
.tabs-layout {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
}

/* ── Icon Rail ── */
.tab-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    flex-shrink: 0;
    padding: 10px 0 10px 0;
    gap: 4px;
    border-right: 1px solid var(--color-border-line);
}

.rail-spacer {
    flex: 1;
}

.rail-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 180ms ease;
    color: var(--color-tertiary-text);
}

.rail-btn i {
    font-size: 1.5rem;
    color: inherit;
    transition: color 180ms ease;
    user-select: none;
}

.rail-btn:hover {
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
}

.rail-btn.active {
    background-color: var(--color-secondary-background);
    color: var(--color-primary-text);
}

/* ── Tooltip ── */
.rail-tooltip {
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--color-secondary-background);
    color: var(--color-primary-text);
    border: 1px solid var(--color-border-line);
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.72rem;
    font-family: Satoshi-Bold;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 150ms ease;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rail-btn:hover .rail-tooltip {
    opacity: 1;
}

/* ── Content Area ── */
.tab-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: 100%;
}
</style>
