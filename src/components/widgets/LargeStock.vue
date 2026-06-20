<template>
    <Widget>
        <div class="large-stock">
            <div class="range-selector">
                <button
                    v-for="option in rangeOptions"
                    :key="option.label"
                    type="button"
                    :class="{ 'selected-range': selectedRange === option.label }"
                    @click="selectedRange = option.label"
                >
                    {{ option.label }}
                </button>
            </div>

            <svg class="graph" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="live-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--color-tertiary-text)" stop-opacity="1" />
                        <stop offset="100%" stop-color="var(--color-tertiary-text)" stop-opacity="0" />
                    </linearGradient>
                </defs>

                <path
                    v-if="pathData && settingsStore.widgetBackground !== 'Transparent'"
                    :d="pathData + ' L 100 100 L 0 100 Z'"
                    fill="url(#live-gradient)"
                    stroke="none"
                    class="live-fill"
                />

                <path
                    v-if="pathData"
                    :d="pathData"
                    stroke="var(--color-secondary-text)"
                    stroke-width="0.5"
                    fill="none"
                    class="live-line"
                />
            </svg>

            <div class="stock-info">
                <div v-if="currentData">
                    <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                    <div style="display: flex; flex-direction: row; gap: 3cqh;">
	                    <h1 class="price">{{ formattedPrice }}</h1>
	                    <h1 class="diff">{{ diffPercentDisplay }}</h1>
                    </div>
                </div>

                <div v-else class="loading-container">
                    <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                    <p class="loading-text">Loading data...</p>
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";
import { YAHOO_QUERY1_BASE, fetchYahoo } from "@/utils/api";

const RANGE_OPTIONS = [
    { label: "1D", range: "1d", interval: "1m" },
    { label: "5D", range: "5d", interval: "15m" },
    { label: "1M", range: "1mo", interval: "60m" },
    { label: "YTD", range: "ytd", interval: "1d" },
    { label: "1Y", range: "1y", interval: "1d" },
    { label: "MAX", range: "max", interval: "1mo" },
];

