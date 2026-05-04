<template>
    <Widget>
        <div class="stock">
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
                    stroke-width="2"
                    fill="none"
                    class="live-line"
                />
            </svg>

            <div class="stock-info">
                <div v-if="currentData">
                    <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                    <h1 class="diff">
                        {{ diffPercentDisplay }}
                    </h1>
                </div>
                <h1 v-if="currentData" class="price">{{ formattedPrice }}</h1>
                
                <div v-else class="loading-container">
                    <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                    <p class="loading-text">Loading data...</p>
                </div>

                <p class="last-updated">
                    {{ lastUpdatedDisplay }}
                </p>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import {useSettingsStore} from "@/settings";
import { YAHOO_QUERY1_BASE } from "@/utils/api";

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
            selected: 0,
            stockDataCache: {},
            lastUpdated: null,
            intervalId: null,
            fetchIntervalId: null,
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
            return this.stockDataCache[this.currentTicker];
        },
        currentTickerDisplay() {
            return this.currentData?.meta?.symbol || this.currentTicker || "---";
        },
        diffPercentDisplay() {
            if (!this.currentData) return "0.00%";
            const diff = this.currentData.diffPercent;
            return (diff > 0 ? "+" : "") + diff.toFixed(2) + "%";
        },
        formattedPrice() {
            if (!this.currentData) return "$0.00";
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: this.currentData.meta.currency || "USD",
            }).format(this.currentData.meta.regularMarketPrice);
        },
        pathData() {
            const targetPoints = 40;
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
        lastUpdatedDisplay() {
            if (!this.lastUpdated) return "";
            return this.lastUpdated.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
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
        async fetchAllStockInfo() {
            const tickers = this.settingsStore.stock.tickers;
            if (!tickers || !tickers.length) return;

            for (const ticker of tickers) {
                try {
                    const res = await fetch(`${YAHOO_QUERY1_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1m`);
                    const data = await res.json();
                    
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

                        // Downsample to exactly 40 points for smooth transitions
                        const targetPoints = 40;
                        const prices = [];
                        if (rawPrices.length > 0) {
                            for (let i = 0; i < targetPoints; i++) {
                                const index = Math.floor(i * (rawPrices.length - 1) / (targetPoints - 1));
                                prices.push(rawPrices[index]);
                            }
                        }

                        const currentPrice = meta.regularMarketPrice;
                        const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
                        const diffPercent = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

                        // Use spread to ensure reactivity in Vue 3
                        this.stockDataCache = {
                            ...this.stockDataCache,
                            [ticker]: {
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
    bottom: 0;
    left: 0;
}

.live-line {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.live-fill {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.loading-text {
    font-size: 8cqw;
    color: var(--color-tertiary-text);
    margin: 5px 0 0 0;
}
</style>
