<template>
    <Widget>
        <div class="large-stock" @mouseenter="pauseTickerCycle" @mouseleave="resumeTickerCycle">
            <div class="large-stock-header">
                <div class="stock-info">
                    <div v-if="currentData">
                        <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                        <div class="price-row">
                            <div class="price-container">
                                <h1 class="price">{{ formattedPrice }}</h1>
                                <span class="hover-date" :style="{ opacity: hoverPoint ? 1 : 0 }">
                                    {{ hoverDateDisplay || '‎' }}
                                </span>
                            </div>
                            <h1 class="diff">{{ diffPercentDisplay }}</h1>
                        </div>
                    </div>

                    <div v-else class="loading-container">
                        <h1 class="ticker">{{ currentTickerDisplay }}</h1>
                        <p class="loading-text">Loading data...</p>
                    </div>
                </div>

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
            </div>

            <div class="graph-container">
                <svg
                    ref="chartSvg"
                    class="graph"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="large-stock-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="var(--color-tertiary-text)" stop-opacity="1" />
                            <stop offset="100%" stop-color="var(--color-tertiary-text)" stop-opacity="0" />
                        </linearGradient>
                    </defs>

                    <line
                        :x1="chartLayout.margins.left"
                        :y1="chartLayout.plotBottom"
                        :x2="100 - chartLayout.margins.right"
                        :y2="chartLayout.plotBottom"
                        class="axis-line"
                    />

                    <path
                        v-if="fillPathData && settingsStore.widgetBackground !== 'Transparent'"
                        :d="fillPathData"
                        fill="url(#large-stock-gradient)"
                        stroke="none"
                        class="live-fill"
                    />

                    <path
                        v-if="linePathData"
                        :d="linePathData"
                        stroke="var(--color-secondary-text)"
                        stroke-width="2"
                        fill="none"
                        class="live-line"
                        vector-effect="non-scaling-stroke"
                    />

                    <template v-if="hoverPoint">
                        <line
                            :x1="hoverPoint.x"
                            :y1="chartLayout.margins.top"
                            :x2="hoverPoint.x"
                            :y2="chartLayout.plotBottom"
                            class="crosshair-line"
                            vector-effect="non-scaling-stroke"
                        />
                        <line
                            :x1="chartLayout.margins.left"
                            :y1="hoverPoint.y"
                            :x2="100 - chartLayout.margins.right"
                            :y2="hoverPoint.y"
                            class="crosshair-line"
                            vector-effect="non-scaling-stroke"
                        />
                    </template>

                    <rect
                        :x="chartLayout.margins.left"
                        :y="chartLayout.margins.top"
                        :width="chartLayout.plotWidth"
                        :height="chartLayout.plotHeight"
                        fill="transparent"
                        class="plot-hit-area"
                        @mousemove="onGraphHover"
                        @mouseleave="clearHover"
                    />
                </svg>

                <div
                    v-if="hoverPoint"
                    class="hover-dot-marker"
                    :style="{ left: hoverPoint.x + '%', top: hoverPoint.y + '%' }"
                ></div>

                <div class="axis-labels">
                    <span
                        v-for="(label, index) in xAxisLabels"
                        :key="'x-' + index"
                        class="axis-label axis-label-x"
                        :style="{ left: label.xPercent + '%', top: label.yPercent + '%' }"
                    >
                        {{ label.text }}
                    </span>
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

const CHART_MARGIN = {
    left: 3,
    right: 3,
    bottom: 14,
    top: 4,
};

