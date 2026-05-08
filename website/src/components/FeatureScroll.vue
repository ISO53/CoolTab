<template>
    <section id="features" class="features-section container">
        <div class="section-header">
            <h2 class="reveal-text">Everything you need.</h2>
            <p>Packed with features to upgrade your browsing experience.</p>
        </div>

        <div class="features-grid">
            <div v-for="(feature, index) in features" :key="index" class="feature-card"
                :class="['feature-' + index, feature.size]" ref="featureCards">
                <div class="card-bg-effects">
                    <div class="glow-circle"></div>
                    <div class="abstract-shape"></div>
                    <div class="line-pattern"></div>
                </div>
                <div class="feature-content">
                    <div class="top-info">
                        <div class="feature-icon" v-html="feature.icon"></div>
                        <div class="feature-badge" v-if="feature.badge">{{ feature.badge }}</div>
                    </div>
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
        title: "Productivity Hub",
        description: "Stay focused with built-in task management and high-speed search. No more tab clutter.",
        size: "large-wide",
        badge: "Core",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
    },
    {
        title: "Live Intelligence",
        description: "Real-time stock tracking and weather forecasts.",
        size: "standard",
        badge: "Live",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    },
    {
        title: "Privacy First",
        description: "Your data stays local. We don't track your browsing habits or sell your information.",
        size: "standard",
        badge: "Secure",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    },
    {
        title: "Infinite Flexibility",
        description: "Arrange and resize widgets freely. Our revamped sidebar makes management intuitive.",
        size: "large-wide",
        badge: "Flex",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    },
    {
        title: "Beautifully Yours",
        description: "Minimal themes curated to match your aesthetic perfectly.",
        size: "large-wide",
        badge: "Style",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    },
    {
        title: "Smart Search",
        description: "Quick access to your favorite search engines.",
        size: "standard",
        badge: "Speed",
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
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
    padding: 120px 20px;
    background: var(--bg-dark);
}

.section-header {
    text-align: center;
    margin-bottom: 80px;
}

.section-header h2 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 220px;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    position: relative;
    background: rgba(15, 15, 15, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 32px;
    padding: 32px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
}

.feature-card.visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-card:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(20, 20, 20, 0.8);
}

.feature-card:hover .glow-circle {
    transform: scale(1.5);
    opacity: 1;
}

/* Bento Sizing - Creates a 3x3 Unit Square/Rectangle */
.large-wide {
    grid-column: span 2;
}

.standard {
    grid-column: span 1;
}

/* Background Effects */
.card-bg-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

.glow-circle {
    position: absolute;
    top: -20%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    transition: all 0.6s ease;
    opacity: 0.6;
}

.feature-0 .glow-circle { background: radial-gradient(circle, rgba(78, 168, 255, 0.08) 0%, transparent 70%); }
.feature-1 .glow-circle { background: radial-gradient(circle, rgba(0, 245, 212, 0.08) 0%, transparent 70%); }
.feature-2 .glow-circle { background: radial-gradient(circle, rgba(199, 125, 255, 0.08) 0%, transparent 70%); }
.feature-3 .glow-circle { background: radial-gradient(circle, rgba(255, 79, 216, 0.08) 0%, transparent 70%); }
.feature-4 .glow-circle { background: radial-gradient(circle, rgba(78, 168, 255, 0.08) 0%, transparent 70%); }
.feature-5 .glow-circle { background: radial-gradient(circle, rgba(0, 245, 212, 0.08) 0%, transparent 70%); }

.abstract-shape {
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.02);
    filter: blur(40px);
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.line-pattern {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.5;
}

/* Content Styles */
.feature-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.feature-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-badge {
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-group {
    flex: 1;
}

.feature-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: white;
}

.feature-card p {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
}

@media (max-width: 1024px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
    }
    
    .large-wide, .standard {
        grid-column: span 1;
    }
}

@media (max-width: 768px) {
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .section-header h2 {
        font-size: 2.5rem;
    }
}
</style>
