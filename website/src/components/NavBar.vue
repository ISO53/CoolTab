<template>
    <nav class="navbar glass-panel">
        <div class="container nav-content">
            <a href="#/" class="logo-group">
                <img class="logo-img" src="/src/public/cooltab_logo.svg" alt="logo" /> 
                <span class="logo-text">CoolTab</span>
            </a>

            <div class="nav-links">
                <a href="#/" :class="{ 'active-link': currentPath === '#/' || currentPath === '' || currentPath === '#' }">Home</a>
                <a href="#/style" :class="{ 'active-link': currentPath === '#/style' }">Styles</a>
                <a href="#/benchmarks" :class="{ 'active-link': currentPath === '#/benchmarks' }">Benchmarks</a>
            </div>

            <div class="nav-actions">
                <a href="#install" class="btn-primary btn-sm desktop-only-cta"> Add to Browser </a>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useNavigation } from '../navigation'

const { currentPath } = useNavigation()

const handleScroll = (e) => {
    if (window.location.hash.startsWith('#/style')) {
        window.location.hash = '#/'
        setTimeout(() => {
            const el = document.querySelector('#features')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }
}
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    height: var(--nav-height);
    z-index: 1000;
    border-radius: 50px;
    padding: 0 20px;
    transition: all 0.3s ease;
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--nav-height);
}

.logo-group {
    font-weight: 700;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-img {
    height: 32px;
    width: 32px;
}

.nav-links {
    display: flex;
    gap: 30px;
}

.nav-links a {
    font-weight: 500;
    color: var(--text-muted);
    transition: color 0.3s;
    font-size: 0.95rem;
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
    padding: 8px 16px;
    font-size: 0.85rem;
    border-radius: 20px;
}

@media (max-width: 768px) {
    .navbar {
        top: 15px;
        height: 48px;
        width: 90%;
        padding: 0 15px;
        border-radius: 50px;
    }

    .nav-content {
        position: relative;
        justify-content: center; /* Centers the links */
        height: 100%;
        width: 100%;
    }

    .logo-group {
        position: absolute;
        left: 0;
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
        gap: 15px;
        height: 100%;
        align-items: center;
        display: flex;
    }

    .nav-links a {
        font-size: 0.85rem;
        padding: 0;
        margin: 0;
        line-height: 1;
    }
}
</style>
