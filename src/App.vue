<template>
    <div class="app">
        <Background />
        <Sidebar />
        <div style="width: calc(100vw - 100px); height: calc(100vh - 100px)">
            <Grid :cols="20" :editing="this.editing" :dotColor="'#c8c8c8'">
                <GridItem :p_x="7" :p_y="4" :p_width="6" :p_height="1"><SearchBar /></GridItem>
                <GridItem :p_x="3" :p_y="3" :p_width="4" :p_height="1"><QuickLinks /></GridItem>
                <GridItem :p_x="0" :p_y="1" :p_width="2" :p_height="2"><Calendar /></GridItem>
                <GridItem :p_x="5" :p_y="3" :p_width="2" :p_height="2"><AnalogClock /></GridItem>
                <GridItem :p_x="1" :p_y="2" :p_width="3" :p_height="3"><DailyWeatherForecast /></GridItem>
                <GridItem :p_x="1" :p_y="2" :p_width="3" :p_height="3"><DigitalClock /></GridItem>
                <GridItem :p_x="1" :p_y="2" :p_width="3" :p_height="3"><Stock /></GridItem>
            </Grid>
        </div>
    </div>
</template>

<script>
import Grid from "@/components/Grid.vue";
import GridItem from "@/components/GridItem.vue";
import Background from "@/components/Background.vue";
import Sidebar from "@/components/Sidebar.vue";
import SearchBar from "@/components/widgets/SearchBar.vue";
import Calendar from "@/components/widgets/Calendar.vue";
import AnalogClock from "@/components/widgets/AnalogClock.vue";
import DigitalClock from "@/components/widgets/DigitalClock.vue";
import DailyWeatherForecast from "./components/widgets/DailyWeatherForecast.vue";
import Stock from "./components/widgets/Stock.vue";
import QuickLinks from "./components/widgets/QuickLinks.vue";

export default {
    name: "App",
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
    },
    data() {
        return {
            editing: false,
        };
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
}
</style>
