<template>
    <div class="style-page container">
        <header class="page-header">
            <h1>Community Styles</h1>
            <p>
                Discover unique layouts designed by the CoolTab community. Copy it's ID, import it from your Cool Tab
                and that's it!
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
}

.page-header {
    text-align: center;
    margin: 60px 0;
}

.page-header h1 {
    font-size: 3rem;
    margin-bottom: 16px;
}

.page-header p {
    color: var(--text-muted);
    font-size: 1.2rem;
}
</style>
