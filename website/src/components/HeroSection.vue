<script setup>
import HeroCanvas from './HeroCanvas.vue';
</script>

<template>
    <section class="hero">
        <div class="hero-bg">
            <HeroCanvas />
            <div class="hero-fade"></div>
        </div>
        <div class="container hero-inner">
            <p class="hero-eyebrow fig-label">New Tab Extension</p>
            <h1 class="hero-title">Just a new tab, but<br />cooler.</h1>
            <p class="hero-subtitle">
                Customize your browser's new tab with brand new widgets, interactive themes, and seamless productivity tools.
            </p>
            <div class="hero-actions">
                <a href="#install" class="btn-primary">Install Extension</a>
                <a href="#features" class="btn-secondary">Explore Features</a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    position: relative;
    padding: 120px 0 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 72vh;
    overflow: hidden;
}

.hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.hero-fade {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 55% 45% at 50% 40%, rgba(10, 10, 11, 0.35) 0%, rgba(10, 10, 11, 0.55) 55%, rgba(10, 10, 11, 0.88) 100%),
        linear-gradient(180deg, rgba(10, 10, 11, 0.25) 0%, transparent 25%, rgba(10, 10, 11, 0.7) 85%, var(--bg-base) 100%);
    pointer-events: none;
    z-index: 1;
}

.hero-inner {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero-eyebrow {
    margin-bottom: 28px;
}

.hero-title {
    font-size: clamp(2.75rem, 6.5vw, 4.75rem);
    line-height: 1.05;
    font-weight: 500;
    margin-bottom: 24px;
    letter-spacing: -0.03em;
}

.hero-subtitle {
    font-size: 1.15rem;
    line-height: 1.65;
    color: var(--text-muted);
    max-width: 520px;
    margin-bottom: 40px;
}

.hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

@media (max-width: 768px) {
    .hero {
        padding: 80px 0 48px;
        min-height: auto;
    }

    .hero-inner {
        align-items: flex-start;
        text-align: left;
    }

    .hero-actions {
        justify-content: flex-start;
        width: 100%;
    }

    .hero-actions a {
        flex: 1;
        text-align: center;
    }
}
</style>
