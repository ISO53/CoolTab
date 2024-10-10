import {defineStore} from "pinia";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: localStorage.getItem("background-image") || null,
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
        setObjectFit(size) {
            this.backgroundSize = size;
            localStorage.setItem("background-size", size);
        },
    },
});
