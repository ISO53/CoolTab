<template>
    <Sidebar ref="sidebarRef" />
    <Info ref="infoRef" />
    <div class="buttons" :class="{revealed: isRevealed}">
        <button @click="toggleEditArea" class="button" title="Edit layout">
            <Svg :class_name="'material-icons-outlined'" :name="'edit'"></Svg>
        </button>

        <button @click="toggleInfo" class="button" title="Info">
            <Svg :class_name="'material-icons-outlined'" :name="'info'"></Svg>
        </button>

        <button @click="toggleSidebar" class="button" title="Open settings">
            <Svg :class_name="'material-icons-outlined'" :name="'settings'"></Svg>
        </button>
    </div>
</template>

<script>
import Sidebar from "@/components/ui/Sidebar.vue";
import Info from "@/components/ui/Info.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "Buttons",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    components: {
        Sidebar,
        Info,
    },
    data() {
        return {
            isRevealed: false,
        };
    },
    mounted() {
        // Startup animation
        setTimeout(() => {
            this.isRevealed = true;
            setTimeout(() => {
                this.isRevealed = false;
            }, 1000); // Stay visible for 1s
        }, 500); // Wait a bit before showing

        window.addEventListener("mousemove", this.checkProximity);
    },
    beforeUnmount() {
        window.removeEventListener("mousemove", this.checkProximity);
    },
    methods: {
        checkProximity(event) {
            const thresholdX = 150; // Width of detection area
            const thresholdY = 150; // Height of detection area (from bottom)
            const windowHeight = window.innerHeight;

            const inZone = event.clientX < thresholdX && event.clientY > windowHeight - thresholdY;

            this.isRevealed = inZone;
        },
        toggleEditArea() {
            this.$parent.toggleEditArea();
        },
        toggleSidebar() {
            this.$refs.sidebarRef.toggleSidebar();
        },
        toggleInfo() {
            this.$refs.infoRef.toggleInfo();
        },
    },
};
</script>

<style scoped>
.buttons {
    aspect-ratio: 1/1;
    height: 30%;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: end;
    flex-wrap: wrap-reverse;
    overflow: hidden;
    padding: 5px;
    gap: 10px;
    pointer-events: none;
}

.buttons.revealed .button {
    transform: translateX(0);
    opacity: 1;
}

/* Stagger delays */
.buttons .button:nth-child(1) {
    transition-delay: 0ms;
}
.buttons .button:nth-child(2) {
    transition-delay: 50ms;
}
.buttons .button:nth-child(3) {
    transition-delay: 100ms;
}

.buttons.revealed .button:nth-child(1) {
    transition-delay: 0ms;
}
.buttons.revealed .button:nth-child(2) {
    transition-delay: 50ms;
}
.buttons.revealed .button:nth-child(3) {
    transition-delay: 100ms;
}

.button {
    margin: 0;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
    pointer-events: auto;

    /* Hidden state */
    transform: translateX(-100%);
    opacity: 0;
    transition: transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1), opacity 300ms ease;
}

.button i {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.button:hover i {
    transform: scale(115%);
}
</style>
