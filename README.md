<p align="center">
  <img src="https://github.com/user-attachments/assets/914102e2-b625-4a47-92f4-1c8b38e5a0e6">
</p>

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
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/cool-tab/kngdmmkbgfgogddahgjgeeigcellojog">
    <img src="https://github.com/user-attachments/assets/d0bfb1ea-67d9-4538-97d7-7b66f61423bd" height="75">
  </a>
  <a href="https://addons.mozilla.org/addon/cooltab/">
    <img src="https://github.com/user-attachments/assets/c2dcc99d-8d4f-44e0-83c0-73575d42494a" height="75">
  </a>
</p>

## Table of Contents

-   [Features](#features)
-   [Installation](#installation)
-   [Application UI](#application-ui)
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
-   **Weekly Weather Forecast:** Shows the full weeks upcoming weather.
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
4. Copy the `manifest.json` (for chrome) or `firefox_manifest.json` (for firefox) file to `/dist` folder depending which browser you are building for.
   > If you copied the `firefox_manifest.json` to `/dist` folder make sure to change the file name back to `manifest.json` after you've copied it.
5. Go to `/dist` folder and zip the project files and upload it to chrome or firefox for testing, development or any other stuff.
   > If you want to run the project in development mode, just run `npm run dev`.


## Application UI
![1 2 0_1](https://github.com/user-attachments/assets/3e5b0da5-9684-484c-a363-1dd42666cda9)
![1 2 0_2](https://github.com/user-attachments/assets/33185a3a-cfb2-48db-93be-b1bb8edd875c)
![1 2 0_3](https://github.com/user-attachments/assets/2bf39321-bc65-4d69-b29d-86e652b1f057)
![1 2 0_4](https://github.com/user-attachments/assets/289729ed-1cb9-402a-8b59-9e390933880e)
![1 2 0_5](https://github.com/user-attachments/assets/e5b56a83-1153-4c24-b5c3-693c50a125dc)


## Contributing

Your contributions are valued! We appreciate your cooperation in making our project better.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE). Feel free to modify the content and structure based on your preferences and project specifics.
