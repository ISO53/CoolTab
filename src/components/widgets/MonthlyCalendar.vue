<template>
    <Widget>
        <div class="monthly-calendar">
            <div class="calendar-header">
                <div class="nav-btn" @click="prevMonth">
                    <Svg name="chevron_left" class_name="material-icons-outlined nav-icon"></Svg>
                </div>
                <div class="month-display">{{ monthName }} {{ currentYear }}</div>
                <div class="nav-btn" @click="nextMonth">
                    <Svg name="chevron_right" class_name="material-icons-outlined nav-icon"></Svg>
                </div>
            </div>
            <div class="calendar-grid">
                <div v-for="day in weekDays" :key="day" class="weekday-header">
                    {{ day }}
                </div>
                <div v-for="day in prevMonthDays" :key="'prev-' + day" class="calendar-day other-month">
                    {{ day }}
                </div>
                <div v-for="day in daysInCurrentMonth" :key="'curr-' + day" class="calendar-day" :class="{ today: isToday(day) }">
                    <span>{{ day }}</span>
                </div>
                <div v-for="day in nextMonthDays" :key="'next-' + day" class="calendar-day other-month">
                    {{ day }}
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from './Widget.vue';

export default {
    name: "MonthlyCalendar",
    components: {
        Widget,
    },
    data() {
        return {
            currentDate: new Date(),
            viewDate: new Date(),
            weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        };
    },
    computed: {
        currentMonth() {
            return this.viewDate.getMonth();
        },
        currentYear() {
            return this.viewDate.getFullYear();
        },
        monthName() {
            return this.viewDate.toLocaleString('default', { month: 'long' });
        },
        daysInCurrentMonth() {
            const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            return Array.from({ length: days }, (_, i) => i + 1);
        },
        blankDays() {
            // Get first day of month (0-6, 0 is Sunday)
            let firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
            // Adjust so Monday is 0, Tuesday is 1, ..., Sunday is 6
            let adjustedFirstDay = (firstDay + 6) % 7;
            return adjustedFirstDay;
        },
        prevMonthDays() {
            const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
            const days = [];
            for (let i = this.blankDays - 1; i >= 0; i--) {
                days.push(prevMonthLastDay - i);
            }
            return days;
        },
        nextMonthDays() {
            const totalCells = 42; // 6 rows * 7 columns
            const occupiedCells = this.blankDays + this.daysInCurrentMonth.length;
            const remainingCells = totalCells - occupiedCells;
            return Array.from({length: remainingCells}, (_, i) => i + 1);
        },
    },
    methods: {
        prevMonth() {
            this.viewDate = new Date(this.currentYear, this.currentMonth - 1, 1);
        },
        nextMonth() {
            this.viewDate = new Date(this.currentYear, this.currentMonth + 1, 1);
        },
        isToday(day) {
            return (
                day === this.currentDate.getDate() &&
                this.currentMonth === this.currentDate.getMonth() &&
                this.currentYear === this.currentDate.getFullYear()
            );
        },
    },
};
</script>

<style scoped>
.monthly-calendar {
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    padding: 2cqh;
    box-sizing: border-box;
    container-type: size;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5cqh;
    font-family: Satoshi-Black;
}

.month-display {
    font-size: 7cqh;
}

.nav-btn {
    cursor: pointer;
    transition: opacity 250ms ease;
}

.nav-btn:hover {
    opacity: 0.5;
}

.nav-icon {
    font-size: 7cqw;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(6, 1fr);
    flex-grow: 1;
    gap: 1cqh;
}

.weekday-header {
    text-align: center;
    font-size: 4cqw;
    opacity: 0.7;
    font-family: Satoshi-Medium;
}

.calendar-day {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5cqw;
    font-family: Satoshi-Light;
}

.other-month {
    opacity: 0.25;
}

.today span {
    background: var(--color-primary-text);
    color: var(--color-primary-background);
    font-family: Satoshi-Black;
    width: 10cqw;
    height: 10cqw;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
</style>
