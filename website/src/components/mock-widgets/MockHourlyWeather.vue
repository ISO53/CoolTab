<template>
    <MockWidget size="2x1">
        <div class="hourly-weather">
            <div class="top">
                <div class="city">
                    <h1>San Francisco</h1>
                    <p>Mostly Clear</p>
                </div>
                <div class="temp-now">
                    <h1>68°</h1>
                </div>
            </div>
            <div class="graph-area">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M 0 80 Q 50 20 100 50 T 200 40 T 300 60 T 400 30" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3" fill="none" />
                    <path d="M 0 80 Q 50 20 100 50 T 200 40 T 300 60 T 400 30 L 400 100 L 0 100 Z" fill="url(#weatherGrad)" />
                    <defs>
                        <linearGradient id="weatherGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="white" stop-opacity="0.1" />
                            <stop offset="100%" stop-color="white" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                <div class="hours">
                    <span v-for="h in ['12PM', '2PM', '4PM', '6PM', '8PM', '10PM']" :key="h">{{ h }}</span>
                </div>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import MockWidget from './MockWidget.vue';
</script>

<style scoped>
.hourly-weather {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.city h1 {
    font-size: 8cqh;
    margin: 0;
}

.city p {
    font-size: 5cqh;
    opacity: 0.6;
    margin: 0;
}

.temp-now h1 {
    font-size: 15cqh;
    margin: 0;
}

.graph-area {
    flex: 1;
    position: relative;
    margin-top: 10px;
}

svg {
    width: 100%;
    height: 100%;
}

.hours {
    position: absolute;
    bottom: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 4cqh;
    opacity: 0.5;
}
</style>
