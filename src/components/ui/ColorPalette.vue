<template>
    <div class="color-palette">
        <button class="switch-theme-button" @click="this.invert">
            <Svg
                :class_name="'material-icons-outlined'"
                :name="'invert_colors'"
                :class="{inverted: this.settingsStore.colorPalette.theme === 'dark'}"
            ></Svg>
            Switch Theme
        </button>

        <div class="colors">
            <div
                v-for="(color, key) in theme[settingsStore.colorPalette.theme]"
                :key="key"
                :style="{
                    backgroundImage: `radial-gradient(ellipse at center, ${color.color_primary_background}, ${color.color_secondary_background}, ${color.color_tertiary_background})`,
                }"
                class="color-item"
                @click="() => chooseTheme(color)"
            >
                <h1 :style="`color: ${color.color_secondary_text};`">A</h1>
            </div>
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "ColorPalette",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            theme: {
                dark: {
                    green: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(200, 255, 200)", // Light greenish-white
                        color_tertiary_text: "rgb(100, 175, 100)", // Muted green

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(20, 30, 20)", // Dark green-tinted gray
                        color_tertiary_background: "rgb(35, 50, 35)", // Subtly brighter gray-green

                        color_border_line: "rgb(50, 75, 50)", // Very low-saturation green
                    },
                    red: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(255, 200, 200)", // Light pinkish-white
                        color_tertiary_text: "rgb(175, 100, 100)", // Muted red

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(30, 20, 20)", // Dark red-tinted gray
                        color_tertiary_background: "rgb(50, 35, 35)", // Subtly brighter gray-red

                        color_border_line: "rgb(75, 50, 50)", // Very low-saturation red
                    },
                    yellow: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(255, 255, 200)", // Light yellowish-white
                        color_tertiary_text: "rgb(175, 175, 100)", // Muted yellow

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(30, 30, 20)", // Dark yellow-tinted gray
                        color_tertiary_background: "rgb(50, 50, 35)", // Subtly brighter gray-yellow

                        color_border_line: "rgb(75, 75, 50)", // Very low-saturation yellow
                    },
                    blue: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(200, 200, 255)", // Light blueish-white
                        color_tertiary_text: "rgb(100, 100, 175)", // Muted blue

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(20, 20, 30)", // Dark blue-tinted gray
                        color_tertiary_background: "rgb(35, 35, 50)", // Subtly brighter gray-blue

                        color_border_line: "rgb(50, 50, 75)", // Very low-saturation blue
                    },
                    purple: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(225, 200, 255)", // Light purpleish-white
                        color_tertiary_text: "rgb(150, 100, 175)", // Muted purple

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(25, 20, 30)", // Dark purple-tinted gray
                        color_tertiary_background: "rgb(40, 35, 50)", // Subtly brighter gray-purple

                        color_border_line: "rgb(60, 50, 75)", // Very low-saturation purple
                    },
                    orange: {
                        color_primary_text: "rgb(250, 250, 250)", // Bright white
                        color_secondary_text: "rgb(255, 200, 150)", // Light orange-tinted white
                        color_tertiary_text: "rgb(175, 100, 50)", // Muted orange

                        color_primary_background: "rgb(0, 0, 0)", // Almost black
                        color_secondary_background: "rgb(30, 25, 20)", // Dark orange-tinted gray
                        color_tertiary_background: "rgb(50, 40, 35)", // Subtly brighter gray-orange

                        color_border_line: "rgb(75, 50, 35)", // Very low-saturation orange
                    },
                    grayscale: {
                        color_primary_text: "rgb(255, 255, 255)", // White
                        color_secondary_text: "rgb(200, 200, 200)", // Light gray
                        color_tertiary_text: "rgb(100, 100, 100)", // Medium gray

                        color_primary_background: "rgb(0, 0, 0)", // Black
                        color_secondary_background: "rgb(25, 25, 25)", // Dark gray
                        color_tertiary_background: "rgb(50, 50, 50)", // Medium-dark gray

                        color_border_line: "rgb(75, 75, 75)", // Subtle border gray
                    },
                },
                light: {
                    green: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(50, 150, 50)", // Medium-dark green
                        color_tertiary_text: "rgb(100, 175, 100)", // Muted green

                        color_primary_background: "rgb(245, 255, 245)", // Light green-tinted white
                        color_secondary_background: "rgb(230, 250, 230)", // Subtle greenish background
                        color_tertiary_background: "rgb(210, 240, 210)", // Light pastel green

                        color_border_line: "rgb(200, 225, 200)", // Very low-saturation green
                    },
                    red: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(150, 50, 50)", // Medium-dark red
                        color_tertiary_text: "rgb(175, 100, 100)", // Muted red

                        color_primary_background: "rgb(255, 245, 245)", // Light pinkish-white
                        color_secondary_background: "rgb(250, 230, 230)", // Subtle pink background
                        color_tertiary_background: "rgb(240, 210, 210)", // Light pastel pink

                        color_border_line: "rgb(225, 200, 200)", // Very low-saturation red
                    },
                    yellow: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(150, 150, 50)", // Medium-dark yellow
                        color_tertiary_text: "rgb(175, 175, 100)", // Muted yellow

                        color_primary_background: "rgb(255, 255, 245)", // Light yellowish-white
                        color_secondary_background: "rgb(250, 250, 230)", // Subtle yellow background
                        color_tertiary_background: "rgb(240, 240, 210)", // Light pastel yellow

                        color_border_line: "rgb(225, 225, 200)", // Very low-saturation yellow
                    },
                    blue: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(50, 50, 150)", // Medium-dark blue
                        color_tertiary_text: "rgb(100, 100, 175)", // Muted blue

                        color_primary_background: "rgb(245, 245, 255)", // Light blueish-white
                        color_secondary_background: "rgb(230, 230, 250)", // Subtle blue background
                        color_tertiary_background: "rgb(210, 210, 240)", // Light pastel blue

                        color_border_line: "rgb(200, 200, 225)", // Very low-saturation blue
                    },
                    purple: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(100, 50, 150)", // Medium-dark purple
                        color_tertiary_text: "rgb(150, 100, 175)", // Muted purple

                        color_primary_background: "rgb(250, 245, 255)", // Light purpleish-white
                        color_secondary_background: "rgb(240, 230, 250)", // Subtle purple background
                        color_tertiary_background: "rgb(230, 210, 240)", // Light pastel purple

                        color_border_line: "rgb(220, 200, 225)", // Very low-saturation purple
                    },
                    orange: {
                        color_primary_text: "rgb(0, 0, 0)", // Almost black
                        color_secondary_text: "rgb(175, 100, 50)", // Medium-dark orange
                        color_tertiary_text: "rgb(200, 150, 100)", // Muted orange

                        color_primary_background: "rgb(255, 250, 245)", // Light orange-tinted white
                        color_secondary_background: "rgb(250, 235, 220)", // Subtle orange background
                        color_tertiary_background: "rgb(240, 215, 200)", // Light pastel orange

                        color_border_line: "rgb(225, 200, 175)", // Very low-saturation orange
                    },
                    grayscale: {
                        color_primary_text: "rgb(0, 0, 0)", // Black
                        color_secondary_text: "rgb(75, 75, 75)", // Dark gray
                        color_tertiary_text: "rgb(150, 150, 150)", // Medium gray

                        color_primary_background: "rgb(255, 255, 255)", // White
                        color_secondary_background: "rgb(230, 230, 230)", // Light gray
                        color_tertiary_background: "rgb(200, 200, 200)", // Medium-light gray

                        color_border_line: "rgb(180, 180, 180)", // Subtle border gray
                    },
                },
            },
        };
    },
    methods: {
        invert() {
            this.settingsStore.setColorPalette({
                theme: this.settingsStore.colorPalette.theme === "dark" ? "light" : "dark",
                color: this.settingsStore.colorPalette.color,
            });
        },
        chooseTheme(colors) {
            this.settingsStore.setColors(colors);
        }
    },
};
</script>

<style scoped>
.color-palette {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
    justify-content: space-between;
}

.inverted {
    transform: rotateY(180deg);
}

.colors {
    display: flex;
    border-radius: 10px;
    border: 2px solid var(--color-border-line);
    overflow: hidden;
    width: 100%;
}

.color-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1 / 1;
    user-select: none;
    cursor: pointer;
}

.color-item h1 {
    font-family: Satoshi-Regular;
    transition: transform 250ms ease;
}

.color-item:hover h1 {
    font-family: Satoshi-Black;
}

.switch-theme-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 2px solid var(--color-border-line);
    border-radius: 10px;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    font-family: Satoshi-Medium;
    font-size: 1rem;
    padding: 8px 12px 8px 12px;
    column-gap: 10px;
    cursor: pointer;
    transition: color 250ms ease;
}

.switch-theme-button i {
    transition: color 250ms ease, transform 250ms ease;
}

.switch-theme-button:hover {
    color: var(--color-primary-text);
}

.switch-theme-button:hover i {
    color: var(--color-primary-text);
}
</style>
