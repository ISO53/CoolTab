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
                <p class="fig-label">Live Widgets</p>
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
    height: 640px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    background: var(--bg-base);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.widgets-background {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.55;
}

.widgets-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.widgets-overlay {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(90deg, rgba(10, 10, 11, 0.92) 0%, rgba(10, 10, 11, 0.55) 42%, rgba(10, 10, 11, 0.35) 100%);
    pointer-events: none;
    z-index: 1;
}

.widgets-content {
    position: relative;
    z-index: 2;
}

.text-wrapper {
    max-width: 480px;
}

.fig-label {
    margin-bottom: 16px;
}

.widgets-title {
    font-size: clamp(2.5rem, 5vw, 3.75rem);
    font-weight: 500;
    margin-bottom: 20px;
    line-height: 1.05;
    letter-spacing: -0.03em;
}

.widgets-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 440px;
}

@media (max-width: 768px) {
    .widgets-section {
        height: auto;
        min-height: 420px;
        padding: 72px 0;
    }

    .widgets-overlay {
        background: linear-gradient(180deg, rgba(10, 10, 11, 0.75) 0%, rgba(10, 10, 11, 0.92) 100%);
    }

    .widgets-title {
        font-size: 2.25rem;
    }

    .widgets-subtitle {
        max-width: 100%;
    }
}
</style>
