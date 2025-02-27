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

export default {
    name: "Calendar",
    components: {
        Widget,
    },
    data() {
        return {
            date: {
                day: "",
                month: "",
                year: "",
                day_name: "",
                month_name: "",
            },
        };
    },
    mounted() {
        this.date = this.getCurrentDate();
    },
    methods: {
        getCurrentDate() {
            const date = new Date();

            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const monthsOfYear = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            return {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                day_name: daysOfWeek[date.getDay()],
                month_name: monthsOfYear[date.getMonth()],
            };
        },
    },
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
    transition: opacity 250ms ease;
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
    transition: opacity 250ms ease;
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
