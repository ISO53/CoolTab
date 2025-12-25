<template>
    <div class="styles-container">
        <div class="styles-header">
            <p>Save your current style for quick access, or import a style from Community Styles.</p>
            <div class="styles-buttons">
                <button class="style-btn" @click="saveCurrentStyle" title="Save current style">
                    <Svg :class_name="'material-icons-outlined'" :name="'save'"></Svg>
                    Save Current Style
                </button>
                <p>or</p>
                <button class="style-btn" @click="importStyle" title="Import style from ID">
                    <Svg :class_name="'material-icons-outlined'" :name="'download'"></Svg>
                    Import Style
                </button>
            </div>
        </div>

        <!-- User Styles Section -->
        <div class="styles-section">
            <div class="section-header">
                <h2>Your Styles</h2>
            </div>
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
                <p>No styles saved yet. Create your own or import one!</p>
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
        async importStyle() {
            const styleId = prompt("Paste Style ID:");
            if (!styleId) return;

            const result = await this.settingsStore.importStyleById(styleId);
            if (result.success) {
                alert("Style imported successfully!");
            } else {
                alert("Failed to import style: " + result.error);
            }
        },
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

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.no-styles {
    text-align: center;
    padding: 20px;
    color: var(--color-tertiary-text);
    background-color: var(--color-secondary-background);
    border: 2px dashed var(--color-border-line);
    border-radius: 10px;
}

.no-styles p {
    margin: 0;
    font-size: 0.9rem;
}

.styles-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
}

.styles-buttons {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.styles-buttons button {
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px;
    gap: 10px;
}

.style-btn i {
    font-size: 1.6rem;
}

.style-btn {
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
    font-family: Satoshi-Bold;
    font-size: 0.85rem;
}

.style-btn:hover {
    color: var(--color-primary-text);
    border-color: var(--color-secondary-text);
}
</style>
