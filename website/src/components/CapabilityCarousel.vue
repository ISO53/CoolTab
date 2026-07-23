<template>
    <section class="capabilities-section" ref="sectionRef" :class="{ 'is-visible': isVisible }">
        <div class="capabilities-sticky">
            <div class="container main-grid">
                <div class="navigation-side">
                    <div class="vertical-nav-container">
                        <div class="nav-track"></div>
                        <div class="vertical-nav">
                            <div
                                v-for="(_, dotIndex) in features"
                                :key="'nav-' + dotIndex"
                                class="nav-item"
                                :class="{ active: activeIndex === dotIndex }"
                                @click="selectIndex(dotIndex)"
                            >
                                <div class="nav-circle">
                                    <span v-if="activeIndex === dotIndex" class="nav-number mono">{{ String(dotIndex + 1).padStart(2, '0') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content-area">
                    <div
                        v-for="(feature, index) in features"
                        :key="index"
                        class="feature-overlay"
                        :class="{ active: activeIndex === index }"
                    >
                        <div class="content-grid">
                            <div class="explanation-side">
                                <p class="fig-label">Capability {{ String(index + 1).padStart(2, '0') }} / {{ String(features.length).padStart(2, '0') }}</p>
                                <h2 class="feature-title">{{ feature.title }}</h2>
                                <p class="feature-description">{{ feature.description }}</p>
                            </div>
                            <div class="video-side">
                                <div class="video-wrapper">
                                    <div class="video-chrome">
                                        <span class="fig-label">Preview</span>
                                        <span class="fig-label">{{ feature.slug }}</span>
                                    </div>
                                    <video
                                        :src="feature.video"
                                        autoplay
                                        loop
                                        muted
                                        playsinline
                                        class="feature-video"
                                    ></video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import browseStyles from '../assets/videos/Browse-Styles.mp4';
import browseWallpapers from '../assets/videos/Browse-Wallpapers.mp4';
import changeColors from '../assets/videos/Change-Colors.mp4';
import chooseWidgets from '../assets/videos/Choose-Widgets.mp4';
import rePosition from '../assets/videos/Re-Position.mp4';
import resizeWidgets from '../assets/videos/Resize-Widgets.mp4';

const features = [
    {
        title: "Endless Style Possibilities",
        description: "Explore a curated collection of beautiful styles. From ultra-minimal to vibrant gradients, find the look that defines your browsing experience.",
        video: browseStyles,
        slug: "styles"
    },
    {
        title: "Stunning Wallpapers",
        description: "Transform your new tab with high-resolution wallpapers. Browse our library or set your own background for a truly personal touch.",
        video: browseWallpapers,
        slug: "wallpapers"
    },
    {
        title: "Dynamic Color Control",
        description: "Take command of your workspace aesthetics. Effortlessly adjust accent colors and gradients to match your mood or wallpaper perfectly.",
        video: changeColors,
        slug: "colors"
    },
    {
        title: "Your Widgets, Your Way",
        description: "Choose exactly what you need. Our expanding library of widgets ensures you have the right tools at your fingertips, every time you open a tab.",
        video: chooseWidgets,
        slug: "widgets"
    },
    {
        title: "Effortless Organization",
        description: "Re-position widgets with simple drag-and-drop. Design a layout that works for you, placing your most-used tools exactly where you need them.",
        video: rePosition,
        slug: "layout"
    },
    {
        title: "Perfectly Proportioned",
        description: "Resize any widget to fit your layout. Whether you want a focus-sized calendar or a compact clock, CoolTab adapts to your spatial needs.",
        video: resizeWidgets,
        slug: "resize"
    }
];

const activeIndex = ref(0);
const isVisible = ref(false);
const sectionRef = ref(null);

const selectIndex = (index) => {
    activeIndex.value = index;
    if (!sectionRef.value || window.innerWidth <= 1024) return;
    const rect = sectionRef.value.getBoundingClientRect();
    const start = window.scrollY + rect.top;
    const scrollable = sectionRef.value.offsetHeight - window.innerHeight;
    const target = start + (index / (features.length - 1)) * scrollable;
    window.scrollTo({ top: target, behavior: 'smooth' });
};

function onScroll() {
    if (!sectionRef.value || window.innerWidth <= 1024) return;
    const rect = sectionRef.value.getBoundingClientRect();
    const scrollable = sectionRef.value.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    // How far we've scrolled through the sticky section
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    const progress = scrolled / scrollable;
    const index = Math.min(
        features.length - 1,
        Math.floor(progress * features.length)
    );
    if (index !== activeIndex.value) {
        activeIndex.value = index;
    }

    isVisible.value = rect.bottom > 0 && rect.top < window.innerHeight;
}

onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
});
</script>

<style scoped>
.capabilities-section {
    position: relative;
    height: 500vh;
}

.capabilities-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 96px 0 40px;
}

.main-grid {
    display: flex;
    align-items: center;
    gap: 48px;
    width: 100%;
    height: 100%;
    max-height: 720px;
}

.navigation-side {
    width: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
}

.vertical-nav-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: min(420px, 55vh);
}

.nav-track {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
    left: 50%;
    transform: translateX(-50%);
}

.vertical-nav {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    position: relative;
    z-index: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.nav-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width var(--transition), height var(--transition), background-color var(--transition), border-color var(--transition);
}

.nav-number {
    font-size: 0.55rem;
    color: var(--bg-base);
    letter-spacing: 0;
    opacity: 0;
}

.nav-item.active .nav-circle {
    width: 28px;
    height: 28px;
    background: var(--text-main);
    border-color: var(--text-main);
}

.nav-item.active .nav-number {
    opacity: 1;
}

.nav-item:hover .nav-circle {
    border-color: rgba(255, 255, 255, 0.6);
}

.content-area {
    position: relative;
    flex: 1;
    height: 100%;
    min-height: 420px;
}

.feature-overlay {
    position: absolute;
    inset: 0;
    display: none;
    opacity: 0;
}

.feature-overlay.active {
    display: block;
    opacity: 1;
    animation: capFade 180ms ease;
}

@keyframes capFade {
    from { opacity: 0; }
    to { opacity: 1; }
}

.content-grid {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 40px;
}

.explanation-side {
    width: 380px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.feature-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.03em;
}

.feature-description {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 360px;
}

.video-side {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    min-width: 0;
}

.video-wrapper {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border);
    background: #000;
    aspect-ratio: 16 / 10;
}

.video-chrome {
    display: flex;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: #111113;
}

.feature-video {
    width: 100%;
    height: calc(100% - 37px);
    object-fit: cover;
    display: block;
}

@media (max-width: 1024px) {
    .capabilities-section {
        height: auto;
    }

    .capabilities-sticky {
        position: relative;
        height: auto;
        padding: 72px 0;
    }

    .main-grid {
        display: block;
        max-height: none;
        height: auto;
    }

    .navigation-side {
        display: none;
    }

    .content-area {
        height: auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 64px;
    }

    .feature-overlay {
        position: relative;
        display: block !important;
        opacity: 1 !important;
        height: auto;
        animation: none;
    }

    .content-grid {
        display: block;
        height: auto;
    }

    .explanation-side {
        width: 100%;
        margin-bottom: 20px;
    }

    .video-side {
        display: block;
    }
}

@media (max-width: 768px) {
    .feature-title {
        font-size: 2rem;
    }
}
</style>
