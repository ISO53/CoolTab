<template>
    <div class="benchmark-page">
        <!-- Hero Header -->
        <section class="benchmark-hero container">
            <h1>Performance Benchmarks</h1>
            <p class="hero-subtitle">
                How does CoolTab stack up against default new tabs? We ran each metric
                10 times and averaged the results. Lower is better across the board.
            </p>
        </section>

        <!-- Chart 1: Initial Load Time -->
        <section class="chart-section container">
            <div class="chart-layout">
                <div class="chart-explanation">
                    <h2>Initial Load Time</h2>
                    <p class="metric-description">
                        Initial Load Time measures how long it takes from the moment you open a new tab
                        until the page is fully loaded and ready to use. It captures the entire loading
                        pipeline including HTML parsing, resource fetching, and rendering.
                    </p>
                    <p class="metric-advantage">
                        A lower load time means your new tab appears instantly. CoolTab loads in
                        <strong>144.1 ms</strong>, nearly half the time of Chrome's default tab.
                        That means less waiting and a snappier browsing experience every time you
                        open a new tab.
                    </p>
                    <button class="btn-methodology" @click="scrollToMethodology">
                        How was this tested?
                        <span class="arrow-down">&#8595;</span>
                    </button>
                </div>
                <div class="chart-container glass-panel">
                    <Bar :data="loadTimeData" :options="chartOptions('ms')" />
                </div>
            </div>
        </section>

        <!-- Chart 2: Memory Usage -->
        <section class="chart-section container">
            <div class="chart-layout">
                <div class="chart-explanation">
                    <h2>Memory Usage</h2>
                    <p class="metric-description">
                        Memory Usage measures the total heap size consumed by the new tab page.
                        Every kilobyte your new tab uses is memory that could be serving your
                        actual browsing, other tabs, or applications running on your system.
                    </p>
                    <p class="metric-advantage">
                        CoolTab uses only <strong>5,550 KB</strong> of memory, roughly half of what
                        Chrome and Firefox consume. This lean footprint means your browser stays
                        responsive even with dozens of tabs open, and your laptop fan stays quiet.
                    </p>
                    <button class="btn-methodology" @click="scrollToMethodology">
                        How was this tested?
                        <span class="arrow-down">&#8595;</span>
                    </button>
                </div>
                <div class="chart-container glass-panel">
                    <Bar :data="memoryData" :options="chartOptions('KB')" />
                </div>
            </div>
        </section>

        <!-- Chart 3: Largest Contentful Paint -->
        <section class="chart-section container">
            <div class="chart-layout">
                <div class="chart-explanation">
                    <h2>Largest Contentful Paint</h2>
                    <p class="metric-description">
                        Largest Contentful Paint (LCP) measures how quickly the biggest visible
                        element on the page finishes rendering. It is one of Google's Core Web Vitals
                        and directly reflects the perceived speed a user experiences.
                    </p>
                    <p class="metric-advantage">
                        At <strong>170 ms</strong>, CoolTab's LCP is nearly twice as fast as Brave
                        and Chrome. The content you see first, your widgets, your clock, your
                        greeting, renders almost instantly, so the tab feels alive the moment
                        it opens.
                    </p>
                    <button class="btn-methodology" @click="scrollToMethodology">
                        How was this tested?
                        <span class="arrow-down">&#8595;</span>
                    </button>
                </div>
                <div class="chart-container glass-panel">
                    <Bar :data="lcpData" :options="chartOptions('ms')" />
                </div>
            </div>
        </section>

        <!-- Methodology Section -->
        <section id="methodology" class="methodology-section container">
            <div class="methodology-header">
                <h2>How We Tested</h2>
                <p class="methodology-intro">
                    All benchmarks were conducted on the same machine under identical conditions.
                    Each metric was measured <strong>10 times</strong> per browser, and the results
                    shown are the <strong>arithmetic averages</strong>. Browser extensions were
                    disabled during testing (except CoolTab itself) to ensure a fair comparison.
                </p>
            </div>

            <div class="results-table-wrapper glass-panel">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Test Command</th>
                            <th>CoolTab</th>
                            <th>Brave</th>
                            <th>Chrome</th>
                            <th>Firefox</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="command-cell">
                                <code>performance.timing.loadEventEnd - performance.timing.navigationStart</code>
                            </td>
                            <td class="cooltab-col">144.1 ms</td>
                            <td>178.5 ms</td>
                            <td>292.1 ms</td>
                            <td>212.4 ms</td>
                        </tr>
                        <tr>
                            <td class="command-cell">
                                <code>Memory tab on dev tools &gt; Memory Snapshot</code>
                            </td>
                            <td class="cooltab-col">5,550 KB</td>
                            <td>9,421 KB</td>
                            <td>11,450 KB</td>
                            <td>10,050 KB</td>
                        </tr>
                        <tr>
                            <td class="command-cell">
                                <code>performance.getEntriesByName('first-contentful-paint')[0]?.startTime</code>
                            </td>
                            <td class="cooltab-col">170 ms</td>
                            <td>324.4 ms</td>
                            <td>310.4 ms</td>
                            <td>236.8 ms</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="command-explanations">
                <div class="explanation-card glass-panel">
                    <h4>Initial Load Time</h4>
                    <p>
                        Uses the Navigation Timing API to measure the total time from navigation
                        start to the load event firing. This captures DNS lookup, connection,
                        request/response, DOM processing, and the load event itself.
                    </p>
                </div>
                <div class="explanation-card glass-panel">
                    <h4>Memory Snapshot</h4>
                    <p>
                        Taken via the browser DevTools Memory panel. A heap snapshot is captured
                        once the page is fully idle, measuring the total retained JavaScript
                        heap size in kilobytes.
                    </p>
                </div>
                <div class="explanation-card glass-panel">
                    <h4>Largest Contentful Paint</h4>
                    <p>
                        Retrieved from the Performance API's paint entries. LCP marks when the
                        largest content element in the viewport finishes rendering, reflecting
                        the user's perceived load speed.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

