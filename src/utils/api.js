const isDev = import.meta.env.DEV;

export const YAHOO_QUERY1_BASE = isDev ? "/yahoo-query1" : "https://query1.finance.yahoo.com";
export const YAHOO_QUERY2_BASE = isDev ? "/yahoo-query2" : "https://query2.finance.yahoo.com";

export async function fetchYahoo(url) {
    if (!isDev && typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: 'FETCH_YAHOO', url }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response && response.error) {
                    reject(new Error(response.error));
                } else if (response) {
                    resolve(response.data);
                } else {
                    reject(new Error("No response from background script"));
                }
            });
        });
    } else {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    }
}
