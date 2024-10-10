<template>
    <div class="file-chooser">
        <input id="file-input" type="file" accept="image/*" @change="handleFileChange" hidden />

        <label for="file-input">
            <p v-if="!settingsStore.backgroundImageFileName">Choose Your Image</p>
            <p class="filename" v-if="settingsStore.backgroundImageFileName">{{ settingsStore.backgroundImageFileName }}</p>
            <img src="@/components/icons/folder.svg" />
        </label>
    </div>
</template>

<script>
import { useSettingsStore } from '@/settings';

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

label img {
    transition: filter 250ms ease;
}

label:hover img {
    filter: brightness(150%);
}

.filename {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
