<template>
    <Widget>
        <div class="weekly-weather-forecast">
            <div class="curr">
                <div class="curr-info">
                    <Svg :class_name="weather.curr.img"></Svg>
                    <h1>{{ weather.curr.temperature + "°" }}</h1>
                    <div class="high-low">
                        <h5>{{ "H " + weather.curr.high + "°" }}</h5>
                        <h5>{{ "L " + weather.curr.low + "°" }}</h5>
                    </div>
                </div>
                <div class="city-and-weather">
                    <h2>{{ weather.curr.city }}</h2>
                    <h2>{{ weather.curr.weather }}</h2>
                </div>
            </div>
            <div class="forecast">
                <div class="day" v-for="(item, index) in weather.week" :key="index">
                    <h1>{{ days[new Date(item.date).getDay()] }}</h1>
                    <Svg :class_name="item.img"></Svg>
                    <h2>{{ item.high + "°" }}</h2>
                    <h2>{{ item.low + "°" }}</h2>
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import {useSettingsStore} from "@/settings";
import Widget from "./Widget.vue";

export default {
    name: "WeekyWeatherForecast",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            weather: this.settingsStore.weeklyWeatherInfo,
            rotation: 0,
            days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
        };
    },
    mounted() {
        this.getWeeklyWeatherInfo();
    },
    methods: {
        async getWeeklyWeatherInfo() {
            if (this.settingsStore.weeklyWeatherInfo.lastUpdated) {
                // compare this.settingsStore.weeklyWeatherInfo.lastUpdated with current time and check if 3 hours passed
                const now = new Date();
                const diff = now - this.settingsStore.weeklyWeatherInfo.lastUpdated;

                // Update the weather info with 3 hour intervals
                if (diff <= 10_800_000) return;
            }

            // Fetch the data
            const response = await fetch("https://cool-tab-api.vercel.app/api/weekly-weather");
            const data = await response.json();

            this.weather = data;
            this.weather.lastUpdated = new Date().toISOString();
            this.settingsStore.setWeeklyWeatherInfo(this.weather);
        },
    },
};
</script>

<style scoped>
.weekly-weather-forecast {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 2 / 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    container-type: size;
}

.weekly-weather-forecast > div {
    width: 100%;
    height: 50%;
    padding: 10cqh;
}

.curr {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    container-type: size;
}

.curr-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    column-gap: 20cqh;
}

.curr-info > i {
    font-size: 100cqh;
}

.curr-info > h1 {
    font-family: Satoshi-Regular;
    font-size: 80cqh;
    line-height: 80cqh;
    margin: 0;
}

.high-low {
    font-family: Satoshi-Light;
    font-size: 30cqh;
}

.city-and-weather {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
}

.city-and-weather > h2 {
    font-family: Satoshi-Light;
    font-size: 25cqh;
    line-height: 25cqh;
    margin: 0;
}

.day {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: Satoshi-Light;
    height: 100%;
}

.day > h1 {
    font-size: 5cqh;
    line-height: 5cqh;
}

.day > h2 {
    font-size: 5cqh;
    line-height: 5cqh;
}

.day > i {
    font-size: 10cqh;
}

.forecast {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 0 !important;
}
</style>
