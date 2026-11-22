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

		<div>
			<h2>Search Suggestions</h2>
			<SelectButton
				v-model="searchSuggestionsText"
				:options="['Enabled', 'Disabled']"
				:onSelect="setSearchSuggestions"
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
					<Icon name="help-outline" />
				</button>
			</div>
			<StockSearch
				v-model="settingsStore.stock.tickers"
				:onSelect="setTickers"
			/>
		</div>

		<span class="divider"></span>

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

		<span class="divider"></span>

		<div>
			<h2>Time Format</h2>
			<SelectButton
				v-model="settingsStore.timeFormat"
				:options="['24h', '12h']"
				:onSelect="setTimeFormat"
			/>
		</div>

		<div>
			<h2>Temperature Unit</h2>
			<SelectButton
				v-model="settingsStore.temperatureUnit"
				:options="['Celsius', 'Fahrenheit']"
				:onSelect="setTemperatureUnit"
			/>
		</div>

		<div>
			<h2>Rain Unit</h2>
			<SelectButton
				v-model="settingsStore.rainUnit"
				:options="['mm', 'inch']"
				:onSelect="setRainUnit"
			/>
		</div>

		<div>
			<h2>Wind Unit</h2>
			<SelectButton
				v-model="settingsStore.windUnit"
				:options="['kmh', 'mph']"
				:onSelect="setWindUnit"
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
		searchSuggestionsText() {
			return this.settingsStore.searchSuggestions ? "Enabled" : "Disabled";
		},
    },
	methods: {
		setSearchSuggestions(choice) {
			this.settingsStore.setSearchSuggestions(choice);
		},
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
        setTimeFormat(format) {
            this.settingsStore.setTimeFormat(format);
		},
        setTemperatureUnit(unit) {
            this.settingsStore.setTemperatureUnit(unit);
        },
        setRainUnit(unit) {
            this.settingsStore.setRainUnit(unit);
        },
        setWindUnit(unit) {
            this.settingsStore.setWindUnit(unit);
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
    transition: color 200ms ease;
}

.help-btn:hover {
    color: var(--color-secondary-text);
}

.help-btn svg {
    width: 1.2rem;
    height: 1.2rem;
}
</style>
