<template>
    <Widget style="border-radius: 50%">
        <div class="clock">
            <div class="hand hour-hand" :style="hourStyle"></div>
            <div class="hand minute-hand" :style="minuteStyle"></div>
            <div class="dot second-hand" :style="secondStyle"></div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";

export default {
    name: "AnalogClock",
    components: {
        Widget,
    },
    data() {
        return {
            hourStyle: {},
            minuteStyle: {},
            secondStyle: {},
        };
    },
    mounted() {
        this.updateClock();
        setInterval(this.updateClock, 1000);
    },
    methods: {
        updateClock() {
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
            const hours = now.getHours();

            const secondDegree = (seconds / 60) * 360 + 90;
            const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
            const hourDegree = (hours / 12) * 360 + (minutes / 60) * 30 + 90;

            this.secondStyle = {transform: `rotate(${secondDegree}deg) translateX(-50%)`};
            this.minuteStyle = {transform: `rotate(${minuteDegree}deg) translateX(-50%) translateX(3px)`};
            this.hourStyle = {transform: `rotate(${hourDegree}deg) translateX(-50%) translateX(6px)`};
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

.second-hand {
    position: absolute;
    width: 50%;
    height: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.second-hand::after {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--color-primary-text);
    transform: translateX(5px);
}

.minute-hand {
    position: absolute;
    width: 45%;
    height: 6px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--color-tertiary-text);
    border-radius: 5px;
}

.hour-hand {
    position: absolute;
    width: 35%;
    height: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--color-secondary-text);
    border-radius: 12px;
}
</style>
