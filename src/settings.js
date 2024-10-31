import {defineStore} from "pinia";

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
            const r = document.querySelector(':root');
            for (const key in colors) {
                if (colors.hasOwnProperty(key)) {
                    r.style.setProperty(`--${key.replaceAll('_', '-')}`, colors[key]);
                }
            }

            storeInLocalStorage("colors", JSON.stringify(colors));
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
            return JSON.parse(widgets);
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
