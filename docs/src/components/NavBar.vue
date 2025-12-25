<template>
    <nav class="navbar glass-panel">
        <div class="container nav-content">
            <router-link to="/" class="logo">
                <img class="logo" src="/src/public/cooltab_logo.svg" alt="logo" /> CoolTab
            </router-link>

            <div class="nav-links">
                <router-link to="/">Home</router-link>
                <a href="/#features">Features</a>
                <router-link to="/style">Styles</router-link>
            </div>

            <a href="#install" class="btn-primary btn-sm"> Add to Browser </a>
        </div>
    </nav>
</template>

<script setup></script>

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
.nav-links a.router-link-active {
    color: var(--text-main);
}

.btn-sm {
    padding: 8px 16px;
    font-size: 0.9rem;
}
</style>
