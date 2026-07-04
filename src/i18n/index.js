import { useSettingsStore } from "@/settings";
// Dynamically import all translation JSON files inside this folder
const modules = import.meta.glob("./*.json", { eager: true });
const languages = {};

for (const path in modules) {
    const key = path.replace(/^\.\/|\.json$/g, ""); // extract filename, e.g. "./en.json" -> "en"
    languages[key] = modules[path].default || modules[path];
}

export const availableLanguages = Object.keys(languages);

export function translate(key, params) {
    let store;
    try {
        store = useSettingsStore();
    } catch (e) {
        // Fallback if Pinia is not yet active or in this context
    }

    const locale = store ? (store.language || "en") : "en";
    const translations = languages[locale] || languages.en;

    // resolve nested keys, e.g. "settings.title"
    let value = key.split('.').reduce((acc, part) => acc && acc[part], translations);

    // fallback to English translation if key not found in chosen locale
    if (value === undefined && locale !== "en") {
        value = key.split('.').reduce((acc, part) => acc && acc[part], languages.en);
    }

    // fallback to key if not found at all
    if (value === undefined) {
        return key;
    }

    // parameter interpolation
    if (params && typeof params === 'object') {
        let result = value;
        Object.keys(params).forEach(param => {
            result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });
        return result;
    }

    return value;
}

export const i18nPlugin = {
    install(app) {
        app.config.globalProperties.$t = function(key, params) {
            return translate(key, params);
        };
        app.config.globalProperties.$tData = function(category, value) {
            if (!value) return "";
            const key = `${category}.${value}`;
            const translated = translate(key);
            return translated !== key ? translated : value;
        };
    }
};
