<template>
    <div class="community-container">
        <!-- Loading skeletons -->
        <div v-if="loading" class="styles-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
                <div class="skeleton-preview"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line wide"></div>
                    <div class="skeleton-line short"></div>
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
                :saveState="getState(style._id, 'save')"
                :applyState="getState(style._id, 'apply')"
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
            states: {},
        };
    },
    mounted() {
        this.fetchStyles();
    },
    methods: {
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
            this.setState(style._id, "apply", "loading");
            try {
                const result = await this.settingsStore.importStyleById(style._id);
                if (result.success) {
                    await this.settingsStore.applyStyle(result.style.id);
                    this.setState(style._id, "apply", "done");
                } else {
                    this.setState(style._id, "apply", "error");
                }
            } catch {
                this.setState(style._id, "apply", "error");
            } finally {
                this.loadingId = null;
                setTimeout(() => this.setState(style._id, "apply", "idle"), 2200);
            }
        },

        async saveStyle(style) {
            if (this.loadingId) return;
            this.loadingId = style._id;
            this.setState(style._id, "save", "loading");
            try {
                const result = await this.settingsStore.importStyleById(style._id);
                if (result.success) {
                    this.setState(style._id, "save", "done");
                } else {
                    this.setState(style._id, "save", "error");
                }
            } catch {
                this.setState(style._id, "save", "error");
            } finally {
                this.loadingId = null;
                setTimeout(() => this.setState(style._id, "save", "idle"), 2200);
            }
        },

        setState(id, action, state) {
            if (!this.states[id]) this.states[id] = {apply: "idle", save: "idle"};
            this.states = {...this.states, [id]: {...this.states[id], [action]: state}};
        },

        getState(id, action) {
            if (this.states[id]?.[action]) {
                return this.states[id][action];
            }
            if (action === "save") {
                const isSaved = this.settingsStore.userStyles?.some((s) => s._id === id);
                if (isSaved) return "done";
            }
            return "idle";
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
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-line {
    height: 10px;
    border-radius: 6px;
    background-color: var(--color-tertiary-background);
    opacity: 0.3;
    margin: 4px 0;
}

.skeleton-btn {
    width: 60px;
    height: 28px;
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
