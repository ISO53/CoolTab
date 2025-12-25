<template>
    <nav class="navbar glass-panel">
        <div class="container nav-content">
            <a href="#/" class="logo">
                <img class="logo" src="/src/public/cooltab_logo.svg" alt="logo" /> CoolTab
            </a>

            <div class="nav-links">
                <a href="#/" :class="{ 'active-link': currentPath === '#/' || currentPath === '' || currentPath === '#' }">Home</a>
                <a href="#features" @click="handleScroll">Features</a>
                <a href="#/style" :class="{ 'active-link': currentPath === '#/style' }">Styles</a>
            </div>

            <a href="#install" class="btn-primary btn-sm"> Add to Browser </a>
        </div>
    </nav>
</template>

<script setup>
import { useNavigation } from '../navigation'

const { currentPath } = useNavigation()

const handleScroll = (e) => {
    // If we are not on home page, we should go home first then scroll
    // But since this is a SPA without router, we can just let it scroll if the element exists
    // or manually navigate if we are on #/style
    if (window.location.hash.startsWith('#/style')) {
        window.location.hash = '#/'
        // Wait for component to mount then scroll
        setTimeout(() => {
            const el = document.querySelector('#features')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }
}
</script>

<style scoped>
.logo {
    height: 48px;
    width: 48px;
}

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
    padding: 0 10px;
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.logo {
    font-weight: 700;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-links {
    display: flex;
    gap: 30px;
}

.nav-links a {
    font-weight: 500;
    color: var(--text-muted);
    transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active-link {
    color: var(--text-main);
}

.btn-sm {
    padding: 8px 16px;
    font-size: 0.9rem;
}
</style>
