<template>
	<div class="palette-header">
		<h2>Palette</h2>
		<div class="selected-palette" v-if="selectedName">
			<span class="dot" :style="{ backgroundColor: selectedAccent }"></span>
			<h2>{{ selectedName }}</h2>
		</div>
	</div>

	<div class="palette-grid">
		<div
			class="swatch"
			v-for="palette in currentPalettes"
			:key="palette.name"
			:class="{ selected: isSelected(palette) }"
			:style="{
				background: `linear-gradient(135deg, ${palette.color_secondary_text} 50%, ${palette.color_tertiary_text} 50%)`,
			}"
			@click="selectColor(palette)"
			@mouseenter="$emit('hover', palette)"
			@mouseleave="$emit('leave')"
		></div>
	</div>
</template>

<script>
import { useSettingsStore } from "@/settings";

export default {
	emits: ["select", "hover", "leave"],
	name: "ColorPalette",
	data() {
		return {
			settingsStore: useSettingsStore(),
			colorPalette: {
				light: [
					{
						name: "Red",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(170, 45, 45)",
						color_tertiary_text: "rgb(190, 95, 95)",
						color_primary_background: "rgb(255, 244, 244)",
						color_secondary_background: "rgb(250, 225, 225)",
						color_tertiary_background: "rgb(242, 205, 205)",
						color_border_line: "rgb(228, 195, 195)",
					},
					{
						name: "Brown",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(130, 75, 30)",
						color_tertiary_text: "rgb(170, 115, 70)",
						color_primary_background: "rgb(255, 248, 240)",
						color_secondary_background: "rgb(245, 232, 215)",
						color_tertiary_background: "rgb(232, 212, 188)",
						color_border_line: "rgb(215, 190, 165)",
					},
					{
						name: "Orange",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(225, 120, 15)",
						color_tertiary_text: "rgb(245, 170, 65)",
						color_primary_background: "rgb(255, 250, 245)",
						color_secondary_background: "rgb(255, 235, 205)",
						color_tertiary_background: "rgb(255, 220, 175)",
						color_border_line: "rgb(240, 205, 155)",
					},
					{
						name: "Yellow",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(200, 180, 25)",
						color_tertiary_text: "rgb(225, 210, 80)",
						color_primary_background: "rgb(255, 255, 245)",
						color_secondary_background: "rgb(255, 250, 220)",
						color_tertiary_background: "rgb(250, 242, 185)",
						color_border_line: "rgb(235, 225, 165)",
					},
					{
						name: "Lime",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(90, 150, 20)",
						color_tertiary_text: "rgb(130, 175, 60)",
						color_primary_background: "rgb(248, 255, 235)",
						color_secondary_background: "rgb(235, 250, 205)",
						color_tertiary_background: "rgb(218, 242, 175)",
						color_border_line: "rgb(200, 225, 150)",
					},
					{
						name: "Green",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(65, 140, 65)",
						color_tertiary_text: "rgb(110, 165, 110)",
						color_primary_background: "rgb(247, 252, 247)",
						color_secondary_background: "rgb(232, 244, 232)",
						color_tertiary_background: "rgb(215, 232, 215)",
						color_border_line: "rgb(200, 220, 200)",
					},
					{
						name: "Teal",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(45, 140, 120)",
						color_tertiary_text: "rgb(95, 180, 160)",
						color_primary_background: "rgb(245, 255, 252)",
						color_secondary_background: "rgb(225, 248, 242)",
						color_tertiary_background: "rgb(205, 238, 230)",
						color_border_line: "rgb(190, 225, 215)",
					},
					{
						name: "Cyan",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(45, 135, 165)",
						color_tertiary_text: "rgb(95, 175, 200)",
						color_primary_background: "rgb(245, 253, 255)",
						color_secondary_background: "rgb(225, 245, 250)",
						color_tertiary_background: "rgb(205, 235, 242)",
						color_border_line: "rgb(190, 220, 228)",
					},
					{
						name: "Blue",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(50, 50, 150)",
						color_tertiary_text: "rgb(100, 100, 175)",
						color_primary_background: "rgb(245, 245, 255)",
						color_secondary_background: "rgb(230, 230, 250)",
						color_tertiary_background: "rgb(210, 210, 240)",
						color_border_line: "rgb(200, 200, 225)",
					},
					{
						name: "Purple",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(100, 50, 150)",
						color_tertiary_text: "rgb(150, 100, 175)",
						color_primary_background: "rgb(250, 245, 255)",
						color_secondary_background: "rgb(240, 230, 250)",
						color_tertiary_background: "rgb(230, 210, 240)",
						color_border_line: "rgb(220, 200, 225)",
					},
					{
						name: "Pink",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(180, 50, 110)",
						color_tertiary_text: "rgb(210, 100, 150)",
						color_primary_background: "rgb(255, 243, 250)",
						color_secondary_background: "rgb(252, 225, 240)",
						color_tertiary_background: "rgb(245, 200, 225)",
						color_border_line: "rgb(235, 175, 210)",
					},
					{
						name: "Rose",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(180, 30, 70)",
						color_tertiary_text: "rgb(210, 75, 110)",
						color_primary_background: "rgb(255, 242, 245)",
						color_secondary_background: "rgb(252, 220, 230)",
						color_tertiary_background: "rgb(245, 193, 210)",
						color_border_line: "rgb(235, 165, 190)",
					},
					{
						name: "Gray",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(75, 75, 75)",
						color_tertiary_text: "rgb(150, 150, 150)",
						color_primary_background: "rgb(255, 255, 255)",
						color_secondary_background: "rgb(230, 230, 230)",
						color_tertiary_background: "rgb(200, 200, 200)",
						color_border_line: "rgb(180, 180, 180)",
					},
					{
						name: "Black",
						color_primary_text: "rgb(0, 0, 0)",
						color_secondary_text: "rgb(15, 15, 18)",
						color_tertiary_text: "rgb(80, 80, 85)",
						color_primary_background: "rgb(250, 250, 252)",
						color_secondary_background: "rgb(225, 225, 228)",
						color_tertiary_background: "rgb(195, 195, 200)",
						color_border_line: "rgb(160, 160, 165)",
					},
				],
				dark: [
					{
						name: "Red",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 200, 200)",
						color_tertiary_text: "rgb(175, 100, 100)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(30, 20, 20)",
						color_tertiary_background: "rgb(50, 35, 35)",
						color_border_line: "rgb(75, 50, 50)",
					},
					{
						name: "Brown",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 210, 165)",
						color_tertiary_text: "rgb(185, 115, 65)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(32, 24, 18)",
						color_tertiary_background: "rgb(54, 42, 34)",
						color_border_line: "rgb(82, 58, 40)",
					},
					{
						name: "Orange",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 185, 90)",
						color_tertiary_text: "rgb(220, 125, 35)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(34, 24, 16)",
						color_tertiary_background: "rgb(58, 42, 28)",
						color_border_line: "rgb(88, 62, 38)",
					},
					{
						name: "Yellow",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 255, 200)",
						color_tertiary_text: "rgb(175, 175, 100)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(30, 30, 20)",
						color_tertiary_background: "rgb(50, 50, 35)",
						color_border_line: "rgb(75, 75, 50)",
					},
					{
						name: "Lime",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(210, 245, 160)",
						color_tertiary_text: "rgb(130, 175, 60)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(20, 28, 10)",
						color_tertiary_background: "rgb(35, 48, 18)",
						color_border_line: "rgb(52, 72, 28)",
					},
					{
						name: "Green",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(200, 255, 200)",
						color_tertiary_text: "rgb(100, 175, 100)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(20, 30, 20)",
						color_tertiary_background: "rgb(35, 50, 35)",
						color_border_line: "rgb(50, 75, 50)",
					},
					{
						name: "Teal",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(160, 235, 228)",
						color_tertiary_text: "rgb(80, 165, 155)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(15, 28, 27)",
						color_tertiary_background: "rgb(28, 48, 46)",
						color_border_line: "rgb(42, 72, 68)",
					},
					{
						name: "Cyan",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(175, 230, 252)",
						color_tertiary_text: "rgb(70, 165, 195)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(15, 25, 32)",
						color_tertiary_background: "rgb(28, 42, 52)",
						color_border_line: "rgb(40, 65, 80)",
					},
					{
						name: "Blue",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(200, 200, 255)",
						color_tertiary_text: "rgb(100, 100, 175)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(20, 20, 30)",
						color_tertiary_background: "rgb(35, 35, 50)",
						color_border_line: "rgb(50, 50, 75)",
					},
					{
						name: "Purple",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(225, 200, 255)",
						color_tertiary_text: "rgb(150, 100, 175)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(25, 20, 30)",
						color_tertiary_background: "rgb(40, 35, 50)",
						color_border_line: "rgb(60, 50, 75)",
					},
					{
						name: "Pink",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 185, 220)",
						color_tertiary_text: "rgb(210, 100, 150)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(30, 18, 24)",
						color_tertiary_background: "rgb(50, 30, 40)",
						color_border_line: "rgb(75, 45, 60)",
					},
					{
						name: "Rose",
						color_primary_text: "rgb(250, 250, 250)",
						color_secondary_text: "rgb(255, 175, 198)",
						color_tertiary_text: "rgb(210, 75, 110)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(30, 15, 20)",
						color_tertiary_background: "rgb(52, 25, 34)",
						color_border_line: "rgb(78, 38, 52)",
					},
					{
						name: "Gray",
						color_primary_text: "rgb(255, 255, 255)",
						color_secondary_text: "rgb(200, 200, 200)",
						color_tertiary_text: "rgb(100, 100, 100)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(25, 25, 25)",
						color_tertiary_background: "rgb(50, 50, 50)",
						color_border_line: "rgb(75, 75, 75)",
					},
					{
						name: "Black",
						color_primary_text: "rgb(255, 255, 255)",
						color_secondary_text: "rgb(235, 235, 235)",
						color_tertiary_text: "rgb(155, 155, 155)",
						color_primary_background: "rgb(0, 0, 0)",
						color_secondary_background: "rgb(16, 16, 16)",
						color_tertiary_background: "rgb(30, 30, 30)",
						color_border_line: "rgb(50, 50, 50)",
					},
				],
			},
		};
	},
	props: {
		theme: "Dark",
	},
	computed: {
		currentPalettes() {
			return this.theme === "Dark"
				? this.colorPalette.dark
				: this.colorPalette.light;
		},
		selectedName() {
			return this.settingsStore.colors?.name ?? null;
		},
		selectedAccent() {
			return this.settingsStore.colors?.color_secondary_text ?? null;
		},
	},
	methods: {
		selectColor(color) {
			this.$emit("select", color);
		},
		isSelected(palette) {
			return this.selectedName === palette.name;
		},
	}
};
</script>

<style scoped>
.palette-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.palette-header > h2 {
	font-family: Satoshi-Bold;
	font-size: 1rem;
	margin: 0;
}

.selected-palette {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6px;
}

.selected-palette > h2 {
	font-family: Satoshi-Medium;
	font-size: 0.9rem;
	margin: 0;
}

.selected-palette .dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	display: block;
}

.palette-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 12px 10px;
	margin-top: 10px;
}

.swatch {
	width: 100%;
	aspect-ratio: 1;
	border-radius: 50%;
	cursor: pointer;
}

.swatch:hover:not(.selected) {
	box-shadow:
		0 0 0 2px var(--color-primary-background),
		0 0 0 3px var(--color-secondary-text);
}

.swatch.selected {
	box-shadow:
		0 0 0 2px var(--color-primary-background),
		0 0 0 4px var(--color-primary-text);
}
</style>
