<template>
    <MockWidget size="1x1">
        <div class="digital-clock">
            <div class="time-main">
                <h1>{{ hour }}</h1>
                <h1>{{ minute }}</h1>
            </div>
            <div class="date-footer">
                <p>{{ dateStr }}</p>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MockWidget from './MockWidget.vue';

const hour = ref("12");
const minute = ref("30");
const dateStr = ref("Friday, May 8");

const updateTime = () => {
    const now = new Date();
    hour.value = String(now.getHours()).padStart(2, "0");
    minute.value = String(now.getMinutes()).padStart(2, "0");
};

let timer;
onMounted(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.digital-clock {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}

.time-main {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.time-main h1 {
    font-size: 35cqw;
    line-height: 35cqw;
    margin: 0;
    font-weight: 800;
}

.date-footer {
    margin-top: 10px;
}

.date-footer p {
    font-size: 8cqw;
    opacity: 0.6;
}
</style>
