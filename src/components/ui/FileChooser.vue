<template>
    <div class="file-chooser">
        <input id="file-input" type="file" accept="image/*" @change="handleFileChange" hidden />

        <label for="file-input">
            <p v-if="!settingsStore.backgroundImageFileName">Choose Your Image</p>
            <p class="filename" v-if="settingsStore.backgroundImageFileName">
                {{ settingsStore.backgroundImageFileName }}
            </p>

            <Svg v-if="settingsStore.backgroundImage === null" class="folder-logo" :name="'folder'"></Svg>

            <Svg
                v-if="settingsStore.backgroundImage !== null"
                class="trash-logo"
                @click.prevent="trash"
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
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                // Read the image file as Base64 string
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Store the file name and image data to settings store
                    this.settingsStore.setBackgroundImage(e.target.result);
                    this.settingsStore.setBackgroundImageFileName(file.name);
                };
                reader.readAsDataURL(file);
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
    background-color: rgb(20, 20, 20);
    color: rgb(200, 200, 200);
    width: 100%;
    padding: 8px 12px 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    border: 2px solid rgb(50, 50, 50);
    transition: color 250ms ease;
    user-select: none;
}

label:hover {
    color: white;
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
}

.trash-logo {
    transition: transform 250ms ease, color 250ms ease;
}

.trash-logo:hover {
    color: red;
    transform: rotate(15deg);
}
</style>
