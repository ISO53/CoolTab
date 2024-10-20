<template>
    <div class="clock">
        <div class="hand hour-hand" :style="hourStyle"></div>
        <div class="hand minute-hand" :style="minuteStyle"></div>
        <div class="dot second-hand" :style="secondStyle"></div>
    </div>
</template>

<script>
export default {
    name: "AnalogClock",
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
    background-color: rgb(20, 20, 20);
    border-radius: 50%;
    border: 2px solid rgb(50, 50, 50);
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    container-type: size;
    resize: both;
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
    background-color: rgb(200, 200, 200);
    transform: translateX(5px);
}

.minute-hand {
    position: absolute;
    width: 45%;
    height: 6px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: rgb(50, 50, 50);
    border-radius: 5px;
}

.hour-hand {
    position: absolute;
    width: 35%;
    height: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: rgb(100, 100, 100);
    border-radius: 12px;
}
</style>
