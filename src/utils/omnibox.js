import {getItem, setItem} from "./db";

/**
 * Search engines supported by the search bar, engine name -> query URL prefix.
 */
export const SEARCH_ENGINES = new Map([
    ["Google", "https://www.google.com/search?q="],
    ["Bing", "https://www.bing.com/search?q="],
    ["DuckDuckGo", "https://duckduckgo.com/?q="],
    ["Yahoo", "https://search.yahoo.com/search?p="],
    ["Ecosia", "https://www.ecosia.org/search?q="],
    ["Yandex", "https://yandex.com/search/?text="],
    ["Startpage", "https://www.startpage.com/do/dsearch?query="],
    ["Swisscows", "https://swisscows.com/web?query="],
]);

// Common file extensions that look like a host TLD but almost never are one.
// Only consulted when the input has no path ("node.exe", not "node.exe/download").
const FILE_EXTENSION_LIKE_TLDS = new Set([
    "exe", "msi", "dmg", "apk", "zip", "rar", "7z", "tar", "gz", "iso",
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
    "jpg", "jpeg", "png", "gif", "webp", "svg", "mp3", "mp4", "avi", "wav",
    "bat", "sh", "dll", "bin",
]);

/**
 * Returns true when the string parses as an absolute URL.
 * @param {String} s
 * @returns {Boolean}
 */
export function isValidUrl(s) {
    try {
        new URL(s);
        return true;
    } catch {
        return false;
    }
}

/**
 * Heuristic URL detection for the search bar, close to what browsers do:
 * explicit scheme, localhost or an IP are URLs; otherwise a dot-separated
 * host whose last label is alphabetic (>= 2 chars) and not a file extension.
 * "3.14", "node.exe" and anything with spaces are searches.
 * @param {String} input
 * @returns {Boolean}
 */
export function isUrl(input) {
    const s = input.trim();
    if (!s || /\s/.test(s)) return false;

    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return isValidUrl(s);
    if (/^localhost(:\d+)?(\/.*)?$/i.test(s)) return true;
    if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/.test(s)) return true;

    if (!s.includes(".")) return false;

    // Strip path/query/fragment and port/userinfo before looking at the TLD,
    // so "youtube.com?app=x&hl=tr" classifies as a URL, not a search
    const host = s.split(/[/?#]/)[0].split(":")[0].split("@").pop();
    const tld = host.split(".").pop();
    if (!/^[a-z]{2,}$/i.test(tld)) return false;
    if (!s.includes("/") && FILE_EXTENSION_LIKE_TLDS.has(tld.toLowerCase())) return false;

    return isValidUrl("https://" + s);
}

/**
 * Turns user input into a navigable absolute URL (adds https:// when missing).
 * @param {String} input
 * @returns {String}
 */
export function toNavigableUrl(input) {
    const s = input.trim();
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : "https://" + s;
}

/**
 * Display form of a URL: scheme, leading www. and a bare trailing slash
 * stripped, used for history entries and ghost text so "you" can complete
 * to "tube.com".
 * @param {String} input
 * @returns {String}
 */
export function toDisplayUrl(input) {
    try {
        const u = new URL(toNavigableUrl(input));
        const host = u.hostname.replace(/^www\./, "");
        const path = u.pathname === "/" ? "" : u.pathname;
        return host + path + u.search;
    } catch {
        return input.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
    }
}

/**
 * Canonical key for deduping URLs across history and top sites:
 * lowercase host without www., no trailing slash, keeps path + query.
 * @param {String} url
 * @returns {String}
 */
export function normalizeUrl(url) {
    try {
        const u = new URL(toNavigableUrl(url));
        let host = u.hostname.toLowerCase();
        if (host.startsWith("www.")) host = host.slice(4);
        return host + u.pathname.replace(/\/+$/, "") + u.search;
    } catch {
        return url.toLowerCase();
    }
}

/**
 * Frecency rank of a history entry: how often it was picked (score) decayed by
 * time since last use (half-life of 14 days). Old, rarely-picked entries sink.
 * @param {{score: Number, lastUsed: Number|String|Date}} entry
 * @returns {Number}
 */
export function frecencyRank(entry) {
    const lastUsed = new Date(entry.lastUsed).getTime();
    const ageDays = Math.max(0, (Date.now() - lastUsed) / 86400000);
    return (entry.score || 1) * Math.pow(0.5, ageDays / 14);
}

// topSites are fetched once per new-tab session; [] everywhere the extension
// API is unavailable (website build, dev server).
let topSitesCache = null;

/**
 * @returns {Promise<Array<{url: String, title: String}>>}
 */
export function getTopSites() {
    if (!topSitesCache) {
        if (typeof chrome !== "undefined" && chrome.topSites?.get) {
            topSitesCache = new Promise((resolve) => {
                try {
                    chrome.topSites.get((sites) => resolve(Array.isArray(sites) ? sites : []));
                } catch {
                    resolve([]);
                }
            });
        } else {
            topSitesCache = Promise.resolve([]);
        }
    }
    return topSitesCache;
}

// Session cache of favicon object URLs, hostname -> blob URL (or null when the
// fetch failed). Shares the IndexedDB cache ("favicon-<hostname>") with QuickLinks.
const faviconUrlCache = new Map();

/**
 * @param {String} hostname
 * @returns {Promise<String|null>} object URL of the favicon, or null
 */
export async function getFaviconUrl(hostname) {
    if (!hostname) return null;
    if (faviconUrlCache.has(hostname)) return faviconUrlCache.get(hostname);

    let url = null;
    try {
        let blob = await getItem(`favicon-${hostname}`);
        if (!blob) {
            const response = await fetch(`https://cool-tab-api.vercel.app/api/favicon?hostname=${hostname}`);
            blob = await response.blob();
            await setItem(`favicon-${hostname}`, blob);
        }
        if (blob instanceof Blob) {
            url = URL.createObjectURL(blob);
        }
    } catch {
        url = null;
    }

    faviconUrlCache.set(hostname, url);
    return url;
}
