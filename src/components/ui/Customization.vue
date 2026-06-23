<template>
	<div class="settings">
		<h2 class="page-title">Customization</h2>

		<p style="width: auto; text-align: center; margin: 10px">
			You can select from predefined themes.
		</p>

		<div style="display: flex; height: auto">
			<ColorPalette></ColorPalette>
		</div>

		<p style="width: auto; text-align: center; margin: 10px">
			Or you can create your own custom theme.
		</p>

		<div>
			<h2>Background Color #1</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_primary_background"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Background Color #2</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_secondary_background"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Background Color #3</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_tertiary_background"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Text Color #1</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_primary_text"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Text Color #2</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_secondary_text"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Text Color #3</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_tertiary_text"
				:onSelect="setColors"
			/>
		</div>
		<div>
			<h2>Border Color</h2>
			<ColorChooser
				v-model="settingsStore.colors.color_border_line"
				:onSelect="setColors"
			/>
		</div>
	</div>
</template>

<script>
import ColorPalette from "./ColorPalette.vue";
import ColorChooser from "./ColorChooser.vue";
import { useSettingsStore } from "@/settings";

export default {
    name: "Customization",
    components: {
        ColorPalette,
        ColorChooser,
    },
    data() {
        return {
            settingsStore: useSettingsStore(),
        };
    },
    methods: {
	    setColors() {
	        this.settingsStore.setColors(this.settingsStore.colors);
	    },
    },
};
</script>

<style>
.settings {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.settings > div {
    display: grid;
    grid-template-columns: 40% 60%;
    align-items: center;
    min-height: 50px;
    height: auto;
}

.settings > div h2 {
    text-wrap: nowrap;
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
}
</style>
