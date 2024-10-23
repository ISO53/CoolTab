<template>
    <div class="app">
        <Background />
        <Sidebar />
        <div style="width: calc(100vw - 100px); height: calc(100vh - 100px)">
            <Grid :cols="20" :editing="this.editing" :dotColor="'#c8c8c8'">
                <GridItem :p_x="5" :p_y="2" :p_width="10" :p_height="1" :p_resize="'horizontal'">
                    <SearchBar />
                </GridItem>
                <GridItem :p_x="8" :p_y="0" :p_width="4" :p_height="1" :p_resize="'horizontal'">
                    <QuickLinks />
                </GridItem>
                <GridItem :p_x="17" :p_y="0" :p_width="2" :p_height="2" :p_resize="'square'">
                    <Calendar />
                </GridItem>
                <GridItem :p_x="8" :p_y="4" :p_width="4" :p_height="4" :p_resize="'square'">
                    <AnalogClock />
                </GridItem>
                <GridItem :p_x="16" :p_y="5" :p_width="3" :p_height="3" :p_resize="'square'">
                    <DailyWeatherForecast />
                </GridItem>
                <GridItem :p_x="1" :p_y="0" :p_width="2" :p_height="2" :p_resize="'square'">
                    <DigitalClock />
                </GridItem>
                <GridItem :p_x="1" :p_y="5" :p_width="3" :p_height="3" :p_resize="'square'">
                    <Stock />
                </GridItem>
            </Grid>

            <button @click="toggleEditArea" class="edit-area-toggle-button close">
                <img src="@/components/icons/edit.svg" />
            </button>
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
    methods: {
        toggleEditArea() {
            this.editing = !this.editing;
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

.edit-area-toggle-button {
    position: absolute;
    bottom: 60px;
    left: 5px;
    margin: 0;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
}

.edit-area-toggle-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.edit-area-toggle-button:hover img {
    transform: rotate(-45deg);
}
</style>
