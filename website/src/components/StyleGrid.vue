<template>
    <div class="style-grid">
        <div v-if="loading" class="loading">Loading styles...</div>
        <div v-else v-for="style in styles" :key="style._id" class="style-card">
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
        const response = await fetch("https://cool-tab-api.vercel.app/api/get-styles-basic");
        if (response.ok) {
            styles.value = await response.json();
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
    column-count: 2;
    column-gap: 16px;
    max-width: 1600px;
    margin: 0 auto;
}

.loading {
    text-align: center;
    padding: 100px;
    font-size: 1.2rem;
    color: var(--text-muted);
}

.style-card {
    break-inside: avoid;
    margin-bottom: 16px;
    background: #0a0a0a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
}

.image-container {
    position: relative;
    width: 100%;
    display: block;
    line-height: 0;
}

.style-image {
    width: 100%;
    height: auto;
    display: block;
}

.card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 24px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: flex-end;
    line-height: normal;
}

.info-glass {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    /* Animation Properties */
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
    color: rgba(255, 255, 255, 0.5);
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
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
}

@media (max-width: 768px) {
    .style-grid {
        column-count: 1;
    }
}
</style>
