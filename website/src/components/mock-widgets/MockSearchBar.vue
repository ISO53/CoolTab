<template>
    <MockWidget size="2x1">
        <div class="search-widget">
            <div class="search-container">
                <div class="search-box">
                    <span class="icon">🔍</span>
                    <span class="placeholder">Search anything...</span>
                </div>
                <div class="engines">
                    <div class="engine active">G</div>
                    <div class="engine">B</div>
                    <div class="engine">D</div>
                </div>
            </div>
            <div class="shortcuts">
                <div v-for="s in ['GitHub', 'Reddit', 'YouTube', 'Vite', 'Vue']" :key="s" class="shortcut">
                    {{ s }}
                </div>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import MockWidget from './MockWidget.vue';
</script>

<style scoped>
.search-widget {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    color: white;
}

.search-container {
    display: flex;
    gap: 10px;
}

.search-box {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.placeholder {
    opacity: 0.5;
    font-size: 6cqh;
}

.engines {
    display: flex;
    gap: 5px;
}

.engine {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.engine.active {
    background: #4ea8ff;
    color: black;
}

.shortcuts {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.shortcut {
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 4.5cqh;
    opacity: 0.8;
}
</style>
