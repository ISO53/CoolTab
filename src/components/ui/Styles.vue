<template>
    <div class="styles-container">
        <div class="styles-header">
            <p>Save your current style for easy access.</p>
            <button class="save-style-btn" @click="saveCurrentStyle" title="Save current style">
                Save Current Style
            </button>
        </div>

        <!-- User Styles Section -->
        <div class="styles-section">
            <h2>Your Styles</h2>
            <div class="styles-grid">
                <StyleCard
                    v-for="style in settingsStore.userStyles"
                    :key="style.id"
                    :style="style"
                    :isPredefined="false"
                    @apply="applyStyle"
                    @delete="deleteStyle"
                />
            </div>
        </div>

        <!-- Predefined Styles Section -->
        <div class="styles-section">
            <h2>Predefined Styles</h2>
            <div class="styles-grid">
                <StyleCard
                    v-for="style in settingsStore.predefinedStyles"
                    :key="style.id"
                    :style="style"
                    :isPredefined="true"
                    @apply="applyStyle"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";
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
        applyStyle(styleId, isPredefined) {
            this.settingsStore.applyStyle(styleId, isPredefined);
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
    overflow-y: auto;
    padding: 10px;
    gap: 15px;
}

.styles-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.styles-section > h2 {
    font-family: Satoshi-Bold;
    font-size: 1.1rem;
    color: var(--color-primary-text);
    margin: 0;
}

.styles-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.styles-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
}

.save-style-btn {
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    padding: 8px 12px 8px 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    border: 2px solid var(--color-border-line);
    transition: color 250ms ease, border-color 250ms ease;
    user-select: none;
}

.save-style-btn:hover {
    color: var(--color-primary-text);
    border-color: var(--color-secondary-text);
}
</style>
