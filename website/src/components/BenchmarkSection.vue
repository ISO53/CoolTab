<template>
    <section class="benchmark-teaser container" ref="sectionRef">
        <div class="teaser-content">
            <p class="fig-label">Benchmarks</p>
            <h2>Lightning Fast Performance</h2>

            <div class="stat-row">
                <div class="stat-card" v-for="stat in stats" :key="stat.label">
                    <span class="stat-multiplier mono-stat">{{ stat.display }}x</span>
                    <span class="stat-label">{{ stat.label }}</span>
                </div>
            </div>

            <p class="teaser-description">
                Every millisecond counts when you open a new tab dozens of times a day.
                CoolTab is engineered to load faster and use less memory than the default
                new tab in Chrome, Brave, and Firefox, so your browser stays snappy and your
                system resources stay free.
            </p>

            <a href="#/benchmarks" class="btn-primary" @click="scrollTop">View Full Benchmarks</a>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
let observer = null

const stats = reactive([
    { value: 2.0, display: '0', label: 'faster load than Chrome' },
    { value: 2.1, display: '0', label: 'less memory than Chrome' },
    { value: 1.8, display: '0', label: 'faster paint than Chrome' }
])

function animateNumbers() {
    const duration = 1000
    const start = performance.now()

    function tick(now) {
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)

        stats.forEach((stat) => {
            const current = eased * stat.value
            if (progress >= 1) {
                stat.display = stat.value % 1 === 0 ? stat.value.toFixed(0) : stat.value.toFixed(1)
            } else {
                stat.display = current.toFixed(1)
            }
        })

        if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
}

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateNumbers()
                    observer.disconnect()
                }
            })
        },
        { threshold: 0.15 }
    )

    if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})

function scrollTop() {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
}
</script>

<style scoped>
.benchmark-teaser {
    padding: 120px 24px;
    text-align: center;
}

.teaser-content {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    font-size: clamp(2.25rem, 5vw, 3.25rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    margin: 16px 0 48px;
}

.stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 40px;
    width: 100%;
}

.stat-card {
    padding: 36px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
}

.mono-stat {
    font-family: var(--font-mono);
    font-size: clamp(2.25rem, 4vw, 3rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    color: var(--text-main);
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.stat-label {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.4;
}

.teaser-description {
    max-width: 560px;
    color: var(--text-muted);
    font-size: 1.05rem;
    line-height: 1.75;
    margin-bottom: 32px;
}

@media (max-width: 768px) {
    .benchmark-teaser {
        padding: 80px 24px;
        text-align: left;
    }

    .teaser-content {
        align-items: flex-start;
    }

    .stat-row {
        grid-template-columns: 1fr;
    }

    .stat-card {
        align-items: flex-start;
    }
}
</style>
