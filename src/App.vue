<template>
    <div class="app">
        <Background />
        <Sidebar />
        <div style="width: calc(100vw - 100px); height: calc(100vh - 100px)">
            <Grid :cols="this.settingsStore.widgetAreaColumns" :editing="this.editing" :dotColor="'#c8c8c8'">
                <GridItem
                    v-for="(widget, index) in this.settingsStore.widgets"
                    :key="index"
                    :p_x="widget.x"
                    :p_y="widget.y"
                    :p_width="widget.width"
                    :p_height="widget.height"
                    :p_resize="widget.resize"
                >
                    <component :is="widget.name" />
                </GridItem>
            </Grid>

            <button @click="toggleEditArea" class="edit-area-toggle-button close">
                <img src="@/components/icons/edit.svg" />
            </button>
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
import {useSettingsStore} from "./settings";

export default {
    name: "App",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
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
