<template>
    <section id="install" class="install-section container">
        <div class="header">
            <p class="fig-label">Get Started</p>
            <h2>Install CoolTab</h2>
            <p>Available for all major browsers.</p>
        </div>

        <div class="platform-grid">
            <a
                href="https://chromewebstore.google.com/detail/cool-tab/kngdmmkbgfgogddahgjgeeigcellojog"
                target="_blank"
                class="platform-card"
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
                class="platform-card"
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
    padding: 120px 24px;
}

.header {
    text-align: center;
    margin-bottom: 48px;
}

.header h2 {
    font-size: clamp(2.25rem, 5vw, 3.25rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    margin: 16px 0 12px;
}

.header p:last-child {
    color: var(--text-muted);
    font-size: 1.05rem;
}

.platform-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 800px;
    margin: 0 auto;
}

.platform-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 28px 24px;
    color: var(--text-main);
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color var(--transition);
}

.platform-card:hover {
    border-color: var(--border-hover);
}

.platform-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    border: none;
    padding: 0;
}

.platform-info h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 4px;
}

.platform-info span {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.action-arrow {
    margin-left: auto;
    font-size: 1.25rem;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity var(--transition), transform var(--transition);
    color: var(--text-muted);
}

.platform-card:hover .action-arrow {
    opacity: 1;
    transform: translateX(0);
}

.browser-logo {
    width: 48px;
    height: 48px;
    filter: grayscale(100%);
    transition: filter var(--transition);
}

.platform-card:hover .browser-logo {
    filter: none;
}

@media (max-width: 768px) {
    .install-section {
        padding: 80px 24px;
    }

    .header {
        text-align: left;
    }

    .platform-grid {
        grid-template-columns: 1fr;
    }

    .action-arrow {
        opacity: 1;
        transform: none;
    }
}
</style>
