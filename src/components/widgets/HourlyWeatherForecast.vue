<template>
    <Widget>
        <div class="hourly-weather">
            <div class="top-section">
                <div class="city-info">
                    <h1>{{ weather.city || "Loading..." }}</h1>
                    <h2>AQI: {{ weather.air_quality?.aqi || 0 }} ({{ weather.air_quality?.label || '...' }})</h2>
                </div>

                <div class="top-controls">
                    <button
                        class="ctrl-btn"
                        :class="{ active: activeMetric === 'temp' }"
                        @mouseenter="activeMetric = 'temp'"
                    >
                        <i class="material-icons-outlined">thermostat</i>
                        <span>Temp</span>
                    </button>
                    <button
                        class="ctrl-btn"
                        :class="{ active: activeMetric === 'rain' }"
                        @mouseenter="activeMetric = 'rain'"
                    >
                        <i class="material-icons-outlined">water_drop</i>
                        <span>Rain</span>
                    </button>
                    <button
                        class="ctrl-btn"
                        :class="{ active: activeMetric === 'wind' }"
                        @mouseenter="activeMetric = 'wind'"
                    >
                        <i class="material-icons-outlined">air</i>
                        <span>Wind</span>
                    </button>
                </div>
            </div>

            <div class="graph-container" v-if="points.length">
                <svg class="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="var(--color-tertiary-text)" stop-opacity="0.5" />
                            <stop offset="100%" stop-color="var(--color-tertiary-text)" stop-opacity="0" />
                        </linearGradient>
                    </defs>

                    <!-- Area Fill -->
                    <path
                        :d="activeFillPath"
                        fill="url(#area-gradient)"
                        stroke="none"
                        class="morph-fill"
                        vector-effect="non-scaling-stroke"
                    />

                    <!-- Morphing Line -->
                    <path
                        :d="activePath"
                        stroke="var(--color-secondary-text)"
                        stroke-width="3"
                        fill="none"
                        class="morph-line"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        vector-effect="non-scaling-stroke"
                    />
                </svg>

                <div class="labels-overlay">
                    <div v-for="(p, i) in points" :key="'lbl'+i" class="label-col" :style="{ left: `${p.x}%` }">
                        <div class="dot" :style="{ top: `${p[activeYKey]}%` }"></div>

                        <div class="val-container" :style="{ top: `${p[activeYKey]}%` }">
                            {{ p[activeValKey] + "" + activeUnit }}
                        </div>
                        <div class="time-label">{{ p.time }}</div>
                    </div>
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import {useSettingsStore} from "@/settings";
import Widget from "./Widget.vue";

