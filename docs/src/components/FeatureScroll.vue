<template>
    <section id="features" class="features-section container">
        <div class="section-header">
            <h2>Everything you need.</h2>
            <p>Packed with features to upgrade your browsing.</p>
        </div>

        <div class="features-grid">
            <div
                v-for="(feature, index) in features"
                :key="index"
                class="feature-card glass-panel interactive-panel"
                ref="featureCards"
            >
                <div class="feature-icon" v-html="feature.icon"></div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import {ref, onMounted} from "vue";

const features = [
    {
        title: "Custom Layouts",
        description: "Arrange and resize widgets to create your ideal workspace. Drag, drop, done.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
    },
    {
        title: "Smart Widgets",
        description: "Weather, Stocks, Calendar, Clocks - all the info you need at a glance.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>',
    },
    {
        title: "Beautiful Backgrounds",
        description: "Choose from a curated collection or upload your own. Support for colors and images.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    },
    {
        title: "Productivity First",
        description: "Quick links to your favorite sites. Fast search. No distractions.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    },
    {
        title: "Financial Insights",
        description: "Keep track of the market with the built-in stock ticker widget.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    },
    {
        title: "Detailed Forecasts",
        description: "Daily and weekly weather forecasts to help you plan your day and week ahead.",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 19a5 5 0 0 0-5-5a5 5 0 0 0-5 5"></path><path d="M12 14a5 5 0 0 0-5-5a5 5 0 0 0-5 5"></path><path d="M12 4a9 9 0 0 0-9 9a9 9 0 0 0 9 9"></path><path d="M12 4a9 9 0 0 1 9 9a9 9 0 0 1-9 9"></path></svg>',
    },
];

const featureCards = ref([]);

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        {threshold: 0.1}
    );

    featureCards.value.forEach((card) => {
        observer.observe(card);
    });
});
</script>

<style scoped>
.features-section {
    padding: 100px 20px;
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
}

.feature-card {
    padding: 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: left;
}

.feature-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 20px;
    color: white;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
}

.feature-card h3 {
    margin-bottom: 12px;
    font-size: 1.5rem;
}

.feature-card p {
    color: var(--text-muted);
    line-height: 1.6;
}

.feature-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
}
</style>
