<template>
    <div>
        <Transition name="overlay">
            <div v-show="isOpen" class="overlay" @click="toggleSidebar"></div>
        </Transition>

        <Transition name="slide">
            <div v-show="isOpen" class="slide">
                <Tabs :selected="$t('sidebar.customization')">
                    <Tab :label="$t('sidebar.customization')" :icon="'palette'">
                        <Customization />
                    </Tab>

                    <Tab :label="$t('sidebar.styles')" :icon="'style'">
                        <Styles />
                    </Tab>

                    <Tab :label="$t('sidebar.community')" :icon="'explore'">
                        <CommunityStyles />
                    </Tab>

                    <Tab :label="$t('sidebar.widgets')" :icon="'widgets'">
                        <Widgets />
                    </Tab>

                    <Tab :label="$t('sidebar.settings')" :icon="'tune'">
                        <Settings />
                    </Tab>

                    <Tab :label="$t('sidebar.about')" :icon="'info'">
                        <Info />
                    </Tab>
                </Tabs>

                <button class="sidebar-close-btn" @click="toggleSidebar" :title="$t('sidebar.close')">
                    <i class="material-icons-outlined">arrow_back</i>
                    <span class="close-tooltip">{{ $t('sidebar.close') }}</span>
                </button>
            </div>
        </Transition>
    </div>
</template>

<script>
import Tabs from "./Tabs.vue";
import Tab from "./Tab.vue";
import Styles from "./Styles.vue";
import CommunityStyles from "./CommunityStyles.vue";
import Info from "./Info.vue";
import Customization from "./Customization.vue";
import Settings from "./Settings.vue";
import Widgets from "./Widgets.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "Sidebar",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    components: {
        Tabs,
        Tab,
        Styles,
        CommunityStyles,
        Info,
        Customization,
        Settings,
        Widgets,
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(10px);
    background-color: color-mix(in srgb, var(--color-primary-background), transparent 50%);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.overlay-enter-active,
.overlay-leave-active {
    transition:
        backdrop-filter 200ms ease,
        background-color 200ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    backdrop-filter: none;
    background-color: transparent;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 630px;
    height: 100vh;
    background-color: var(--color-primary-background);
    z-index: 10000;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 16px 16px 16px 0;
    overflow: hidden;
    box-sizing: border-box;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 200ms ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.sidebar-close-btn {
    position: absolute;
    bottom: 14px;
    left: 8px;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-tertiary-text);
    transition:
        background-color 200ms ease,
        color 200ms ease;
    z-index: 1;
}

.sidebar-close-btn i {
    font-size: 1.5rem;
    color: inherit;
    transition: transform 200ms ease;
    user-select: none;
}

.sidebar-close-btn:hover {
    background-color: var(--color-secondary-background);
    color: var(--color-primary-text);
}

.close-tooltip {
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
    transition: opacity 200ms ease;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.sidebar-close-btn:hover .close-tooltip {
    opacity: 1;
}
</style>
