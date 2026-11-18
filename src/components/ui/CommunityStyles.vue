<template>
    <div class="community-container">
        <!-- Loading skeletons -->
        <div v-if="loading" class="styles-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
                <div class="skeleton-preview"></div>
                <div class="skeleton-body">
                    <div class="skeleton-text">
                        <div class="skeleton-line wide"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                    <div class="skeleton-actions">
                        <div class="skeleton-btn"></div>
                        <div class="skeleton-btn"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="empty-state">
            <i class="material-icons-outlined">wifi_off</i>
            <p>Could not load community styles</p>
            <button class="retry-btn" @click="fetchStyles">
                <i class="material-icons-outlined">refresh</i>
                Retry
            </button>
        </div>

        <!-- Empty -->
        <div v-else-if="styles.length === 0" class="empty-state">
            <i class="material-icons-outlined">explore_off</i>
            <p>No community styles yet</p>
        </div>

        <!-- Grid -->
        <div v-else class="styles-grid">
            <StyleCard
                v-for="style in styles"
                :key="style._id"
                :style="style"
                variant="community"
                :saved="isSaved(style._id)"
                :disabled="loadingId === style._id"
                @save="saveStyle(style)"
                @apply="applyStyle(style)"
            />
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";
import StyleCard from "./StyleCard.vue";

export default {
    name: "CommunityStyles",
    components: {
        StyleCard,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            styles: [],
            loading: true,
            error: false,
            loadingId: null,
        };
    },
    mounted() {
        this.fetchStyles();
    },
    methods: {
        isSaved(communityStyleId) {
            return (this.settingsStore.userStyles || []).some((s) => s._id === communityStyleId);
        },
        async fetchStyles() {
            this.loading = true;
            this.error = false;
            try {
                const res = await fetch("https://cool-tab-api.vercel.app/api/get-styles?type=basic");
                if (res.ok) {
                    this.styles = await res.json();
                } else {
                    this.error = true;
                }
            } catch {
                this.error = true;
            } finally {
                this.loading = false;
            }
        },

        async applyStyle(style) {
            if (this.loadingId) return;
            this.loadingId = style._id;
            try {
                const result = await this.settingsStore.importStyleById(style._id);
                if (result.success) {
                    await this.settingsStore.applyStyle(result.style.id);
                    // The imported style has no preview yet; render one now so it
                    // shows up without needing to leave and revisit the tab
                    this.settingsStore.generateStylePreview(result.style.id);
                }
            } catch {
                // Keep the card enabled; a failed apply can simply be retried
            } finally {
                this.loadingId = null;
            }
        },

        async saveStyle(style) {
            if (this.loadingId) return;
            this.loadingId = style._id;
            try {
                const result = await this.settingsStore.importStyleById(style._id);
                if (result.success) {
                    this.settingsStore.generateStylePreview(result.style.id);
                }
            } catch {
                // Keep the card enabled; a failed save can simply be retried
            } finally {
                this.loadingId = null;
            }
        },
    },
};
</script>

<style scoped>
.community-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* ── Grid ── */
.styles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* ── Skeletons ── */
.skeleton-card {
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-preview {
    width: 100%;
    aspect-ratio: 1 / 0.45;
    background-color: var(--color-tertiary-background);
    opacity: 0.3;
}

.skeleton-body {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.skeleton-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-line {
    height: 19px;
    border-radius: 6px;
    background-color: var(--color-tertiary-background);
    opacity: 0.3;
}

.skeleton-btn {
    width: 60px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--color-tertiary-background);
    opacity: 0.3;
}

.skeleton-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.skeleton-line.wide {
    width: 60%;
}
.skeleton-line.short {
    width: 35%;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

/* ── Empty / Error ── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 20px;
    color: var(--color-tertiary-text);
}

.empty-state i {
    font-size: 2.5rem;
}

.empty-state p {
    font-size: 0.9rem;
    margin: 0;
}

.retry-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    background-color: var(--color-secondary-background);
    border: 1.5px solid var(--color-border-line);
    color: var(--color-secondary-text);
    cursor: pointer;
    font-family: Satoshi-Bold;
    font-size: 0.8rem;
    transition:
        border-color 200ms ease,
        color 200ms ease;
}

.retry-btn:hover {
    border-color: var(--color-secondary-text);
    color: var(--color-primary-text);
}

.retry-btn i {
    font-size: 1rem;
}
</style>
