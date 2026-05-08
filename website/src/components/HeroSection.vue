<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BrowserMockup from './BrowserMockup.vue';

const scrollY = ref(0);

const handleScroll = () => {
    scrollY.value = window.scrollY;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <section class="hero">
        <div class="container hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Just a new tab, but<br /><span class="gradient-text">cooler</span>.</h1>
                <p class="hero-subtitle">
                    Customize your browser's new tab with brand new widgets, interactive themes, and seamless productivity tools.
                </p>

                <div class="hero-actions">
                    <a href="#install" class="btn-primary"> Install Extension </a>
                    <a href="#features" class="btn-secondary"> Explore Features </a>
                </div>
            </div>
            
            <div 
                class="hero-mockup-wrapper"
                :style="{ 
                    transform: `perspective(1000px) rotateY(${-5 + scrollY * 0.01}deg) rotateX(${scrollY * 0.005}deg) translateY(${scrollY * 0.05}px)` 
                }"
            >
                <BrowserMockup />
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    position: relative;
    height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;
    z-index: 2;
    gap: 40px;
}

.hero-content {
    flex: 0.8; /* Smaller flex to give more space to mockup */
    max-width: 500px;
    text-align: left;
}

.hero-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 1.1;
    font-weight: 700;
    margin-bottom: 24px;
}

.gradient-text {
    background: linear-gradient(135deg, #ff4fd8 0%, #c77dff 30%, #4ea8ff 70%, #00b4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    margin-bottom: 40px;
}

.hero-actions {
    display: flex;
    gap: 20px;
}

.btn-secondary {
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: var(--glass-bg);
    color: white;
    font-weight: 600;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.hero-mockup-wrapper {
    flex: 1.4; /* Larger flex to make mockup bigger */
    position: relative;
    margin-right: -30%; /* Slightly more hidden to accommodate larger size */
    will-change: transform;
    transition: transform 0.1s ease-out; /* Smooth follow for scroll */
}

@media (max-width: 992px) {
    .hero {
        height: auto;
        padding-top: 120px;
        padding-bottom: 60px;
    }
    
    .hero-container {
        flex-direction: column;
        text-align: center;
        gap: 60px;
    }
    
    .hero-content {
        max-width: 100%;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex: 1;
    }
    
    .hero-mockup-wrapper {
        margin-right: 0;
        width: 100%;
        transform: none !important;
        flex: 1;
    }
}
</style>
