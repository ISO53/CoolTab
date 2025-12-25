<template>
    <div class="style-card">
        <div class="style-preview">
            <div class="color-squares">
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_primary_background, borderColor: colors.color_border_line}"
                    title="Primary Background"
                ></div>
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_secondary_background, borderColor: colors.color_border_line}"
                    title="Secondary Background"
                ></div>
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_tertiary_background, borderColor: colors.color_border_line}"
                    title="Tertiary Background"
                ></div>
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_primary_text, borderColor: colors.color_border_line}"
                    title="Primary Text"
                ></div>
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_secondary_text, borderColor: colors.color_border_line}"
                    title="Secondary Text"
                ></div>
                <div
                    class="color-square"
                    :style="{backgroundColor: colors.color_tertiary_text, borderColor: colors.color_border_line}"
                    title="Tertiary Text"
                ></div>
            </div>
        </div>
        <div class="style-info">
            <h3>{{ style.name }}</h3>
            <p class="style-date" v-if="style.createdAt">{{ formatDate(style.createdAt) }}</p>
        </div>
        <div class="style-actions">
            <button class="action-btn" @click="handleApply" title="Apply style">
                <Svg :class_name="'material-icons-outlined'" class="apply" :name="'check_circle'"></Svg>
            </button>
            <button class="action-btn" @click="handleDelete" title="Delete style">
                <Svg :class_name="'material-icons-outlined'" class="delete" :name="'delete'"></Svg>
            </button>
        </div>
    </div>
</template>

<script>
import Svg from "./Svg.vue";

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
    methods: {
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
        colors() {
            if (this.style && this.style.settings && this.style.settings.colors) {
                return this.style.settings.colors;
            }
            return {
                color_primary_background: "#000",
                color_secondary_background: "#141414",
                color_tertiary_background: "#4b4b4b",
                color_primary_text: "#fafafa",
                color_secondary_text: "#c8c8c8",
                color_tertiary_text: "#646464",
                color_border_line: "#323232",
            };
        },
    },
};
</script>

<style scoped>
.style-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    min-height: 64px;
    overflow: hidden;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    border-radius: 10px;
    text-align: left;
    border: 2px solid var(--color-border-line);
    user-select: none;
}

.style-preview {
    width: 160px;
    height: 64px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 6px;
}

.color-squares {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 4px;
    width: 100%;
    height: 100%;
}

.color-square {
    border: 2px solid var(--color-border-line);
    border-radius: 5px;
}

.placeholder {
    color: var(--color-tertiary-text);
    font-size: 0.8rem;
    text-align: center;
}

.style-info {
    padding: 8px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.style-info h3 {
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

.style-actions {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    border-left: 1px solid var(--color-border-line);
    align-items: center;
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
    transition: color 150ms ease, transform 150ms ease;
}

.apply:hover {
    color: green;
}

.delete:hover {
    color: red;
    transform: rotate(15deg);
}
</style>
