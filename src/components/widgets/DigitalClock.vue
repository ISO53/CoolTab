<template>
    <Widget>
        <div class="outer">
            <div v-if="settingsStore.timeFormat === '12h' && dayPeriod" class="ampm">
                {{ dayPeriod }}
            </div>
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
import {useSettingsStore} from "@/settings";

export default {
    name: "DigitalClock",
    components: {
        Widget,
    },
    data() {
        return {
            settingsStore: useSettingsStore(),
            hour: "",
            minute: "",
            second: "",
            dayPeriod: "",
        };
    },
	mounted() {
		this.dayPeriodFormatter = new Intl.DateTimeFormat(undefined, {
            hour: "numeric",
            hour12: true,
        });
        this.updateClock();
        this.timer = setInterval(this.updateClock, 1000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        updateClock() {
        	const now = new Date();
            this.second = String(now.getSeconds()).padStart(2, "0");
            this.minute = String(now.getMinutes()).padStart(2, "0");
			const hours = now.getHours();

			if (this.settingsStore.timeFormat === "12h") {
                const hour12 = hours % 12 || 12;
                this.hour = String(hour12).padStart(2, "0");
                const dayPeriodPart = this.dayPeriodFormatter
                    .formatToParts(now)
                    .find(part => part.type === "dayPeriod");
                this.dayPeriod = dayPeriodPart ? dayPeriodPart.value : "";
            } else {
                this.hour = String(hours).padStart(2, "0");
                this.dayPeriod = "";
            }
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
    container-type: size;
}

.ampm {
    overflow: hidden;
    position: absolute;
    top: 3cqw;
    right: 3cqw;
	font-size: 12cqw;
    height: 12cqw;
    line-height: 12cqw;
    font-family: Satoshi-Medium;
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
    transition: opacity 200ms ease;
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
    transition: opacity 200ms ease;
}

.comprehensive h1 {
    font-size: 20cqw;
    line-height: 20cqw;
    margin: 0;
    font-variant-numeric: tabular-nums;
}
</style>