// CoolTab always first (leftmost), then sorted ascending by value
const coolTabColor = 'rgba(255, 255, 255, 0.85)'
const coolTabColorHover = 'rgba(255, 255, 255, 1)'
const competitorColor = 'rgba(255, 255, 255, 0.12)'
const competitorColorHover = 'rgba(255, 255, 255, 0.22)'

function makeDataset(label, sortedBrowsers, sortedValues) {
    const bgColors = sortedBrowsers.map(b => b === 'CoolTab' ? coolTabColor : competitorColor)
    const hoverColors = sortedBrowsers.map(b => b === 'CoolTab' ? coolTabColorHover : competitorColorHover)
    const borderColors = sortedBrowsers.map(b => b === 'CoolTab' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)')

    return {
        labels: sortedBrowsers,
        datasets: [{
            label,
            data: sortedValues,
            backgroundColor: bgColors,
            hoverBackgroundColor: hoverColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
        }]
    }
}

// Raw data: { browser: value } — we sort CoolTab first, then ascending
function sortData(rawEntries) {
    const coolTab = rawEntries.find(e => e[0] === 'CoolTab')
    const others = rawEntries.filter(e => e[0] !== 'CoolTab').sort((a, b) => a[1] - b[1])
    const sorted = [coolTab, ...others]
    return {
        browsers: sorted.map(e => e[0]),
        values: sorted.map(e => e[1])
    }
}

const loadRaw = [['Brave', 178.5], ['Chrome', 292.1], ['Firefox', 212.4], ['CoolTab', 144.1]]
const memRaw = [['Brave', 9421], ['Chrome', 11450], ['Firefox', 10050], ['CoolTab', 5550]]
const lcpRaw = [['Brave', 324.4], ['Chrome', 310.4], ['Firefox', 236.8], ['CoolTab', 170]]

const loadSorted = sortData(loadRaw)
const memSorted = sortData(memRaw)
const lcpSorted = sortData(lcpRaw)

const loadTimeData = makeDataset('Initial Load Time', loadSorted.browsers, loadSorted.values)
const memoryData = makeDataset('Memory Usage', memSorted.browsers, memSorted.values)
const lcpData = makeDataset('Largest Contentful Paint', lcpSorted.browsers, lcpSorted.values)

