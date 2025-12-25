<template>
    <section class="theme-demo container">
        <div class="demo-header">
            <h2>Light & Dark Mode</h2>
            <p>Seamlessly switch between themes to match your vibe.</p>
        </div>

        <div class="comparison-slider" ref="sliderRef" @mousemove="handleMove" @touchmove="handleMove">
            <div class="image-wrapper dark-mode">
                <img src="/src/public/dark.png" class="theme-image" alt="Dark Theme" />
            </div>

            <div class="image-wrapper light-mode" :style="{width: sliderPosition + '%'}">
                <img src="/src/public/light.png" class="theme-image" alt="Light Theme" />
            </div>

            <div class="slider-handle" :style="{left: sliderPosition + '%'}">
                <div class="handle-line"></div>
                <div class="handle-circle">
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref} from "vue";

const sliderPosition = ref(50);
const sliderRef = ref(null);

const handleMove = (e) => {
    if (!sliderRef.value) return;

    const rect = sliderRef.value.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const width = rect.width;

    let pos = (x / width) * 100;
    pos = Math.max(0, Math.min(100, pos));

    sliderPosition.value = pos;
};
</script>

<style scoped>
.theme-demo {
    padding: 100px 20px 40px;
    text-align: center;
}

.demo-header {
    margin-bottom: 40px;
}

.comparison-slider {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: 450px;
    margin: 0 auto;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--glass-border);
    cursor: ew-resize;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.dark-mode {
    background: #111;
}

.slider-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background: white;
    z-index: 20;
    transform: translateX(-50%);
    pointer-events: none;
}

.handle-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.theme-image {
    width: 800px;
    height: 100%;
    display: flex;
    object-fit: cover;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
</style>
