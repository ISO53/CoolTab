<template>
    <footer class="footer">
        <!-- Faded massive outline background text with soft glow shadow (almost full width) -->
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
                    <h4>Navigation</h4>
                    <a href="#/">Home</a>
                    <a href="#/style">Styles</a>
                    <a href="#/benchmarks">Benchmarks</a>
                </div>
                
                <div class="footer-column">
                    <h4>Community</h4>
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
    margin-top: 180px;
    padding: 160px 0 80px; /* Extremely tall to accommodate the massive background text */
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(5, 5, 5, 0) 100%);
    border-top: 1px solid var(--glass-border);
    overflow: hidden;
}

/* Faded massive outline background text with soft glow shadow (almost full width) */
.footer-bg-text {
    position: absolute;
    bottom: -50px;
    left: 0;
    font-size: clamp(8rem, 20vw, 26rem); /* Scaled up to 20vw to span almost full width */
    font-weight: 950;
    letter-spacing: -0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.015); /* Increased from 0.003 to 1.5% opacity */
    -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.04); /* Increased from 0.012 to 4% opacity */
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.03)); /* Slightly enhanced glow shadow */
    user-select: none;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
    text-align: left;
}

.footer-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    gap: 80px;
    margin-bottom: 65px;
}

.footer-left {
    flex: 1.2;
    max-width: 400px;
}

.footer-left h3 {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #ffffff, #888888);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-desc {
    color: var(--text-muted);
    font-size: 1.15rem;
    margin-bottom: 16px;
}

.footer-meta {
    color: rgba(255, 255, 255, 0.2);
    font-size: 0.85rem;
    line-height: 1.6;
}

.footer-links-grid {
    flex: 1.8;
    display: flex;
    gap: 80px;
    justify-content: flex-end;
}

.footer-column {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.footer-column h4 {
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.footer-column a {
    color: var(--text-muted);
    font-size: 0.95rem;
    transition: all 0.2s ease;
    width: max-content;
}

.footer-column a:hover {
    color: #ffffff;
    transform: translateX(4px);
}

.footer-bottom {
    position: relative;
    z-index: 1;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 30px;
    margin-top: 40px;
}

.copyright {
    text-align: left;
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.85rem;
    letter-spacing: 0.02em;
}

@media (max-width: 768px) {
    .footer {
        padding: 100px 0 50px;
        margin-top: 100px;
    }
    
    .footer-content {
        flex-direction: column;
        gap: 50px;
        margin-bottom: 40px;
    }
    
    .footer-left {
        max-width: 100%;
    }
    
    .footer-links-grid {
        justify-content: flex-start;
        gap: 60px;
    }
    
    .footer-bg-text {
        bottom: -25px;
        left: 0;
        transform: none;
        font-size: clamp(5rem, 20vw, 10rem);
    }
}
</style>
