<template>
    <MockWidget size="1x1">
        <div class="analog-clock">
            <div class="clock-face">
                <div class="ticks">
                    <div v-for="i in 12" :key="i" class="tick" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
                </div>
                <div class="hand hour" :style="{ transform: `rotate(${hourDeg}deg)` }"></div>
                <div class="hand minute" :style="{ transform: `rotate(${minuteDeg}deg)` }"></div>
                <div class="hand second" :style="{ transform: `rotate(${secondDeg}deg)` }"></div>
                <div class="center-dot"></div>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MockWidget from './MockWidget.vue';

const hourDeg = ref(0);
const minuteDeg = ref(0);
const secondDeg = ref(0);

const updateClock = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    
    hourDeg.value = (h % 12) * 30 + m * 0.5;
    minuteDeg.value = m * 6;
    secondDeg.value = s * 6;
};

let timer;
onMounted(() => {
    updateClock();
    timer = setInterval(updateClock, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.analog-clock {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.clock-face {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.tick {
    position: absolute;
    width: 100%;
    height: 100%;
}

.tick::after {
    content: '';
    position: absolute;
    top: 5%;
    left: 50%;
    width: 2px;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-50%);
}

.hand {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform-origin: bottom center;
    border-radius: 4px;
}

.hour {
    width: 4px;
    height: 25%;
    background: white;
    z-index: 3;
}

.minute {
    width: 3px;
    height: 35%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 2;
}

.second {
    width: 1px;
    height: 40%;
    background: #ff4fd8;
    z-index: 4;
}

.center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
}
</style>
