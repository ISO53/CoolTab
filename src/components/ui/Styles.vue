<template>
    <div class="styles-container">
        <div class="styles-top-bar">
            <h2 class="page-title">Styles</h2>
        </div>

        <!-- In-tab share panel: opened from a style card, shares that style -->
        <div v-if="shareOpen && sharingStyle" class="share-panel">
            <div class="share-panel-header">
                <h3>Share Your Style</h3>
                <button class="share-panel-close" @click="toggleSharePanel" title="Close">
                    <i class="material-icons-outlined">close</i>
                </button>
            </div>
            <p class="share-panel-subtitle">
                Share "{{ sharingStyle.name }}" with the CoolTab community
            </p>
            <ShareStyleForm :showCancel="false" :targetStyle="sharingStyle" />
        </div>

        <!-- Filter -->
        <SelectButton v-model="filter" :options="filterOptions" />

        <!-- Content -->
        <div class="styles-section">
            <template v-if="filter === 'My Styles'">
                <div class="styles-grid">
                    <StyleCard
                        v-for="style in sortedUserStyles"
                        :key="style.id"
                        :style="style"
                        variant="mine"
                        @apply="applyStyle"
                        @delete="deleteStyle"
                        @share="openSharePanel"
                    />
                </div>
                <div v-if="!this.settingsStore.userStyles.length" class="no-styles">
                    <i class="material-icons-outlined">style</i>
                    <p>No styles saved yet.</p>
                    <p class="hint">Save your current look or check the Community filter.</p>
                </div>
            </template>
            <CommunityStyles v-else />
        </div>

        <!-- Floating action -->
        <div class="floating-actions">
            <FloatingButton :icon="saving ? 'hourglass_empty' : 'save'" label="Save style" :disabled="saving" @click="saveCurrentStyle" />
        </div>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";
import StyleCard from "./StyleCard.vue";
import CommunityStyles from "./CommunityStyles.vue";
import SelectButton from "./SelectButton.vue";
import ShareStyleForm from "./ShareStyleForm.vue";
import FloatingButton from "./FloatingButton.vue";

export default {
    name: "Styles",
    components: {
        StyleCard,
        CommunityStyles,
        SelectButton,
        ShareStyleForm,
        FloatingButton,
    },
    data() {
        return {
            settingsStore: useSettingsStore(),
            saving: false,
            shareOpen: false,
            sharingStyle: null,
            filter: "My Styles",
            filterOptions: [
                {label: "My Styles", icon: "person"},
                {label: "Community", icon: "explore"},
            ],
        };
    },
    computed: {
        sortedUserStyles() {
            const styles = this.settingsStore.userStyles || [];
            return [...styles].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        },
    },
    mounted() {
        // The Styles tab mounts on first open (Tab uses v-if), which is the natural
        // moment to backfill previews for styles saved before previews existed.
        this.backfillPreviews();
    },
    methods: {
        openSharePanel(style) {
            this.sharingStyle = style;
            this.shareOpen = true;
        },
        toggleSharePanel() {
            this.shareOpen = !this.shareOpen;
        },
        async saveCurrentStyle() {
            const name = prompt("Name for your style:");
            if (!name) return;
            this.saving = true;
            try {
                await this.settingsStore.createStyle(name);
            } finally {
                this.saving = false;
            }
        },
        async backfillPreviews() {
            for (const style of this.settingsStore.userStyles) {
                if (style.hasPreview) continue;
                await this.settingsStore.generateStylePreview(style.id);
            }
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
    position: relative;
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

.floating-actions {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 5;
}

.share-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-shrink: 0;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    border-radius: 12px;
    padding: 16px;
}

.share-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.share-panel-header h3 {
    margin: 0;
    font-family: Satoshi-Bold;
    font-size: 1.05rem;
    color: var(--color-primary-text);
}

.share-panel-close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    color: var(--color-tertiary-text);
    cursor: pointer;
    transition: color 200ms ease, background-color 200ms ease;
}

.share-panel-close:hover {
    color: var(--color-primary-text);
    background-color: var(--color-tertiary-background);
}

.share-panel-subtitle {
    margin: 0;
    font-family: Satoshi-Light;
    font-size: 0.8rem;
    color: var(--color-tertiary-text);
}

.styles-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    flex: 1;
    /* Keep the last card clear of the floating save button */
    padding-bottom: 70px;
}

.styles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
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
