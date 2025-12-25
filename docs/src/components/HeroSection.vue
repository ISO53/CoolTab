<template>
    <section class="hero">
        <div class="container hero-content">
            <h1 class="hero-title">Just a new tab,<br />but <span class="gradient-text">cooler</span>.</h1>
            <p class="hero-subtitle">
                Customize your browser's new tab with widgets, themes, and more. Experience the next level of
                productivity and aesthetics.
            </p>

            <div class="hero-actions">
                <a href="#install" class="btn-primary"> Install Extension </a>
                <a href="#features" class="btn-secondary"> Explore Features </a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero {
    position: relative;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero-title {
    font-size: 5rem;
    line-height: 1.1;
    font-weight: 700;
    margin-bottom: 24px;
}

.gradient-text {
    background: linear-gradient(135deg, #ff4fd8 0%, #c77dff 30%, #4ea8ff 70%, #00b4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 600px;
    margin-bottom: 40px;
}

.hero-actions {
    display: flex;
    gap: 20px;
}

.btn-secondary {
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: var(--glass-bg);
    color: white;
    font-weight: 600;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}
</style>
