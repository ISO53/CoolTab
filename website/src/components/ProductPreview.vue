<script setup>
import previewImage from '../assets/preview.jpg';
</script>

<template>
    <section class="product-preview" aria-label="CoolTab product preview">
        <div class="preview-frame">
            <div class="chrome">
                <div class="chrome-dots">
                    <span></span><span></span><span></span>
                </div>
                <div class="chrome-address">
                    <span class="fig-label">cooltab · new tab</span>
                </div>
            </div>
            <div class="preview-body">
                <img
                    :src="previewImage"
                    alt="CoolTab dashboard with widgets on a dark theme"
                    class="preview-image"
                    width="1920"
                    height="877"
                />
            </div>
            <div class="preview-meta">
                <span class="fig-label">FIG_00</span>
                <span class="fig-label">Dashboard Composition</span>
            </div>
        </div>
    </section>
</template>

<style scoped>
.product-preview {
    width: 100%;
    padding: 0 24px 80px;
    max-width: 1280px;
    margin: 0 auto;
}

.preview-frame {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
}

.chrome {
    height: 40px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    background: #111113;
}

.chrome-dots {
    display: flex;
    gap: 6px;
}

.chrome-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
}

.chrome-address {
    flex: 1;
    display: flex;
    justify-content: center;
}

.preview-body {
    position: relative;
    aspect-ratio: 1920 / 877;
    background: #000;
    line-height: 0;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.preview-meta {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
    .product-preview {
        padding: 0 16px 48px;
    }

    .chrome {
        height: 36px;
    }
}
</style>
