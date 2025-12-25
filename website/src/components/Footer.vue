<template>
    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-left">
                <h3>CoolTab</h3>
                <p>Your browser, but cooler.</p>
            </div>
            <div class="footer-right">
                <a href="https://github.com/ISO53/CoolTab" target="_blank">GitHub</a>
                <a href="#privacy">Privacy</a>
                <a href="https://github.com/ISO53" target="_blank">Contact</a>
            </div>
        </div>
        <div class="copyright">&copy; {{ new Date().getFullYear() }} CoolTab. All rights reserved.</div>
    </footer>
</template>

<style scoped>
.footer {
    margin-top: 100px;
    padding: 60px 0 20px;
    background: linear-gradient(to top, #000 0%, transparent 100%);
    border-top: 1px solid var(--glass-border);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
}

.footer-left h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #fff, #aaa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.footer-left p {
    color: var(--text-muted);
}

.footer-right {
    display: flex;
    gap: 20px;
}

.footer-right a {
    color: var(--text-muted);
}

.footer-right a:hover {
    color: var(--text-main);
}

.copyright {
    text-align: center;
    color: #555;
    font-size: 0.9rem;
}
</style>