export default {
    name: "LargeStock",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            selected: 0,
            selectedRange: "1D",
            stockDataCache: {},
            lastUpdated: null,
            intervalId: null,
            fetchIntervalId: null,
            rangeOptions: RANGE_OPTIONS,
        };
    },
    computed: {
        currentTicker() {
            const tickers = this.settingsStore.stock.tickers;
            if (!tickers || !tickers.length) return null;
            return tickers[this.selected % tickers.length];
        },
        currentData() {
            if (!this.currentTicker) return null;
            return this.stockDataCache[this.cacheKey(this.currentTicker)];
        },
        currentRangeConfig() {
            return RANGE_OPTIONS.find((option) => option.label === this.selectedRange) || RANGE_OPTIONS[0];
        },
        currentTickerDisplay() {
            return this.currentData?.meta?.symbol || this.currentTicker || "---";
        },
        diffPercentDisplay() {
            if (!this.currentData) return "0.00%";
            const diff = this.currentData.diffPercent;
            return (diff > 0 ? "↗︎ " + diff.toFixed(2) : "↘︎ " + diff.toFixed(2).substr(1)) + "%";
        },
        formattedPrice() {
            if (!this.currentData) return "$0.00";
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: this.currentData.meta.currency || "USD",
            }).format(this.currentData.meta.regularMarketPrice);
        },
        pathData() {
            const targetPoints = 300;
            if (!this.currentData || !this.currentData.prices.length) {
                let d = "";
                for (let i = 0; i < targetPoints; i++) {
                    const x = (i / (targetPoints - 1)) * 100;
                    d += (i === 0 ? "M " : " L ") + `${x} 45`;
                }
                return d;
            }

            const prices = this.currentData.prices;
            const max = Math.max(...prices);
            const min = Math.min(...prices);
            const range = max - min || 1;

            let d = "";
            for (let i = 0; i < prices.length; i++) {
                const x = (i / (prices.length - 1)) * 100;
                // Map prices to y range [20, 70] to leave space for text at the top and price at the bottom
                const y = 70 - ((prices[i] - min) / range) * 50;
                d += (i === 0 ? "M " : " L ") + `${x} ${y}`;
            }
            return d;
        },
    },
    watch: {
        selectedRange() {
            this.fetchAllStockInfo();
        },
    },
    mounted() {
        this.fetchAllStockInfo();
        this.fetchIntervalId = setInterval(this.fetchAllStockInfo, 60000); // Fetch every minute
        this.intervalId = setInterval(this.setSelected, 8000); // Cycle every 8 seconds
    },
    unmounted() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.fetchIntervalId) clearInterval(this.fetchIntervalId);
    },
    methods: {
        cacheKey(ticker) {
            return `${ticker}:${this.selectedRange}`;
        },
        async fetchAllStockInfo() {
            const tickers = this.settingsStore.stock.tickers;
            if (!tickers || !tickers.length) return;

            const { range, interval } = this.currentRangeConfig;

            for (const ticker of tickers) {
                try {
                    const data = await fetchYahoo(`${YAHOO_QUERY1_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=${interval}`);

                    if (data.chart && data.chart.result && data.chart.result.length > 0) {
                        const result = data.chart.result[0];
                        const meta = result.meta;
                        let rawPrices = result.indicators?.quote[0]?.close || [];

                        // Filter out leading/trailing nulls if any, but better to just fill
                        let lastValid = rawPrices.find(p => p !== null) ?? meta.regularMarketPrice;
                        rawPrices = rawPrices.map(p => {
                            if (p === null || p === undefined) return lastValid;
                            lastValid = p;
                            return p;
                        });

                        // Downsample to exactly 300
                        const targetPoints = 300;
                        const prices = [];
                        if (rawPrices.length > 0) {
                            for (let i = 0; i < targetPoints; i++) {
                                const index = Math.floor(i * (rawPrices.length - 1) / (targetPoints - 1));
                                prices.push(rawPrices[index]);
                            }
                        }

                        const currentPrice = meta.regularMarketPrice;
                        const firstPrice = prices[0] ?? currentPrice;
                        const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
                        const diffBase = this.selectedRange === "1D" ? prevClose : firstPrice;
                        const diffPercent = diffBase ? ((currentPrice - diffBase) / diffBase) * 100 : 0;

                        // Use spread to ensure reactivity in Vue 3
                        this.stockDataCache = {
                            ...this.stockDataCache,
                            [this.cacheKey(ticker)]: {
                                meta,
                                prices,
                                diffPercent
                            }
                        };
                    }
                } catch (e) {
                    console.error("Error fetching live stock for", ticker, e);
                }
            }
            this.lastUpdated = new Date();
        },
        setSelected() {
            const tickers = this.settingsStore.stock.tickers;
            if (tickers && tickers.length > 0) {
                this.selected = (this.selected + 1) % tickers.length;
            }
        },
    },
};
</script>

<style scoped>
.large-stock {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 2 / 1;
    font-family: Satoshi-Medium;
    overflow: hidden;
    container-type: size;
}

.graph {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    bottom: 0;
    left: 0;
}

.live-line {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.live-fill {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.range-selector {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 4;
    display: flex;
    gap: 1cqh;
}

.range-selector > button {
	padding: 2cqh 3cqh;
    border-radius: 10cqh;
    border: 1px solid transparent;
    color: var(--color-secondary-text);
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2cqh;
    cursor: pointer;
    font-size: 5cqh;
    line-height: 5cqh;
}

.selected-range {
	border: 1px solid var(--color-secondary-text) !important;
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
    pointer-events: none;
}

.ticker {
    font-size: 12cqh;
    line-height: 12cqh;
    margin: 0;
    font-family: Satoshi-Black;
}

.diff {
	color: var(--color-secondary-text);
    font-size: 5cqh;
    line-height: 5cqh;
    border: 0.5cqh solid var(--color-secondary-text);
    border-radius: 999px;
    padding: 1.5cqh 3cqh;
    margin: 0;
    font-family: Satoshi-Medium;
}

.price {
    font-size: 9cqh;
    line-height: 9cqh;
    margin: 0;
    font-family: Satoshi-Medium;
}

.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.loading-text {
    font-size: 8cqh;
    color: var(--color-tertiary-text);
    margin: 5px 0 0 0;
}
</style>
