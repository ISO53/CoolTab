<template>
    <Widget>
        <div class="weekly-weather-forecast" ref="weeklyWeatherContainer">
            <div class="curr">
                <div class="curr-info">
                    <Svg :class_name="weather.curr?.img || ''"></Svg>
                    <h1>{{ (weather.curr?.temperature ?? 0) + "°" }}</h1>
                    <div class="high-low">
                        <h5>{{ $t('weather.high') + " " + (weather.curr?.high ?? 0) + "°" }}</h5>
                        <h5>{{ $t('weather.low') + " " + (weather.curr?.low ?? 0) + "°" }}</h5>
                    </div>
                </div>
                <div class="city-and-weather">
                    <h2 class="marquee-container" :style="{ fontSize: $tData('geo', weather.curr?.city).length > 12 ? '20cqh' : '25cqh', lineHeight: $tData('geo', weather.curr?.city).length > 12 ? '20cqh' : '25cqh' }"><span class="marquee-text">{{ $tData('geo', weather.curr?.city) }}</span></h2>
                    <h2 class="marquee-container" :style="{ fontSize: $tData('weather_cond', weather.curr?.weather).length > 12 ? '20cqh' : '25cqh', lineHeight: $tData('weather_cond', weather.curr?.weather).length > 12 ? '20cqh' : '25cqh' }"><span class="marquee-text">{{ $tData('weather_cond', weather.curr?.weather) }}</span></h2>
                </div>
            </div>
            <div class="forecast">
                <div class="day" v-for="(item, index) in weather.week" :key="index">
                    <h1>{{ item.date ? days[new Date(item.date).getDay()] : '' }}</h1>
                    <Svg :class_name="item.img || ''"></Svg>
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
    name: "WeeklyWeatherForecast",
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
        };
    },
    computed: {
        days() {
            const locale = this.settingsStore.language || "en";
            if (locale === "ru") {
                return ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
            }
            return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        }
    },
    mounted() {
        this.getWeeklyWeatherInfo();
        this.resizeObserver = new ResizeObserver(() => {
            this.checkAllOverflows();
        });
        this.$nextTick(() => {
            const container = this.$refs.weeklyWeatherContainer;
            if (container) {
                const texts = container.querySelectorAll(".marquee-text") || [];
                texts.forEach(el => this.resizeObserver.observe(el));
            }
        });
    },
    beforeUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    },
    watch: {
        'weather.curr.city'() {
            this.$nextTick(() => {
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect();
                    const container = this.$refs.weeklyWeatherContainer;
                    if (container) {
                        const texts = container.querySelectorAll(".marquee-text") || [];
                        texts.forEach(el => this.resizeObserver.observe(el));
                    }
                } else {
                    this.checkAllOverflows();
                }
            });
        },
        'weather.curr.weather'() {
            this.$nextTick(() => {
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect();
                    const container = this.$refs.weeklyWeatherContainer;
                    if (container) {
                        const texts = container.querySelectorAll(".marquee-text") || [];
                        texts.forEach(el => this.resizeObserver.observe(el));
                    }
                } else {
                    this.checkAllOverflows();
                }
            });
        },
        'settingsStore.language'() {
            this.$nextTick(() => this.checkAllOverflows());
        }
    },
    methods: {
        async getWeeklyWeatherInfo() {
            if (this.settingsStore.weeklyWeatherInfo?.lastUpdated) {
                // compare this.settingsStore.weeklyWeatherInfo.lastUpdated with current time and check if 3 hours passed
                const now = new Date();
                const diff = now - this.settingsStore.weeklyWeatherInfo.lastUpdated;

                // Update the weather info with 3 hour intervals
                if (diff <= 10_800_000) return;
            }

            try {
                const response = await fetch("https://cool-tab-api.vercel.app/api/weekly-weather");
                if (response.ok) {
                    const data = await response.json();
                    data.lastUpdated = new Date().toISOString();
                    this.weather = data;
                    this.settingsStore.setWeeklyWeatherInfo(data);
                }
            } catch (e) {
                console.error("Error fetching weekly weather:", e);
            }
        },
        checkAllOverflows() {
            const container = this.$refs.weeklyWeatherContainer;
            if (!container) return;
            const marqueeTexts = container.querySelectorAll(".marquee-text") || [];
            marqueeTexts.forEach((textEl) => {
                const el = textEl.parentElement;
                if (!el) return;
                
                el.classList.remove("is-overflowing");
                el.style.removeProperty("--scroll-distance");
                
                const scrollDist = textEl.offsetWidth - el.clientWidth;
                console.log(`[WeeklyWeatherForecast] text: ${textEl.innerText.trim()}, textWidth: ${textEl.offsetWidth}, parentWidth: ${el.clientWidth}, scrollDist: ${scrollDist}`);
                if (scrollDist > 0) {
                    el.style.setProperty("--scroll-distance", `-${scrollDist + 4}px`);
                    el.classList.add("is-overflowing");
                }
            });
        }
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
    font-size: 22cqh;
    line-height: 24cqh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.high-low h5 {
    margin: 0;
    padding: 0;
}

.city-and-weather {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    width: 50%;
    overflow: hidden;
}

.city-and-weather > h2 {
    font-family: Satoshi-Light;
    font-size: 25cqh;
    line-height: 25cqh;
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    text-align: right;
}

.city-and-weather > h2.is-overflowing {
    text-align: left;
}

.marquee-text {
    display: inline-block;
    white-space: nowrap;
    will-change: transform;
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
