<template>
    <div class="home-page">
        <HeroSection />
        <AboutSection />
        <ThemeDemo />
        <FeatureScroll />
        <PrivacySection />
        <InstallationSection />

        <!-- CTA Section -->
        <section class="bottom-cta container">
            <div class="glass-panel cta-box">
                <h2>Ready to upgrade your browser?</h2>
                <a href="#install" class="btn-primary"> Get CoolTab Now </a>
            </div>
        </section>
    </div>
</template>

<script setup>
import HeroSection from "../components/HeroSection.vue";
import AboutSection from "../components/AboutSection.vue";
import ThemeDemo from "../components/ThemeDemo.vue";
import FeatureScroll from "../components/FeatureScroll.vue";
import PrivacySection from "../components/PrivacySection.vue";
import InstallationSection from "../components/InstallationSection.vue";
</script>

<style scoped>
.bottom-cta {
    margin-top: 100px;
    text-align: center;
}

.cta-box {
    padding: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    position: relative;
}

.cta-box::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 120px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
}

h2 {
    font-size: 2.5rem;
}
</style>
