<template>
    <section id="privacy" class="privacy-section container">
        <div class="feature-block">
            <div class="content">
                <span class="section-label">Security & Transparency</span>
                <h3>Private by Default, Open by Design</h3>
                <p>
                    We believe your browser data is yours alone. CoolTab operates entirely locally on your device. No
                    tracking, no analytics, no data harvesting. Our code is fully open-source on 
                    <a href="https://github.com/iso53/cooltab" target="_blank" rel="noopener noreferrer">Github</a>
                    for anyone to audit, contribute to, or fork. Built by the community, for the community.
                </p>
            </div>
            <div class="visual glow-effect">
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
    </section>
</template>

<style scoped>
.privacy-section {
    padding: 120px 20px;
}

.privacy-section a {
    color: white;
    text-decoration: underline;
    text-underline-offset: 4px;
}

.feature-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 80px;
    max-width: 1100px;
    margin: 0 auto;
}

.content {
    flex: 1;
    max-width: 600px;
}

.section-label {
    display: inline-block;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 16px;
}

h3 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    color: white;
}

p {
    color: var(--text-muted);
    line-height: 1.8;
    font-size: 1.15rem;
}

.visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 350px;
}

.visual svg {
    z-index: 2;
    transition: transform 0.5s ease;
    color: white;
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
    width: 250px;
    height: 250px;
    border-radius: 50%;
    filter: blur(100px);
    z-index: 1;
    opacity: 0.4;
    transition: opacity 0.3s ease;
    background: rgba(255, 255, 255, 0.4);
}

.visual:hover .glow-effect::before {
    opacity: 0.6;
}

@media (max-width: 1000px) {
    .feature-block {
        flex-direction: column;
        text-align: left;
        gap: 40px;
    }

    .content {
        margin: 0;
    }

    .visual {
        min-height: 200px;
    }

    h3 {
        font-size: 2.5rem;
    }
}
</style>
