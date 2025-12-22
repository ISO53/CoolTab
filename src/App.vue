<template>
    <div class="app">
        <Background />
        <Sidebar />
        <Info />
        <NewFeaturesPanel />
        <Buttons />
        <div style="width: calc(100vw - 100px); height: calc(100vh - 100px)">
            <Grid :cols="this.settingsStore.widgetAreaColumns" :editing="this.editing" :dotColor="this.settingsStore.colors.color_secondary_text">
                <GridItem
                    v-for="(widget, index) in settingsStore.widgets"
                    :key="index"
                    :p_x="widget.x"
                    :p_y="widget.y"
                    :p_width="widget.width"
                    :p_height="widget.height"
                    :p_resize="widget.resize"
                    :class="{hidden: !widget.selected}"
                    @update-position="updateWidgetPosition(index, $event)"
                    @update-size="updateWidgetSize(index, $event)"
                >
                    <component v-if="widget.selected" :is="widget.name" />
                </GridItem>
            </Grid>
        </div>
    </div>
</template>

<script>
import Grid from "@/components/ui/Grid.vue";
import GridItem from "@/components/ui/GridItem.vue";
import Background from "@/components/ui/Background.vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import SearchBar from "@/components/widgets/SearchBar.vue";
import Calendar from "@/components/widgets/Calendar.vue";
import AnalogClock from "@/components/widgets/AnalogClock.vue";
import DigitalClock from "@/components/widgets/DigitalClock.vue";
import DailyWeatherForecast from "./components/widgets/DailyWeatherForecast.vue";
import Stock from "./components/widgets/Stock.vue";
import QuickLinks from "./components/widgets/QuickLinks.vue";
import Info from "./components/ui/Info.vue";
import WeeklyWeatherForecast from "./components/widgets/WeeklyWeatherForecast.vue";
import NewFeaturesPanel from "./components/ui/NewFeaturesPanel.vue";
import Buttons from "./components/ui/Buttons.vue";
import {useSettingsStore} from "./settings";

export default {
    name: "App",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    beforeMount() {
        this.updateCSSVariables();
    },
    components: {
        Grid,
        GridItem,
        Background,
        Sidebar,
        SearchBar,
        Calendar,
        AnalogClock,
        DigitalClock,
        DailyWeatherForecast,
        Stock,
        QuickLinks,
        Info,
        WeeklyWeatherForecast,
        NewFeaturesPanel,
        Buttons,
    },
    data() {
        return {
            editing: false,
        };
    },
    methods: {
        toggleEditArea() {
            this.editing = !this.editing;
        },
        updateWidgetPosition(index, {x, y}) {
            const widgets = this.settingsStore.widgets;
            widgets[index].x = x;
            widgets[index].y = y;
            this.settingsStore.setWidgets(widgets);
        },
        updateWidgetSize(index, {width, height}) {
            const widgets = this.settingsStore.widgets;
            widgets[index].width = width;
            widgets[index].height = height;
            this.settingsStore.setWidgets(widgets);
        },
        updateCSSVariables() {
            // update css variables
            const r = document.querySelector(":root");
            const colors = this.settingsStore.colors;

            for (const key in colors) {
                if (colors.hasOwnProperty(key)) {
                    r.style.setProperty(`--${key.replaceAll("_", "-")}`, colors[key]);
                }
            }
        },
    },
};
</script>

<style scoped>
.app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.hidden {
    display: none;
}
</style>
