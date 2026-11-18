<template>
    <div class="style-card">
        <div class="card-preview" :class="{placeholder: !previewUrl}">
            <img v-if="previewUrl" :src="previewUrl" class="preview-image" alt="" draggable="false" />
            <!-- Fallback for styles without a captured preview (legacy saves, imports) -->
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
                <h3>{{ style.name }}</h3>
                <p class="style-date" v-if="style.createdAt">{{ formatDate(style.createdAt) }}</p>
            </div>
            <div class="card-actions">
                <button class="action-btn" @click="handleApply" title="Apply style">
                    <Svg :class_name="'material-icons-outlined apply'" :name="'check_circle'"></Svg>
                </button>
                <button class="action-btn" @click="handleDelete" title="Delete style">
                    <Svg :class_name="'material-icons-outlined delete'" :name="'delete'"></Svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Svg from "./Svg.vue";
import {getItem} from "@/utils/db";

export default {
    name: "StyleCard",
    components: {
        Svg,
    },
    props: {
        style: {
            type: Object,
            required: true,
        },
    },
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
            if (!this.style.hasPreview) return;
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
        handleApply() {
            this.$emit("apply", this.style.id);
        },
        handleDelete() {
            this.$emit("delete", this.style.id);
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
    },
};
</script>

<style scoped>
.style-card {
    width: 100%;
    overflow: hidden;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    border-radius: 10px;
    text-align: left;
    border: 2px solid var(--color-border-line);
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

/* Fallback palette, matching the Community Styles cards */
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

.card-text h3 {
    margin: 0;
    font-family: Satoshi-Bold;
    font-size: 0.95rem;
    color: var(--color-primary-text);
    word-break: break-word;
}

.style-date {
    margin: 0;
    font-family: Satoshi-Light;
    font-size: 0.75rem;
    color: var(--color-tertiary-text);
}

.card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: transparent;
    border: none;
}

.action-btn > i {
    cursor: pointer;
    transition: color 200ms ease, transform 200ms ease;
}

.apply:hover {
    color: green;
}

.delete:hover {
    color: red;
    transform: rotate(15deg);
}
</style>