const TARGET_POINTS = 300;

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
            stockDataCache: {},
            lastUpdated: null,
            intervalId: null,
            fetchIntervalId: null,
            rangeOptions: RANGE_OPTIONS,
            hoverIndex: null,
        };
    },
    computed: {
        selectedRange: {
            get() {
                const range = this.settingsStore.largeStockRange;
                return RANGE_OPTIONS.some((option) => option.label === range) ? range : "1D";
            },
            set(value) {
                this.settingsStore.setLargeStockRange(value);
            },
        },
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
            if (this.hoverPoint) {
                return this.hoverPriceDisplay;
            }
            if (!this.currentData) return "$0.00";
            return this.formatPrice(this.currentData.meta.regularMarketPrice);
        },
        chartLayout() {
            const plotWidth = 100 - CHART_MARGIN.left - CHART_MARGIN.right;
            const plotHeight = 100 - CHART_MARGIN.top - CHART_MARGIN.bottom;
            return {
                margins: CHART_MARGIN,
                plotWidth,
                plotHeight,
                plotBottom: 100 - CHART_MARGIN.bottom,
            };
        },
        chartSeries() {
            if (!this.currentData?.prices?.length) {
                return this.placeholderSeries();
            }

            const prices = this.currentData.prices;
            const timestamps = this.currentData.timestamps || [];
            const max = Math.max(...prices);
            const min = Math.min(...prices);
            const range = max - min || 1;
            const { left, top } = CHART_MARGIN;
            const { plotWidth, plotHeight } = this.chartLayout;

            return prices.map((price, index) => ({
                index,
                price,
                timestamp: timestamps[index] ?? null,
                x: left + (index / (prices.length - 1)) * plotWidth,
                y: top + plotHeight - ((price - min) / range) * plotHeight,
            }));
        },
        linePathData() {
            if (!this.chartSeries.length) return "";
            return this.chartSeries
                .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
                .join(" ");
        },
        fillPathData() {
            if (!this.chartSeries.length) return "";
            const first = this.chartSeries[0];
            const last = this.chartSeries[this.chartSeries.length - 1];
            const plotBottom = this.chartLayout.plotBottom;
            return `${this.linePathData} L ${last.x} ${plotBottom} L ${first.x} ${plotBottom} Z`;
        },
        xAxisLabels() {
            if (!this.chartSeries.length) return [];

            const lastIndex = this.chartSeries.length - 1;
            const indices = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(ratio * lastIndex));
            const points = [...new Set(indices)].map((index) => this.chartSeries[index]);

            const seen = new Set();
            return points
                .filter((point) => point.timestamp)
                .filter((point) => {
                    const key = point.timestamp;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                })
                .map((point) => ({
                    x: point.x,
                    text: this.formatAxisDate(point.timestamp),
                    xPercent: point.x,
                    yPercent: this.chartLayout.plotBottom + 6,
                }));
        },
        hoverPoint() {
            if (this.hoverIndex === null || !this.chartSeries.length) return null;
            return this.chartSeries[this.hoverIndex] || null;
        },
        hoverPriceDisplay() {
            if (!this.hoverPoint) return "";
            return this.formatPrice(this.hoverPoint.price);
        },
        hoverDateDisplay() {
            if (!this.hoverPoint?.timestamp) return "";
            return this.formatHoverDate(this.hoverPoint.timestamp);
        },
        pauseTickerCycle() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        resumeTickerCycle() {
            if (!this.intervalId) {
                this.intervalId = setInterval(this.setSelected, 8000);
            }
        },
    },
    watch: {
        selectedRange() {
            this.clearHover();
            this.fetchAllStockInfo();
        },
        currentTicker() {
            this.clearHover();
        },
        currentData() {
            this.clearHover();
        },
    },
    mounted() {
        this.fetchAllStockInfo();
        this.fetchIntervalId = setInterval(this.fetchAllStockInfo, 60000);
        this.intervalId = setInterval(this.setSelected, 8000);
    },
    unmounted() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.fetchIntervalId) clearInterval(this.fetchIntervalId);
    },
    methods: {
        cacheKey(ticker) {
            return `${ticker}:${this.selectedRange}`;
        },
        placeholderSeries() {
            const { left, top } = CHART_MARGIN;
            const { plotWidth, plotHeight } = this.chartLayout;
            const y = top + plotHeight * 0.5;

            return Array.from({ length: TARGET_POINTS }, (_, index) => ({
                index,
                price: 0,
                timestamp: null,
                x: left + (index / (TARGET_POINTS - 1)) * plotWidth,
                y,
            }));
        },
        formatPrice(price) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: this.currentData?.meta?.currency || "USD",
            }).format(price);
        },
        formatAxisDate(timestamp) {
            const date = new Date(timestamp * 1000);
            if (this.selectedRange === "1D") {
                return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            }
            if (this.selectedRange === "5D" || this.selectedRange === "1M") {
                return date.toLocaleDateString([], { month: "short", day: "numeric" });
            }
            return date.toLocaleDateString([], { month: "short", year: "2-digit" });
        },
        formatHoverDate(timestamp) {
            const date = new Date(timestamp * 1000);
            if (this.selectedRange === "1D") {
                return date.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                });
            }
            return date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        },
        onGraphHover(event) {
            const svg = this.$refs.chartSvg;
            if (!svg || this.chartSeries.length < 2) return;

            const rect = svg.getBoundingClientRect();
            const plotLeft = (CHART_MARGIN.left / 100) * rect.width;
            const plotWidth = (this.chartLayout.plotWidth / 100) * rect.width;
            const relativeX = event.clientX - rect.left - plotLeft;

            if (relativeX < 0 || relativeX > plotWidth) {
                this.hoverIndex = null;
                return;
            }

            const ratio = relativeX / plotWidth;
            this.hoverIndex = Math.round(ratio * (this.chartSeries.length - 1));
        },
        clearHover() {
            this.hoverIndex = null;
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
                        let rawTimestamps = result.timestamp || [];

                        let lastValid = rawPrices.find((p) => p !== null) ?? meta.regularMarketPrice;
                        rawPrices = rawPrices.map((p) => {
                            if (p === null || p === undefined) return lastValid;
                            lastValid = p;
                            return p;
                        });

                        const prices = [];
                        const timestamps = [];
                        if (rawPrices.length > 0) {
                            for (let i = 0; i < TARGET_POINTS; i++) {
                                const index = Math.floor(i * (rawPrices.length - 1) / (TARGET_POINTS - 1));
                                prices.push(rawPrices[index]);
                                timestamps.push(rawTimestamps[index] ?? null);
                            }
                        }

                        const currentPrice = meta.regularMarketPrice;
                        const firstPrice = prices[0] ?? currentPrice;
                        const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
                        const diffBase = this.selectedRange === "1D" ? prevClose : firstPrice;
                        const diffPercent = diffBase ? ((currentPrice - diffBase) / diffBase) * 100 : 0;

                        this.stockDataCache = {
                            ...this.stockDataCache,
                            [this.cacheKey(ticker)]: {
                                meta,
                                prices,
                                timestamps,
                                diffPercent,
                            },
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
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    aspect-ratio: 2 / 1;
    font-family: Satoshi-Medium;
    overflow: hidden;
    container-type: size;
}

.large-stock-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.graph-container {
    position: relative;
    flex: 1;
    min-height: 0;
    width: 100%;
}

.graph {
    display: block;
    width: 100%;
    height: 100%;
}

.plot-hit-area {
    cursor: crosshair;
}

.axis-line {
    stroke: var(--color-tertiary-text);
    stroke-width: 0.35;
    vector-effect: non-scaling-stroke;
    opacity: 0.5;
}

.axis-labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.axis-label {
    position: absolute;
    color: var(--color-tertiary-text);
    font-size: 6cqh;
    line-height: 6cqh;
    white-space: nowrap;
}

.axis-label-x {
    transform: translate(-50%, -50%);
}

.axis-label-x:first-child {
    transform: translate(0, -50%);
}

.axis-label-x:last-child {
    transform: translate(-100%, -50%);
}

.live-line {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.live-fill {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.crosshair-line {
    stroke: var(--color-secondary-text);
    stroke-width: 0.5;
    stroke-dasharray: 1.5 1.5;
    opacity: 0.6;
    pointer-events: none;
}

.hover-dot-marker {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color-primary-text);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 4;
}

.price-container {
    display: flex;
    flex-direction: column;
}

.hover-date {
    font-size: 5cqh;
    line-height: 5cqh;
    color: var(--color-secondary-text);
    margin-top: 1cqh;
    font-family: Satoshi-Medium;
    transition: opacity 0.15s ease;
}

.range-selector {
    display: flex;
    gap: 1cqh;
    flex-shrink: 0;
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
    pointer-events: none;
    min-width: 0;
}

.price-row {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 3cqh;
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
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
}

.loading-container {
    display: flex;
    flex-direction: column;
}

.loading-text {
    font-size: 8cqh;
    color: var(--color-tertiary-text);
    margin: 5px 0 0 0;
}
</style>
