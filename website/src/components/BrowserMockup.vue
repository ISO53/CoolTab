<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const images = [
    new URL('../assets/b-img/0.jpg', import.meta.url).href,
    new URL('../assets/b-img/1.jpg', import.meta.url).href,
    new URL('../assets/b-img/2.jpg', import.meta.url).href,
    new URL('../assets/b-img/3.jpg', import.meta.url).href,
    new URL('../assets/b-img/4.jpg', import.meta.url).href,
    new URL('../assets/b-img/5.jpg', import.meta.url).href,
];

const currentIndex = ref(0);
let timer = null;

onMounted(() => {
    timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % images.length;
    }, 2000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<template>
    <div class="browser-mockup">
        <div class="browser-header">
            <div class="browser-controls">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
            </div>
            <div class="browser-address">cooltab</div>
        </div>
        <div class="browser-body">
            <div class="image-container">
                <TransitionGroup name="fade">
                    <img
                        v-for="(img, index) in images"
                        :key="index"
                        :src="img"
                        v-show="currentIndex === index"
                        class="mockup-image"
                        alt="Browser Mockup"
                    />
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped>
.browser-mockup {
    width: 100%;
    max-width: 1200px;
    background: #1a1a1a;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
}

.browser-header {
    height: 40px;
    background: #2a2a2a;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.browser-controls {
    display: flex;
    gap: 8px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.red { background: #ff5f57; }
.yellow { background: #ffbd2e; }
.green { background: #28c940; }

.browser-address {
    flex: 1;
    height: 24px;
    background: #1a1a1a;
    border-radius: 4px;
    font-size: 12px;
    color: #888;
    display: flex;
    align-items: center;
    padding: 0 12px;
    max-width: 400px;
}

.browser-body {
    position: relative;
    width: 100%;
    background: #000;
}

.image-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    width: 100%;
}

.mockup-image {
    grid-area: 1 / 1;
    width: 100%;
    height: auto;
    object-fit: contain;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
