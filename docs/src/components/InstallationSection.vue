<template>
    <section id="install" class="install-section container">
        <div class="header">
            <h2>Install CoolTab</h2>
            <p>Available for all major browsers.</p>
        </div>

        <div class="platform-grid">
            <a
                href="https://chromewebstore.google.com/detail/cool-tab/kngdmmkbgfgogddahgjgeeigcellojog"
                target="_blank"
                class="platform-card chromium glass-panel interactive-panel"
            >
                <div class="platform-icon">
                    <img class="browser-logo" src="/src/public/chromium_logo.png" alt="Chromium Logo" />
                </div>
                <div class="platform-info">
                    <h3>Chromium</h3>
                    <span>Chrome, Edge, Brave</span>
                </div>
                <div class="action-arrow">→</div>
            </a>

            <a
                href="https://addons.mozilla.org/addon/cooltab/"
                target="_blank"
                class="platform-card firefox glass-panel interactive-panel"
            >
                <div class="platform-icon">
                    <img class="browser-logo" src="/src/public/firefox_logo.png" alt="Firefox Logo" />
                </div>
                <div class="platform-info">
                    <h3>Firefox</h3>
                    <span>Get the Add-on</span>
                </div>
                <div class="action-arrow">→</div>
            </a>
        </div>
    </section>
</template>

<style scoped>
.install-section {
    padding: 100px 20px;
}

.header {
    text-align: center;
    margin-bottom: 60px;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

p {
    color: var(--text-muted);
}

.platform-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 800px;
    margin: 0 auto;
}

.platform-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px;
    color: var(--text-main);
}

.platform-icon {
    color: var(--text-main);
}

.platform-info h3 {
    font-size: 1.25rem;
    margin-bottom: 4px;
}

.platform-info span {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.action-arrow {
    margin-left: auto;
    font-size: 1.5rem;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
}

.platform-card:hover .action-arrow {
    opacity: 1;
    transform: translateX(0);
}

.browser-logo {
    width: 48px;
    height: 48px;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
}

.platform-card:hover .browser-logo {
    filter: none;
}
</style>
