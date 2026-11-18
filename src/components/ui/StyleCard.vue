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
            <DropdownButton
                v-if="variant === 'mine'"
                action="Apply"
                icon="check_circle"
                :items="mineItems"
                title="Style actions"
                @action="$emit('apply', style.id)"
                @select="onMenuSelect"
            />
            <DropdownButton
                v-else
                action="Apply & Save"
                icon="check_circle_outline"
                :items="communityItems"
                title="Community style actions"
                :disabled="disabled"
                @action="$emit('apply')"
                @select="$emit('save')"
            />
        </div>
    </div>
</template>

<script>
import DropdownButton from "./DropdownButton.vue";
import {getItem} from "@/utils/db";

const MINE_ITEMS = [
    {id: "share", icon: "share", label: "Share"},
    {id: "delete", icon: "delete", label: "Delete", danger: true},
];

const COMMUNITY_ITEMS = [
    {id: "save", icon: "bookmark_border", label: "Save"},
];

export default {
    name: "StyleCard",
    components: {
        DropdownButton,
    },
    props: {
        style: {
            type: Object,
            required: true,
        },
        variant: {
            type: String,
            default: "mine",
        },
        // Community only: disables the actions while a request is running
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["apply", "delete", "save", "share"],
    data() {
        return {
            mineItems: MINE_ITEMS,
            communityItems: COMMUNITY_ITEMS,
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
        onMenuSelect(item) {
            // Share carries the style itself; delete carries its id (fixes the
            // no-payload emit that previously made delete a silent no-op)
            if (item.id === "share") {
                this.$emit("share", this.style);
            } else if (item.id === "delete") {
                this.$emit("delete", this.style.id);
            }
        },
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
    filter: blur(22px);
}

.palette-swatch {
    width: 100%;
    height: 100%;
}

.card-body {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.card-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
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
    font-size: 0.95rem;
    color: var(--color-tertiary-text);
    margin: 0;
}
</style>
