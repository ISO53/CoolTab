<template>
    <Widget>
        <div class="stock">
            <svg class="graph" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--color-tertiary-text)" stop-opacity="1" />
                        <stop offset="100%" stop-color="var(--color-tertiary-text)" stop-opacity="0" />
                    </linearGradient>
                </defs>

                <path
                    d="M -100 120, L 5 55, L 10 50, L 15 53, L 20 48, L 25 52, L 30 50, L 35 58, L 40 53, L 45 47, L 50 50, L 55 32, L 60 38, L 65 42, L 70 35, L 75 32, L 80 38, L 85 42, L 95 35, L 100 28, L 140 120"
                    fill="url(#gradient)"
                    stroke="none"
                />

                <path
                    d="M 0 60 L 5 55, L 10 50, L 15 53, L 20 48, L 25 52, L 30 50, L 35 58, L 40 53, L 45 47, L 50 50, L 55 32, L 60 38, L 65 42, L 70 35, L 75 32, L 80 38, L 85 42, L 95 35, L 100 28,"
                    stroke="var(--color-secondary-text)"
                    stroke-width="2"
                    fill="none"
                />
            </svg>

            <div class="stock-info">
                <div>
                    <h1 class="ticker">{{ stock.stocks[selected].ticker }}</h1>
                    <h1 class="diff">
                        {{
                            (stock.stocks[selected].diff > 0 ? "+" : "") +
                            parseFloat(stock.stocks[selected].diff).toFixed(2) +
                            "%"
                        }}
                    </h1>
                </div>
                <h1 class="price">{{ "$" + stock.stocks[selected].close }}</h1>

                <p class="last-updated">
                    {{ new Date(stock.cache_time).toLocaleDateString("en-GB").replace(/\//g, ".") }}
                </p>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";

export default {
    name: "Stock",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            stock: this.settingsStore.stock,
            selected: 0,
        };
    },
    mounted() {
        this.getCurrentStockInfo();
        setInterval(this.setSelected, 5000);
    },
    methods: {
        getCurrentStockInfo() {
            const now = new Date();
            const last = this.settingsStore.stock.lastUpdated;

            // Check if one day passed (or passed midnight) since last update
            const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
            if (diff < 0) return;

            // If there is no selected tickers, return
            if (!this.settingsStore.stock.tickers?.length) return;

            // Update the stock info
            fetch("https://cool-tab-api.vercel.app/api/stock?names=" + this.settingsStore.stock.tickers.join(","))
                .then((response) => response.json())
                .then((data) => {
                    this.stock.cache_time = data.cache_time;
                    this.stock.lastUpdated = new Date();
                    this.stock.stocks = data.stock_data;
                    this.stock.tickers = this.settingsStore.stock.tickers;
                    this.settingsStore.setStock(this.stock);
                })
                .catch((error) => {
                    console.error("Error fetching stock data:", error);
                });
        },
        setSelected() {
            if (this.stock.stocks) this.selected = (this.selected + 1) % this.stock.stocks.length;
        },
    },
};
</script>

<style scoped>
.stock {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    font-family: Satoshi-Medium;
    overflow: hidden;
    container-type: size;
}

.stock:hover .last-updated {
    opacity: 1;
}

.graph {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.stock-info {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 3;
}

.ticker {
    font-size: 12cqw;
    line-height: 12cqw;
    margin: 0;
    font-family: Satoshi-Black;
}

.diff {
    font-size: 9cqw;
    line-height: 9cqw;
    margin: 0;
    font-family: Satoshi-Light;
}

.price {
    font-size: 16cqw;
    line-height: 16cqw;
    margin: 0;
    font-family: Satoshi-Medium;
}

.last-updated {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 7cqw;
    line-height: 7cqw;
    margin: 0;
    font-family: Satoshi-Light;
    opacity: 0;
    transition: opacity 250ms ease;
}
</style>
