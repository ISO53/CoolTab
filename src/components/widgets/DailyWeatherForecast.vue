<template>
    <div class="weather-forecast">
        <div class="sun-and-moon">
            <div class="orbit">
                <div class="orbit-line" :style="{transform: `rotate(${rotation}deg)`}">
                    <img class="planet" src="@/components/weather/sun.svg" />
                    <img class="planet" src="@/components/weather/moon.svg" />
                </div>
            </div>
        </div>
        <div v-if="rotation < 180" class="times">
            <h2>{{ weather.sunrise }}</h2>
            <h2>{{ weather.sunset }}</h2>
        </div>
        <div v-else class="times">
            <h2>{{ weather.sunset }}</h2>
            <h2>{{ weather.sunrise }}</h2>
        </div>
        <div class="info">
            <h1>{{ weather.temperature }}</h1>
            <div>
                <h4>{{ weather.country }}</h4>
                <h3>{{ weather.city }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "DailyWeatherForecast",
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
    mounted() {
        this.getCurrentWeatherInfo();
        setInterval(this.calculateRotation, 60_000);
    },
    methods: {
        convertTimeToMinutes(time) {
            const [hour, minute] = time.split(":");
            const hour24 = parseInt(hour);
            const minuteVal = parseInt(minute);

            return hour24 * 60 + minuteVal;
        },
        calculateRotation() {
            const sunriseMinutes = this.convertTimeToMinutes(this.weather.sunrise);
            const sunsetMinutes = this.convertTimeToMinutes(this.weather.sunset);
            const totalDayMinutes = sunsetMinutes - sunriseMinutes;

            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            let sunPosition = (currentMinutes - sunriseMinutes) / totalDayMinutes;
            this.rotation = sunPosition * 180;
        },
        getCurrentWeatherInfo() {
            if (this.settingsStore.currentWeatherInfo.lastUpdated) {
                // compare this.settingsStore.currentWeatherInfo.lastUpdated with current time and check if 1 hour passed
                const now = new Date();
                const diff = now - this.settingsStore.currentWeatherInfo.lastUpdated;

                // Update the weather info hourly
                if (diff >= 3_600_000) return;
            }

            fetch("https://cool-tab-api.vercel.app/api/current-weather")
                .then((response) => response.json())
                .then((data) => {
                    this.weather.sunrise = data.sunrise;
                    this.weather.sunset = data.sunset;
                    this.weather.temperature = data.temp_c + "°";
                    this.weather.country = data.country;
                    this.weather.city = data.city;
                    this.weather.lastUpdated = new Date().toISOString();

                    this.calculateRotation();
                    this.settingsStore.setCurrentWeatherInfo(this.weather);
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                });
        },
    },
};
</script>

<style scoped>
.weather-forecast {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    background-color: rgb(20, 20, 20);
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    user-select: none;
    font-family: Satoshi-Bold;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding: 10px;
    container-type: size;
    resize: both;
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
    border: 1px solid white;
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
    background-color: rgb(20, 20, 20);
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
    height: 50%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    overflow: hidden;
}

.info h1 {
    font-size: 35cqw;
    line-height: 35cqw;
    margin: 0;
    padding: 0;
}

.info h3 {
    margin: 0;
    text-align: right;
}

.info h4 {
    margin: 0;
    text-align: right;
}
</style>
