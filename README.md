<p align="center">
  <img width="460" height="300" src="https://github.com/ISO53/CoolTab/blob/master/cooltab_logo.svg">
</p>

<h1 align="center">Cool Tab</h1>

<p align="center">
    <b>Cool Tab</b> is a customizable New Tab page built with Vue.js.
</p>

<br>

<p align="center">
  <a href="https://github.com/ISO53/CoolTab/releases/latest">
    <img src="https://img.shields.io/github/v/release/ISO53/CoolTab?label=GitHub%20Release&style=round-square&color=black" alt="GitHub Release">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-GNU-black.svg?style=round-square" alt="License">
  </a>
  <img src="https://img.shields.io/github/languages/code-size/ISO53/CoolTab?style=round-square&color=black" alt="GitHub code size in bytes">
<!--   <a href="https://chromewebstore.google.com/detail/leetmacro/ijjbjplfbmkfifipofkdbpadlehhndha?pli=1">
    <img src="https://img.shields.io/badge/Available_On-Chrome_Web_Store-black" alt="Chrome Web Store">
  </a> -->
</p>

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Contributing](#contributing)
-   [License](#license)


## Features
-   **Customizable Background:** Set a background image, color, and size to personalize your new tab experience.
-   **Search Bar:** Choose your preferred search engine (Google by default) and open results in a new tab or the current window.
-   **Quick Links:** Add your most visited websites for quick access. Customize the orientation (horizontal/vertical) and add images to your links.
-   **Current Weather:** Displays sunrise/sunset times, temperature, and location.
-   **Stock Ticker:** Track your favorite stocks.
-   **Calendar:** View the current month and date.
-   **Analog Clock:** A stylish analog clock widget.
-   **Digital Clock:** A clear and concise digital clock.
-   **Daily Weather Forecast:** Get a glimpse of the upcoming weather.
-   **Widget Layout:** Arrange and resize widgets to create your ideal layout. The layout is saved automatically.
-   **And More:** There will be more widgets and customizations on future releases!


## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ISO53/CoolTab.git
    ```
2.  **Locate the project directory**
    ```bash
    cd CoolTab
    ```
3. **Build The Project**
    ```bash
    npm run build
    ```
4. Copy the `manifest.json` file to `/dist` folder.
5.  Go to `/dist` folder and zip the project files and [upload it to chrome](chrome://extensions/) for testing, development or any other stuff. If you want to use this on firefox you need to add [couple more fields](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings) to `manifest.json` file before copying it to `/dist`.

> If you want to run the project in development mode, just run `npm run dev`.


## Contributing

Your contributions are valued! We appreciate your cooperation in making our project better.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE). Feel free to modify the content and structure based on your preferences and project specifics.
