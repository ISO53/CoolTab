<template>
    <div class="community-container">
        <div class="page-header">
            <h2>Community Styles</h2>
            <p class="subtitle">Discover styles shared by the CoolTab community</p>
        </div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="styles-grid">
            <div v-for="i in 6" :key="i" class="style-card skeleton-card">
                <div class="card-preview skeleton-preview"></div>
                <div class="card-body">
                    <div class="card-text">
                        <div class="skeleton-line wide"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                    <div class="card-actions">
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
            <div v-for="style in styles" :key="style._id" class="style-card">
                <!-- Preview -->
                <div
                    class="card-preview"
                    :class="{'has-image': !!style.preview}"
                    :style="style.preview ? {backgroundImage: `url(${style.preview})`} : {}"
                >
                    <!-- Color palette fallback -->
                    <div v-if="!style.preview && style.settings && style.settings.colors" class="palette-preview">
                        <div
                            v-for="(color, key) in getPreviewColors(style.settings.colors)"
                            :key="key"
                            class="palette-swatch"
                            :style="{backgroundColor: color}"
                        ></div>
                    </div>
                </div>

                <!-- Card info -->
                <div class="card-body">
                    <div class="card-text">
                        <h3 class="card-name">{{ style.name }}</h3>
                        <p class="card-date">{{ formatDate(style.createdAt) }}</p>
                    </div>
                    <div class="card-actions">
                        <button
                            class="action-btn save-btn"
                            :class="getState(style._id, 'save')"
                            :disabled="loadingId === style._id"
                            @click.stop="saveStyle(style)"
                            title="Save to My Styles"
                        >
                            <i class="material-icons-outlined">{{ getIcon(style._id, "save") }}</i>
                            <span>{{ getLabel(style._id, "save") }}</span>
                        </button>
                        <button
                            class="action-btn apply-btn"
                            :class="getState(style._id, 'apply')"
                            :disabled="loadingId === style._id"
                            @click.stop="applyStyle(style)"
                            title="Apply style immediately"
                        >
                            <i class="material-icons-outlined">{{ getIcon(style._id, "apply") }}</i>
                            <span>{{ getLabel(style._id, "apply") }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "CommunityStyles",
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
                const res = await fetch("https://cool-tab-api.vercel.app/api/get-styles-basic");
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
            return this.states[id]?.[action] || "idle";
        },

        getIcon(id, action) {
            const s = this.getState(id, action);
            const icons = {
                apply: {
                    idle: "check_circle_outline",
                    loading: "hourglass_empty",
                    done: "check_circle",
                    error: "error_outline",
                },
                save: {
                    idle: "bookmark_border",
                    loading: "hourglass_empty",
                    done: "bookmark_added",
                    error: "error_outline",
                },
            };
            return icons[action][s] || icons[action].idle;
        },

        getLabel(id, action) {
            const s = this.getState(id, action);
            const labels = {
                apply: {idle: "Apply & Save", loading: "Applying…", done: "Applied!", error: "Failed"},
                save: {idle: "Save", loading: "Saving…", done: "Saved!", error: "Failed"},
            };
            return labels[action][s] || labels[action].idle;
        },

        getPreviewColors(colors) {
            return {
                a: colors.color_primary_background,
                b: colors.color_secondary_background,
                c: colors.color_tertiary_background,
                d: colors.color_primary_text,
                e: colors.color_secondary_text,
                f: colors.color_border_line,
            };
        },

        formatDate(dateString) {
            if (!dateString) return "";
            return new Date(dateString).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"});
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

.page-header h2 {
    font-family: Satoshi-Bold;
    font-size: 1.2rem;
    color: var(--color-primary-text);
    margin: 0 0 4px 0;
}

.subtitle {
    font-size: 0.78rem;
    color: var(--color-tertiary-text);
    margin: 0;
}

/* ── Grid ── */
.styles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

/* ── Card ── */
.style-card {
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    transition:
        border-color 200ms ease,
        transform 200ms ease;
    cursor: pointer;
}

/* ── Preview ── */
.card-preview {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 0.45;
    background-color: var(--color-primary-background);
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.card-preview.has-image {
    background-color: #0a0a0a;
}

.palette-preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    height: 100%;
    width: 100%;
    gap: 0;
}

.palette-swatch {
    width: 100%;
    height: 100%;
}

/* ── Card body ── */
.card-body {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.card-text {
    flex: 1;
    min-width: 0;
}

.card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ── Action Buttons ── */
.action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1.5px solid transparent;
    font-size: 0.72rem;
    font-family: Satoshi-Bold;
    cursor: pointer;
    white-space: nowrap;
    transition: all 150ms ease;
}

.action-btn i {
    font-size: 1rem;
}

.action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.apply-btn {
    background-color: var(--color-primary-text);
    color: var(--color-primary-background);
    border-color: var(--color-primary-text);
}

.apply-btn:hover:not(:disabled) {
    opacity: 0.88;
}

.apply-btn.done {
    background-color: #22c55e;
    border-color: #22c55e;
    color: #fff;
}

.apply-btn.error {
    background-color: #ef4444;
    border-color: #ef4444;
    color: #fff;
}

.save-btn {
    background-color: transparent;
    color: var(--color-secondary-text);
    border-color: var(--color-border-line);
}

.save-btn:hover:not(:disabled) {
    background-color: var(--color-primary-background);
    border-color: var(--color-tertiary-text);
    color: var(--color-primary-text);
}

.save-btn.done {
    border-color: #22c55e;
    color: #22c55e;
}

.save-btn.error {
    border-color: #ef4444;
    color: #ef4444;
}


.card-name {
    font-family: Satoshi-Bold;
    font-size: 0.95rem;
    color: var(--color-primary-text);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-date {
    font-family: Satoshi-Light;
    font-size: 0.75rem;
    color: var(--color-tertiary-text);
    margin: 0;
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
        border-color 150ms ease,
        color 150ms ease;
}

.retry-btn:hover {
    border-color: var(--color-secondary-text);
    color: var(--color-primary-text);
}

.retry-btn i {
    font-size: 1rem;
}
</style>
