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
                <div class="chart-container">
                    <div class="chart-meta">
                        <span class="fig-label">FIG_A · LOAD</span>
                        <span class="fig-label">LOWER IS BETTER</span>
                    </div>
                    <div class="chart-plot">
                        <Bar :data="loadTimeData" :options="chartOptions('ms')" />
                    </div>
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
                <div class="chart-container">
                    <div class="chart-meta">
                        <span class="fig-label">FIG_B · MEMORY</span>
                        <span class="fig-label">LOWER IS BETTER</span>
                    </div>
                    <div class="chart-plot">
                        <Bar :data="memoryData" :options="chartOptions('KB')" />
                    </div>
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
                <div class="chart-container">
                    <div class="chart-meta">
                        <span class="fig-label">FIG_C · LCP</span>
                        <span class="fig-label">LOWER IS BETTER</span>
                    </div>
                    <div class="chart-plot">
                        <Bar :data="lcpData" :options="chartOptions('ms')" />
                    </div>
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
const coolTabColor = 'rgba(242, 242, 240, 0.92)'
const coolTabColorHover = 'rgba(255, 255, 255, 1)'
const competitorColor = 'rgba(255, 255, 255, 0.06)'
const competitorColorHover = 'rgba(255, 255, 255, 0.12)'

function makeDataset(label, sortedBrowsers, sortedValues) {
    const bgColors = sortedBrowsers.map(b => b === 'CoolTab' ? coolTabColor : competitorColor)
    const hoverColors = sortedBrowsers.map(b => b === 'CoolTab' ? coolTabColorHover : competitorColorHover)
    const borderColors = sortedBrowsers.map(b => b === 'CoolTab' ? 'rgba(242,242,240,0.95)' : 'rgba(255,255,255,0.18)')

    return {
        labels: sortedBrowsers,
        datasets: [{
            label,
            data: sortedValues,
            backgroundColor: bgColors,
            hoverBackgroundColor: hoverColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 0,
            borderSkipped: false,
            barPercentage: 0.55,
            categoryPercentage: 0.72
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
    const mono = "'IBM Plex Mono', ui-monospace, monospace"
    return {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { top: 28, right: 8, left: 4, bottom: 4 }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#151517',
                titleColor: '#F2F2F0',
                bodyColor: '#8A8A90',
                borderColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                cornerRadius: 6,
                padding: 12,
                titleFont: { family: mono, size: 11, weight: '500' },
                bodyFont: { family: mono, size: 11 },
                displayColors: false,
                callbacks: {
                    label: (ctx) => `${ctx.parsed.y.toLocaleString()} ${unit}`
                }
            },
            datalabels: {
                color: (ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex]
                    return label === 'CoolTab' ? '#F2F2F0' : 'rgba(255,255,255,0.45)'
                },
                anchor: 'end',
                align: 'end',
                offset: 6,
                font: {
                    size: 11,
                    weight: '500',
                    family: mono
                },
                formatter: (value) => `${value.toLocaleString()} ${unit}`
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255,255,255,0.04)',
                    drawTicks: false,
                    lineWidth: 1
                },
                ticks: {
                    color: 'rgba(255,255,255,0.45)',
                    font: {
                        size: 11,
                        family: mono
                    },
                    padding: 10
                },
                border: { color: 'rgba(255,255,255,0.12)', width: 1 }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255,255,255,0.06)',
                    drawTicks: false,
                    lineWidth: 1
                },
                ticks: {
                    color: 'rgba(255,255,255,0.35)',
                    font: {
                        size: 10,
                        family: mono
                    },
                    padding: 8,
                    callback: (value) => `${value.toLocaleString()} ${unit}`
                },
                border: { color: 'rgba(255,255,255,0.12)', width: 1, dash: [3, 3] }
            }
        },
        animation: {
            duration: 700,
            easing: 'easeOutCubic'
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
    font-weight: 500;
    letter-spacing: -0.03em;
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
    font-weight: 500;
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
    padding: 10px 18px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color var(--transition), color var(--transition), background-color var(--transition);
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
    min-height: 400px;
    padding: 0;
    position: relative;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.chart-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: #111113;
}

.chart-plot {
    flex: 1;
    min-height: 340px;
    padding: 16px 16px 12px;
    position: relative;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 24px 24px;
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
    font-weight: 500;
    letter-spacing: -0.03em;
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
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
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
    color: #F2F2F0 !important;
    font-family: var(--font-mono);
    font-weight: 500 !important;
}

.results-table tbody td:not(.command-cell) {
    font-family: var(--font-mono);
    font-size: 0.9rem;
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
        min-height: 360px;
    }

    .chart-plot {
        min-height: 300px;
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
