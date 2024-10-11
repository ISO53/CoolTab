<template>
    <div class="calendar">
        <div class="simple">
            <h1>{{ date.day }}</h1>
        </div>
        <div class="compherensive">
            <h2>{{ date.day_name }}</h2>
            <h2>{{ date.month_name }}</h2>
            <h2>{{ date.day }}</h2>
            <h2>{{ date.year }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: "Calendar",
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

            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    aspect-ratio: 1;
    background-color: rgb(20, 20, 20);
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    user-select: none;
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
    background-color: rgb(20, 20, 20);
    z-index: 2;
    border-radius: 10px;
}

.simple h1 {
    font-size: 65cqw;
}

.simple:hover {
    opacity: 0;
}

.compherensive {
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
}

.compherensive h2 {
    font-size: 25cqw;
    line-height: 25cqw;
    margin: 0;
}
</style>
