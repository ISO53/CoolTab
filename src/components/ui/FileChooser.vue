<template>
    <div class="file-chooser">
        <input id="file-input" type="file" accept="image/*" @change="handleFileChange" hidden />

        <label for="file-input">
            <p class="file-text" v-if="!settingsStore.backgroundImageFileName">Choose Your Image</p>
            <p class="filename" v-if="settingsStore.backgroundImageFileName">
                {{ settingsStore.backgroundImageFileName }}
            </p>

            <Svg
                v-if="settingsStore.backgroundImage === null"
                class="folder-logo"
                :class_name="'material-icons-outlined'"
                :name="'folder'"
            ></Svg>

            <Svg
                v-if="settingsStore.backgroundImage !== null"
                class="trash-logo"
                @click.prevent="trash"
                :class_name="'material-icons-outlined'"
                :name="'delete'"
            ></Svg>
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
            if (file && file.type.startsWith("image/")) {
                try {
                    const resizedImage = await this.resizeImage(file);
                    this.settingsStore.setBackgroundImage(resizedImage);
                    this.settingsStore.setBackgroundImageFileName(file.name);
                } catch (error) {
                    console.error("Failed to process image:", error);
                }
            }
        },

        resizeImage(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        let width = img.width;
                        let height = img.height;

                        const screenWidth = window.screen.width;
                        const screenHeight = window.screen.height;

                        // Scale down to screen resolution if image is larger
                        if (width > screenWidth || height > screenHeight) {
                            const ratio = Math.min(screenWidth / width, screenHeight / height);
                            width = Math.floor(width * ratio);
                            height = Math.floor(height * ratio);
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        // Use JPEG with quality adjustment to save space
                        // 0.8 is usually a good balance between quality and size
                        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                        resolve(dataUrl);
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
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
    transition: color 250ms ease;
    user-select: none;
}

label:hover {
    color: var(--color-primary-text);
}

.folder-logo {
    transition: filter 250ms ease;
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
    transition: transform 250ms ease, color 250ms ease;
}

.trash-logo:hover {
    color: red;
    transform: rotate(15deg);
}

.file-text {
    display: flex;
    align-items: center;
}
</style>
