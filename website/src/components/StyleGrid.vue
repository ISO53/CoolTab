<template>
    <div class="style-grid">
        <div v-if="loading" class="loading">Loading styles...</div>
        <template v-else>
            <div
                v-for="style in styles"
                :key="style._id"
                class="style-card"
                :class="{ 'style-card--large': style.isLarge }"
            >
                <div class="image-container">
                    <img :src="style.preview" :alt="style.name" class="style-image" />
                    <div class="card-overlay">
                        <div class="info-glass">
                            <h3>{{ style.name }}</h3>
                            <p>{{ formatDate(style.createdAt) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loadingMore" class="loading">Loading more styles...</div>
        </template>
    </div>

    <!-- Load more failed -->
    <div v-if="loadMoreError" class="load-more-error">
        <p>Couldn't load more styles</p>
        <button @click="loadMore">Retry</button>
    </div>

    <!-- Infinite scroll sentinel -->
    <div v-else-if="hasMore" ref="sentinel" class="sentinel"></div>
</template>

<script setup>
import {ref, nextTick, onMounted, onBeforeUnmount} from "vue";

const API_URL = "https://cool-tab-api.vercel.app/api/get-styles";
const PAGE_SIZE = 12;

const styles = ref([]);
const loading = ref(true);
const page = ref(1);
const hasMore = ref(false);
const loadingMore = ref(false);
const loadMoreError = ref(false);
const sentinel = ref(null);
let observer = null;

const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const observeSentinel = () => {
    if (!hasMore.value || loadMoreError.value) return;
    const el = sentinel.value;
    if (!el) return;
    if (!observer) {
        observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) loadMore();
            },
            {rootMargin: "400px"}
        );
    }
    observer.observe(el);
};

const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return;
    loadingMore.value = true;
    loadMoreError.value = false;
    // Pause observation while fetching; re-observing afterwards also
    // re-fires a fetch if the sentinel is still on screen
    observer?.disconnect();
    try {
        const nextPage = page.value + 1;
        const response = await fetch(`${API_URL}?type=basic&page=${nextPage}&limit=${PAGE_SIZE}`);
        if (response.ok) {
            const data = await response.json();
            const incoming = data.styles ?? data;
            // Styles created between page fetches shift the offset; drop anything already shown
            const seen = new Set(styles.value.map((s) => s._id));
            const fresh = incoming
                .filter((s) => !seen.has(s._id))
                // Randomly assign large class to ~15% of items for 2x2 effect
                .map((style) => ({...style, isLarge: Math.random() > 0.85}));
            styles.value.push(...fresh);
            page.value = nextPage;
            // A bare array means an API without pagination support; hasMore is authoritative otherwise
            hasMore.value = data.hasMore ?? false;
        } else {
            loadMoreError.value = true;
        }
    } catch (error) {
        console.error("Error loading more styles:", error);
        loadMoreError.value = true;
    } finally {
        loadingMore.value = false;
        nextTick(observeSentinel);
    }
};

onMounted(async () => {
    try {
        const response = await fetch(`${API_URL}?type=basic&page=1&limit=${PAGE_SIZE}`);
        if (response.ok) {
            const data = await response.json();
            const incoming = data.styles ?? data;
            // Randomly assign large class to ~15% of items for 2x2 effect
            styles.value = incoming.map((style) => ({
                ...style,
                isLarge: Math.random() > 0.85
            }));
            // A bare array means an API without pagination support; hasMore is authoritative otherwise
            hasMore.value = data.hasMore ?? false;
        }
    } catch (error) {
        console.error("Error fetching styles:", error);
    } finally {
        loading.value = false;
    }
    nextTick(observeSentinel);
});

onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
});
</script>

<style scoped>
.style-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: dense;
    grid-auto-rows: 200px; /* Base height unit */
    gap: 16px;
    max-width: 1600px;
    margin: 0 auto;
}

.loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 100px;
    font-size: 1.2rem;
    color: var(--text-muted);
}

/* ── Infinite scroll ── */
.sentinel {
    width: 100%;
    height: 1px;
}

.load-more-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 20px;
    color: var(--text-muted);
}

.load-more-error p {
    margin: 0;
    font-size: 0.95rem;
}

.load-more-error button {
    padding: 8px 18px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: inherit;
    cursor: pointer;
    font-size: 0.85rem;
    transition:
        border-color 200ms ease,
        color 200ms ease;
}

.load-more-error button:hover {
    border-color: rgba(255, 255, 255, 0.45);
}

.style-card {
    grid-column: span 1;
    grid-row: span 1;
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.style-card:hover {
    z-index: 10;
}

.style-card--large {
    grid-column: span 2;
    grid-row: span 2;
}

.image-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
}

.style-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 24px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    line-height: normal;
}

.info-glass {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.style-card:hover .info-glass {
    opacity: 1;
    transform: translateY(0);
}

.info-glass h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: white;
}

.info-glass p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.7rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.info-glass p::before {
    content: "";
    width: 3px;
    height: 3px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
}

@media (max-width: 1200px) {
    .style-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 900px) {
    .style-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .style-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
    }
    
    .style-card--large {
        grid-column: span 1;
        grid-row: span 1;
    }
    
    .style-image {
        aspect-ratio: 16/9;
    }
}
</style>
