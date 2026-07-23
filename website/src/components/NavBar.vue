<template>
    <nav class="navbar">
        <div class="container nav-content">
            <a href="#/" class="logo-group">
                <img class="logo-img" src="/src/public/cooltab_logo.svg" alt="logo" />
                <span class="logo-text">CoolTab</span>
            </a>

            <div class="nav-links">
                <a href="#/" :class="{ 'active-link': currentPath === '#/' || currentPath === '' || currentPath === '#' }">Home</a>
                <a href="#/style" :class="{ 'active-link': currentPath === '#/style' }">Styles</a>
                <a href="#/benchmarks" :class="{ 'active-link': currentPath === '#/benchmarks' }">Benchmarks</a>
                <a href="#/releases" :class="{ 'active-link': currentPath === '#/releases' }">Releases</a>
            </div>

            <div class="nav-actions">
                <a href="#install" class="btn-primary btn-sm desktop-only-cta">Add to Browser</a>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useNavigation } from '../navigation'

const { currentPath } = useNavigation()
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    max-width: 1200px;
    height: var(--nav-height);
    z-index: 1000;
    border-radius: var(--radius);
    padding: 0 8px;
    background: rgba(10, 10, 11, 0.85);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--nav-height);
    max-width: none;
    padding: 0 12px;
}

.logo-group {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 1.05rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-img {
    height: 28px;
    width: 28px;
}

.nav-links {
    display: flex;
    gap: 28px;
}

.nav-links a {
    font-weight: 400;
    color: var(--text-muted);
    transition: color var(--transition);
    font-size: 0.9rem;
}

.nav-links a:hover,
.nav-links a.active-link {
    color: var(--text-main);
}

.nav-actions {
    display: flex;
    align-items: center;
}

.btn-sm {
    padding: 8px 14px;
    font-size: 0.8rem;
    border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
    .navbar {
        top: 12px;
        height: 52px;
        width: calc(100% - 24px);
        padding: 0 4px;
    }

    .nav-content {
        position: relative;
        justify-content: center;
        height: 100%;
        width: 100%;
        padding: 0 8px;
    }

    .logo-group {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        display: flex;
        align-items: center;
    }

    .logo-text,
    .nav-actions {
        display: none;
    }

    .logo-img {
        height: 22px;
        width: 22px;
        display: block;
    }

    .nav-links {
        gap: 14px;
        height: 100%;
        align-items: center;
        display: flex;
    }

    .nav-links a {
        font-size: 0.8rem;
    }
}
</style>
