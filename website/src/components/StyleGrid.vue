<template>
    <div class="style-grid">
        <div v-if="loading" class="loading">Loading styles...</div>
        <div v-else v-for="style in styles" :key="style._id" class="style-card glass-panel">
            <div
                class="card-image"
                :style="{
                    backgroundImage: `url(${style.preview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }"
            ></div>
            <div class="card-info">
                <h3>{{ style.name }}</h3>
                <p>Created on {{ formatDate(style.createdAt) }}</p>
                <button class="btn-apply" @click="copyId(style._id)">
                    {{ copiedId === style._id ? "Copied!" : "Copy ID" }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

const styles = ref([]);
const loading = ref(true);
const copiedId = ref(null);

const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const copyId = async (id) => {
    try {
        await navigator.clipboard.writeText(id);
        copiedId.value = id;
        setTimeout(() => {
            if (copiedId.value === id) {
                copiedId.value = null;
            }
        }, 2000);
    } catch (err) {
        console.error("Failed to copy!", err);
    }
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 50px;
    font-size: 1.2rem;
    color: var(--text-muted);
}

.style-card {
    overflow: hidden;
    transition: transform 0.3s ease;
    background: var(--bg-card);
    border-radius: 12px;
}

.style-card:hover {
    transform: translateY(-5px);
}

.card-image {
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a1a;
}

.card-overlay {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
}

.mock-widgets {
    display: flex;
    gap: 10px;
}

.widget-stub {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
}

.card-info {
    padding: 20px;
}

.card-info h3 {
    margin-bottom: 5px;
}

.card-info p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 15px;
}

.btn-apply {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
}

.btn-apply:hover {
    background: white;
    color: #1a1a1a;
}
</style>
