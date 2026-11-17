<template>
	<div style="display: flex; flex-direction: column; gap: 10px">
		<h2 class="page-title">Theme</h2>

		<div class="setting">
			<h2>Theme</h2>
			<SelectButton
				v-model="theme"
				:options="[
					{ label: 'Light', icon: 'light_mode' },
					{ label: 'Dark', icon: 'dark_mode' },
				]"
				:onSelect="setTheme"
			/>
		</div>

		<div class="palette-info">
			<Svg :class_name="'material-icons-outlined'" :name="'info'"></Svg>
			<h2 v-if="this.theme === 'Dark'">Dark themes are best suited for dark colored wallpapers.</h2>
			<h2 v-else>Light themes are best suited for light colored wallpapers.</h2>
		</div>

		<ThemePreview :preview-palette="previewPalette" />

		<div class="color-palette">
			<ColorPalette
				:theme="theme"
				@select="setColors"
				@hover="previewColors"
				@leave="restoreColors"
			/>
		</div>
	</div>
</template>

<script>
import ColorPalette from "./ColorPalette.vue";
import SelectButton from "./SelectButton.vue";
import ThemePreview from "./ThemePreview.vue";
import Svg from "./Svg.vue";
import { useSettingsStore } from "@/settings";

export default {
	name: "Theme",
	components: {
		ColorPalette,
		SelectButton,
		ThemePreview,
		Svg,
	},
	data() {
		return {
			settingsStore: useSettingsStore(),
			hue: 0,
			saturation: 50,
			theme: "Dark",
			previewPalette: null,
		};
	},
	methods: {
		setTheme(theme) {
			this.theme = theme;
		},
		setColors(colors) {
			this.settingsStore.setColorPalette({ color: "default", theme: this.theme });
			this.settingsStore.setColors(colors);
		},
		previewColors(palette) {
			this.previewPalette = palette;
		},
		restoreColors() {
			this.previewPalette = null;
		},
	},
};
</script>

<style>
.setting {
	display: grid;
	grid-template-columns: 40% 60%;
	align-items: center;
	min-height: 50px;
	height: auto;
}

.setting > h2 {
	text-wrap: nowrap;
	font-size: 1rem;
	font-weight: bold;
	margin: 0;
}

.palette-info {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
}

.palette-info > i.svg {
	font-size: 1.2rem;
	color: var(--color-tertiary-text);
}

.palette-info > h2 {
	font-family: Satoshi-Light;
	color: var(--color-tertiary-text);
	font-size: 1rem;
	margin: 0;
	font-weight: normal;
}
</style>
