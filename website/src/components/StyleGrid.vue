<template>
    <div class="style-grid">
        <div v-if="loading" class="loading">Loading styles...</div>
        <div 
            v-else 
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
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

const styles = ref([]);
const loading = ref(true);

const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

onMounted(async () => {
    try {
        const response = await fetch("https://cool-tab-api.vercel.app/api/get-styles?type=basic");
        if (response.ok) {
            const data = await response.json();
            // Randomly assign large class to ~15% of items for 2x2 effect
            styles.value = data.map(style => ({
                ...style,
                isLarge: Math.random() > 0.85
            }));
        }
    } catch (error) {
        console.error("Error fetching styles:", error);
    } finally {
        loading.value = false;
    }
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
