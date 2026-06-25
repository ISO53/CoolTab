<template>
	<div class="palette-info">
		<Svg :class_name="'material-icons-outlined'" :name="'info'"></Svg>
		<h2 v-if="this.theme === 'Dark'">Dark themes are best suited for dark colored wallpapers.</h2>
		<h2 v-else>Light themes are best suited for light colored wallpapers.</h2>
	</div>

	<div class="color-palette">
		<div v-for="palette in currentPalettes" :key="palette.name">
			<div class="color-card" @click="selectColor(palette)">
				<div class="colors">
					<span :style="{ backgroundColor: palette.color_primary_text }"></span>
					<span :style="{ backgroundColor: palette.color_secondary_text }"></span>
					<span :style="{ backgroundColor: palette.color_tertiary_text }"></span>
					<span :style="{ backgroundColor: palette.color_primary_background }"></span>
					<span :style="{ backgroundColor: palette.color_secondary_background }"></span>
					<span :style="{ backgroundColor: palette.color_tertiary_background }"></span>
					<span :style="{ backgroundColor: palette.color_border_line }"></span>
				</div>
				<h2>{{ palette.name }}</h2>
			</div>
		</div>
	</div>
</template>

<script>
import { useSettingsStore } from "@/settings";
import Svg from "./Svg.vue";

export default {
	emits: ["select"],
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
	},
	methods: {
		selectColor(color) {
			this.$emit("select", color);
		}
	}
};
</script>

<style scoped>
.palette-info {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
	gap: 5px;
}

.palette-info > i {
	font-size: 1.2rem;
	color: var(--color-tertiary-text);
}

.palette-info > h2{
	font-family: Satoshi-Light;
	color: var(--color-tertiary-text);
	font-size: 1rem;
}

.color-palette {
	display: grid;
	grid-gap: 10px;
	grid-template-columns: 1fr 1fr 1fr;
	grid-auto-columns: 1fr;
}

.color-card {
	width: 100%;
	height: 100%;
	border: 2px solid var(--color-border-line);
	border-radius: 10px;
	overflow: hidden;
	cursor: pointer;
	transition: border-color 200ms ease;
}

.color-card:hover {
	border-color: var(--color-secondary-text);
}

.color-card > h2 {
	font-family: Satoshi-Medium;
	font-size: 1rem;
	line-height: 1rem;
	padding: 10px;
}

.colors {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 75px;
}

.colors > span {
	display: block;
	width: calc(100% / 7);
	height: 100%;
}
</style>
