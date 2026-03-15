<template>
    <section id="features" class="features-section container">
        <div class="section-header">
            <h2>Everything you need.</h2>
            <p>Packed with features to upgrade your browsing.</p>
        </div>

        <div class="features-grid">
            <div v-for="(feature, index) in features" :key="index" class="feature-card glass-panel"
                :class="['feature-' + index, feature.size]" ref="featureCards">
                <div class="feature-content">
                    <div class="feature-icon" v-html="feature.icon"></div>
                    <div class="text-group">
                        <h3>{{ feature.title }}</h3>
                        <p>{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const features = [
    {
        title: "Task Management",
        description: "Stay organized with the brand new TodoList widget. Add, toggle, and manage tasks directly.",
        size: "large",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    },
    {
        title: "Custom Layouts",
        description: "Arrange and resize widgets freely. Drag, drop, done.",
        size: "wide",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
    },
    {
        title: "Personalization",
        description: "Minimal or Classic clock styles to match your vibe.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    },
    {
        title: "Smart Widgets",
        description: "Weather, Stocks, Calendar & more at your fingertips.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>',
    },
    {
        title: "Revamped Sidebar",
        description: "A gorgeous, interactive grid for effortless widget management and selection.",
        size: "large",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    },
    {
        title: "Financials",
        description: "Real-time stock market tracking widgets.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    },
    {
        title: "Weather Stats",
        description: "Precise daily and weekly weather forecasts.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 19a5 5 0 0 0-5-5a5 5 0 0 0-5 5"></path><path d="M12 14a5 5 0 0 0-5-5a5 5 0 0 0-5 5"></path><path d="M12 4a9 9 0 0 0-9 9a9 9 0 0 0 9 9"></path><path d="M12 4a9 9 0 0 1 9 9a9 9 0 0 1-9 9"></path></svg>',
    },
    {
        title: "Eye Candy",
        description: "Curated collection of stunning, high-res themes.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    },
    {
        title: "Zero Distractions",
        description: "Pure focus with quick access to your top sites.",
        size: "small",
        icon: '<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
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
        { threshold: 0.1 }
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
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, auto);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    position: relative;
    padding: 30px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.feature-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.05), transparent);
    z-index: 0;
}

.feature-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;
}

.large .feature-content {
    justify-content: space-between;
}

.feature-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color, #c77dff);
    transition: transform 0.3s ease;
}

/* Bento Grid Spans */
.large {
    grid-column: span 2;
    grid-row: span 2;
    padding: 40px;
}

.wide {
    grid-column: span 2;
}

/* Specific Placements to optimize Bento look */
.feature-0 {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}

.feature-1 {
    grid-column: 3 / 5;
    grid-row: 1 / 2;
}

.feature-4 {
    grid-column: 1 / 3;
    grid-row: 3 / 5;
}

.feature-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
}

.large h3 {
    font-size: 2rem;
}

.feature-card p {
    color: var(--text-muted);
    line-height: 1.5;
    font-size: 0.95rem;
}

.large p {
    font-size: 1.1rem;
}

.feature-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
}

.feature-card:hover .feature-icon {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 1000px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .feature-0,
    .feature-1,
    .feature-4 {
        grid-column: span 2;
        grid-row: auto;
    }
}

@media (max-width: 600px) {
    .features-grid {
        grid-template-columns: 1fr;
    }

    .large,
    .wide,
    .feature-0,
    .feature-1,
    .feature-4 {
        grid-column: span 1;
    }
}
</style>
