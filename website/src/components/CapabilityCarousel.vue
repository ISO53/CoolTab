<template>
    <section class="capabilities-section" :class="{ 'is-visible': isVisible }">
        <div class="container main-grid">
            <!-- Left Side: Navigation (Desktop Only) -->
            <div class="navigation-side">
                <div class="vertical-nav-container">
                    <div class="nav-track"></div>
                    <div class="vertical-nav">
                        <div
                            v-for="(_, dotIndex) in features"
                            :key="'nav-'+dotIndex"
                            class="nav-item"
                            :class="{ active: activeIndex === dotIndex }"
                            @click="selectIndex(dotIndex)"
                        >
                            <div class="nav-circle">
                                <span v-if="activeIndex === dotIndex" class="nav-number">{{ dotIndex + 1 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="content-area">
                <div
                    v-for="(feature, index) in features"
                    :key="index"
                    class="feature-overlay"
                    :class="{ active: activeIndex === index }"
                >
                    <div class="content-grid">
                        <div class="explanation-side">
                            <h2 class="feature-title">{{ feature.title }}</h2>
                            <p class="feature-description">{{ feature.description }}</p>
                        </div>
                        <div class="video-side">
                            <div class="video-wrapper">
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
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Import videos
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
        video: browseStyles
    },
    {
        title: "Stunning Wallpapers",
        description: "Transform your new tab with high-resolution wallpapers. Browse our library or set your own background for a truly personal touch.",
        video: browseWallpapers
    },
    {
        title: "Dynamic Color Control",
        description: "Take command of your workspace aesthetics. Effortlessly adjust accent colors and gradients to match your mood or wallpaper perfectly.",
        video: changeColors
    },
    {
        title: "Your Widgets, Your Way",
        description: "Choose exactly what you need. Our expanding library of widgets ensures you have the right tools at your fingertips, every time you open a tab.",
        video: chooseWidgets
    },
    {
        title: "Effortless Organization",
        description: "Re-position widgets with simple drag-and-drop. Design a layout that works for you, placing your most-used tools exactly where you need them.",
        video: rePosition
    },
    {
        title: "Perfectly Proportioned",
        description: "Resize any widget to fit your layout. Whether you want a focus-sized calendar or a compact clock, CoolTab adapts to your spatial needs.",
        video: resizeWidgets
    }
];

const activeIndex = ref(0);
const isVisible = ref(false);

let interval = null;

const startAutoPlay = () => {
    // Only run auto-play on desktop (checked via window width if needed, or just let CSS handle it)
    if (window.innerWidth > 1024) {
        interval = setInterval(() => {
            activeIndex.value = (activeIndex.value + 1) % features.length;
        }, 5000);
    }
};

const stopAutoPlay = () => {
    if (interval) clearInterval(interval);
};

const selectIndex = (index) => {
    activeIndex.value = index;
    stopAutoPlay();
    startAutoPlay();
};

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                isVisible.value = true;
                stopAutoPlay();
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        },
        { threshold: 0.1 }
    );

    const section = document.querySelector('.capabilities-section');
    if (section) {
        observer.observe(section);
    }
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>

<style scoped>
.capabilities-section {
    position: relative;
    padding: 0;
    background: transparent;
    opacity: 0;
    transform: translateY(40px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.capabilities-section.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.main-grid {
    display: flex;
    align-items: center;
    gap: 80px;
    position: relative;
    width: 100%;
    height: 100%;
}

.navigation-side {
    width: 60px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    z-index: 20;
}

.vertical-nav-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nav-track {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
    left: 50%;
    transform: translateX(-50%);
}

.vertical-nav {
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: relative;
    z-index: 1;
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.4s ease;
}

.nav-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-number {
    font-size: 0.7rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    color: black;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.nav-item.active .nav-circle {
    width: 24px;
    height: 24px;
    background: white;
    transform: scale(1.2);
}

.nav-item.active .nav-number {
    opacity: 1;
}

.nav-item:hover .nav-circle {
    background: rgba(255, 255, 255, 0.6);
}

.content-area {
    position: relative;
    flex: 1;
    height: 100%;
}

.feature-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    pointer-events: none;
}

.feature-overlay.active {
    display: block;
    pointer-events: auto;
}

.content-grid {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
}

.explanation-side {
    width: 450px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 32px;
    z-index: 15;
    animation: fadeIn 0.4s ease forwards;
    position: relative;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

.feature-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    color: white;
}

.feature-description {
    font-size: 1.3rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 400px;
}

.video-side {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
}

.video-wrapper {
    width: 200%;
    height: 75vh;
    margin-right: -80%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 50px 100px rgba(0, 0, 0, 0.9);
    line-height: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: perspective(2000px) rotateY(-12deg);
    background: #000;
}

.feature-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

@media (max-width: 1200px) {
    .explanation-side {
        width: 380px;
    }

    .video-wrapper {
        width: 180%;
        margin-right: -60%;
    }
}

@media (max-width: 1024px) {
    .capabilities-section {
        height: auto;
        padding: 80px 0;
        overflow: visible;
    }

    .main-grid {
        display: block;
        height: auto;
    }

    .navigation-side {
        display: none;
    }

    .content-area {
        height: auto;
        display: flex;
        flex-direction: column;
        gap: 80px;
    }

    .feature-overlay {
        position: relative;
        display: block !important;
        height: auto;
        width: 100%;
        pointer-events: auto;
    }

    .content-grid {
        display: block;
        height: auto;
        text-align: left;
    }

    .explanation-side {
        width: 100%;
        align-items: flex-start;
        padding: 0 20px;
        animation: none;
        gap: 16px;
    }

    .feature-title {
        font-size: 2.5rem;
        margin-bottom: 8px;
    }

    .feature-description {
        font-size: 1.2rem;
        max-width: 600px;
        width: 100%;
        margin: 0;
    }

    .video-side {
        display: none; /* Removed videos on mobile as requested */
    }
}

@media (max-width: 768px) {
    .capabilities-section {
        padding: 60px 0;
    }

    .content-area {
        gap: 60px;
    }

    .feature-title {
        font-size: 2rem;
    }

    .feature-description {
        font-size: 1.1rem;
    }
}
</style>
