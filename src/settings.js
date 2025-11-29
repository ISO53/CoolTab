import {defineStore} from "pinia";
import pkg from "../package.json";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: localStorage.getItem("background-image") || null,
        backgroundImageFileName: localStorage.getItem("background-image-file-name") || null,
        backgroundSize: localStorage.getItem("background-size") || "Cover",
        searchEngine: localStorage.getItem("search-engine") || "Google",
        openSearchResultIn: localStorage.getItem("open-search-result-in") || "New Tab",
        currentWeatherInfo: getCurrentWeatherInfo(),
        stock: getStock(),
        quickLinks: getQuickLinks(),
        widgets: getWidgets(),
        widgetAreaColumns: parseInt(localStorage.getItem("widget-area-columns")) || 20,
        weeklyWeatherInfo: getWeeklyWeatherInfo(),
        widgetBackground: localStorage.getItem("widget-background") || "Color",
        colors: getColors(),
        colorPalette: getColorPalette(),
        currentVersion: pkg && pkg.version ? pkg.version : "0.0.0",
        savedVersion: getSavedVersion(),
        releaseNotes: null,
        showUpdatePopup: false,
        userStyles: getUserStyles(),
        predefinedStyles: getPredefinedStyles(),
    }),
    actions: {
        setBackgroundImage(image) {
            this.backgroundImage = image;
            storeInLocalStorage("background-image", image);
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
        setWidgets(widgets) {
            this.widgets = widgets;
            storeInLocalStorage("widgets", JSON.stringify(widgets));
        },
        setWidgetAreaColumns(columns) {
            this.widgetAreaColumns = columns;
            storeInLocalStorage("widget-area-columns", columns);
        },
        setWeeklyWeatherInfo(info) {
            this.weeklyWeatherInfo = info;
            storeInLocalStorage("weekly-weather-info", JSON.stringify(info));
        },
        setWidgetBackground(background) {
            this.widgetBackground = background;
            storeInLocalStorage("widget-background", background);
        },
        setColors(colors) {
            this.colors = colors;

            // update css variables
            const r = document.querySelector(":root");
            for (const key in colors) {
                if (colors.hasOwnProperty(key)) {
                    r.style.setProperty(`--${key.replaceAll("_", "-")}`, colors[key]);
                }
            }

            storeInLocalStorage("colors", JSON.stringify(colors));
        },
        setColorPalette(palette) {
            this.colorPalette = palette;
            storeInLocalStorage("color-palette", JSON.stringify(palette));
        },
        setSavedVersion(version) {
            this.savedVersion = version;
            storeInLocalStorage("saved-version", version);
        },
        dismissUpdatePopup() {
            this.setSavedVersion(this.currentVersion);
            this.showUpdatePopup = false;
        },
        hideUpdatePopup() {
            this.showUpdatePopup = false;
        },
        async fetchReleaseForVersion(version) {
            try {
                const latest = await fetch(`https://cool-tab-api.vercel.app/api/latest-release`);
                if (latest.ok) {
                    const json = await latest.json();
                    this.releaseNotes = {
                        tag_name: json.tag_name,
                        name: json.name,
                        body: json.body,
                        html_url: json.html_url,
                        published_at: json.published_at,
                    };
                    return this.releaseNotes;
                }
            } catch (e) {
                console.log(e);
            }
            return null;
        },
        async checkVersionOnStart() {
            // Compare savedVersion and currentVersion; if current > saved, fetch notes and show popup
            try {
                const cur = this.currentVersion || "0.0.0";
                const saved = this.savedVersion || "0.0.0";
                if (compareVersions(cur, saved) === 1) {
                    // updated
                    await this.fetchReleaseForVersion(cur);
                    this.showUpdatePopup = true;
                }
            } catch (e) {
                // ignore errors; don't block startup
            }
        },
        createStyle(name) {
            const style = {
                id: Date.now().toString(),
                name: name,
                createdAt: new Date().toISOString(),
                settings: this.getStyleSnapshot(),
            };
            // ensure userStyles array exists
            if (!Array.isArray(this.userStyles)) this.userStyles = [];
            this.userStyles.push(style);
            storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
            return style;
        },
        deleteStyle(styleId) {
            // Only allow deleting user styles
            const index = this.userStyles ? this.userStyles.findIndex((t) => t.id === styleId) : -1;
            if (index !== -1) {
                this.userStyles.splice(index, 1);
                storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
            }
        },
        applyStyle(styleId, isPredefined = false) {
            const styleList = isPredefined ? this.predefinedStyles : this.userStyles;
            const style = styleList ? styleList.find((t) => t.id === styleId) : null;
            if (style && style.settings) {
                this.applyStyleSettings(style.settings);
            }
        },
        applyStyleSettings(settings) {
            if (settings.backgroundImage !== undefined) this.setBackgroundImage(settings.backgroundImage);
            if (settings.backgroundImageFileName !== undefined)
                this.setBackgroundImageFileName(settings.backgroundImageFileName);
            if (settings.backgroundSize !== undefined) this.setBackgroundSize(settings.backgroundSize);
            if (settings.searchEngine !== undefined) this.setSearchEngine(settings.searchEngine);
            if (settings.openSearchResultIn !== undefined) this.setOpenSearchResultIn(settings.openSearchResultIn);
            if (settings.widgetBackground !== undefined) this.setWidgetBackground(settings.widgetBackground);
            if (settings.colors !== undefined) this.setColors(settings.colors);
            if (settings.colorPalette !== undefined) this.setColorPalette(settings.colorPalette);
            if (settings.widgets !== undefined) this.setWidgets(settings.widgets);
            if (settings.widgetAreaColumns !== undefined) this.setWidgetAreaColumns(settings.widgetAreaColumns);
            if (settings.quickLinks !== undefined) this.setQuickLinks(settings.quickLinks);
            if (settings.currentWeatherInfo !== undefined) this.setCurrentWeatherInfo(settings.currentWeatherInfo);
            if (settings.stock !== undefined) this.setStock(settings.stock);
            if (settings.weeklyWeatherInfo !== undefined) this.setWeeklyWeatherInfo(settings.weeklyWeatherInfo);
        },
        getStyleSnapshot() {
            return {
                backgroundImage: this.backgroundImage,
                backgroundImageFileName: this.backgroundImageFileName,
                backgroundSize: this.backgroundSize,
                searchEngine: this.searchEngine,
                openSearchResultIn: this.openSearchResultIn,
                widgetBackground: this.widgetBackground,
                colors: JSON.parse(JSON.stringify(this.colors)),
                colorPalette: JSON.parse(JSON.stringify(this.colorPalette)),
                widgets: JSON.parse(JSON.stringify(this.widgets)),
                widgetAreaColumns: this.widgetAreaColumns,
                quickLinks: JSON.parse(JSON.stringify(this.quickLinks)),
                currentWeatherInfo: JSON.parse(JSON.stringify(this.currentWeatherInfo)),
                stock: JSON.parse(JSON.stringify(this.stock)),
                weeklyWeatherInfo: JSON.parse(JSON.stringify(this.weeklyWeatherInfo)),
            };
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
 * Return the saved version stored in localStorage, or default "0.0.0"
 * @returns {String}
 */
function getSavedVersion() {
    const v = localStorage.getItem("saved-version");
    return v || "0.0.0";
}

/**
 * Compare semantic versions a and b.
 * Returns 1 if a > b, 0 if equal, -1 if a < b.
 */
function compareVersions(a, b) {
    const pa = (a || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);
    const pb = (b || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb) return 1;
        if (na < nb) return -1;
    }
    return 0;
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

/**
 * @returns {{widgets: Array<{name: String, x: Number, y: Number, width: Number, height: Number, resize: String}>}}
 */
function getWidgets() {
    const widgets = localStorage.getItem("widgets");
    const def = [
        {
            name: "SearchBar",
            x: 3,
            y: 4,
            width: 14,
            height: 1,
            resize: "horizontal",
            selected: true,
        },
        {
            name: "QuickLinks",
            x: 8,
            y: 5,
            width: 4,
            height: 1,
            resize: "horizontal",
            selected: true,
        },
        {
            name: "Calendar",
            x: 9,
            y: 6,
            width: 2,
            height: 2,
            resize: "square",
            selected: true,
        },
        {
            name: "AnalogClock",
            x: 3,
            y: 6,
            width: 2,
            height: 2,
            resize: "square",
            selected: true,
        },
        {
            name: "DailyWeatherForecast",
            x: 14,
            y: 0,
            width: 3,
            height: 3,
            resize: "square",
            selected: true,
        },
        {
            name: "DigitalClock",
            x: 3,
            y: 0,
            width: 3,
            height: 3,
            resize: "square",
            selected: true,
        },
        {
            name: "Stock",
            x: 15,
            y: 6,
            width: 2,
            height: 2,
            resize: "square",
            selected: true,
        },
        {
            name: "WeeklyWeatherForecast",
            x: 7,
            y: 0,
            width: 6,
            height: 3,
            resize: "2/1",
            selected: true,
        },
    ];

    if (widgets) {
        try {
            let widgetsJSON = JSON.parse(widgets);

            // Convert widgetsJSON into a Map for quick lookup by name
            const widgetMap = new Map(widgetsJSON.map((widget) => [widget.name, widget]));

            // Ensure all default widgets exist in widgetsJSON
            def.forEach((defaultWidget) => {
                if (!widgetMap.has(defaultWidget.name)) {
                    widgetsJSON.push(defaultWidget);
                }
            });

            return widgetsJSON;
        } catch (e) {
            return def;
        }
    }

    return def;
}

/**
 * Returns the default weather data structure.
 *
 * @returns {{
 *   curr: {img: String, temperature: Number, high: Number, low: Number, city: String, weather: String},
 *   week: Array<{date: String, img: String, high: Number, low: Number}>,
 *   lastUpdated: Date
 * }} An object containing current weather information and a weekly forecast.
 **/
function getWeeklyWeatherInfo() {
    const info = localStorage.getItem("weekly-weather-info");
    const def = {
        curr: {
            img: "",
            temperature: 20,
            high: 25,
            low: 15,
            city: "City",
            weather: "Weather",
        },
        week: [
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
            {date: "", img: "", high: 25, low: 15},
        ],
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
 * Returns the current color scheme.
 *
 * @returns {{
 *   color_primary_text: String,
 *   color_secondary_text: String,
 *   color_tertiary_text: String,
 *   color_primary_background: String,
 *   color_secondary_background: String,
 *   color_tertiary_background: String,
 *   color_border_line: String,
 *}} An object containing current color scheme.
 **/
function getColors() {
    const colors = localStorage.getItem("colors");
    const def = {
        color_primary_text: "#fafafa",
        color_secondary_text: "#c8c8c8",
        color_tertiary_text: "#646464",
        color_primary_background: "#000000",
        color_secondary_background: "#141414",
        color_tertiary_background: "#4b4b4b",
        color_border_line: "#323232",
    };

    let parsed = null;
    if (colors) {
        try {
            parsed = JSON.parse(colors);
        } catch (e) {
            return def;
        }
        return parsed;
    }

    return def;
}

/**
 * Returns the color palette.
 *
 * @returns {{theme: String, color: String}} An object containing color palette.
 **/
function getColorPalette() {
    const palette = localStorage.getItem("color-palette");
    const def = {
        theme: "dark",
        color: "green",
    };

    let parsed = null;
    if (palette) {
        try {
            parsed = JSON.parse(palette);
        } catch (e) {
            return def;
        }
        return parsed;
    }

    return def;
}

/**
 * Return user styles from localStorage
 * @returns {Array}
 */
function getUserStyles() {
    const styles = localStorage.getItem("user-styles");
    if (styles) {
        try {
            return JSON.parse(styles);
        } catch (e) {
            return [];
        }
    }
    return [];
}

/**
 * Return predefined styles hardcoded in the app
 * @returns {Array}
 */
function getPredefinedStyles() {
    return [
        {
            id: "default-dark",
            name: "Default Dark",
            settings: {
                backgroundImage: null,
                backgroundImageFileName: null,
                backgroundSize: "Cover",
                searchEngine: "Google",
                openSearchResultIn: "New Tab",
                widgetBackground: "Color",
                widgetAreaColumns: 20,
                colors: {
                    color_primary_text: "#fafafa",
                    color_secondary_text: "#c8c8c8",
                    color_tertiary_text: "#646464",
                    color_primary_background: "#000000",
                    color_secondary_background: "#141414",
                    color_tertiary_background: "#4b4b4b",
                    color_border_line: "#323232",
                },
                colorPalette: {
                    theme: "dark",
                    color: "default",
                },
            },
        },
    ];
}
