<template>
	<div class="settings">
		<h2 class="page-title">Settings</h2>

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
				:options="['Color', 'Transparent', 'Blur', 'Glass']"
				:onSelect="setWidgetBackground"
			/>
		</div>

		<span class="divider"></span>

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
			<h2>Analog Clock Style</h2>
			<SelectButton
				v-model="settingsStore.analogClockStyle"
				:options="['Minimal', 'Classic']"
				:onSelect="setAnalogClockStyle"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<div class="title-with-action">
				<h2>Stocks</h2>
				<button
					class="help-btn"
					@click="showStockGuide = true"
					title="Show Search Guide"
				>
					<i class="material-icons-outlined">help_outline</i>
				</button>
			</div>
			<StockSearch
				v-model="settingsStore.stock.tickers"
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

		<span class="divider"></span>

		<div>
			<h2>Max Todo Tasks</h2>
			<NumberPicker
				v-model="settingsStore.todoMaxTasks"
				:min="5"
				:max="100"
				:step="1"
				:onSelect="setTodoMaxTasks"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>Hourly Weather Rotation</h2>
			<SelectButton
				v-model="settingsStore.hourlyWeatherRotation"
				:options="['Enabled', 'Disabled']"
				:onSelect="setHourlyWeatherRotation"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>Remember Wallpaper Page</h2>
			<SelectButton
				v-model="rememberWallpaperPageText"
				:options="['Enabled', 'Disabled']"
				:onSelect="setRememberWallpaperPage"
			/>
		</div>
	</div>

	<StockGuidePopup :show="showStockGuide" @close="showStockGuide = false" />
</template>

<script>
import FileChooser from "./FileChooser.vue";
import SelectButton from "./SelectButton.vue";
import DropdownSelect from "./DropdownSelect.vue";
import StockSearch from "./StockSearch.vue";
import StockGuidePopup from "./StockGuidePopup.vue";
import DropdownList from "./DropdownList.vue";
import NumberPicker from "./NumberPicker.vue";
import {useSettingsStore} from "@/settings";

export default {
	name: "Settings",
	components: {
		FileChooser,
		SelectButton,
		DropdownSelect,
		StockSearch,
		StockGuidePopup,
		DropdownList,
		NumberPicker,
	},
	data() {
		return {
			settingsStore: useSettingsStore(),
			showStockGuide: false,
		};
	},
	computed: {
        rememberWallpaperPageText() {
            return this.settingsStore.rememberWallpaperPage ? "Enabled" : "Disabled";
        },
    },
	methods: {
		setBackgroundSize(option) {
            this.settingsStore.setBackgroundSize(option);
        },
        setWidgetBackground(background) {
            this.settingsStore.setWidgetBackground(background);
        },
        setSearchEngine(engine) {
            this.settingsStore.setSearchEngine(engine);
        },
        setOpenSearchResultIn(choice) {
            this.settingsStore.setOpenSearchResultIn(choice);
        },
        setAnalogClockStyle(style) {
            this.settingsStore.setAnalogClockStyle(style);
        },
        setTickers(tickers) {
            const stockInfo = this.settingsStore.stock;
            stockInfo.tickers = tickers;
            this.settingsStore.setStock(stockInfo);
        },
        setQuickLinks(links) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.links = links;
            this.settingsStore.setQuickLinks(quickLinksInfo);
        },
        setOrientation(orientation) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.orientation = orientation;
            this.settingsStore.setQuickLinks(quickLinksInfo);

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
        setOpenLinkIn(openLinkIn) {
            const quickLinksInfo = this.settingsStore.quickLinks;
            quickLinksInfo.open_link_in = openLinkIn;
            this.settingsStore.setQuickLinks(quickLinksInfo);
        },
        setWidgetAreaColumns(columns) {
            this.settingsStore.setWidgetAreaColumns(columns);
        },
        setTodoMaxTasks(max) {
            this.settingsStore.setTodoMaxTasks(max);
        },
        setHourlyWeatherRotation(rotation) {
            this.settingsStore.setHourlyWeatherRotation(rotation);
        },
        setRememberWallpaperPage(choice) {
            this.settingsStore.setRememberWallpaperPage(choice);
        },
	},
};
</script>

<style>
.settings {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.settings > div {
    display: grid;
    grid-template-columns: 40% 60%;
    align-items: center;
    min-height: 50px;
    height: auto;
}

.settings > div h2 {
    text-wrap: nowrap;
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
}

.page-title {
    font-family: Satoshi-Bold;
    font-size: 1.2rem;
    color: var(--color-primary-text);
    margin: 0 0 16px 0;
    flex-shrink: 0;
}

.divider {
    width: 100%;
    height: 1px;
    background: color-mix(in srgb, var(--color-border-line), transparent 20%);
    margin: 10px 0;
}

.title-with-action {
    display: flex;
    align-items: center;
}

.help-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: bottom;
    justify-content: left;
    color: var(--color-tertiary-text);
    transition: color 250ms ease;
}

.help-btn:hover {
    color: var(--color-secondary-text);
}

.help-btn i {
    font-size: 1.2rem;
}
</style>
