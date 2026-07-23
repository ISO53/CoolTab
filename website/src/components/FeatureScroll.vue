<template>
    <section id="features" class="features-section container">
        <div class="section-header">
            <p class="fig-label">Feature Set</p>
            <h2>Everything you need.</h2>
            <p class="section-sub">Packed with features to upgrade your browsing experience.</p>
        </div>

        <div class="features-grid">
            <div
                v-for="(feature, index) in features"
                :key="index"
                class="feature-card"
                :class="feature.size"
                ref="featureCards"
            >
                <div class="card-art" aria-hidden="true">
                    <FeatureArt :type="feature.art" />
                    <div class="art-fade"></div>
                </div>
                <div class="feature-foreground">
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
import FeatureArt from "./FeatureArt.vue";

const features = [
    {
        title: "Productivity Hub",
        description: "Stay focused with built-in task management and high-speed search. No more tab clutter.",
        size: "featured",
        art: "productivity",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    },
    {
        title: "Live Intelligence",
        description: "Real-time stock tracking and weather forecasts.",
        size: "side",
        art: "live",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    },
    {
        title: "Privacy First",
        description: "Your data stays local. We don't track your browsing habits or sell your information.",
        size: "side",
        art: "privacy",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    },
    {
        title: "Infinite Flexibility",
        description: "Arrange and resize widgets freely. Our revamped sidebar makes management intuitive.",
        size: "third",
        art: "flex",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    },
    {
        title: "Beautifully Yours",
        description: "Minimal themes curated to match your aesthetic perfectly.",
        size: "third",
        art: "theme",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    },
    {
        title: "Smart Search",
        description: "Quick access to your favorite search engines.",
        size: "third",
        art: "search",
        icon: '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="1.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
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
    padding: 120px 24px;
}

.section-header {
    text-align: left;
    margin-bottom: 56px;
    max-width: 640px;
}

.section-header h2 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    margin: 16px 0 12px;
}

.section-sub {
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.6;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: minmax(200px, auto);
    gap: 12px;
}

.feature-card {
    position: relative;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 400ms ease, transform 400ms ease, border-color var(--transition);
}

.feature-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-card:hover {
    border-color: var(--border-hover);
}

.feature-card:hover .feature-icon {
    color: var(--text-main);
}

.card-art {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

.card-art .feature-art,
.card-art :deep(.feature-art) {
    position: absolute;
    top: 8%;
    right: -4%;
    width: 85%;
    height: auto;
    opacity: 0.55;
}

.art-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(21, 21, 23, 0.2) 0%,
        rgba(21, 21, 23, 0.55) 48%,
        rgba(21, 21, 23, 0.94) 78%,
        var(--bg-surface) 100%
    );
    z-index: 1;
}

.feature-foreground {
    position: relative;
    z-index: 2;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.featured {
    grid-column: span 4;
    grid-row: span 2;
    padding: 36px;
    min-height: 420px;
}

.featured .card-art :deep(.feature-art) {
    top: 4%;
    right: 2%;
    width: 72%;
    opacity: 0.65;
}

.featured .art-fade {
    background: linear-gradient(
        200deg,
        rgba(21, 21, 23, 0.08) 0%,
        rgba(21, 21, 23, 0.4) 42%,
        rgba(21, 21, 23, 0.9) 72%,
        var(--bg-surface) 100%
    );
}

.featured h3 {
    font-size: 1.75rem;
}

.featured p {
    font-size: 1.05rem;
    max-width: 360px;
}

.side {
    grid-column: span 2;
    min-height: 200px;
}

.third {
    grid-column: span 2;
    min-height: 220px;
}

.feature-icon {
    width: 24px;
    height: 24px;
    color: var(--text-muted);
    transition: color var(--transition);
    line-height: 0;
}

.text-group h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
}

.text-group p {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
}

@media (max-width: 1024px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .featured,
    .side,
    .third {
        grid-column: span 1;
        grid-row: span 1;
        min-height: 260px;
    }
}

@media (max-width: 768px) {
    .features-section {
        padding: 80px 24px;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }
}
</style>
