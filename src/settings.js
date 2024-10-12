import {defineStore} from "pinia";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: localStorage.getItem("background-image") || null,
        backgroundImageFileName: localStorage.getItem("background-image-file-name") || null,
        backgroundColor: localStorage.getItem("background-color") || "#ffffff",
        backgroundSize: localStorage.getItem("background-size") || "cover",
        searchEngine: localStorage.getItem("search-engine") || "Google",
        openSearchResultIn: localStorage.getItem("open-search-result-in") || "New Tab",
        currentWeatherInfo: getCurrentWeatherInfo(),
    }),
    actions: {
        setBackgroundImage(image) {
            this.backgroundImage = image;
            storeInLocalStorage("background-image", image);
        },
        setBackgroundColor(color) {
            this.backgroundColor = color;
            storeInLocalStorage("background-color", color);
        },
        setBackgroundSize(size) {
            this.backgroundSize = size;
            storeInLocalStorage("background-size", size);
        },
        setBackgroundImageFileName(fileName) {
            this.backgroundImageFileName = fileName;
            storeInLocalStorage("background-image-file-name", fileName);
        },
        setSearchEngine(engine) {
            this.searchEngine = engine;
            storeInLocalStorage("search-engine", engine);
        },
        setOpenSearchResultIn(choice) {
            this.openSearchResultIn = choice;
            storeInLocalStorage("open-search-result-in", choice);
        },
        setCurrentWeatherInfo(weather) {
            this.currentWeatherInfo = weather;
            storeInLocalStorage("weather-info", JSON.stringify(weather));
        },
    },
});

function storeInLocalStorage(key, value) {
    if (value === null) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, value);
    }
}

function getCurrentWeatherInfo() {
    const info = localStorage.getItem("weather-info");
    const def = {
        sunrise: "",
        sunset: "",
        temperature: "",
        country: "",
        city: "",
        lastUpdated: null,
    };

    let parsed = null;
    if (info) {
        try {
            parsed = JSON.parse(info);
        } catch (e) {
            return def;
        }
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        return parsed;
    }

    return def;
}
