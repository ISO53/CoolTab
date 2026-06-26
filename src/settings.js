import {defineStore} from "pinia";
import pkg from "../package.json";
import {getItem, setItem, removeItem} from "./utils/db";
import {upload} from "@vercel/blob/client";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: null,
        backgroundImageFileName: localStorage.getItem("background-image-file-name") || null,
        backgroundSize: localStorage.getItem("background-size") || "Cover",
        searchEngine: localStorage.getItem("search-engine") || "Google",
        openSearchResultIn: localStorage.getItem("open-search-result-in") || "New Tab",
        currentWeatherInfo: getCurrentWeatherInfo(),
        stock: getStock(),
        quickLinks: getQuickLinks(),
        widgets: getWidgets(),
        widgetAreaColumns: parseInt(localStorage.getItem("widget-area-columns")) || 33,
        weeklyWeatherInfo: getWeeklyWeatherInfo(),
        hourlyWeatherInfo: getHourlyWeatherInfo(),
        widgetBackground: localStorage.getItem("widget-background") || "Color",
        colors: getColors(),
        colorPalette: getColorPalette(),
        currentVersion: pkg && pkg.version ? pkg.version : "0.0.0",
        savedVersion: getSavedVersion(),
        releaseNotes: null,
        showUpdatePopup: false,
        userStyles: getUserStyles(),
        todoItems: getTodoItems(),
        todoMaxTasks: parseInt(localStorage.getItem("todo-max-tasks")) || 25,
        analogClockStyle: localStorage.getItem("analog-clock-style") || "Minimal",
        hourlyWeatherRotation: localStorage.getItem("hourly-weather-rotation") || "Enabled",
        largeStockRange: localStorage.getItem("large-stock-range") || "1D",
        rememberWallpaperPage: localStorage.getItem("remember-wallpaper-page") !== "Disabled",
        location: getLocation(),
    }),
    actions: {
        async setBackgroundImage(image, saveToDb = true) {
            if (this.backgroundImage?.startsWith("blob:")) {
                URL.revokeObjectURL(this.backgroundImage);
            }

            if (image instanceof Blob) {
                const processed = await processImage(image);
                this.backgroundImage = URL.createObjectURL(processed);
                if (saveToDb) {
                    await setItem("background-image", processed);
                }
            } else if (typeof image === "string" && image.trim() !== "") {
                try {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    await this.setBackgroundImage(blob, saveToDb);
                } catch (e) {
                    console.error("Failed to fetch remote background image:", e);
                    this.backgroundImage = null;
                }
            } else {
                this.backgroundImage = null;
                if (saveToDb) {
                    await removeItem("background-image");
                }
            }
        },
        async loadBackgroundImage() {
            try {
                const stored = await getItem("background-image");
                if (stored instanceof Blob) {
                    this.backgroundImage = URL.createObjectURL(stored);
                } else if (typeof stored === "string" && stored.trim() !== "") {
                    this.backgroundImage = stored;
                }
            } catch (e) {
                console.error("Failed to load background image:", e);
            }
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
            if (weather && weather.lastUpdated && typeof weather.lastUpdated === "string") {
                weather.lastUpdated = new Date(weather.lastUpdated);
            }
            this.currentWeatherInfo = weather;
            storeInLocalStorage("weather-info", JSON.stringify(weather));
        },
        setStock(stockInfo) {
            if (stockInfo && stockInfo.lastUpdated && typeof stockInfo.lastUpdated === "string") {
                stockInfo.lastUpdated = new Date(stockInfo.lastUpdated);
            }
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
        setWeeklyWeatherInfo(weather) {
            if (weather && weather.lastUpdated && typeof weather.lastUpdated === "string") {
                weather.lastUpdated = new Date(weather.lastUpdated);
            }
            this.weeklyWeatherInfo = weather;
            storeInLocalStorage("weekly-weather-info", JSON.stringify(weather));
        },
        setHourlyWeatherInfo(weather) {
            if (weather && weather.lastUpdated && typeof weather.lastUpdated === "string") {
                weather.lastUpdated = new Date(weather.lastUpdated);
            }
            this.hourlyWeatherInfo = weather;
            storeInLocalStorage("hourly-weather-info", JSON.stringify(weather));
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
        dismissUpdatePopup() {
            this.setSavedVersion(this.currentVersion);
            this.showUpdatePopup = false;
        },
        async checkVersionOnStart() {
            // Compare savedVersion and currentVersion; if current > saved, show popup
            try {
                const cur = this.currentVersion || "0.0.0";
                const saved = this.savedVersion || "0.0.0";
                if (compareVersions(cur, saved) === 1) {
                    // updated
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

            // If there's a custom background image, save a copy for this style
            const currentImage = this.backgroundImage;
            if (currentImage && currentImage.startsWith("blob:")) {
                fetch(currentImage)
                    .then((r) => r.blob())
                    .then((blob) => {
                        setItem(`style-image-${style.id}`, blob);
                    });
            }

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
                const styleIdToDelete = this.userStyles[index].id;
                this.userStyles.splice(index, 1);
                storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
                removeItem(`style-image-${styleIdToDelete}`);
            }
        },
        async applyStyle(styleId) {
            const styleList = this.userStyles;
            const style = styleList ? styleList.find((t) => t.id === styleId) : null;
            if (style && style.settings) {
                await this.applyStyleSettings(style.settings);

                // Load style-specific background if it exists
                const styleBlob = await getItem(`style-image-${styleId}`);
                if (styleBlob) {
                    await this.setBackgroundImage(styleBlob);
                }
            }
        },
        async importStyleById(styleId) {
            try {
                if (!Array.isArray(this.userStyles)) this.userStyles = [];
                const existing = this.userStyles.find(s => s._id === styleId);
                if (existing) {
                    return {success: true, style: existing};
                }

                const response = await fetch(`https://cool-tab-api.vercel.app/api/get-style?id=${styleId}`);
                if (response.ok) {
                    const style = await response.json();
                    if (style && style.settings) {
                        const importedStyle = {
                            ...style,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString(),
                        };

                        this.userStyles.push(importedStyle);
                        storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
                        return {success: true, style: importedStyle};
                    }
                }
                return {success: false, error: "Style not found or invalid format"};
            } catch (e) {
                console.error("Error importing style:", e);
                return {success: false, error: e.message};
            }
        },
        async shareUserStyle(styleName) {
            try {
                const snapshot = this.getStyleSnapshot();

                // Always handle background image upload if it exists
                if (this.backgroundImage) {
                    try {
                        const response = await fetch(this.backgroundImage);
                        const blob = await response.blob();

                        // Upload to Vercel Blob
                        const newBlob = await upload(this.backgroundImageFileName || "background.jpg", blob, {
                            access: "public",
                            handleUploadUrl: "https://cool-tab-api.vercel.app/api/upload-image",
                        });

                        snapshot.backgroundImage = newBlob.url;
                    } catch (uploadError) {
                        console.error("Failed to upload background image to Vercel Blob:", uploadError);
                        // If upload fails, snapshot.backgroundImage remains as is from getStyleSnapshot()
                        // which might be a remote URL or null.
                    }
                }

                const styleData = {
                    name: styleName,
                    settings: snapshot,
                };

                const response = await fetch("https://cool-tab-api.vercel.app/api/set-style", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(styleData),
                });

                if (response.ok) {
                    return {success: true};
                }

                // Check for rate limit error
                if (response.status === 429) {
                    return {success: false, error: "Rate limit exceeded", isRateLimit: true};
                }

                return {success: false, error: "Failed to share style"};
            } catch (e) {
                console.error("Error sharing style:", e);
                return {success: false, error: e.message};
            }
        },
        setTodoItems(items) {
            this.todoItems = items;
            storeInLocalStorage("todo-items", JSON.stringify(items));
        },
        setTodoMaxTasks(max) {
            this.todoMaxTasks = max;
            storeInLocalStorage("todo-max-tasks", max);
        },
        setAnalogClockStyle(style) {
            this.analogClockStyle = style;
            storeInLocalStorage("analog-clock-style", style);
        },
        setHourlyWeatherRotation(rotation) {
            this.hourlyWeatherRotation = rotation;
            storeInLocalStorage("hourly-weather-rotation", rotation);
        },
        setLargeStockRange(range) {
            this.largeStockRange = range;
            storeInLocalStorage("large-stock-range", range);
        },
        setRememberWallpaperPage(choice) {
            this.rememberWallpaperPage = choice === "Enabled";
            storeInLocalStorage("remember-wallpaper-page", choice);
        },
        setLocation(location) {
            if (location && location.lastUpdated && typeof location.lastUpdated === "string") {
                location.lastUpdated = new Date(location.lastUpdated);
            }
            this.location = location;
            storeInLocalStorage("location", JSON.stringify(location));
		},
		setSavedVersion(version) {
		    this.savedVersion = version;
		    storeInLocalStorage("saved-version", version);
		},
		getStyleSnapshot() {
		    return {
		        backgroundImage:
		            this.backgroundImage && this.backgroundImage.startsWith("blob:") ? null : this.backgroundImage,
		        backgroundImageFileName: this.backgroundImageFileName,
		        backgroundSize: this.backgroundSize,
		        widgetBackground: this.widgetBackground,
		        colors: JSON.parse(JSON.stringify(this.colors)),
		        colorPalette: JSON.parse(JSON.stringify(this.colorPalette)),
		        widgets: JSON.parse(JSON.stringify(this.widgets)),
		        widgetAreaColumns: this.widgetAreaColumns,
		        analogClockStyle: this.analogClockStyle,
		    };
		},
		async applyStyleSettings(settings) {
		    if (settings.backgroundImage !== undefined) {
		        await this.setBackgroundImage(settings.backgroundImage);
		    }
		    if (settings.backgroundImageFileName !== undefined)
		        this.setBackgroundImageFileName(settings.backgroundImageFileName);
		    if (settings.backgroundSize !== undefined) this.setBackgroundSize(settings.backgroundSize);
		    // We no longer override searchEngine, openSearchResultIn, quickLinks, stock, todoMaxTasks,
		    // hourlyWeatherRotation, todoItems, hourlyWeatherInfo, weeklyWeatherInfo and currentWeatherInfo from styles
		    if (settings.widgetBackground !== undefined) this.setWidgetBackground(settings.widgetBackground);
		    if (settings.colors !== undefined) this.setColors(settings.colors);
		    if (settings.colorPalette !== undefined) this.setColorPalette(settings.colorPalette);
		    if (settings.widgets !== undefined) this.setWidgets(settings.widgets);
		    if (settings.widgetAreaColumns !== undefined) this.setWidgetAreaColumns(settings.widgetAreaColumns);
		    if (settings.analogClockStyle !== undefined) this.setAnalogClockStyle(settings.analogClockStyle);
		}
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
            {
                ticker: "",
                open: "",
                close: "",
                diff: 0,
            },
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
        open_link_in: "New Tab",
    };

    if (quickLinks) {
        try {
            const parsed = JSON.parse(quickLinks);
            delete parsed.images; // Cleanup legacy data
            return parsed;
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
			x: 17,
			y: 7,
			width: 7,
			height: 1,
			resize: "horizontal",
			selected: true,
		},
		{
			name: "QuickLinks",
			x: 0,
			y: 13,
			width: 8,
			height: 1,
			resize: "horizontal",
			selected: true,
		},
		{
			name: "Calendar",
			x: 29,
			y: 0,
			width: 4,
			height: 4,
			resize: "square",
			selected: true,
		},
		{
			name: "MonthlyCalendar",
			x: 29,
			y: 10,
			width: 4,
			height: 4,
			resize: "square",
			selected: true,
		},
		{
			name: "AnalogClock",
			x: 9,
			y: 7,
			width: 7,
			height: 7,
			resize: "square",
			selected: true,
		},
		{
			name: "DailyWeatherForecast",
			x: 29,
			y: 5,
			width: 4,
			height: 4,
			resize: "square",
			selected: true,
		},
		{
			name: "DigitalClock",
			x: 24,
			y: 0,
			width: 4,
			height: 4,
			resize: "square",
			selected: true,
		},
		{
			name: "Stock",
			x: 25,
			y: 5,
			width: 3,
			height: 3,
			resize: "square",
			selected: true,
		},
		{
			name: "WeeklyWeatherForecast",
			x: 0,
			y: 8,
			width: 8,
			height: 4,
			resize: "2/1",
			selected: true,
		},
		{
			name: "HourlyWeatherForecast",
			x: 17,
			y: 9,
			width: 10,
			height: 5,
			resize: "2/1",
			selected: true,
		},
		{
			name: "TodoList",
			x: 8,
			y: 0,
			width: 3,
			height: 6,
			resize: "1/2",
			selected: true,
		},
		{
			name: "LargeStock",
			x: 12,
			y: 0,
			width: 11,
			height: 6,
			resize: "2/1",
			selected: true,
		},
		{
			name: "Location",
			x: 0,
			y: 0,
			width: 7,
			height: 7,
			resize: "square",
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
 * Returns the default hourly weather data structure.
 *
 * @returns {{
 *   city: String,
 *   hours: Array<{time: String, temp: Number, rain: Number, wind: Number}>,
 *   air_quality: {aqi: Number, label: String},
 *   lastUpdated: Date
 * }}
 **/
function getHourlyWeatherInfo() {
    const info = localStorage.getItem("hourly-weather-info");
    const def = {
        city: "City",
        hours: [
            { time: "00:00", temp: 20, rain: 0, wind: 10 },
            { time: "01:00", temp: 20, rain: 0, wind: 10 },
            { time: "02:00", temp: 20, rain: 0, wind: 10 },
            { time: "03:00", temp: 20, rain: 0, wind: 10 },
            { time: "04:00", temp: 20, rain: 0, wind: 10 },
            { time: "05:00", temp: 20, rain: 0, wind: 10 },
            { time: "06:00", temp: 20, rain: 0, wind: 10 },
            { time: "07:00", temp: 20, rain: 0, wind: 10 },
        ],
        air_quality: { aqi: 0, label: "Good" },
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
        theme: "Dark",
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
 * Return todo items from localStorage
 * @returns {Array}
 */
function getTodoItems() {
    const items = localStorage.getItem("todo-items");
    if (items) {
        try {
            return JSON.parse(items);
        } catch (e) {
            return [];
        }
    }
    return [];
}

/**
 * @returns {{ip: String, city: String, lat: Number, lon: Number, lastUpdated: Date}}
 */
function getLocation() {
    const info = localStorage.getItem("location");
    const def = {
        ip: "",
        city: "",
        lat: 20,
        lon: 20,
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
 * Scales an image down to fit the screen resolution if it is larger; otherwise, keeps the original.
 * @param {File} file - The image file to process.
 * @returns {Promise<Blob|File>} Resolves to a compressed JPEG Blob if resized, or the original File.
 */
function processImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const screenWidth = window.screen.width * window.devicePixelRatio;
            const screenHeight = window.screen.height * window.devicePixelRatio;

            let width = img.width;
            let height = img.height;

            // Only scale down if image is larger than screen resolution
            if (width > screenWidth || height > screenHeight) {
                const ratio = Math.min(screenWidth / width, screenHeight / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Use high quality since we are in IndexedDB now
                canvas.toBlob(
                    (blob) => {
                        resolve(blob || file);
                    },
                    "image/jpeg",
                    0.95,
                );
            } else {
                // Image is smaller than screen, keep original
                resolve(file);
            }
        };
        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
    });
}
