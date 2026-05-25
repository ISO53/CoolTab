<template>
    <MockWidget size="1x1">
        <div class="calendar-widget">
            <div class="month">MAY</div>
            <div class="day">08</div>
            <div class="events">
                <div class="event">
                    <span class="dot"></span>
                    <span>Team Sync</span>
                </div>
                <div class="event">
                    <span class="dot"></span>
                    <span>Launch Day</span>
                </div>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import MockWidget from './MockWidget.vue';
</script>

<style scoped>
.calendar-widget {
    padding: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
}

.month {
    font-size: 8cqw;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.6);
}

.day {
    font-size: 30cqw;
    font-weight: 800;
    line-height: 1;
}

.events {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.event {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 6cqw;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 8px;
    border-radius: 4px;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
}
</style>