export default {
    name: "HourlyWeatherForecast",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            weather: this.settingsStore.hourlyWeatherInfo,
            activeMetric: 'temp',
            metricRotationInterval: null,
        };
    },
    computed: {
        activeYKey() {
            return this.activeMetric + 'Y';
        },
        activeValKey() {
            return this.activeMetric;
        },
        activeUnit() {
            if (this.activeMetric === 'temp') return '°';
            if (this.activeMetric === 'rain') return 'mm';
            return 'km/h';
        },
        points() {
            const hours = this.weather?.hours || [];
            if (!hours.length) return [];

            const temps = hours.map(h => h.temp);
            const winds = hours.map(h => h.wind);
            const rains = hours.map(h => h.rain);

            const minT = Math.min(...temps);
            const maxT = Math.max(...temps);
            const rangeT = maxT - minT || 1;

            const minW = Math.min(...winds);
            const maxW = Math.max(...winds);
            const rangeW = maxW - minW || 1;

            const maxR = Math.max(...rains) || 0.1;

            return hours.map((h, i) => {
                // 8% margin on each side for labels/dots
                const x = 8 + (i / (hours.length - 1)) * 84;
                const tempY = 70 - ((h.temp - minT) / rangeT) * 45;
                const windY = 70 - ((h.wind - minW) / rangeW) * 45;
                const rainY = 70 - (h.rain / maxR) * 45;

                return {
                    x, tempY, windY, rainY,
                    time: h.time,
                    temp: Math.round(h.temp),
                    wind: Math.round(h.wind),
                    rain: h.rain.toFixed(1)
                };
            });
        },
        activePath() {
            if (!this.points.length) return "";
            const yKey = this.activeYKey;
            const p = this.points;

            // Start at the left edge (0) with the first point's Y
            let d = `M 0 ${p[0][yKey]} L ${p[0].x} ${p[0][yKey]}`;

            for(let i = 1; i < p.length; i++) {
                const p0 = p[i-1];
                const p1 = p[i];
                const cp1x = p0.x + (p1.x - p0.x) * 0.35;
                const cp2x = p1.x - (p1.x - p0.x) * 0.35;
                d += ` C ${cp1x} ${p0[yKey]}, ${cp2x} ${p1[yKey]}, ${p1.x} ${p1[yKey]}`;
            }

            // End at the right edge (100) with the last point's Y
            d += ` L 100 ${p[p.length - 1][yKey]}`;

            return d;
        },
        activeFillPath() {
            if (!this.activePath) return "";
            return `${this.activePath} L 100 100 L 0 100 Z`;
        }
    },
    watch: {
        "settingsStore.hourlyWeatherRotation": {
            handler(val) {
                if (val === "Enabled") {
                    this.startRotation();
                } else {
                    this.stopRotation();
                }
            },
            immediate: false,
        },
    },
    mounted() {
        this.getHourlyWeatherInfo();
        if (this.settingsStore.hourlyWeatherRotation === "Enabled") {
            this.startRotation();
        }
    },
    beforeUnmount() {
        this.stopRotation();
    },
    methods: {
        async getHourlyWeatherInfo() {
            if (this.settingsStore.hourlyWeatherInfo?.lastUpdated) {
                const now = new Date();
                const diff = now - this.settingsStore.hourlyWeatherInfo.lastUpdated;
                if (diff <= 3600000) return;
            }

            try {
                const response = await fetch("https://cool-tab-api.vercel.app/api/hourly-weather");
                if (response.ok) {
                    const data = await response.json();
                    data.lastUpdated = new Date().toISOString();
                    this.weather = data;
                    this.settingsStore.setHourlyWeatherInfo(data);
                }
            } catch (e) {
                console.error("Error fetching hourly weather:", e);
            }
        },
        startRotation() {
            this.stopRotation();
            this.metricRotationInterval = setInterval(() => {
                const metrics = ["temp", "rain", "wind"];
                const currentIndex = metrics.indexOf(this.activeMetric);
                const nextIndex = (currentIndex + 1) % metrics.length;
                this.activeMetric = metrics[nextIndex];
            }, 5000);
        },
        stopRotation() {
            if (this.metricRotationInterval) {
                clearInterval(this.metricRotationInterval);
                this.metricRotationInterval = null;
            }
        },
    },
};
</script>

<style scoped>
.hourly-weather {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 2 / 1;
    display: flex;
    flex-direction: column;
    container-type: size;
    font-family: Satoshi-Medium;
    box-sizing: border-box;
    overflow: hidden;
}

.top-section {
    padding: 5cqh;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
}

.city-info h1 {
    font-size: 12cqh;
    line-height: 12cqh;
    margin: 0;
    font-family: Satoshi-Black;
    color: var(--color-secondary-text);
}

.city-info h2 {
    font-size: 9cqh;
    line-height: 9cqh;
    margin: 0;
    font-family: Satoshi-Light;
    color: var(--color-secondary-text);
}

.top-controls {
    display: flex;
    flex-direction: row;
    gap: 3cqh;
}

.ctrl-btn {
    padding: 2.5cqh 5cqh;
    border-radius: 10cqh;
    border: 1px solid transparent;
    background: none;
    color: var(--color-secondary-text);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2cqh;
    cursor: pointer;
}

.ctrl-btn:hover, .ctrl-btn.active {
    border-color: var(--color-secondary-text);
}

.ctrl-btn i {
    font-size: 7cqh;
}

.ctrl-btn span {
    font-size: 5.5cqh;
    font-family: Satoshi-Medium;
}

.graph-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 65%;
    margin: 0;
    padding: 0;
}

.graph-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.morph-line, .morph-fill {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot {
    position: absolute;
    width: 2.5cqh;
    height: 2.5cqh;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
}

.labels-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.label-col {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.val-container {
    position: absolute;
    transform: translateY(-150%);
    font-size: 5cqh;
    white-space: nowrap;
    transition: top 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--color-secondary-text);
    font-family: Satoshi-Medium;
}

.time-label {
    position: absolute;
    bottom: 5cqh;
    font-size: 4.5cqh;
    color: var(--color-secondary-text);
    font-family: Satoshi-Light;
    white-space: nowrap;
}
</style>
