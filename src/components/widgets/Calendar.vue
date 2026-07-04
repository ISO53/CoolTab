<template>
    <Widget>
        <div class="calendar">
            <div class="simple">
                <h1>{{ date.day }}</h1>
                <h2>{{ date.day_name }}</h2>
            </div>
            <div class="comprehensive">
                <h2>{{ date.day_name + "." }}</h2>
                <h2>{{ date.month_name }}</h2>
                <h2>{{ date.day }}</h2>
                <h2>{{ date.year }}</h2>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from './Widget.vue';
import { useSettingsStore } from "@/settings";

export default {
    name: "Calendar",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return { settingsStore };
    },
    computed: {
        date() {
            const date = new Date();
            const locale = this.settingsStore.language || "en";

            const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
            let dayName = dayFormatter.format(date);
            if (dayName) {
                dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            }

            const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });
            let monthName = monthFormatter.format(date);
            if (monthName) {
                monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            }

            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                day_name: dayName,
                month_name: monthName,
            };
        }
    }
};
</script>

<style scoped>
.calendar {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
}

.calendar:hover .simple {
    opacity: 0;
}

.calendar:hover .comprehensive {
    opacity: 1;
}

.simple {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3cqw;
    font-family: Satoshi-Bold;
    transition: opacity 200ms ease;
    container-type: size;
    resize: both;
    z-index: 2;
    border-radius: 10px;
}

.simple h1 {
    font-size: 65cqw;
    overflow: hidden;
    text-wrap: wrap;
    text-overflow: ellipsis;
}

.simple h2 {
    font-size: 15cqw;
    overflow: hidden;
    position: absolute;
    top: 3cqw;
    right: 3cqw;
    height: 15cqw;
    line-height: 15cqw;
    font-family: Satoshi-Medium;
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
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    transition: opacity 200ms ease;
}

.comprehensive h2 {
    font-size: 25cqw;
    line-height: 25cqw;
    margin: 0;
    overflow: hidden;
    text-wrap: wrap;
    text-overflow: ellipsis;
}
</style>
