<template>
    <div class="file-chooser">
        <input id="file-input" type="file" accept="image/*" @change="handleFileChange" hidden />

        <label for="file-input">
            <p class="file-text" v-if="!settingsStore.backgroundImageFileName">Choose Your Image</p>
            <p class="filename" v-if="settingsStore.backgroundImageFileName">
                {{ settingsStore.backgroundImageFileName }}
            </p>

            <Icon v-if="settingsStore.backgroundImage === null" class="folder-logo" name="folder" />

            <Icon v-if="settingsStore.backgroundImage !== null" class="trash-logo" name="delete" @click.prevent="trash" />
        </label>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "FileChooser",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    methods: {
        async handleFileChange(event) {
            const file = event.target.files[0];
            if (file?.type.startsWith("image/")) {
                try {
                    await this.settingsStore.setBackgroundImage(file);
                    this.settingsStore.setBackgroundImageFileName(file.name);
                } catch (error) {
                    console.error("Failed to process image:", error);
                }
            }
        },

        trash() {
            this.settingsStore.setBackgroundImage(null);
            this.settingsStore.setBackgroundImageFileName(null);
        },
    },
};
</script>

<style scoped>
label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    width: 100%;
    padding: 8px 12px 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    border: 2px solid var(--color-border-line);
    transition: color 200ms ease;
    user-select: none;
}

label:hover {
    color: var(--color-primary-text);
}

.folder-logo {
    width: 1.8rem;
    height: 1.8rem;
}

label:hover .folder-logo {
    color: var(--color-primary-text);
}

.filename {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
}

.trash-logo {
    width: 1.8rem;
    height: 1.8rem;
}

.trash-logo:hover {
    color: red;
}

.file-text {
    display: flex;
    align-items: center;
}
</style>
