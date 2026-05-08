<script setup>
import MockDigitalClock from './mock-widgets/MockDigitalClock.vue';
import MockStock from './mock-widgets/MockStock.vue';
import MockHourlyWeather from './mock-widgets/MockHourlyWeather.vue';
import MockCalendar from './mock-widgets/MockCalendar.vue';
import MockAnalogClock from './mock-widgets/MockAnalogClock.vue';
import MockTodoList from './mock-widgets/MockTodoList.vue';
import MockSearchBar from './mock-widgets/MockSearchBar.vue';

const row1 = [
    { component: MockDigitalClock },
    { component: MockStock },
    { component: MockHourlyWeather },
    { component: MockCalendar },
    { component: MockAnalogClock },
];

const row2 = [
    { component: MockSearchBar },
    { component: MockTodoList },
    { component: MockDigitalClock },
    { component: MockStock },
    { component: MockHourlyWeather },
];

const row3 = [
    { component: MockStock },
    { component: MockAnalogClock },
    { component: MockSearchBar },
    { component: MockCalendar },
    { component: MockTodoList },
];
</script>

<template>
    <section class="widgets-section">
        <div class="widgets-background">
            <div class="widgets-grid">
                <!-- Row 1 -->
                <div class="widget-row row-0">
                    <div v-for="(item, j) in [...row1, ...row1]" :key="'r1-'+j" class="widget-wrapper">
                        <component :is="item.component" />
                    </div>
                </div>
                <!-- Row 2 -->
                <div class="widget-row row-1">
                    <div v-for="(item, j) in [...row2, ...row2]" :key="'r2-'+j" class="widget-wrapper">
                        <component :is="item.component" />
                    </div>
                </div>
                <!-- Row 3 -->
                <div class="widget-row row-2">
                    <div v-for="(item, j) in [...row3, ...row3]" :key="'r3-'+j" class="widget-wrapper">
                        <component :is="item.component" />
                    </div>
                </div>
            </div>
        </div>

        <div class="widgets-overlay"></div>

        <div class="container widgets-content">
            <div class="text-wrapper">
                <h2 class="widgets-title">A Widget for Everything</h2>
                <p class="widgets-subtitle">
                    Experience your actual dashboard widgets in action. 
                    From real-time stock tracking to weather forecasts and smart calendars—all seamlessly integrated into your new tab.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.widgets-section {
    position: relative;
    height: 700px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    background: #000;
}

.widgets-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-8deg) scale(1.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0.5;
}

.widgets-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.widget-row {
    display: flex;
    gap: 20px;
    width: max-content;
}

.widget-wrapper {
    flex-shrink: 0;
}

.row-0 { animation: slide-left 80s linear infinite; }
.row-1 { animation: slide-right 70s linear infinite; }
.row-2 { animation: slide-left 90s linear infinite; }

@keyframes slide-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

@keyframes slide-right {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
}

.widgets-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
    pointer-events: none;
    z-index: 1;
}

.widgets-content {
    position: relative;
    z-index: 2;
    pointer-events: none;
}

.text-wrapper {
    max-width: 600px;
}

.widgets-title {
    font-size: 4.5rem;
    font-weight: 800;
    margin-bottom: 24px;
    line-height: 1;
    letter-spacing: -2px;
}

.widgets-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 500px;
}

@media (max-width: 768px) {
    .widgets-section {
        height: auto;
        padding: 80px 0;
        text-align: center;
    }

    .widgets-content {
        display: flex;
        justify-content: center;
    }

    .text-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 100%;
    }

    .widgets-title {
        font-size: 2.25rem;
        margin-bottom: 16px;
    }

    .widgets-subtitle {
        font-size: 1.1rem;
        max-width: 100%;
    }
}
</style>
