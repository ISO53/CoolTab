<template>
    <div>
        <Transition name="overlay">
            <div v-show="isOpen" class="overlay" @click="toggleSidebar"></div>
        </Transition>

        <Transition name="slide">
            <div v-show="isOpen" class="slide">
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

                            <span class="divider"></span>

                            <div>
                                <h2>Widget Background</h2>
                                <SelectButton
                                    v-model="settingsStore.widgetBackground"
                                    :options="['Color', 'Transparent', 'Blur']"
                                    :onSelect="setWidgetBackground"
                                />
                            </div>

                            <span class="divider"></span>

                            <p style="width: auto; text-align: center; margin: 10px">
                                You can select from predefined themes.
                            </p>

                            <div style="display: flex; height: auto">
                                <ColorPalette></ColorPalette>
                            </div>

                            <p style="width: auto; text-align: center; margin: 10px">
                                Or you can create your own custom theme.
                            </p>

                            <div>
                                <h2>Background Color #1</h2>
                                <ColorChooser
                                    v-model="settingsStore.colors.color_primary_background"
                                    :onSelect="setColors"
                                />
                            </div>
                            <div>
                                <h2>Background Color #2</h2>
                                <ColorChooser
                                    v-model="settingsStore.colors.color_secondary_background"
                                    :onSelect="setColors"
                                />
                            </div>
                            <div>
                                <h2>Background Color #3</h2>
                                <ColorChooser
                                    v-model="settingsStore.colors.color_tertiary_background"
                                    :onSelect="setColors"
                                />
                            </div>
                            <div>
                                <h2>Text Color #1</h2>
                                <ColorChooser v-model="settingsStore.colors.color_primary_text" :onSelect="setColors" />
                            </div>
                            <div>
                                <h2>Text Color #2</h2>
                                <ColorChooser
                                    v-model="settingsStore.colors.color_secondary_text"
                                    :onSelect="setColors"
                                />
                            </div>
                            <div>
                                <h2>Text Color #3</h2>
                                <ColorChooser
                                    v-model="settingsStore.colors.color_tertiary_text"
                                    :onSelect="setColors"
                                />
                            </div>
                            <div>
                                <h2>Border Color</h2>
                                <ColorChooser v-model="settingsStore.colors.color_border_line" :onSelect="setColors" />
                            </div>
                        </div>
                    </Tab>

                    <Tab :label="'Styles'">
                        <Styles />
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

                <button @click="toggleSidebar" class="sidebar-toggle-button close" title="Close settings">
                    <Svg :class_name="'material-icons-outlined'" :name="'arrow_back'"></Svg>
                </button>
            </div>
        </Transition>
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
import ColorPalette from "./ColorPalette.vue";
import Styles from "./Styles.vue";
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
        ColorPalette,
        Styles,
    },
    data() {
        return {
            isOpen: false,
            selectedOption: null,
        };
    },
    methods: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
        setBackgroundSize(option) {
            this.settingsStore.setBackgroundSize(option);
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
            // Adjust the widgets orientation
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.orientation = orientation;
            this.settingsStore.setQuickLinks(quickLinksInfo);

            // Adjust the grids orientation for widget
            const widgets = this.settingsStore.widgets;
            widgets
                .filter((w) => w.name === "QuickLinks")
                .forEach((w) => {
                    w.resize = orientation.toLowerCase();
                    let temp = w.width;
                    w.width = w.height;
                    w.height = temp;
                });
            this.settingsStore.setWidgets(widgets);
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
        setWidgetBackground(background) {
            this.settingsStore.setWidgetBackground(background);
        },
        setColors() {
            this.settingsStore.setColors(this.settingsStore.colors);
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
    background-color: var(--color-primary-background);
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

.sidebar-toggle-button i {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.close:hover i {
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
    font-weight: bold;
}

.header {
    margin-bottom: 20px;
    font-weight: 900;
    color: var(--color-primary-text);
}

.divider {
    width: 100%;
    height: 1px;
    background: color-mix(in srgb, var(--color-border-line), transparent 20%);
    margin: 10px 0 10px 0;
}

.widget-states > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
