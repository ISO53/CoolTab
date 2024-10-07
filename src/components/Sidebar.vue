<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="toggleSidebar"></div>
        </Transition>

        <Transition name="slide">
            <div v-if="isOpen" class="slide">
                <div class="background-settings">
                    <div></div>
                    <div></div>
                </div>
            </div>
        </Transition>

        <button v-if="!isOpen" @click="toggleSidebar" class="open-btn">
            <img src="@/components/icons/settings.svg" alt="" srcset="">
        </button>
    </div>
</template>

<script>
export default {
    name: "Sidebar",
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isOpen = !this.isOpen;
        }
    }
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
    width: 400px;
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

.open-btn {
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

.open-btn:hover img{
    transform: rotate(45deg) scale(110%);
}

.open-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}
</style>
