<template>
    <Teleport to="body">
    <Transition name="overlay">
        <div v-if="show" class="overlay" @click="$emit('close')">
            <div class="panel" @click.stop>
                <button class="panel-close-btn" @click="$emit('close')" title="Close">
                    <i class="material-icons-outlined">close</i>
                </button>

                <div class="header">
                    <i class="material-icons-outlined">help_outline</i>
                    <h1>Stock Search Guide</h1>
                </div>
                
                <div class="content">
                    <p class="intro">
                        CoolTab uses Yahoo Finance symbols to track real-time data. You can search for stocks, cryptocurrencies, currencies, and more.
                    </p>

                    <div class="guide-grid">
                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">trending_up</i>
                                <h3>Stocks</h3>
                            </div>
                            <p>Use standard ticker symbols for US markets. For international markets, append the exchange suffix.</p>
                            <ul>
                                <li><b>AAPL</b> - Apple Inc. (US)</li>
                                <li><b>VOW3.DE</b> - Volkswagen (Germany)</li>
                                <li><b>OR.PA</b> - L'Oréal (France)</li>
                                <li><b>BARC.L</b> - Barclays (UK)</li>
                            </ul>
                        </div>

                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">currency_bitcoin</i>
                                <h3>Crypto</h3>
                            </div>
                            <p>Track cryptocurrencies by pairing them with a fiat currency (USD, EUR, GBP, etc.).</p>
                            <ul>
                                <li><b>BTC-USD</b> - Bitcoin</li>
                                <li><b>ETH-EUR</b> - Ethereum</li>
                                <li><b>SOL-GBP</b> - Solana</li>
                                <li><b>DOGE-USD</b> - Dogecoin</li>
                            </ul>
                        </div>

                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">payments</i>
                                <h3>Currencies</h3>
                            </div>
                            <p>Monitor Forex exchange rates by adding the <b>=X</b> suffix to the currency pair.</p>
                            <ul>
                                <li><b>EURUSD=X</b> - Euro to US Dollar</li>
                                <li><b>JPY=X</b> - Japanese Yen</li>
                                <li><b>GBPUSD=X</b> - British Pound to US Dollar</li>
                            </ul>
                        </div>

                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">inventory_2</i>
                                <h3>Commodities</h3>
                            </div>
                            <p>Track commodity prices using their futures symbols with the <b>=F</b> suffix.</p>
                            <ul>
                                <li><b>GC=F</b> - Gold</li>
                                <li><b>SI=F</b> - Silver</li>
                                <li><b>CL=F</b> - Crude Oil</li>
                                <li><b>NG=F</b> - Natural Gas</li>
                            </ul>
                        </div>

                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">account_balance</i>
                                <h3>Turkish Market (BIST)</h3>
                            </div>
                            <p>Follow Borsa Istanbul stocks by adding the <b>.IS</b> suffix.</p>
                            <ul>
                                <li><b>THYAO.IS</b> - Türk Hava Yolları</li>
                                <li><b>ASELS.IS</b> - Aselsan</li>
                                <li><b>EREGL.IS</b> - Erdemir</li>
                            </ul>
                        </div>

                        <div class="guide-item">
                            <div class="item-header">
                                <i class="material-icons-outlined">pie_chart</i>
                                <h3>Market Indices</h3>
                            </div>
                            <p>Track major market indices using the <b>^</b> prefix.</p>
                            <ul>
                                <li><b>^GSPC</b> - S&P 500</li>
                                <li><b>^DJI</b> - Dow Jones</li>
                                <li><b>^IXIC</b> - NASDAQ</li>
                                <li><b>^FTSE</b> - FTSE 100</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
    </Teleport>
</template>

<script>
export default {
    name: "StockGuidePopup",
    props: {
        show: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: color-mix(in srgb, var(--color-primary-background), transparent 60%);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20000;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: opacity 300ms ease, backdrop-filter 300ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

.panel {
    background-color: var(--color-primary-background);
    border: 1px solid var(--color-border-line);
    border-radius: 24px;
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    padding: 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.panel-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-tertiary-text);
    transition: background-color 200ms ease, color 200ms ease;
}

.panel-close-btn:hover {
    background-color: var(--color-secondary-background);
    color: var(--color-primary-text);
}

.panel-close-btn i {
    font-size: 1.5rem;
}

.overlay-enter-active .panel,
.overlay-leave-active .panel {
    transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease;
}

.overlay-enter-from .panel,
.overlay-leave-to .panel {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.header i {
    font-size: 2rem;
    color: var(--color-primary-text);
}

.header h1 {
    font-family: Satoshi-Bold;
    font-size: 1.8rem;
    margin: 0;
    color: var(--color-primary-text);
}

.content {
    overflow-y: auto;
    padding-right: 8px;
}

.content::-webkit-scrollbar {
    width: 6px;
}

.content::-webkit-scrollbar-track {
    background: transparent;
}

.content::-webkit-scrollbar-thumb {
    background: var(--color-border-line);
    border-radius: 10px;
}

.intro {
    font-family: Satoshi-Medium;
    color: var(--color-secondary-text);
    line-height: 1.6;
    margin-bottom: 32px;
    font-size: 1rem;
}

.guide-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding-bottom: 10px;
}

.guide-item {
    background: color-mix(in srgb, var(--color-secondary-background), transparent 40%);
    border: 1px solid var(--color-border-line);
    border-radius: 16px;
    padding: 20px;
}

.item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.item-header i {
    font-size: 1.2rem;
    color: var(--color-primary-text);
}

.item-header h3 {
    margin: 0;
    font-family: Satoshi-Bold;
    font-size: 1.1rem;
    color: var(--color-primary-text);
}

.guide-item p {
    font-size: 0.9rem;
    color: var(--color-secondary-text);
    line-height: 1.4;
    margin-bottom: 12px;
}

.guide-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.guide-item li {
    font-size: 0.85rem;
    color: var(--color-tertiary-text);
    font-family: Satoshi-Regular;
}

.guide-item b {
    color: var(--color-primary-text);
    font-family: Satoshi-Bold;
    background: var(--color-secondary-background);
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 4px;
}

.actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    background-color: var(--color-primary-text);
    color: var(--color-primary-background);
    border: none;
    padding: 12px 32px;
    border-radius: 12px;
    font-family: Satoshi-Bold;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 200ms ease, opacity 200ms ease;
}

.close-btn:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}

.close-btn:active {
    transform: translateY(0);
}

@media (max-width: 600px) {
    .guide-grid {
        grid-template-columns: 1fr;
    }
}
</style>
