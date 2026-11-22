import {getItem, setItem} from "./db";

// Session cache of favicon resolutions, hostname -> Promise<String|null>.
// A resolved null means "no favicon could be resolved".
const faviconCache = new Map();

// Whether the browser exposes the chrome-extension://_favicon/ endpoint.
// Chrome 104+ with the "favicon" permission declared in the manifest; Firefox
// and the dev/website build (no chrome APIs) fall through to the remote API.
function browserFaviconSupported() {
    try {
        return typeof chrome !== "undefined" &&
            chrome.runtime?.getManifest?.().permissions?.includes("favicon");
    } catch {
        return false;
    }
}

// A failed load means the endpoint is unavailable (wrong build, missing
// permission); a missing icon would still resolve to the browser's default.
function probeImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = src;
    });
}

/**
 * Resolves a favicon for a page URL from a single place: the browser's own
 * favicon database when available, otherwise the shared IndexedDB cache and
 * finally the CoolTab API.
 *
 * @param {String} url full page URL
 * @returns {Promise<String|null>} src usable in an <img> (chrome-extension://
 *     or blob: URL), or null when nothing could be resolved
 */
export function getFavicon(url) {
    let hostname;
    try {
        hostname = new URL(url).hostname;
    } catch {
        return Promise.resolve(null);
    }
    if (!hostname) return Promise.resolve(null);

    if (faviconCache.has(hostname)) return faviconCache.get(hostname);

    const promise = resolveFavicon(url, hostname).catch(() => null);
    faviconCache.set(hostname, promise);
    return promise;
}

async function resolveFavicon(url, hostname) {
    // 1. Browser favicon database. Top sites are visited URLs, so their icons
    //    live in the local profile; nothing leaves the machine.
    if (browserFaviconSupported()) {
        const src = `chrome-extension://_favicon/?pageUrl=${encodeURIComponent(url)}&size=64`;
        if (await probeImage(src)) {
            return src;
        }
    }

    // 2. Blob cached by a previous API fetch.
    let blob = await getItem(`favicon-${hostname}`);
    if (!blob) {
        // 3. CoolTab API, cached for future loads.
        const response = await fetch(`https://cool-tab-api.vercel.app/api/favicon?hostname=${hostname}`);
        blob = await response.blob();
        await setItem(`favicon-${hostname}`, blob);
    }
    return blob instanceof Blob ? URL.createObjectURL(blob) : null;
}
