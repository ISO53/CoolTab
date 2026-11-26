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
import { colorPalette } from "@/utils/colorPaletteData";

export default {
	emits: ["select", "hover", "leave"],
	name: "ColorPalette",
	data() {
		return {
			settingsStore: useSettingsStore(),
			colorPalette: colorPalette,
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
