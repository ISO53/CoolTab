<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="toggleSidebar"></div>
        </Transition>

        <Transition name="slide">
            <div v-if="isOpen" class="slide">
                <h1 class="header">CoolTab Settings</h1>
                <div class="background-settings">
                    <div>
                        <h2>Background Image</h2>
                        <FileChooser />
                    </div>
                    <div>
                        <h2>Background Color</h2>
                        <ColorChooser />
                    </div>
                </div>
                <button @click="toggleSidebar" class="sidebar-toggle-button close">
                    <img src="@/components/icons/back.svg" />
                </button>
            </div>
        </Transition>

        <button v-if="!isOpen" @click="toggleSidebar" class="sidebar-toggle-button">
            <img src="@/components/icons/settings.svg" />
        </button>
    </div>
</template>

<script>
import ColorChooser from "./ColorChooser.vue";
import FileChooser from "./FileChooser.vue";

export default {
    name: "Sidebar",
    components: {
        FileChooser,
        ColorChooser,
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: backdrop-filter 250ms ease, background-color 250ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    backdrop-filter: none;
    background-color: transparent;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 100vh;
    background-color: black;
    z-index: 10000;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding: 20px;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 250ms ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.sidebar-toggle-button {
    position: absolute;
    bottom: 10px;
    left: 5px;
    margin: 0;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.sidebar-toggle-button:hover img {
    transform: rotate(45deg);
}

.sidebar-toggle-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.close:hover img{
    transform: translateX(-3px);
}

.background-settings {
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 10px;
}

.background-settings > div {
    display: grid;
    grid-template-columns: 40% 60%;
    align-items: center;
    height: 50px;
}

.background-settings > div > h2 {
    text-wrap: nowrap;
    font-size: 1rem;
    font-weight: 100;
}

.header {
    margin-bottom: 20px;
    font-weight: 900;
    color: #fafafa;
}
</style>
