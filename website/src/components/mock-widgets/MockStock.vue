<template>
    <MockWidget size="1x1">
        <div class="stock-widget">
            <svg class="graph" width="200" height="200" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 60 L 10 55 L 20 65 L 30 40 L 40 50 L 50 30 L 60 45 L 70 20 L 80 35 L 90 15 L 100 25" stroke="var(--accent)" stroke-width="3" fill="none" />
                <path d="M 0 60 L 10 55 L 20 65 L 30 40 L 40 50 L 50 30 L 60 45 L 70 20 L 80 35 L 90 15 L 100 25 L 100 100 L 0 100 Z" fill="url(#grad)" />
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div class="info">
                <h2 class="ticker">AAPL</h2>
                <p class="diff">+2.45%</p>
                <h1 class="price">$189.42</h1>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import MockWidget from './MockWidget.vue';
</script>

<style scoped>
.stock-widget {
    --accent: rgba(255, 255, 255, 0.3);
    padding: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    color: white;
}

.graph {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.info {
    position: relative;
    z-index: 2;
}

.ticker {
    font-size: 10cqw;
    margin: 0;
    font-weight: 700;
}

.diff {
    font-size: 7cqw;
    color: rgba(255, 255, 255, 0.5);
    margin: 2px 0;
}

.price {
    font-size: 18cqw;
    margin: 0;
    font-weight: 700;
}
</style>
