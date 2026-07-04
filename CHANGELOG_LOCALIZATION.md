# Walkthrough - Custom i18n Localization & Enhancements

This document summarizes all modifications, additions, and styling fixes introduced in this iteration compared to the original codebase.

---

## 1. New Files Added

| File Path | Description |
| :--- | :--- |
| **[src/i18n/index.js](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/i18n/index.js)** | The core reactive i18n localization engine. Dynamically loads files, interpolates parameters, translates dynamic API coordinates, and provides fallback values. |
| **[src/i18n/en.json](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/i18n/en.json)** | Standard translation dictionary for English labels, widgets, onboarding tour steps, and options. Features detailed developer metadata comments (`_comment` keys) describing the UI context of each translation group to assist future GitHub translators. |
| **[src/i18n/ru.json](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/i18n/ru.json)** | Standard translation dictionary for Russian labels, widgets, onboarding tour steps, and options. |
| **[src/assets/fonts/Inter-Cyrillic-Regular.woff2](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/fonts/Inter-Cyrillic-Regular.woff2)** | Inter Cyrillic Regular font file to support beautiful Cyrillic typography without system font fallbacks. |
| **[src/assets/fonts/Inter-Cyrillic-Light.woff2](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/fonts/Inter-Cyrillic-Light.woff2)** | Inter Cyrillic Light font file. |
| **[src/assets/fonts/Inter-Cyrillic-Medium.woff2](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/fonts/Inter-Cyrillic-Medium.woff2)** | Inter Cyrillic Medium font file. |
| **[src/assets/fonts/Inter-Cyrillic-Bold.woff2](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/fonts/Inter-Cyrillic-Bold.woff2)** | Inter Cyrillic Bold font file. |
| **[src/assets/fonts/Inter-Cyrillic-Black.woff2](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/fonts/Inter-Cyrillic-Black.woff2)** | Inter Cyrillic Black font file. |

---

## 2. Modified Files & Key Code Modifications

### 2.1 Core Setup
* **[src/main.js](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/main.js)**:
  * Registered the custom `i18nPlugin` onto the Vue app instance to expose `$t` and `$tData` globally inside templates.
* **[src/App.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/App.vue)**:
  * Bound a dynamic scroll mode CSS class onto the root layout wrapper (e.g. `.scroll-mode-always`, `.scroll-mode-hover`) linked to Pinia settings.

### 2.2 Styles & Fonts
* **[src/assets/base.css](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/base.css)**:
  * Appended global marquee scroll class selectors (`.scroll-mode-always .is-overflowing .marquee-text` and `.scroll-mode-hover .is-overflowing:hover .marquee-text`) and `@keyframes marquee-scroll` to resolve Vue scoped CSS compilation issues and keep animations consistent across widgets.
* **[src/assets/satoshi.css](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/assets/satoshi.css)**:
  * Declared `@font-face` blocks for the Cyrillic subset of `Inter` targeting character ranges `U+0400-04FF, U+0500-052F`. Latin text continues rendering in original `Satoshi`, while Cyrillic text displays seamlessly in `Inter` under the same font names, keeping layout metrics aligned.

### 2.3 Settings & State Management
* **[src/settings.js](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/settings.js)**:
  * Added `language` state (defaulting to `"en"`) and its action `setLanguage`.
  * Added `scrollMode` state (options: `Disabled`, `Hover`, `Always`, defaulting to `"Hover"`) and action `setScrollMode`.
  * Added `customSearchEngineUrl` state and action `setCustomSearchEngineUrl`.
* **[src/components/ui/Settings.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/ui/Settings.vue)**:
  * Integrated language selection select buttons (which dynamically load all JSON locales scanned from the folder at build time).
  * Added custom search engine option `"Custom"` (translated as `"Своя"` in Russian) and input field for entering a custom search query template.
  * Added the scroll mode selector.
  * Localized all sidebar sections, wallpaper presets, labels, release logs, and titles.

### 2.4 Layout & Widget Updates
* **[src/components/ui/SelectButton.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/ui/SelectButton.vue)**:
  * Converted the container layout from a flex-row to a **2-column CSS Grid** (`grid-template-columns: repeat(2, 1fr)` and `min-height: 43px; height: auto`). This allows the dynamic language selection buttons to stack onto multiple rows cleanly as languages are added without compressing text.
  * Added `flex-shrink: 0` to `.marquee-text` to prevent parent layouts from squeezing overflowing option text.
  * Added a `ResizeObserver` listener to recalculate overflows when hidden configurations transition open.
* **[src/components/widgets/TodoList.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/widgets/TodoList.vue)**:
  * Added a `ResizeObserver` listener targeting widget width.
  * **Dynamic Placeholders**: If the widget is shrunk under `185px` in width, the placeholder text dynamically switches to shorter variants (`"Добавить..."` / `"Add..."` and `"Лимит достигнут"` / `"Limit reached"`). If it is wider, it switches back to full descriptive text.
  * Added `container-type: inline-size` on the widget wrapper and bound a font-size clamp selector `font-size: clamp(10px, 6.5cqw, 0.85rem)` to make input placeholder size adapt responsively to column size.
* **[src/components/widgets/DailyWeatherForecast.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/widgets/DailyWeatherForecast.vue)**:
  * Localized raw API data strings (cities, countries, and weather conditions) reactively through `$tData`.
  * Replaced hardcoded `width: 50%` on location with `flex: 1; min-width: 0;` to prevent premature truncation.
  * Integrated a `ResizeObserver` using element refs to calculate text overflows.
* **[src/components/widgets/WeeklyWeatherForecast.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/widgets/WeeklyWeatherForecast.vue)**:
  * Reduced maximum weather temperature font-size from `30cqh` to `22cqh` and cleared browser default margins on `h5` elements to prevent vertical overflow/overlaps with weekdays below.
  * Localized weather states, weekdays, and city names using `$tData`.
  * Integrated `ResizeObserver` on container refs for marquee calculations.
* **[src/components/widgets/SearchBar.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/widgets/SearchBar.vue)**:
  * Updated query resolution logic. Handles the `{query}` replacement token or appends the search string directly to the end of the URL template when using a custom search engine.
* **[src/components/ui/ColorPalette.vue](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/components/ui/ColorPalette.vue)**:
  * Localized theme warnings and color names.
* **[src/utils/onboarding.js](file:///d:/Nikita/ProjectPYTH/CoolTab-master/src/utils/onboarding.js)**:
  * Imported the raw JS translator to localize steps and instructions inside the onboarding tour.

---

## 3. Deleted Files
* None. (All files from the original codebase were preserved to maintain feature integrity).
