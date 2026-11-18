<template>
    <div class="style-card">
        <div class="card-preview" :class="{placeholder: !previewSrc}">
            <img v-if="previewSrc" :src="previewSrc" class="preview-image" alt="" draggable="false" />
            <!-- Fallback for styles without a captured preview -->
            <div v-else class="palette-preview">
                <div
                    v-for="(color, key) in previewColors"
                    :key="key"
                    class="palette-swatch"
                    :style="{backgroundColor: color}"
                ></div>
            </div>
        </div>
        <div class="card-body">
            <div class="card-text">
                <h3 class="card-name">{{ style.name }}</h3>
                <p class="card-date" v-if="style.createdAt">{{ formatDate(style.createdAt) }}</p>
            </div>
            <div class="card-actions">
                <!-- Community: Save + Apply & Save, driven by the parent's request states -->
                <template v-if="variant === 'community'">
                    <button
                        class="action-btn secondary-btn"
                        :class="saveState"
                        :disabled="disabled"
                        @click.stop="$emit('save')"
                        title="Save to My Styles"
                    >
                        <i class="material-icons-outlined">{{ saveIcon }}</i>
                        <span>{{ saveLabel }}</span>
                    </button>
                    <button
                        class="action-btn primary-btn"
                        :class="applyState"
                        :disabled="disabled"
                        @click.stop="$emit('apply')"
                        title="Apply style immediately"
                    >
                        <i class="material-icons-outlined">{{ applyIcon }}</i>
                        <span>{{ applyLabel }}</span>
                    </button>
                </template>

                <!-- Mine: Delete (secondary) + Apply (primary) -->
                <template v-else>
                    <button class="action-btn secondary-btn" @click.stop="$emit('delete')" title="Delete style">
                        <i class="material-icons-outlined">delete</i>
                        <span>Delete</span>
                    </button>
                    <button class="action-btn primary-btn" @click.stop="$emit('apply')" title="Apply style">
                        <i class="material-icons-outlined">check_circle</i>
                        <span>Apply</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import {getItem} from "@/utils/db";

const COMMUNITY_SAVE_STATES = {
    idle: {icon: "bookmark_border", label: "Save"},
    loading: {icon: "hourglass_empty", label: "Saving…"},
    done: {icon: "bookmark_added", label: "Saved!"},
    error: {icon: "error_outline", label: "Failed"},
};

const COMMUNITY_APPLY_STATES = {
    idle: {icon: "check_circle_outline", label: "Apply & Save"},
    loading: {icon: "hourglass_empty", label: "Applying…"},
    done: {icon: "check_circle", label: "Applied!"},
    error: {icon: "error_outline", label: "Failed"},
};

export default {
    name: "StyleCard",
    props: {
        style: {
            type: Object,
            required: true,
        },
        variant: {
            type: String,
            default: "mine",
        },
        // Community-only request states: idle | loading | done | error
        saveState: {
            type: String,
            default: "idle",
        },
        applyState: {
            type: String,
            default: "idle",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["apply", "delete", "save"],
    data() {
        return {
            previewUrl: null,
        };
    },
    watch: {
        // The hasPreview flag flips reactively when the preview backfill finishes
        "style.hasPreview": {
            immediate: true,
            handler: "loadPreview",
        },
    },
    beforeUnmount() {
        this.revokePreview();
    },
    methods: {
        async loadPreview() {
            this.revokePreview();
            if (this.variant !== "mine" || !this.style.hasPreview) return;
            try {
                const blob = await getItem(`style-preview-${this.style.id}`);
                if (blob && this.style.hasPreview) {
                    this.previewUrl = URL.createObjectURL(blob);
                }
            } catch (e) {
                console.error("Failed to load style preview:", e);
            }
        },
        revokePreview() {
            if (this.previewUrl) {
                URL.revokeObjectURL(this.previewUrl);
                this.previewUrl = null;
            }
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        },
    },
    computed: {
        previewSrc() {
            if (this.variant === "community") {
                return this.style.preview || null;
            }
            return this.previewUrl;
        },
        previewColors() {
            const colors = this.style?.settings?.colors;
            if (!colors) {
                return {
                    a: "#000000",
                    b: "#141414",
                    c: "#4b4b4b",
                    d: "#fafafa",
                    e: "#c8c8c8",
                    f: "#323232",
                };
            }
            return {
                a: colors.color_primary_background,
                b: colors.color_secondary_background,
                c: colors.color_tertiary_background,
                d: colors.color_primary_text,
                e: colors.color_secondary_text,
                f: colors.color_border_line,
            };
        },
        saveIcon() {
            return COMMUNITY_SAVE_STATES[this.saveState]?.icon ?? "bookmark_border";
        },
        saveLabel() {
            return COMMUNITY_SAVE_STATES[this.saveState]?.label ?? "Save";
        },
        applyIcon() {
            if (this.variant !== "community") return "check_circle";
            return COMMUNITY_APPLY_STATES[this.applyState]?.icon ?? "check_circle_outline";
        },
        applyLabel() {
            if (this.variant !== "community") return "Apply";
            return COMMUNITY_APPLY_STATES[this.applyState]?.label ?? "Apply & Save";
        },
    },
};
</script>

<style scoped>
.style-card {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    transition:
        border-color 200ms ease,
        transform 200ms ease;
    cursor: pointer;
    user-select: none;
}

.card-preview {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 0.45;
    overflow: hidden;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.card-preview.placeholder {
    background-color: var(--color-primary-background);
}

/* Fallback palette */
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

.card-body {
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.card-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
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

.card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

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
    transition: all 200ms ease;
}

.action-btn i {
    font-size: 1rem;
}

.action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.primary-btn {
    background-color: var(--color-primary-text);
    color: var(--color-primary-background);
    border-color: var(--color-primary-text);
}

.primary-btn:hover:not(:disabled) {
    opacity: 0.88;
}

.primary-btn.done {
    background-color: #22c55e;
    border-color: #22c55e;
    color: #fff;
}

.primary-btn.error {
    background-color: #ef4444;
    border-color: #ef4444;
    color: #fff;
}

.secondary-btn {
    background-color: transparent;
    color: var(--color-secondary-text);
    border-color: var(--color-border-line);
}

.secondary-btn:hover:not(:disabled) {
    background-color: var(--color-primary-background);
    border-color: var(--color-tertiary-text);
    color: var(--color-primary-text);
}

.secondary-btn.done {
    border-color: #22c55e;
    color: #22c55e;
}

.secondary-btn.error {
    border-color: #ef4444;
    color: #ef4444;
}
</style>
