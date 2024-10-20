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
        stock: getStock(),
        quickLinks: getQuickLinks(),
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
        setStock(stockInfo) {
            this.stock = stockInfo;
            storeInLocalStorage("stock", JSON.stringify(stockInfo));
        },
        setQuickLinks(links) {
            this.quickLinks = links;
            storeInLocalStorage("quick-links", JSON.stringify(links));
        },
    },
});

/**
 * Removes the item if the value is null, sets it otherwise
 * @param {String} key key for local storage
 * @param {String} value value for local storage
 */
function storeInLocalStorage(key, value) {
    if (value === null) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, value);
    }
}

/**
 * @returns {{sunrise: String, sunset: String, temperature: String, country: String, city: String, lastUpdated: Date}}
 */
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

/**
 * @returns {{cache_time: String, lastUpdated: Date, stocks: Array<{ticker: String, open: String, close: String, diff: Number}>, tickers: Array<String>}}
 */
function getStock() {
    const stocksData = localStorage.getItem("stock");
    const def = {
        cache_time: "",
        lastUpdated: new Date(null),
        stocks: [
            {
                ticker: "",
                open: "",
                close: "",
                diff: 0,
            },
        ],
        tickers: ["AAPL", "MSFT", "GOOG"],
    };

    let parsed = null;
    if (stocksData) {
        try {
            parsed = JSON.parse(stocksData);
        } catch (e) {
            return def;
        }
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        return parsed;
    }

    return def;
}

/**
 * @returns {{orientation: String, links: Array<String>, images: Array<String>, open_link_in: String}}
 */
function getQuickLinks() {
    const quickLinks = localStorage.getItem("quick-links");
    const def = {
        orientation: "Horizontal",
        links: ["www.youtube.com", "google.com/maps"],
        images: ["", ""],
        open_link_in: "New Tab",
    };

    if (quickLinks) {
        try {
            return JSON.parse(quickLinks);
        } catch (e) {
            return def;
        }
    }

    return def;
}
