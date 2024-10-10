import {defineStore} from "pinia";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: localStorage.getItem("background-image") || null,
        backgroundImageFileName: localStorage.getItem("background-image-file-name") || null,
        backgroundColor: localStorage.getItem("background-color") || "#ffffff",
        backgroundSize: localStorage.getItem("background-size") || "cover",
    }),
    actions: {
        setBackgroundImage(image) {
            this.backgroundImage = image;
            localStorage.setItem("background-image", image);
        },
        setBackgroundColor(color) {
            this.backgroundColor = color;
            localStorage.setItem("background-color", color);
        },
        setBackgroundSize(size) {
            this.backgroundSize = size;
            localStorage.setItem("background-size", size);
        },
        setBackgroundImageFileName(fileName) {
            this.backgroundImageFileName = fileName;
            localStorage.setItem("background-image-file-name", fileName);
        },
    },
});
