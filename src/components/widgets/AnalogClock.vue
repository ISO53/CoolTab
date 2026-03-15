<template>
    <Widget style="border-radius: 50%">
        <div class="clock" :class="settingsStore.analogClockStyle.toLowerCase()">
            <!-- Minimal Style -->
            <template v-if="settingsStore.analogClockStyle === 'Minimal'">
                <div class="hand hour-hand" :style="hourStyle"></div>
                <div class="hand minute-hand" :style="minuteStyle"></div>
                <div class="dot second-hand" :style="secondStyle"></div>
            </template>

            <!-- Classic Style -->
            <template v-else-if="settingsStore.analogClockStyle === 'Classic'">
                <div class="ticks">
                    <div v-for="i in 12" :key="i" class="tick" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
                </div>
                <div class="classic-hand hour-hand" :style="hourStyleClassic"></div>
                <div class="classic-hand minute-hand" :style="minuteStyleClassic"></div>
                <div class="classic-hand second-hand" :style="secondStyleClassic"></div>
                <div class="center-dot"></div>
            </template>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import { useSettingsStore } from "@/settings";

export default {
    name: "AnalogClock",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return { settingsStore };
    },
    data() {
        return {
            hourStyle: {},
            minuteStyle: {},
            secondStyle: {},
            hourStyleClassic: {},
            minuteStyleClassic: {},
            secondStyleClassic: {},
        };
    },
    mounted() {
        this.updateClock();
        this.timer = setInterval(this.updateClock, 10);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        updateClock() {
            const now = new Date();
            const ms = now.getMilliseconds();
            const s = now.getSeconds();
            const m = now.getMinutes();
            const h = now.getHours();

            // Minimal degrees
            const secondDegree = ((s * 1000 + ms) / 60000) * 360 + 90;
            const minuteDegree = (m / 60) * 360 + (s / 60) * 6 + 90;
            const hourDegree = (h / 12) * 360 + (m / 60) * 30 + 90;

            this.secondStyle = { transform: `rotate(${secondDegree}deg) translateX(-50%)` };
            this.minuteStyle = { transform: `rotate(${minuteDegree}deg) translateX(-50%) translateX(1.5cqw)` };
            this.hourStyle = { transform: `rotate(${hourDegree}deg) translateX(-50%) translateX(3cqw)` };

            // Classic degrees
            const secondDegreeClassic = ((s * 1000 + ms) / 60000) * 360 - 90;
            const minuteDegreeClassic = (m / 60) * 360 + (s / 60) * 6 - 90;
            const hourDegreeClassic = (h / 12) * 360 + (m / 60) * 30 - 90;

            this.secondStyleClassic = { transform: `translateY(-50%) rotate(${secondDegreeClassic}deg)` };
            this.minuteStyleClassic = { transform: `translateY(-50%) rotate(${minuteDegreeClassic}deg)` };
            this.hourStyleClassic = { transform: `translateY(-50%) rotate(${hourDegreeClassic}deg)` };
        },
    },
};
</script>

<style scoped>
.clock {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    container-type: size;
}

/* Minimal Styles */
.second-hand {
    position: absolute;
    width: 50%;
    height: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.minimal .second-hand::after {
    content: "";
    width: 3cqw;
    height: 3cqw;
    border-radius: 50%;
    background-color: var(--color-primary-text);
    transform: translateX(1.5cqw);
}

.minute-hand {
    position: absolute;
    width: 45%;
    height: 3cqw;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--color-tertiary-text);
    border-radius: 1.5cqw;
}

.hour-hand {
    position: absolute;
    width: 35%;
    height: 6cqw;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--color-secondary-text);
    border-radius: 3cqw;
}

/* Classic Styles */
.tick {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.tick::after {
    content: "";
    position: absolute;
    top: 5%;
    left: 50%;
    width: 2px;
    height: 3%;
    background-color: var(--color-tertiary-text);
    transform: translateX(-50%);
    opacity: 0.5;
}

.classic-hand {
    position: absolute;
    background-color: var(--color-primary-text);
    transform-origin: left center;
    left: 50%;
    top: 50%;
    border-radius: 0;
    /* Sharp rectangles */
}

.classic .hour-hand {
    width: 25%;
    height: 1.5%;
    background-color: var(--color-secondary-text);
}

.classic .minute-hand {
    width: 38%;
    height: 1%;
    background-color: var(--color-tertiary-text);
}

.classic .second-hand {
    width: 42%;
    height: 0.5%;
    background-color: var(--color-primary-text);
}

.center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4cqw;
    height: 4cqw;
    background-color: var(--color-primary-text);
    border-radius: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
