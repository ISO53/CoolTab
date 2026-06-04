<script setup>
import widgetsVideo from '../assets/videos/Widgets-Video.webm';
</script>

<template>
    <section class="widgets-section">
        <div class="widgets-background">
            <video
                :src="widgetsVideo"
                autoplay
                loop
                muted
                playsinline
                class="widgets-video"
            ></video>
        </div>

        <div class="widgets-overlay"></div>

        <div class="container widgets-content">
            <div class="text-wrapper">
                <h2 class="widgets-title">A Widget for Everything</h2>
                <p class="widgets-subtitle">
                    Experience your actual dashboard widgets in action.
                    From real-time stock tracking to weather forecasts and smart calendars—all seamlessly integrated into your new tab.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.widgets-section {
    position: relative;
    height: 700px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    background: #000;
}

.widgets-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-8deg) scale(1.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0.5;
    filter: blur(1px);
}

.widgets-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.widgets-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
    pointer-events: none;
    z-index: 1;
}

.widgets-content {
    position: relative;
    z-index: 2;
    pointer-events: none;
}

.text-wrapper {
    max-width: 600px;
}

.widgets-title {
    font-size: 4.5rem;
    font-weight: 800;
    margin-bottom: 24px;
    line-height: 1;
    letter-spacing: -2px;
}

.widgets-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 500px;
}

@media (max-width: 768px) {
    .widgets-section {
        height: auto;
        padding: 80px 0;
        text-align: left;
    }

    .widgets-content {
        display: flex;
        justify-content: flex-start;
    }

    .text-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 100%;
    }

    .widgets-title {
        font-size: 2.25rem;
        margin-bottom: 16px;
    }

    .widgets-subtitle {
        font-size: 1.1rem;
        max-width: 100%;
    }
}
</style>
