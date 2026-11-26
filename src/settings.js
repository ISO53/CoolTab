import {defineStore} from "pinia";
import pkg from "../package.json";
import {getItem, setItem, removeItem} from "./utils/db";
import {upload} from "@vercel/blob/client";
import {normalizeUrl, frecencyRank} from "./utils/omnibox";

export const useSettingsStore = defineStore("settings", {
    state: () => ({
        backgroundImage: null,
        backgroundImageFileName: localStorage.getItem("background-image-file-name") || null,
        backgroundSize: localStorage.getItem("background-size") || "Cover",
        searchEngine: localStorage.getItem("search-engine") || "Google",
        openSearchResultIn: localStorage.getItem("open-search-result-in") || "New Tab",
        searchSuggestions: localStorage.getItem("search-suggestions") !== "Disabled",
        searchHistory: getSearchHistory(),
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
        currentVersion: pkg?.version ? pkg.version : "0.0.0",
        savedVersion: getSavedVersion(),
        releaseNotes: null,
        showUpdatePopup: false,
        userStyles: getUserStyles(),
        todoItems: getTodoItems(),
        todoMaxTasks: parseInt(localStorage.getItem("todo-max-tasks")) || 25,
        analogClockStyle: localStorage.getItem("analog-clock-style") || "Minimal",
        hourlyWeatherRotation: localStorage.getItem("hourly-weather-rotation") || "Enabled",
        largeStockRange: localStorage.getItem("large-stock-range") || "1D",
        dailyWallpapers: localStorage.getItem("daily-wallpapers") || "Disabled",
        wallpaperColors: localStorage.getItem("wallpaper-colors") || "Follow wallpaper",
        dailyWallpaper: getDailyWallpaper(),
		location: getLocation(),
		onboarding: localStorage.getItem("onboarding") || "Enabled",
		timeFormat: localStorage.getItem("time-format") || getDefaultTimeFormat(),
		temperatureUnit: localStorage.getItem("temperature-unit") || "Celsius",
		rainUnit: localStorage.getItem("rain-unit") || "mm",
		windUnit: localStorage.getItem("wind-unit") || "kmh",
    }),
    actions: {
        async setBackgroundImage(image, saveToDb = true) {
            // Setting a background manually is a takeover: it turns the daily
            // rotation off (the daily wallpaper never flows through here —
            // it renders straight from its CDN URL per Unsplash guidelines).
            this.setDailyWallpapers("Disabled");
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
        setSearchSuggestions(choice) {
            this.searchSuggestions = choice === "Enabled";
            storeInLocalStorage("search-suggestions", choice);
        },
        setSearchHistory(items) {
            this.searchHistory = items;
            storeInLocalStorage("search-history", JSON.stringify(items));
        },
        clearSearchHistory() {
            this.setSearchHistory([]);
        },
        /**
         * Removes a single history entry, matched the same way
         * recordSearchPick dedupes: URL entries by normalized URL,
         * search entries by case-insensitive text.
         * @param {{type: String, text: String, url: String|null}} entry
         */
        removeSearchHistoryEntry(entry) {
            const list = this.searchHistory.filter((e) => {
                if (entry.type === "url") {
                    return !(e.type === "url" && normalizeUrl(e.url) === normalizeUrl(entry.url));
                }
                return !(e.type === "search" && e.text.toLowerCase() === entry.text.toLowerCase());
            });
            this.setSearchHistory(list);
        },
        /**
         * Boosts (or creates) a history entry after the user submitted or
         * picked it, so the suggestion list self-tunes per user. Short inputs
         * and recording while suggestions are disabled are skipped.
         * @param {{type: String, text: String, url: String|null}} entry
         */
        recordSearchPick(entry) {
            if (!this.searchSuggestions) return;

            const text = entry.text?.trim();
            if (!text || text.length < 3) return;

            const list = [...this.searchHistory];
            const now = Date.now();
            const index = list.findIndex((e) =>
                entry.type === "url"
                    ? e.type === "url" && normalizeUrl(e.url) === normalizeUrl(entry.url)
                    : e.type === "search" && e.text.toLowerCase() === text.toLowerCase()
            );

            if (index !== -1) {
                list[index].score = (list[index].score || 1) * 0.7 + 1;
                list[index].lastUsed = now;
                list[index].text = text;
                if (entry.url) list[index].url = entry.url;
            } else {
                list.push({type: entry.type, text: text, url: entry.url || null, score: 1, lastUsed: now});
            }

            // Evict lowest-ranked (decayed) entries past the cap
            const max_search_history = 200;
            if (list.length > max_search_history) {
                list.sort((a, b) => frecencyRank(a) - frecencyRank(b));
                list.splice(0, list.length - max_search_history);
            }

            this.setSearchHistory(list);
        },
        setCurrentWeatherInfo(weather) {
            if (weather?.lastUpdated && typeof weather.lastUpdated === "string") {
                weather.lastUpdated = new Date(weather.lastUpdated);
            }
            this.currentWeatherInfo = weather;
            storeInLocalStorage("weather-info", JSON.stringify(weather));
        },
        setStock(stockInfo) {
            if (stockInfo?.lastUpdated && typeof stockInfo.lastUpdated === "string") {
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
            if (weather?.lastUpdated && typeof weather.lastUpdated === "string") {
                weather.lastUpdated = new Date(weather.lastUpdated);
            }
            this.weeklyWeatherInfo = weather;
            storeInLocalStorage("weekly-weather-info", JSON.stringify(weather));
        },
        setHourlyWeatherInfo(weather) {
            if (weather?.lastUpdated && typeof weather.lastUpdated === "string") {
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
                if (Object.hasOwn(colors, key)) {
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
            } catch {
                // ignore errors; don't block startup
            }
        },
        async createStyle(name) {
            // Capture a preview screenshot of the current design using snapdom
            const {captureCurrentDesign} = await import("@/utils/stylePreview");
            const previewBlob = await captureCurrentDesign();

            const style = {
                id: Date.now().toString(),
                name: name,
                createdAt: new Date().toISOString(),
                settings: this.getStyleSnapshot(),
            };

            if (previewBlob) {
                style.hasPreview = true;
                await setItem(`style-preview-${style.id}`, previewBlob);
            }

            // If there's a custom background image, save a copy for this style
            const currentImage = this.backgroundImage;
            if (currentImage?.startsWith("blob:")) {
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
        setStylePreview(styleId, blob = null) {
            const style = this.userStyles?.find((t) => t.id === styleId);
            if (!style) return;
            if (blob) {
                setItem(`style-preview-${styleId}`, blob);
            }
            if (!style.hasPreview) {
                style.hasPreview = true;
                storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
            }
        },
        async generateStylePreview(styleId) {
            const style = this.userStyles?.find((t) => t.id === styleId);
            if (!style || style.hasPreview) return;
            try {
                // A blob may already exist from a run that failed before the flag was persisted
                const existing = await getItem(`style-preview-${styleId}`);
                if (existing) {
                    this.setStylePreview(styleId);
                    return;
                }

                const {renderStylePreview} = await import("@/utils/stylePreview");
                const blob = await renderStylePreview(style);
                if (blob) {
                    this.setStylePreview(styleId, blob);
                }
            } catch (e) {
                console.error("Failed to generate style preview:", e);
            }
        },
        deleteStyle(styleId) {
            // Only allow deleting user styles
            const index = this.userStyles ? this.userStyles.findIndex((t) => t.id === styleId) : -1;
            if (index !== -1) {
                const styleIdToDelete = this.userStyles[index].id;
                this.userStyles.splice(index, 1);
                storeInLocalStorage("user-styles", JSON.stringify(this.userStyles));
                removeItem(`style-image-${styleIdToDelete}`);
                removeItem(`style-preview-${styleIdToDelete}`);
            }
        },
        async applyStyle(styleId) {
            const styleList = this.userStyles;
            const style = styleList ? styleList.find((t) => t.id === styleId) : null;
            if (style?.settings) {
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
                    if (style?.settings) {
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
        async shareUserStyle(styleName, style = null) {
            try {
                // Without a style argument the current design is shared; with one,
                // the saved style's own snapshot and wallpaper are shared instead.
                const snapshot = style ? JSON.parse(JSON.stringify(style.settings)) : this.getStyleSnapshot();

                let blob = null;
                let fileName = "background.jpg";
                if (style) {
                    fileName = style.settings.backgroundImageFileName || fileName;
                    // The style's wallpaper copy lives in IndexedDB; fall back to its remote URL
                    blob = await getItem(`style-image-${style.id}`);
                    if (!blob && typeof style.settings.backgroundImage === "string" && style.settings.backgroundImage.trim()) {
                        blob = await (await fetch(style.settings.backgroundImage)).blob();
                    }
                } else if (this.backgroundImage) {
                    blob = await (await fetch(this.backgroundImage)).blob();
                    fileName = this.backgroundImageFileName || fileName;
                }

                if (blob) {
                    // Upload to Vercel Blob
                    const newBlob = await upload(fileName, blob, {
                        access: "public",
                        handleUploadUrl: "https://cool-tab-api.vercel.app/api/upload-image",
                    });
                    snapshot.backgroundImage = newBlob.url;
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
        setDailyWallpapers(choice) {
            this.dailyWallpapers = choice;
            storeInLocalStorage("daily-wallpapers", choice);
        },
        setWallpaperColors(choice) {
            this.wallpaperColors = choice;
            storeInLocalStorage("wallpaper-colors", choice);
        },
        setDailyWallpaper(photo) {
            this.dailyWallpaper = photo;
            storeInLocalStorage("daily-wallpaper", photo ? JSON.stringify(photo) : null);
        },
        setLocation(location) {
            if (location?.lastUpdated && typeof location.lastUpdated === "string") {
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
		        backgroundImage: this.backgroundImage?.startsWith("blob:") ? null : this.backgroundImage,
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
			// Applying a style is a manual design takeover, same as uploading
			// an image: the daily rotation hands control back to the user.
			this.setDailyWallpapers("Disabled");
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
		},
		setOnboarding(onboarding) {
			this.onboarding = onboarding;
			storeInLocalStorage("onboarding", onboarding);
		},
		setTimeFormat(format) {
			this.timeFormat = format;
			storeInLocalStorage("time-format", format);
		},
		setTemperatureUnit(unit) {
			this.temperatureUnit = unit;
			storeInLocalStorage("temperature-unit", unit);
		},
		setRainUnit(unit) {
			this.rainUnit = unit;
			storeInLocalStorage("rain-unit", unit);
		},
		setWindUnit(unit) {
			this.windUnit = unit;
			storeInLocalStorage("wind-unit", unit);
		},
    },
});

/**
 * Returns the default time format based on the user's locale
 * @returns {String} "12h" or "24h"
 */
function getDefaultTimeFormat() {
	const options = new Intl.DateTimeFormat(navigator.language, {
		hour: "numeric",
	}).resolvedOptions();

	// hourCycle: 'h11' or 'h12' → 12-hour; 'h23' or 'h24' → 24-hour
	return options.hourCycle === "h11" || options.hourCycle === "h12" ? "12h" : "24h";
};

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
 * @returns {{sunrise_epoch: Number|String, sunset_epoch: Number|String, temperature: String, country: String, city: String, lastUpdated: Date}}
 */
function getDefaultCurrentWeatherInfo() {
    return {
        sunrise_epoch: "",
        sunset_epoch: "",
        temperature: "",
        country: "",
        city: "",
        lastUpdated: null,
    };
}

/**
 * @returns {{sunrise_epoch: Number|String, sunset_epoch: Number|String, temperature: String, country: String, city: String, lastUpdated: Date}}
 */
function getCurrentWeatherInfo() {
    const info = localStorage.getItem("weather-info");
    const def = getDefaultCurrentWeatherInfo();

    let parsed = null;
    if (info) {
        try {
            parsed = JSON.parse(info);
        } catch {
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
        } catch {
            return def;
        }
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        return parsed;
    }

    return def;
}

/**
 * @returns {{orientation: String, open_link_in: String}}
 */
function getQuickLinks() {
    const quickLinks = localStorage.getItem("quick-links");
    const def = {
        orientation: "Horizontal",
        open_link_in: "New Tab",
    };

    if (quickLinks) {
        try {
            const parsed = JSON.parse(quickLinks);
            delete parsed.images; // Cleanup legacy data
            delete parsed.links; // Links were replaced by topSites
            return parsed;
        } catch {
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
            const widgetsJSON = JSON.parse(widgets);

            // Convert widgetsJSON into a Map for quick lookup by name
            const widgetMap = new Map(widgetsJSON.map((widget) => [widget.name, widget]));

            // Ensure all default widgets exist in widgetsJSON
            def.forEach((defaultWidget) => {
                if (!widgetMap.has(defaultWidget.name)) {
                    widgetsJSON.push({...defaultWidget, selected: false});
                }
            });

            return widgetsJSON;
        } catch {
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
 *   week: Array<{date: String, img: String, high_c: Number, low_c: Number, high_f: Number, low_f: Number}>,
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
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
            {date: "", img: "", high_c: 25, low_c: 15, high_f: 77, low_f: 59},
        ],
    };

    let parsed = null;
    if (info) {
        try {
            parsed = JSON.parse(info);
        } catch {
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
 *   hours: Array<{time_epoch: Number, temp_c: Number, temp_f: Number, rain_mm: Number, rain_inch: Number, wind_kmh: Number, wind_mph: Number}>,
 *   air_quality: {aqi: Number, label: String},
 *   lastUpdated: Date
 * }}
 **/
function getHourlyWeatherInfo() {
    const info = localStorage.getItem("hourly-weather-info");
    const def = {
        city: "City",
        hours: [
            { time_epoch: 1784640256000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784636656000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784633056000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784629456000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784625856000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784622256000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784618656000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
            { time_epoch: 1784615056000, temp_c: 20, temp_f: 68, rain_mm: 0, rain_inch: 0, wind_kph: 10, wind_mph: 6 },
        ],
        air_quality: { aqi: 0, label: "Good" },
    };

    let parsed = null;
    if (info) {
        try {
            parsed = JSON.parse(info);
        } catch {
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
        } catch {
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
        } catch {
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
        } catch {
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
        } catch {
            return [];
        }
    }
    return [];
}

/**
 * Return search history entries from localStorage
 * @returns {Array<{type: String, text: String, url: String|null, score: Number, lastUsed: Number}>}
 */
function getSearchHistory() {
    const items = localStorage.getItem("search-history");
    if (items) {
        try {
            return JSON.parse(items);
        } catch {
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
        } catch {
            return def;
        }
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        return parsed;
    }

    return def;
}

/**
 * Return the applied daily wallpaper (or null) from localStorage.
 * @returns {{id: String, url: String, date: String, credit: Object}|null}
 */
function getDailyWallpaper() {
    const photo = localStorage.getItem("daily-wallpaper");
    if (photo) {
        try {
            return JSON.parse(photo);
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Scales an image down to fit the screen resolution if it is larger; otherwise, keeps the original.
 * @param {File} file - The image file to process.
 * @returns {Promise<Blob|File>} Resolves to a compressed JPEG Blob if resized, or the original File.
 */
function processImage(file) {
    return new Promise((resolve) => {
        // Never re-encode GIFs: the canvas resize flattens animation to a static frame
        if (file.type === "image/gif") {
            resolve(file);
            return;
        }
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
