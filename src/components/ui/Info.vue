<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="toggleInfo">
                <div v-if="isOpen" class="info-div" @click.stop>
                    <img src="@/components/icons/cooltab_logo.svg" />
                    <h1>CoolTab</h1>
                    <p>Just a new tab for your browser, but cooler...</p>
                    <p>Version: {{ appVersion }}</p>
                    <p>Source Code: <a href="https://github.com/iso53/cooltab">github.com/iso53/cooltab</a></p>

                    <br />

                    <h2>Special Thanks To</h2>
                    <p>
                        <a href="https://www.weatherapi.com/" title="Weather API">WeatherAPI.com</a> for providing
                        weather info.
                    </p>
                    <p><a href="https://open-meteo.com/">Open-Meteo.com</a> for providing weather info.</p>
                    <p><a href="https://polygon.io/">Polygon.io</a> for providing stock market info.</p>
                    <p><a href="https://icons.qweather.com/">QWeather.com</a> for providing weather icons.</p>
                </div>
            </div>
        </Transition>

        <button @click="toggleInfo" class="info-toggle-button">
            <img src="@/components/icons/info.svg" />
        </button>
    </div>
</template>

<script>
import {version} from "@/../package.json";

export default {
    name: "Info",
    data() {
        return {
            isOpen: false,
            appVersion: version,
        };
    },
    methods: {
        toggleInfo() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: backdrop-filter 250ms ease, background-color 250ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    backdrop-filter: none;
    background-color: transparent;
}

.overlay-enter-active > .info-div,
.overlay-leave-active > .info-div {
    transition: transform 250ms ease, opacity 250ms ease;
}

.overlay-enter-from > .info-div,
.overlay-leave-to > .info-div {
    transform: scale(50%);
    opacity: 0;
}

.info-div {
    width: fit-content;
    height: fit-content;
    background-color: rgb(20, 20, 20);
    border: 2px solid rgb(50, 50, 50);
    z-index: 10000;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.info-div > h1 {
    font-family: Satoshi-Bold;
    font-size: 3rem;
}

.info-div > p {
    font-family: Satoshi-Light;
    font-size: 1rem;
}

.info-div > h2 {
    font-family: Satoshi-Bold;
    font-size: 2rem;
}

.info-div > img {
    width: 100px;
    height: 100px;
}

.info-div > p > a {
    position: relative;
    text-decoration: none;
    color: rgb(100, 100, 100);
    font-weight: bold;
    transition: color 250ms ease;
}

.info-div > p > a:hover {
    color: rgb(200, 200, 200);
}

.info-div > p > a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: #fafafa;
    transform: scaleX(0%);
    transition: transform 250ms ease;
}

.info-div > p > a:hover::after {
    transform: scaleX(100%);
}

.info-toggle-button {
    position: absolute;
    bottom: 10px;
    right: 5px;
    margin: 0;
    border-radius: 50px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
}

.info-toggle-button:hover img {
    transform: scale(125%);
}

.info-toggle-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    margin: 0;
    transition: transform 250ms ease;
}

.close:hover img {
    transform: translateX(-3px);
}
</style>
