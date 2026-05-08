<template>
    <MockWidget size="1x1">
        <div class="todo-widget">
            <h2 class="title">Tasks</h2>
            <div class="todo-list">
                <div v-for="(todo, i) in todos" :key="i" class="todo-item" :class="{ done: todo.done }">
                    <div class="checkbox">
                        <span v-if="todo.done">✓</span>
                    </div>
                    <span class="text">{{ todo.text }}</span>
                </div>
            </div>
        </div>
    </MockWidget>
</template>

<script setup>
import MockWidget from './MockWidget.vue';

const todos = [
    { text: 'Finish landing page', done: true },
    { text: 'Write documentation', done: false },
    { text: 'Release v1.0', done: false },
    { text: 'Lunch with team', done: false },
];
</script>

<style scoped>
.todo-widget {
    padding: 15px;
    height: 100%;
    color: white;
}

.title {
    font-size: 8cqw;
    margin-bottom: 10px;
    font-weight: 700;
}

.todo-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.todo-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 6cqw;
}

.todo-item.done .text {
    text-decoration: line-through;
    opacity: 0.5;
}

.checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
}

.todo-item.done .checkbox {
    background: #00f5d4;
    border-color: #00f5d4;
    color: black;
}
</style>
