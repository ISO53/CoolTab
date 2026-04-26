<template>
    <div class="info-container">
        <div class="info-header">
            <img src="@/components/icons/cooltab_logo.svg" draggable="false" class="logo" />
            <h2 class="page-title">CoolTab</h2>
            <p class="tagline">Just a new tab for your browser, but cooler...</p>
        </div>

        <div class="info-section">
            <div class="info-item">
                <span class="label">Version</span>
                <span class="value">{{ appVersion }}</span>
            </div>
            <div class="info-item">
                <span class="label">Created by</span>
                <span class="value"><a href="https://github.com/iso53" target="_blank">iso53</a></span>
            </div>
            <div class="info-item">
                <span class="label">Source Code</span>
                <span class="value"><a href="https://github.com/iso53/cooltab" target="_blank">GitHub</a></span>
            </div>
        </div>

        <div class="thanks-section">
            <h3 class="section-title">Special Thanks To</h3>
            <ul class="thanks-list">
                <li>
                    <a href="https://www.weatherapi.com/" target="_blank">WeatherAPI.com</a> for providing weather info.
                </li>
                <li>
                    <a href="https://open-meteo.com/" target="_blank">Open-Meteo.com</a> for providing weather info.
                </li>
                <li><a href="https://polygon.io/" target="_blank">Polygon.io</a> for providing stock market info.</li>
                <li>
                    <a href="https://icons.qweather.com/" target="_blank">QWeather.com</a> for providing weather icons.
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {version} from "@/../package.json";

export default {
    name: "Info",
    data() {
        return {
            appVersion: version,
        };
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
</style>
