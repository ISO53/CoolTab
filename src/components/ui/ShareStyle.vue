<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="close">
                <div v-if="isOpen" class="share-style-div" @click.stop>
                    <h1>Share Your Style</h1>
                    <p class="subtitle">Share your custom style with the CoolTab community</p>
                    <br />

                    <ShareStyleForm @cancel="close" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
// Original overlay popup. The form itself lives in ShareStyleForm.vue so it can also be
// presented inside the Styles tab; this wrapper keeps the floating-popup design intact.
import ShareStyleForm from "./ShareStyleForm.vue";

export default {
    name: "ShareStyle",
    components: {
        ShareStyleForm,
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleShareStyle() {
            this.isOpen = !this.isOpen;
        },
        close() {
            this.isOpen = false;
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(10px);
    background-color: color-mix(in srgb, var(--color-primary-background), transparent 80%);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: backdrop-filter 200ms ease, background-color 200ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    backdrop-filter: none;
    background-color: transparent;
}

.overlay-enter-active > .share-style-div,
.overlay-leave-active > .share-style-div {
    transition: transform 200ms ease, opacity 200ms ease;
}

.overlay-enter-from > .share-style-div,
.overlay-leave-to > .share-style-div {
    transform: scale(50%);
    opacity: 0;
}

.share-style-div {
    width: fit-content;
    height: fit-content;
    background-color: var(--color-primary-background);
    border: 2px solid var(--color-border-line);
    z-index: 10000;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.share-style-div > h1 {
    font-family: Satoshi-Bold;
    font-size: 3rem;
}

.share-style-div > p {
    font-family: Satoshi-Light;
    font-size: 1rem;
}

.subtitle {
    color: var(--color-secondary-text);
    margin-top: -10px;
    text-align: center;
}
</style>
