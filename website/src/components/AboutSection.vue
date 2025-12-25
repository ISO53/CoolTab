<template>
    <section class="about-section container">
        <div class="glass-panel about-card" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" ref="cardRef">
            <div class="content">
                <h2>What is CoolTab?</h2>
                <p>
                    CoolTab is a comprehensive overhaul for your browser's new tab page. It replaces the standard,
                    cluttered interface with a clean, customizable dashboard tailored to your workflow.
                </p>
                <p>
                    More than just a background changer, offering improved productivity through integrated widgets,
                    real-time data, and a layout that you control completely.
                </p>
            </div>

            <div class="visual-container" :style="cardStyle">
                <svg viewBox="0 0 400 300" class="abstract-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.1)" />
                            <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0.02)" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color: rgba(100, 100, 100, 0.2)" />
                            <stop offset="100%" style="stop-color: rgba(50, 50, 50, 0.1)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- Abstract Background Shape -->
                    <path
                        d="M50 150 Q200 50 350 150 T50 150"
                        stroke="rgba(255,255,255,0.05)"
                        stroke-width="1"
                        fill="none"
                    />

                    <!-- Floating Layers (representing tabs/ui) -->
                    <g transform="translate(100, 80)">
                        <!-- Back Layer -->
                        <rect
                            x="20"
                            y="20"
                            width="180"
                            height="120"
                            rx="12"
                            fill="url(#grad2)"
                            transform="rotate(-5)"
                        />
                        <!-- Middle Layer -->
                        <rect
                            x="10"
                            y="10"
                            width="180"
                            height="120"
                            rx="12"
                            fill="url(#grad2)"
                            transform="rotate(-2)"
                        />
                        <!-- Front Highlight Layer -->
                        <rect
                            x="0"
                            y="0"
                            width="180"
                            height="120"
                            rx="12"
                            fill="url(#grad1)"
                            stroke="rgba(255,255,255,0.2)"
                            stroke-width="1"
                            filter="url(#glow)"
                        />

                        <!-- Decorative Dots (UI elements) -->
                        <circle cx="20" cy="20" r="4" fill="rgba(255,255,255,0.3)" />
                        <circle cx="35" cy="20" r="4" fill="rgba(255,255,255,0.3)" />
                        <rect x="20" y="45" width="80" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                        <rect x="20" y="65" width="120" height="6" rx="3" fill="rgba(255,255,255,0.1)" />

                        <!-- Abstract 'Action' Element -->
                        <circle
                            cx="160"
                            cy="90"
                            r="15"
                            fill="rgba(255,255,255,0.1)"
                            stroke="rgba(255,255,255,0.3)"
                            stroke-width="1"
                        />
                    </g>

                    <!-- Floating Particles -->
                    <circle cx="80" cy="200" r="3" fill="rgba(255,255,255,0.2)" />
                    <circle cx="320" cy="100" r="2" fill="rgba(255,255,255,0.2)" />
                    <circle cx="280" cy="240" r="4" fill="rgba(255,255,255,0.1)" />
                </svg>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref, computed} from "vue";

const cardRef = ref(null);
const rotateX = ref(0);
const rotateY = ref(0);

const handleMouseMove = (e) => {
    if (!cardRef.value) return;

    const rect = cardRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation values (limit to +/- 10 degrees)
    rotateY.value = ((x - centerX) / centerX) * 10;
    rotateX.value = -((y - centerY) / centerY) * 10;
};

const handleMouseLeave = () => {
    rotateX.value = 0;
    rotateY.value = 0;
};

const cardStyle = computed(() => {
    return {
        transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    };
});
</script>

<style scoped>
.about-section {
    padding: 80px 20px;
}

.about-card {
    display: flex;
    align-items: center;
    gap: 60px;
    padding: 60px;
    background: linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.8));
    overflow: hidden;
}

.content {
    flex: 1;
    z-index: 2;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
}

p {
    color: var(--text-muted);
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 20px;
}

.visual-container {
    flex: 0 0 350px;
    transition: transform 0.1s ease-out;
    animation: float 6s ease-in-out infinite;
    display: flex;
    justify-content: center;
}

.about-card:hover .visual-container {
    animation: none;
}

.abstract-svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@media (max-width: 900px) {
    .about-card {
        flex-direction: column-reverse;
        flex-direction: column;
        text-align: center;
        padding: 40px;
    }

    .visual-container {
        width: 100%;
        flex: none;
        max-width: 400px;
        margin-top: 20px;
    }
}
</style>
