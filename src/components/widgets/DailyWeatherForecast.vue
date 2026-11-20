<template>
    <Widget>
        <div class="weather-forecast">
            <div class="inner">
                <div class="sun-and-moon">
                    <div class="orbit">
                        <div class="orbit-line" :style="{transform: `rotate(${rotation}deg)`}">
                            <Icon class="planet" name="sun" />
                            <Icon class="planet" name="moon-star" />
                        </div>
                    </div>
                </div>
                <div v-if="rotation < 180" class="times">
                    <h2>{{ sunriseDisplay }}</h2>
                    <h2>{{ sunsetDisplay }}</h2>
                </div>
                <div v-else class="times">
                    <h2>{{ sunsetDisplay }}</h2>
                    <h2>{{ sunriseDisplay }}</h2>
                </div>
                <div class="info">
                    <h1>{{
						this.settingsStore.temperatureUnit === "Fahrenheit" ?
						weather.temperature_f :
						weather.temperature_c
					}}
                    </h1>
                    <div>
                        <h4>{{ weather.country }}</h4>
                        <h3>{{ weather.city }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import { useSettingsStore } from "@/settings";
import { formatEpochTime } from "@/utils/time";

export default {
    name: "DailyWeatherForecast",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            weather: this.settingsStore.currentWeatherInfo,
            rotation: 0,
        };
	},
	computed: {
		sunriseDisplay() {
	        return formatEpochTime(this.weather.sunrise_epoch, this.settingsStore.timeFormat === "12h");
	    },
	    sunsetDisplay() {
	        return formatEpochTime(this.weather.sunset_epoch, this.settingsStore.timeFormat === "12h");
	    },
	},
    mounted() {
        this.getCurrentWeatherInfo();
        this.calculateRotation();
        this.timer = setInterval(this.calculateRotation, 60_000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        calculateRotation() {
        	if (!this.weather.sunrise_epoch || !this.weather.sunset_epoch) return;

            const totalDayMs = this.weather.sunset_epoch - this.weather.sunrise_epoch;
            if (totalDayMs <= 0) return;

            const sunPosition = (Date.now() - this.weather.sunrise_epoch) / totalDayMs;
            this.rotation = sunPosition * 180;
        },
        epochToMinutesSinceMidnight(epochMs) {
            const date = new Date(epochMs);
            return date.getHours() * 60 + date.getMinutes();
		},
        async getCurrentWeatherInfo() {
            if (this.settingsStore.currentWeatherInfo?.lastUpdated) {
                // compare this.settingsStore.currentWeatherInfo.lastUpdated with current time and check if 1 hour passed
                const now = new Date();
                const diff = now - this.settingsStore.currentWeatherInfo.lastUpdated;

                // Update the weather info hourly
                if (diff <= 3_600_000) return;
            }

            try {
                const response = await fetch("https://cool-tab-api.vercel.app/api/current-weather");
                if (response.ok) {
                    const data = await response.json();
                    this.weather.sunrise_epoch = data.sunrise_epoch;
                    this.weather.sunset_epoch = data.sunset_epoch;
					this.weather.temperature_f = `${data.temp_f}°`;
                    this.weather.temperature_c = `${data.temp_c}°`;
                    this.weather.country = data.country;
                    this.weather.city = data.city;
                    this.weather.lastUpdated = new Date().toISOString();

                    this.calculateRotation();
                    this.settingsStore.setCurrentWeatherInfo(this.weather);
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        },
    },
};
</script>

<style scoped>
.inner {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    padding: 10px;
}

.weather-forecast {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    font-family: Satoshi-Bold;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    container-type: size;
}

.sun-and-moon {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    display: flex;
}

.orbit {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid var(--color-secondary-text);
    border-radius: 50%;
    position: absolute;
    display: flex;
    align-items: center;
}

.orbit-line {
    width: 100%;
    height: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
}

.planet {
    border-radius: 50%;
    margin: 5px;
    width: 15cqh !important;
    height: 15cqh !important;
}

.times {
    display: flex;
    flex-direction: row;
    font-size: 5cqw;
    justify-content: space-between;
    width: 100%;
    font-family: Satoshi-Medium;
}

.info {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    text-wrap: nowrap;
    text-overflow: ellipsis;
}

.info h1 {
    font-size: 35cqw;
    line-height: 35cqw;
    margin: 0;
    padding: 0;
}

.info > div {
    display: flex;
    flex-direction: column;
    width: 50%;
}

.info h3 {
    margin: 0;
    text-align: right;
    font-size: 10cqw;
    line-height: 11cqw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.info h4 {
    margin: 0;
    text-align: right;
    font-size: 9cqw;
    line-height: 10cqw;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
