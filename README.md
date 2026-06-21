<p align="center">
  <img src="https://github.com/user-attachments/assets/21aa3b31-9713-412c-8da1-59fa9d41912e">
</p>

<p align="center">
    <b>CoolTab</b> is a fast & memory efficient customizable New Tab built with Vue.js.
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

-   [What is Cooltab](#what-is-cooltab)
-   [Features](#features)
-   [Installation](#installation)
-   [Application UI](#application-ui)
-   [Contributing](#contributing)
-   [License](#license)

## What is CoolTab

Picture a new tab with a tremendous amount of customization. Colors, borders, backgrounds, wallpapers, and widgets... all while running circles around your browser's stock new tab in speed and memory usage. Sounds like a dream? Open your eyes, it's right in front of you.

**CoolTab** is a lightweight, highly customizable new tab extension built with Vue.js, available for all major browsers. Instead of locking you into one fixed layout, CoolTab gives you a flexible canvas of draggable, resizable widgets, search bar, quick links, clock, calendar, weather, stocks, a 3D location globe, and more. So you can build a new tab experience that actually fits the way you work and browse.

Every detail is yours to control: pick a background image, color, or wallpaper, adjust sizing, choose your search engine, and arrange widgets exactly how you like them. Your layout is saved automatically, so it's there the moment you open a new tab. Don't just take our word for the speed and efficiency claims, check out the [benchmarks](https://iso53.github.io/CoolTab/#/benchmarks) yourself.

Whether you want a minimal, distraction-free tab or a fully-loaded dashboard with weather, stocks, and a clock at a glance, CoolTab adapts to you.

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
    The build process automatically generates optimized versions for both browsers:
    -   `/dist/chrome`: For Chromium-based browsers (Chrome, Edge, Brave, etc.).
    -   `/dist/firefox`: For Firefox.

4. **Deployment & Testing**
    Zip the contents of either the `/dist/chrome` or `/dist/firefox` folder and upload it to your browser's extension management page for testing.
    > If you want to run the project in development mode, just run `npm run dev`.


## Application UI
You can check different styles of the application UI created by the community by clicking [here](https://iso53.github.io/CoolTab/#/style)!


## Contributing

Your contributions are valued! We appreciate your cooperation in making our project better.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE). Feel free to modify the content and structure based on your preferences and project specifics.
