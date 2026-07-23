<template>
    <footer class="footer">
        <div class="footer-bg-text">CoolTab</div>

        <div class="container footer-content">
            <div class="footer-left">
                <h3>CoolTab</h3>
                <p class="footer-desc">Your browser, but cooler.</p>
                <div class="footer-meta">
                    <p>Designed for pure speed and beautiful customization.</p>
                </div>
            </div>

            <div class="footer-links-grid">
                <div class="footer-column">
                    <h4 class="fig-label">Navigation</h4>
                    <a href="#/">Home</a>
                    <a href="#/style">Styles</a>
                    <a href="#/benchmarks">Benchmarks</a>
                </div>

                <div class="footer-column">
                    <h4 class="fig-label">Community</h4>
                    <a href="https://github.com/ISO53/CoolTab" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://github.com/ISO53" target="_blank" rel="noopener noreferrer">Developer</a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="copyright">&copy; {{ new Date().getFullYear() }} CoolTab.</div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    position: relative;
    margin-top: 120px;
    padding: 100px 0 48px;
    border-top: 1px solid var(--border);
    overflow: hidden;
}

.footer-bg-text {
    position: absolute;
    bottom: -40px;
    left: 0;
    font-size: clamp(8rem, 20vw, 22rem);
    font-weight: 500;
    letter-spacing: -0.06em;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.04);
    user-select: none;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
}

.footer-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 64px;
    margin-bottom: 48px;
}

.footer-left {
    flex: 1.2;
    max-width: 400px;
}

.footer-left h3 {
    font-size: 1.75rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
    color: var(--text-main);
}

.footer-desc {
    color: var(--text-muted);
    font-size: 1.05rem;
    margin-bottom: 12px;
}

.footer-meta {
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.85rem;
    line-height: 1.6;
}

.footer-links-grid {
    flex: 1.8;
    display: flex;
    gap: 64px;
    justify-content: flex-end;
}

.footer-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.footer-column h4 {
    margin-bottom: 4px;
}

.footer-column a {
    color: var(--text-muted);
    font-size: 0.95rem;
    transition: color var(--transition);
    width: max-content;
}

.footer-column a:hover {
    color: var(--text-main);
}

.footer-bottom {
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--border);
    padding-top: 24px;
}

.copyright {
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.8rem;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
}

@media (max-width: 768px) {
    .footer {
        padding: 72px 0 40px;
        margin-top: 80px;
    }

    .footer-content {
        flex-direction: column;
        gap: 40px;
        margin-bottom: 32px;
    }

    .footer-left {
        max-width: 100%;
    }

    .footer-links-grid {
        justify-content: flex-start;
        gap: 48px;
    }

    .footer-bg-text {
        bottom: -20px;
        font-size: clamp(5rem, 20vw, 10rem);
    }
}
</style>
