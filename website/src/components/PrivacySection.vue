<template>
    <section id="privacy" class="privacy-section container">
        <!-- Privacy Block (Left Text, Right Icon) -->
        <div class="feature-block">
            <div class="content">
                <div class="label-badge">Security</div>
                <h3>Privacy First</h3>
                <p>
                    We believe your browser data is yours alone. CoolTab operates entirely locally on your device. No
                    tracking, no analytics, no data harvesting. Your digital footprint remains yours.
                </p>
            </div>
            <div class="visual glow-effect gold">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M12 8v4"></path>
                    <path d="M12 16h.01"></path>
                </svg>
            </div>
        </div>

        <!-- Open Source Block (Left Icon, Right Text) -->
        <div class="feature-block reverse">
            <div class="visual glow-effect white">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            </div>
            <div class="content">
                <div class="label-badge">Transparency</div>
                <h3>Open Source</h3>
                <p>
                    Full transparency is our promise. The code is available on 
                    <a href="https://github.com/iso53/cooltab" target="_blank" rel="noopener noreferrer">Github</a>
                    for anyone to audit, contribute
                    to, or fork. Built by the community, for the community.
                </p>
            </div>
        </div>
    </section>
</template>

<style scoped>
.privacy-section {
    padding: 120px 20px;
    display: flex;
    flex-direction: column;
    gap: 120px;
}

.privacy-section a {
    color: #dadada;
    transition: color 0.3s ease;
}

.privacy-section a:hover {
    color: white;
}

.feature-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
}

.feature-block.reverse {
    flex-direction: row-reverse;
}

.content {
    flex: 1;
    max-width: 500px;
}

.label-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
}

h3 {
    font-size: 2.5rem;
    margin-bottom: 24px;
    background: linear-gradient(90deg, #fff, #aaa);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

p {
    color: var(--text-muted);
    line-height: 1.8;
    font-size: 1.1rem;
}

.visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 300px;
}

.visual svg {
    z-index: 2;
    transition: transform 0.5s ease;
}

.visual:hover svg {
    transform: scale(1.1) rotate(5deg);
}

.glow-effect::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 1;
    opacity: 0.4;
    transition: opacity 0.3s ease;
}

.visual:hover .glow-effect::before {
    opacity: 0.6;
}

.glow-effect.gold::before {
    background: rgba(255, 255, 255, 0.5); /* Changed to white/silver */
}

.glow-effect.white::before {
    background: #ffffff;
}

@media (max-width: 900px) {
    .feature-block,
    .feature-block.reverse {
        flex-direction: column;
        text-align: center;
        gap: 40px;
    }

    .content {
        margin: 0 auto;
    }

    .visual {
        min-height: 200px;
    }
}
</style>
