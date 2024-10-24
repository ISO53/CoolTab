<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="toggleSidebar"></div>
        </Transition>

        <Transition name="slide">
            <div v-if="isOpen" class="slide">
                <h1 class="header">CoolTab Settings</h1>

                <Tabs :selected="'Customization'">
                    <Tab :label="'Customization'">
                        <div class="settings">
                            <div>
                                <h2>Background Image</h2>
                                <FileChooser />
                            </div>

                            <div>
                                <h2>Image Size</h2>
                                <SelectButton
                                    v-model="settingsStore.backgroundSize"
                                    :options="['Auto', 'Cover', 'Contain']"
                                    :onSelect="setBackgroundSize"
                                />
                            </div>

                            <div>
                                <h2>Background Color</h2>
                                <ColorChooser v-model="settingsStore.backgroundColor" :onSelect="setBackgroundColor" />
                            </div>
                        </div>
                    </Tab>

                    <Tab :label="'Widgets'">
                        <div class="settings widget-states">
                            <div v-for="(widget, index) in this.settingsStore.widgets" :key="index">
                                <h2>{{ widget.name }}</h2>
                                <ToggleSwitch
                                    v-model="widget.selected"
                                    @change="setWidgetSelected(widget, widget.selected)"
                                />
                            </div>
                        </div>
                    </Tab>

                    <Tab :label="'Settings'">
                        <div class="settings">
                            <div>
                                <h2>Search Engine</h2>
                                <DropdownSelect
                                    v-model="settingsStore.searchEngine"
                                    :values="[
                                        'Google',
                                        'Bing',
                                        'DuckDuckGo',
                                        'Yahoo',
                                        'Ecosia',
                                        'Yandex',
                                        'Startpage',
                                        'Swisscows',
                                    ]"
                                    :onSelect="setSearchEngine"
                                />
                            </div>

                            <div>
                                <h2>Open Result In</h2>
                                <SelectButton
                                    v-model="settingsStore.openSearchResultIn"
                                    :options="['Current Tab', 'New Tab']"
                                    :onSelect="setOpenSearchResultIn"
                                />
                            </div>

                            <span class="divider"></span>

                            <div>
                                <h2>Stocks</h2>
                                <DropdownList
                                    v-model="settingsStore.stock.tickers"
                                    :text="'stock'"
                                    :onSelect="setTickers"
                                />
                            </div>

                            <span class="divider"></span>

                            <div>
                                <h2>Quick Links</h2>
                                <DropdownList
                                    v-model="this.settingsStore.quickLinks.links"
                                    :text="'link'"
                                    :onSelect="setQuickLinks"
                                />
                            </div>

                            <div>
                                <h2>Quick Links Orientation</h2>
                                <SelectButton
                                    v-model="settingsStore.quickLinks.orientation"
                                    :options="['Vertical', 'Horizontal']"
                                    :onSelect="setOrientation"
                                />
                            </div>

                            <div>
                                <h2>Open Link In</h2>
                                <SelectButton
                                    v-model="settingsStore.quickLinks.open_link_in"
                                    :options="['Current Tab', 'New Tab']"
                                    :onSelect="setOpenLinkIn"
                                />
                            </div>

                            <span class="divider"></span>

                            <div>
                                <h2>Widget Area Columns</h2>
                                <NumberPicker
                                    v-model="settingsStore.widgetAreaColumns"
                                    :min="10"
                                    :max="80"
                                    :step="1"
                                    :onSelect="setWidgetAreaColumns"
                                />
                            </div>
                        </div>
                    </Tab>
                </Tabs>

                <button @click="toggleSidebar" class="sidebar-toggle-button close">
                    <img src="@/components/icons/back.svg" />
                </button>
            </div>
        </Transition>

        <button v-if="!isOpen" @click="toggleSidebar" class="sidebar-toggle-button">
            <img src="@/components/icons/settings.svg" />
        </button>
    </div>
</template>

<script>
import ColorChooser from "./ColorChooser.vue";
import DropdownSelect from "./DropdownSelect.vue";
import FileChooser from "./FileChooser.vue";
import SelectButton from "./SelectButton.vue";
import DropdownList from "./DropdownList.vue";
import Tabs from "./Tabs.vue";
import Tab from "./Tab.vue";
import NumberPicker from "./NumberPicker.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "Sidebar",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    components: {
        FileChooser,
        ColorChooser,
        SelectButton,
        DropdownSelect,
        DropdownList,
        Tabs,
        Tab,
        NumberPicker,
        ToggleSwitch,
    },
    data() {
        return {
            isOpen: false,
            selectedOption: null,
            links: this.settingsStore.quickLinks.links.map((link) => link.url),
        };
    },
    methods: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
        setBackgroundSize(option) {
            this.settingsStore.setBackgroundSize(option);
        },
        setBackgroundColor(color) {
            this.settingsStore.setBackgroundColor(color);
        },
        setSearchEngine(engine) {
            this.settingsStore.setSearchEngine(engine);
        },
        setOpenSearchResultIn(choice) {
            this.settingsStore.setOpenSearchResultIn(choice);
        },
        setTickers(tickers) {
            const stockInfo = this.settingsStore.stock;
            stockInfo.tickers = tickers;
            this.settingsStore.setStock(stockInfo);
        },
        setOrientation(orientation) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.orientation = orientation;
            this.settingsStore.setQuickLinks(quickLinksInfo);
        },
        setQuickLinks(links) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.links = links;
            this.settingsStore.setQuickLinks(quickLinksInfo);
        },
        setOpenLinkIn(openLinkIn) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.open_link_in = openLinkIn;
            this.settingsStore.setQuickLinks(quickLinksInfo);
        },
        setWidgetAreaColumns(columns) {
            this.settingsStore.setWidgetAreaColumns(columns);
        },
        setWidgetSelected(widget, isSelected) {
            widget.selected = isSelected;
            this.settingsStore.setWidgets(this.settingsStore.widgets);
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: backdrop-filter 250ms ease, background-color 250ms ease;
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
    width: 500px;
    height: 100vh;
    background-color: black;
    z-index: 10000;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 20px;
    overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 250ms ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.sidebar-toggle-button {
    position: absolute;
    bottom: 10px;
    left: 5px;
    margin: 0;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
}

.sidebar-toggle-button:hover img {
    transform: rotate(45deg);
}

.sidebar-toggle-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.close:hover img {
    transform: translateX(-3px);
}

.settings {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.settings > div {
    display: grid;
    grid-template-columns: 40% 60%;
    align-items: center;
    height: 50px;
}

.settings > div > h2 {
    text-wrap: nowrap;
    font-size: 1rem;
    font-weight: 100;
}

.header {
    margin-bottom: 20px;
    font-weight: 900;
    color: #fafafa;
}

.divider {
    width: 100%;
    height: 1px;
    background: rgb(50, 50, 50);
    margin: 10px 0 10px 0;
}

.widget-states > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