function chartOptions(unit) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.85)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y.toLocaleString()} ${unit}`
                }
            },
            datalabels: {
                color: (ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex]
                    return label === 'CoolTab' ? '#fff' : 'rgba(255,255,255,0.5)'
                },
                anchor: 'end',
                align: 'end',
                offset: 4,
                font: {
                    size: 13,
                    weight: (ctx) => {
                        const label = ctx.chart.data.labels[ctx.dataIndex]
                        return label === 'CoolTab' ? '700' : '500'
                    },
                    family: 'Satoshi-Regular, Inter, sans-serif'
                },
                formatter: (value) => `${value.toLocaleString()} ${unit}`
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.6)',
                    font: {
                        size: 13,
                        family: 'Satoshi-Regular, Inter, sans-serif'
                    }
                },
                border: { color: 'rgba(255,255,255,0.08)' }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: 'rgba(255,255,255,0.4)',
                    font: {
                        size: 12,
                        family: 'Satoshi-Regular, Inter, sans-serif'
                    },
                    callback: (value) => `${value.toLocaleString()} ${unit}`
                },
                border: { display: false }
            }
        },
        animation: {
            duration: 900,
            easing: 'easeOutQuart'
        }
    }
}

function scrollToMethodology() {
    const el = document.getElementById('methodology')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* ── Hero ── */
.benchmark-hero {
    text-align: center;
    padding: 60px 20px 40px;
}

.benchmark-hero h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.hero-subtitle {
    max-width: 640px;
    margin: 0 auto;
    color: var(--text-muted);
    font-size: 1.15rem;
    line-height: 1.7;
}

/* ── Chart sections ── */
.chart-section {
    padding: 80px 20px;
}

.chart-layout {
    display: flex;
    align-items: center;
    gap: 60px;
    max-width: 1100px;
    margin: 0 auto;
}

.chart-explanation {
    flex: 1;
    max-width: 420px;
}

.chart-explanation h2 {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.metric-description {
    color: var(--text-muted);
    line-height: 1.8;
    font-size: 1.05rem;
    margin-bottom: 16px;
}

.metric-advantage {
    color: var(--text-muted);
    line-height: 1.8;
    font-size: 1.05rem;
    margin-bottom: 28px;
}

.metric-advantage strong {
    color: #fff;
}

.btn-methodology {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
}

.btn-methodology:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
}

.arrow-down {
    font-size: 1rem;
    transition: transform 0.3s ease;
}

.btn-methodology:hover .arrow-down {
    transform: translateY(3px);
}

.chart-container {
    flex: 1.2;
    min-height: 380px;
    padding: 30px 24px 20px;
    position: relative;
}

/* ── Methodology section ── */
.methodology-section {
    padding: 100px 20px 120px;
}

.methodology-header {
    text-align: center;
    margin-bottom: 60px;
}

.methodology-header h2 {
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
}

.methodology-intro {
    max-width: 700px;
    margin: 0 auto;
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1.8;
}

.methodology-intro strong {
    color: #fff;
}

/* ── Results table ── */
.results-table-wrapper {
    overflow-x: auto;
    padding: 4px;
    margin-bottom: 50px;
}

.results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.results-table th,
.results-table td {
    padding: 18px 20px;
    text-align: left !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.results-table thead th {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.results-table tbody td {
    color: rgba(255, 255, 255, 0.7);
}

.results-table tbody tr:last-child td {
    border-bottom: none;
}

.command-cell {
    max-width: 320px;
}

.command-cell code {
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.6);
    word-break: break-all;
}

.cooltab-col {
    color: #ffffff !important;
    font-weight: 700 !important;
}

/* ── Command explanations ── */
.command-explanations {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.explanation-card {
    padding: 28px;
}

.explanation-card h4 {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
}

.explanation-card p {
    color: var(--text-muted);
    line-height: 1.7;
    font-size: 0.95rem;
}

/* ── Responsive ── */
@media (max-width: 1000px) {
    .chart-layout {
        flex-direction: column;
        text-align: center;
        gap: 40px;
    }

    .chart-explanation {
        max-width: 100%;
    }

    .chart-container {
        width: 100%;
        min-height: 320px;
    }

    .command-explanations {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .benchmark-hero {
        padding: 40px 20px 20px;
    }

    .benchmark-hero h1 {
        font-size: 2rem;
    }

    .chart-section {
        padding: 50px 20px;
    }

    .chart-explanation h2 {
        font-size: 1.75rem;
    }

    .methodology-header h2 {
        font-size: 2rem;
    }

    .results-table th,
    .results-table td {
        padding: 12px 10px;
        font-size: 0.85rem;
    }

    .command-cell code {
        font-size: 0.7rem;
    }
}
</style>
