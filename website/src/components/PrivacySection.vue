<template>
    <section id="privacy" class="privacy-section container">
        <div class="feature-block">
            <div class="content">
                <span class="section-label fig-label">Security & Transparency</span>
                <h3>Private by Default, Open by Design</h3>
                <p>
                    We believe your browser data is yours alone. CoolTab operates entirely locally on your device. No
                    tracking, no analytics, no data harvesting. Our code is fully open-source on
                    <a href="https://github.com/iso53/cooltab" target="_blank" rel="noopener noreferrer">Github</a>
                    for anyone to audit, contribute to, or fork. Built by the community, for the community.
                </p>
            </div>
            <div class="visual" aria-hidden="true">
                <svg viewBox="0 0 420 420" class="privacy-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Outer construction ring -->
                    <circle cx="210" cy="210" r="168" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4 6" class="spin-slow" />
                    <circle cx="210" cy="210" r="148" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
                    <circle cx="210" cy="210" r="128" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="2 8" class="spin-rev" />

                    <!-- Tick marks -->
                    <g stroke="rgba(255,255,255,0.25)" stroke-width="1">
                        <line x1="210" y1="52" x2="210" y2="68" />
                        <line x1="210" y1="352" x2="210" y2="368" />
                        <line x1="52" y1="210" x2="68" y2="210" />
                        <line x1="352" y1="210" x2="368" y2="210" />
                    </g>

                    <!-- Shield body -->
                    <path
                        class="shield"
                        d="M210 92 L290 118 V198 C290 262 248 310 210 328 C172 310 130 262 130 198 V118 Z"
                        stroke="#F2F2F0"
                        stroke-width="1.5"
                        fill="rgba(255,255,255,0.03)"
                    />
                    <path
                        d="M210 112 L268 132 V198 C268 246 236 284 210 298 C184 284 152 246 152 198 V132 Z"
                        stroke="rgba(255,255,255,0.2)"
                        stroke-width="1"
                        fill="none"
                    />

                    <!-- Lock -->
                    <rect x="186" y="198" width="48" height="40" rx="4" stroke="#F2F2F0" stroke-width="1.4" fill="rgba(255,255,255,0.04)" class="lock-body" />
                    <path d="M196 198 V184 C196 170 202 162 210 162 C218 162 224 170 224 184 V198" stroke="#F2F2F0" stroke-width="1.4" fill="none" class="lock-shackle" />
                    <circle cx="210" cy="216" r="4" fill="#F2F2F0" class="lock-key" />
                    <line x1="210" y1="220" x2="210" y2="228" stroke="#F2F2F0" stroke-width="1.4" />

                    <!-- Scan line -->
                    <line x1="140" y1="210" x2="280" y2="210" stroke="rgba(242,242,240,0.55)" stroke-width="1" class="scan-line" />

                    <!-- Annotation leaders -->
                    <line x1="290" y1="140" x2="350" y2="110" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3 3" stroke-width="1" />
                    <circle cx="290" cy="140" r="2.5" fill="#F2F2F0" />
                    <text x="356" y="106" class="anno">LOCAL STORE</text>
                    <text x="356" y="120" class="anno muted">NO NETWORK I/O</text>

                    <line x1="130" y1="250" x2="70" y2="290" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3 3" stroke-width="1" />
                    <circle cx="130" cy="250" r="2" fill="rgba(255,255,255,0.5)" />
                    <text x="8" y="298" class="anno muted">OPEN SOURCE</text>

                    <text x="210" y="388" text-anchor="middle" class="anno muted">FIG_04 · PRIVACY BOUNDARY</text>

                    <!-- Pulse nodes -->
                    <circle cx="210" cy="92" r="3" fill="#F2F2F0" class="pulse" />
                    <circle cx="290" cy="198" r="2.5" fill="rgba(242,242,240,0.7)" class="pulse delay" />
                </svg>
            </div>
        </div>
    </section>
</template>

<style scoped>
.privacy-section {
    padding: 120px 24px;
}

.privacy-section a {
    color: var(--text-main);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: rgba(255, 255, 255, 0.35);
    transition: text-decoration-color var(--transition);
}

.privacy-section a:hover {
    text-decoration-color: var(--text-main);
}

.feature-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    max-width: 1100px;
    margin: 0 auto;
}

.content {
    flex: 1;
    max-width: 520px;
}

.section-label {
    display: inline-block;
    margin-bottom: 16px;
}

h3 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
}

p {
    color: var(--text-muted);
    line-height: 1.75;
    font-size: 1.1rem;
}

.visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 0;
}

.privacy-svg {
    width: min(420px, 100%);
    height: auto;
    display: block;
}

.privacy-svg :deep(.anno),
.anno {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    fill: #F2F2F0;
}

.anno.muted {
    fill: #8A8A90;
}

.spin-slow {
    transform-origin: 210px 210px;
    animation: spin 28s linear infinite;
}

.spin-rev {
    transform-origin: 210px 210px;
    animation: spin 40s linear infinite reverse;
}

.scan-line {
    animation: scan 3.2s ease-in-out infinite;
}

.lock-body,
.lock-shackle,
.lock-key {
    animation: lockPulse 2.8s ease-in-out infinite;
}

.pulse {
    transform-origin: center;
    transform-box: fill-box;
    animation: nodePulse 2.4s ease-in-out infinite;
}

.pulse.delay {
    animation-delay: 1.1s;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes scan {
    0%, 100% { transform: translateY(-36px); opacity: 0.2; }
    50% { transform: translateY(36px); opacity: 0.85; }
}

@keyframes lockPulse {
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
}

@keyframes nodePulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.4); }
}

@media (prefers-reduced-motion: reduce) {
    .spin-slow,
    .spin-rev,
    .scan-line,
    .lock-body,
    .lock-shackle,
    .lock-key,
    .pulse {
        animation: none;
    }
}

@media (max-width: 1000px) {
    .feature-block {
        flex-direction: column;
        align-items: flex-start;
        gap: 40px;
    }

    .visual {
        width: 100%;
    }

    .privacy-svg {
        width: min(360px, 100%);
        margin: 0 auto;
    }
}
</style>
