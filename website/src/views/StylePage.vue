<template>
    <div class="style-page container">
        <header class="page-header">
            <h1>Community Styles</h1>
            <p>
                Browse and apply stunning community-made themes directly from within your CoolTab application.
            </p>
        </header>

        <StyleGrid />
    </div>
</template>

<script setup>
import StyleGrid from "../components/StyleGrid.vue";
</script>

<style scoped>
.style-page {
    padding-bottom: 100px;
    max-width: 1600px !important;
}

.page-header {
    text-align: center;
    margin: 120px 0 80px;
}

.page-header h1 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.page-header p {
    color: var(--text-muted);
    font-size: 1.15rem;
}
</style>
