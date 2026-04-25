<template>
    <div class="styles-container">
        <div class="styles-top-bar">
            <h2 class="page-title">My Styles</h2>
            <button class="save-btn" @click="saveCurrentStyle" title="Save current style">
                <i class="material-icons-outlined">save</i>
                Save Current Style
            </button>
        </div>

        <!-- User Styles Section -->
        <div class="styles-section">
            <div class="styles-grid">
                <StyleCard
                    v-for="style in this.settingsStore.userStyles"
                    :key="style.id"
                    :style="style"
                    :isPredefined="false"
                    @apply="applyStyle"
                    @delete="deleteStyle"
                />
            </div>
            <div v-if="!this.settingsStore.userStyles.length" class="no-styles">
                <i class="material-icons-outlined">style</i>
                <p>No styles saved yet.</p>
                <p class="hint">Save your current look or browse Community Styles.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useSettingsStore } from "@/settings";
import StyleCard from "./StyleCard.vue";

export default {
    name: "Styles",
    components: {
        StyleCard,
    },
    data() {
        return {
            settingsStore: useSettingsStore(),
        };
    },
    methods: {
        saveCurrentStyle() {
            const name = prompt("Name for your style:");
            if (!name) return;
            this.settingsStore.createStyle(name);
        },
        applyStyle(styleId) {
            this.settingsStore.applyStyle(styleId);
        },
        deleteStyle(styleId) {
            if (confirm("Are you sure you want to delete this style?")) {
                this.settingsStore.deleteStyle(styleId);
            }
        },
    },
};
</script>

<style scoped>
.styles-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;
}

.styles-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-shrink: 0;
}

.page-title {
    font-family: Satoshi-Bold;
    font-size: 1.2rem;
    color: var(--color-primary-text);
    margin: 0;
}

.save-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    border: 1.5px solid var(--color-border-line);
    border-radius: 10px;
    cursor: pointer;
    font-family: Satoshi-Bold;
    font-size: 0.78rem;
    white-space: nowrap;
    transition: color 200ms ease, border-color 200ms ease;
    user-select: none;
    flex-shrink: 0;
}

.save-btn i {
    font-size: 1.1rem;
}

.save-btn:hover {
    color: var(--color-primary-text);
    border-color: var(--color-secondary-text);
}

.styles-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    flex: 1;
}

.styles-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.no-styles {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 32px 20px;
    color: var(--color-tertiary-text);
    background-color: var(--color-secondary-background);
    border: 2px dashed var(--color-border-line);
    border-radius: 12px;
}

.no-styles i {
    font-size: 2rem;
    opacity: 0.5;
}

.no-styles p {
    margin: 0;
    font-size: 0.88rem;
}

.no-styles .hint {
    font-size: 0.78rem;
    opacity: 0.7;
}
</style>
