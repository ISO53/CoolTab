<template>
	<div class="settings">
		<h2 class="page-title">{{ $t('settings.title') }}</h2>

		<div>
			<h2>{{ $t('settings.language') }}</h2>
			<SelectButton
				v-model="settingsStore.language"
				:options="availableLanguages"
				:onSelect="setLanguage"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.backgroundImage') }}</h2>
			<FileChooser />
		</div>

		<div>
			<h2>{{ $t('settings.imageSize') }}</h2>
			<SelectButton
				v-model="settingsStore.backgroundSize"
				:options="['Auto', 'Cover', 'Contain']"
				:onSelect="setBackgroundSize"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.widgetBackground') }}</h2>
			<SelectButton
				v-model="settingsStore.widgetBackground"
				:options="['Color', 'Transparent', 'Blur', 'Glass']"
				:onSelect="setWidgetBackground"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.searchEngine') }}</h2>
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
					'Custom',
				]"
				:onSelect="setSearchEngine"
			/>
		</div>

		<div v-if="settingsStore.searchEngine === 'Custom'" class="custom-search-container">
			<h2>{{ $t('settings.customSearchUrl') }}</h2>
			<input
				class="form-input custom-search-input"
				type="text"
				:value="settingsStore.customSearchEngineUrl"
				@input="setCustomSearchEngineUrl"
				:placeholder="$t('settings.customSearchPlaceholder')"
			/>
			<p class="custom-search-hint">{{ $t('settings.customSearchHint') }}</p>
		</div>

		<div>
			<h2>{{ $t('settings.openResultIn') }}</h2>
			<SelectButton
				v-model="settingsStore.openSearchResultIn"
				:options="['Current Tab', 'New Tab']"
				:onSelect="setOpenSearchResultIn"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.scrollMode') }}</h2>
			<SelectButton
				v-model="settingsStore.scrollMode"
				:options="['Disabled', 'Hover', 'Always']"
				:onSelect="setScrollMode"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.analogClockStyle') }}</h2>
			<SelectButton
				v-model="settingsStore.analogClockStyle"
				:options="['Minimal', 'Classic']"
				:onSelect="setAnalogClockStyle"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<div class="title-with-action">
				<h2>{{ $t('settings.stocks') }}</h2>
				<button
					class="help-btn"
					@click="showStockGuide = true"
					:title="$t('stockGuide.title')"
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
			<h2>{{ $t('settings.quickLinks') }}</h2>
			<DropdownList
				v-model="this.settingsStore.quickLinks.links"
				:text="'link'"
				:onSelect="setQuickLinks"
			/>
		</div>

		<div>
			<h2>{{ $t('settings.quickLinksOrientation') }}</h2>
			<SelectButton
				v-model="settingsStore.quickLinks.orientation"
				:options="['Vertical', 'Horizontal']"
				:onSelect="setOrientation"
			/>
		</div>

		<div>
			<h2>{{ $t('settings.openLinkIn') }}</h2>
			<SelectButton
				v-model="settingsStore.quickLinks.open_link_in"
				:options="['Current Tab', 'New Tab']"
				:onSelect="setOpenLinkIn"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.widgetAreaColumns') }}</h2>
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
			<h2>{{ $t('settings.maxTodoTasks') }}</h2>
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
			<h2>{{ $t('settings.hourlyWeatherRotation') }}</h2>
			<SelectButton
				v-model="settingsStore.hourlyWeatherRotation"
				:options="['Enabled', 'Disabled']"
				:onSelect="setHourlyWeatherRotation"
			/>
		</div>

		<span class="divider"></span>

		<div>
			<h2>{{ $t('settings.rememberWallpaperPage') }}</h2>
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
import {availableLanguages} from "@/i18n";

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
        availableLanguages() {
            return availableLanguages;
        }
    },
	methods: {
		setLanguage(option) {
			this.settingsStore.setLanguage(option);
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
        setCustomSearchEngineUrl(event) {
            this.settingsStore.setCustomSearchEngineUrl(event.target.value);
        },
        setScrollMode(mode) {
            this.settingsStore.setScrollMode(mode);
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
    transition: color 200ms ease;
}

.help-btn:hover {
    color: var(--color-secondary-text);
}

.help-btn i {
    font-size: 1.2rem;
}

.custom-search-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
}

.custom-search-input {
    background-color: var(--color-secondary-background);
    color: var(--color-primary-text);
    border: 2px solid var(--color-border-line);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 14px;
    width: 100%;
}

.custom-search-input:focus {
    outline: none;
    border-color: var(--color-tertiary-background);
}

.custom-search-hint {
    font-size: 12px;
    color: var(--color-tertiary-text);
    line-height: 1.4;
}
</style>
