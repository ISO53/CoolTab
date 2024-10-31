<template>
    <Widget>
        <div class="outer">
            <div class="simple">
                <h1>{{ hour }}</h1>
                <h1>{{ minute }}</h1>
            </div>
            <div class="comprehensive">
                <h1>{{ hour }}:{{ minute }}:{{ second }}</h1>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from './Widget.vue';

export default {
    name: "DigitalClock",
    components: {
        Widget,
    },
    data() {
        return {
            hour: "",
            minute: "",
            second: "",
        };
    },
    mounted() {
        this.updateClock();
        setInterval(this.updateClock, 1000);
    },
    methods: {
        updateClock() {
            const now = new Date();
            this.second = String(now.getSeconds()).padStart(2, "0");
            this.minute = String(now.getMinutes()).padStart(2, "0");
            this.hour = String(now.getHours()).padStart(2, "0");
        },
    },
};
</script>

<style scoped>
.outer {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    font-family: Satoshi-Bold;
    overflow: hidden;
}

.outer:hover .simple{
    opacity: 0;
}

.outer:hover .comprehensive{
    opacity: 1;
}

.simple {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: opacity 250ms ease;
    container-type: size;
    resize: both;
    z-index: 2;
    border-radius: 10px;
}

.simple h1 {
    font-size: 45cqw;
    line-height: 45cqw;
    padding: 0;
    margin: 0;
}

.comprehensive {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    container-type: size;
    resize: both;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 250ms ease;
}

.comprehensive h1 {
    font-size: 20cqw;
    line-height: 20cqw;
    margin: 0;
}
</style>
