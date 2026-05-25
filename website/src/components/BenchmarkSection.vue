<template>
    <section class="benchmark-teaser container" ref="sectionRef">
        <div class="teaser-content">
            <h2>Lightning Fast Performance</h2>

            <div class="stat-row">
                <div class="stat-card glass-panel" v-for="stat in stats" :key="stat.label">
                    <span class="stat-multiplier">{{ stat.display }}x</span>
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
    const duration = 1200
    const fps = 60
    const totalFrames = Math.round(duration / (1000 / fps))
    let frame = 0

    function tick() {
        frame++
        const progress = frame / totalFrames
        // easeOutQuart curve
        const eased = 1 - Math.pow(1 - progress, 4)

        stats.forEach((stat) => {
            const current = eased * stat.value
            // Show one decimal place, but snap to clean value at end
            if (frame >= totalFrames) {
                stat.display = stat.value % 1 === 0 ? stat.value.toFixed(0) : stat.value.toFixed(1)
            } else {
                stat.display = current.toFixed(1)
            }
        })

        if (frame < totalFrames) {
            requestAnimationFrame(tick)
        }
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
        { threshold: 0.1 }
    )

    if (sectionRef.value) {
        observer.observe(sectionRef.value)
    }
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
    padding: 120px 20px;
    text-align: center;
}

.teaser-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 50px;
}

.stat-row {
    display: flex;
    gap: 24px;
    margin-bottom: 40px;
    width: 100%;
    justify-content: center;
}

.stat-card {
    flex: 1;
    max-width: 260px;
    padding: 36px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: default;
    transition: none !important;
}

.stat-card:hover {
    transform: none !important;
    box-shadow: none !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
}

.stat-multiplier {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #ffffff;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.stat-label {
    color: var(--text-muted);
    font-size: 1rem;
    line-height: 1.4;
}

.teaser-description {
    max-width: 600px;
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 36px;
}

@media (max-width: 768px) {
    .benchmark-teaser {
        padding: 80px 20px;
        text-align: left;
    }

    .teaser-content {
        align-items: flex-start;
        margin: 0;
    }

    h2 {
        font-size: 2.25rem;
        margin-bottom: 36px;
    }

    .stat-row {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .stat-card {
        max-width: 100%;
        width: 100%;
        align-items: flex-start;
    }

    .stat-multiplier {
        font-size: 2.5rem;
    }

    .teaser-description {
        max-width: 100%;
    }
}
</style>
