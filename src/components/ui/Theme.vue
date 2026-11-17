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

		<div class="color-palette">
			<ColorPalette :theme="theme" @select="setColors" />
		</div>
	</div>
</template>

<script>
import ColorPalette from "./ColorPalette.vue";
import SelectButton from "./SelectButton.vue";
import { useSettingsStore } from "@/settings";

export default {
	name: "Theme",
	components: {
		ColorPalette,
		SelectButton,
	},
	data() {
		return {
			settingsStore: useSettingsStore(),
			hue: 0,
			saturation: 50,
			theme: "Dark",
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
</style>
