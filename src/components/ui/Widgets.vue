<template>
	<h2 class="page-title">Widgets</h2>
	<div class="widget-grid">
		<div
			v-for="(widget, index) in settingsStore.widgets"
			:key="index"
			class="widget-card"
			:class="{
				active: widget.selected,
				inactive: !widget.selected,
			}"
			@click="setWidgetSelected(widget, !widget.selected)"
		>
			<div v-if="widget.selected" class="card-indicator">
				<Svg
					:class_name="'material-icons-outlined'"
					:name="'check_circle'"
				></Svg>
			</div>
			<div class="preview-container">
				<div class="preview-wrapper">
					<component :is="widget.name" class="widget-preview" />
				</div>
			</div>
			<div class="widget-info">
				<span class="widget-name">{{
					formatWidgetName(widget.name)
				}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import Svg from "@/components/ui/Svg.vue";
import SearchBar from "@/components/widgets/SearchBar.vue";
import Calendar from "@/components/widgets/Calendar.vue";
import AnalogClock from "@/components/widgets/AnalogClock.vue";
import DigitalClock from "@/components/widgets/DigitalClock.vue";
import DailyWeatherForecast from "@/components/widgets/DailyWeatherForecast.vue";
import Stock from "@/components/widgets/Stock.vue";
import LargeStock from "@/components/widgets/LargeStock.vue";
import QuickLinks from "@/components/widgets/QuickLinks.vue";
import WeeklyWeatherForecast from "@/components/widgets/WeeklyWeatherForecast.vue";
import TodoList from "@/components/widgets/TodoList.vue";
import HourlyWeatherForecast from "@/components/widgets/HourlyWeatherForecast.vue";
import MonthlyCalendar from "@/components/widgets/MonthlyCalendar.vue";
import {defineAsyncComponent} from "vue";

import {useSettingsStore} from "@/settings";

// Location widget is lazy loaded because it loads cobe library, a WebGL-based 3D globe library that
// should not be loaded to RAM if the user doesn't use the widget.
const Location = defineAsyncComponent(() => import("../widgets/Location.vue"));

export default {
	name: "Widgets",
	components: {
		Svg,
		SearchBar,
		Calendar,
		AnalogClock,
		DigitalClock,
		DailyWeatherForecast,
		Stock,
		LargeStock,
		QuickLinks,
		WeeklyWeatherForecast,
		TodoList,
		HourlyWeatherForecast,
		MonthlyCalendar,
		Location,
	},
	data() {
		return {
			settingsStore: useSettingsStore(),
		};
	},
	methods: {
		setWidgetSelected(widget, isSelected) {
            widget.selected = isSelected;
            this.settingsStore.setWidgets(this.settingsStore.widgets);
        },
        formatWidgetName(name) {
            return name.replace(/([A-Z])/g, " $1").trim();
        },
	},
};
</script>

<style>
.page-title {
    font-family: Satoshi-Bold;
    font-size: 1.2rem;
    color: var(--color-primary-text);
    margin: 0 0 16px 0;
    flex-shrink: 0;
}

.widget-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 4px 0;
}

.widget-preview:has(.quick-links.horizontal) {
	height: 10cqh;
	width: 50cqw;
}

.widget-preview:has(.quick-links.vertical) {
	height: 50cqh;
	width: 10cqh;
}

.widget-preview:has(.search-bar) {
	height: 10cqh;
	width: 50cqw;
}

.widget-card {
    background-color: var(--color-secondary-background);
    border: 1.5px solid var(--color-border-line);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    position: relative;
}

.widget-card:hover {
    border-color: var(--color-tertiary-text);
}

.widget-card.active {
    border-color: var(--color-primary-text);
    background-color: color-mix(in srgb, var(--color-secondary-background), var(--color-primary-text) 3%);
}

.widget-card.inactive {
    opacity: 0.7;
}

.widget-card.inactive:hover {
    opacity: 1;
}

.widget-card:hover .preview-wrapper {
    transform: scale(0.33);
}

.widget-card:hover .widget-name,
.widget-card.active .widget-name {
    color: var(--color-primary-text);
}

.card-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    color: var(--color-primary-text);
    background-color: var(--color-primary-background);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.card-indicator i {
    font-size: 1.1rem !important;
}

.preview-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: var(--color-primary-background);
    background-image: radial-gradient(circle at 2px 2px, var(--color-border-line) 1px, transparent 0);
    background-size: 16px 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1.5px solid var(--color-border-line);
    position: relative;
}

:deep(.preview-container .widget) {
    background: color-mix(in srgb, var(--color-secondary-background), transparent 80%) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid var(--color-border-line) !important;
}

.preview-wrapper {
    width: 600px;
    height: 400px;
    transform: scale(0.3);
    transform-origin: center;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.widget-info {
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.widget-name {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05rem;
    color: var(--color-secondary-text);
    transition: color 0.3s ease;
}
</style>
