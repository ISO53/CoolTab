<template>
    <div class="info-container">
        <div class="info-header">
            <img src="@/components/icons/cooltab_logo.svg" draggable="false" class="logo" />
            <h2 class="page-title">CoolTab</h2>
            <p class="tagline">{{ $t('info.tagline') }}</p>
        </div>

        <div class="info-section">
            <div class="info-item">
                <span class="label">{{ $t('info.version') }}</span>
                <span class="value"><a href="https://iso53.github.io/CoolTab/#/releases" target="_blank" title="See what's new in this version">{{ appVersion }}</a></span>
            </div>
            <div class="info-item">
                <span class="label">{{ $t('info.createdBy') }}</span>
                <span class="value"><a href="https://github.com/iso53" target="_blank" title="Visit creator's GitHub profile">iso53</a></span>
            </div>
            <div class="info-item">
                <span class="label">{{ $t('info.sourceCode') }}</span>
                <span class="value"><a href="https://github.com/iso53/cooltab" target="_blank" title="View the open-source code on GitHub">GitHub</a></span>
            </div>
        </div>

        <div class="thanks-section">
            <h3 class="section-title">{{ $t('info.thanks') }}</h3>
            <ul class="thanks-list">
                <li>
                    <a href="https://www.weatherapi.com/" target="_blank">WeatherAPI.com</a> {{ $t('info.thanksWeather') }}
                </li>
                <li>
                    <a href="https://open-meteo.com/" target="_blank">Open-Meteo.com</a> {{ $t('info.thanksWeather') }}
                </li>
                <li><a href="https://finance.yahoo.com/" target="_blank">Yahoo Finance</a> {{ $t('info.thanksStocks') }}</li>
                <li>
                    <a href="https://icons.qweather.com/" target="_blank">QWeather.com</a> {{ $t('info.thanksWeatherIcons') }}
                </li>
                <li>
                    <a href="https://peapix.com/" target="_blank">Peapix.com</a> {{ $t('info.thanksWallpapers') }}
                </li>
            </ul>
        </div>

        <button class="tour-button" @click="startTour">
        	<i class="material-icons-outlined">tour</i>
        	<span>{{ $t('info.takeTour') }}</span>
        </button>
    </div>
</template>

<script>
import { version } from "@/../package.json";
import { useSettingsStore } from "@/settings";

export default {
    name: "Info",
    data() {
		return {
			settingsStore: useSettingsStore(),
            appVersion: version,
        };
    },
    methods: {
		startTour() {
			// Close the sidebar first
			document.querySelector(".sidebar-close-btn").click();

			// Wait for the sidebar to close before opening the onboarding popup
			setTimeout(() => this.settingsStore.setOnboarding("Enabled"), 200);
        },
    },
};
</script>

<style scoped>
.info-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.info-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 10px 0;
}

.logo {
    width: 128px;
    height: 128px;
    margin-bottom: 8px;
}

.tagline {
    font-size: 0.9rem;
    color: var(--color-secondary-text);
    margin: 0;
}

.page-title {
    font-family: Satoshi-Bold;
    font-size: 1.8rem;
    color: var(--color-primary-text);
    margin: 0;
}

.info-section {
    display: flex;
    flex-direction: column;
    background-color: var(--color-secondary-background);
    border-radius: 12px;
    border: 1.5px solid var(--color-border-line);
    overflow: hidden;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border-line);
}

.info-item:last-child {
    border-bottom: none;
}

.label {
    font-size: 0.85rem;
    color: var(--color-tertiary-text);
}

.value {
    font-size: 0.85rem;
    font-family: Satoshi-Bold;
    color: var(--color-primary-text);
}

.value a {
    color: var(--color-primary-text);
    text-decoration: underline;
}

.section-title {
    font-family: Satoshi-Bold;
    font-size: 1.2rem;
    color: var(--color-primary-text);
    margin: 0 0 12px 0;
}

.thanks-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.thanks-list li {
    font-size: 0.85rem;
    color: var(--color-secondary-text);
}

.thanks-list a {
    color: var(--color-primary-text);
    font-family: Satoshi-Bold;
    text-decoration: none;
}

.thanks-list a:hover {
    text-decoration: underline;
}

.tour-button {
   position: absolute;
   bottom: 20px;
   right: 20px;
   width: 50px;
   height: 50px;
   display: flex;
   align-items: center;
   justify-content: flex-start;
   padding: 0 0 0 13px;
   border: none;
   background-color: var(--color-secondary-text);
   color: var(--color-primary-background);
   border-radius: 10px;
   font-size: 1rem;
   font-family: Satoshi-Medium;
   cursor: pointer;
   transition: width 200ms ease, background-color 200ms ease;
   overflow: hidden;
   white-space: nowrap;
}

.tour-button:hover {
	width: 140px;
	background-color: var(--color-primary-text);
}

.tour-button > span {
	margin: 0 0 0 10px;
	opacity: 0;
	font-family: Satoshi-Bold;
	font-size: 0.95rem;
	transition: opacity 200ms ease;
}

.tour-button:hover > span {
	opacity: 1;
	transition-delay: 80ms;
}

.tour-button > i {
	margin: 0;
	line-height: 1.4rem;
	height: 1.4rem;
	font-size: 1.4rem;
	flex-shrink: 0;
}
</style>
