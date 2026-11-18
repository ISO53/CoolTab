<template>
    <div class="render-root">
        <Background />
        <div style="width: calc(100vw - 100px); height: calc(100vh - 100px)">
            <Grid :cols="settingsStore.widgetAreaColumns" :editing="false" :dotColor="settingsStore.colors.color_secondary_text">
                <GridItem
                    v-for="(widget, index) in settingsStore.widgets"
                    :key="index"
                    :p_x="widget.x"
                    :p_y="widget.y"
                    :p_width="widget.width"
                    :p_height="widget.height"
                    :p_resize="widget.resize"
                    :class="{hidden: !widget.selected}"
                >
                    <component v-if="widget.selected" :is="widget.name" />
                </GridItem>
            </Grid>
        </div>
    </div>
</template>

<script>
// Never mounted in the live app: this component re-renders a saved style snapshot
// inside an off-screen Vue app (see utils/stylePreview.js) so a preview thumbnail
// can be captured from it. It reads everything from the store, which is seeded
// with the style's snapshot before mounting.
import Background from "@/components/ui/Background.vue";
import Grid from "@/components/ui/Grid.vue";
import GridItem from "@/components/ui/GridItem.vue";
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
import {useSettingsStore} from "@/settings";
import {defineAsyncComponent} from "vue";

// Location widget is lazy loaded because it loads cobe library, a WebGL-based 3D globe library that
// should not be loaded to RAM if the user doesn't use the widget.
const Location = defineAsyncComponent(() => import("@/components/widgets/Location.vue"));

export default {
    name: "StyleRenderRoot",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    components: {
        Background,
        Grid,
        GridItem,
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
};
</script>

<style scoped>
.render-root {
    position: relative;
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
