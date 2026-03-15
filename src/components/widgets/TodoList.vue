<template>
    <Widget class="todo-widget">
        <div class="todo-list">
            <h2 class="title" v-if="settingsStore.todoItems.length === 0">Tasks</h2>
            <div class="tasks-container" ref="tasksContainer">
                <div v-for="item in settingsStore.todoItems" :key="item.id" class="task-item"
                    :class="{ done: item.done }">
                    <div class="checkbox" @click="toggleTask(item)">
                        <Svg v-if="item.done" :class_name="'material-icons-outlined'" :name="'check_box'"></Svg>
                        <Svg v-else :class_name="'material-icons-outlined'" :name="'check_box_outline_blank'"></Svg>
                    </div>
                    <span class="task-text" @click="toggleTask(item)">{{ item.text }}</span>
                    <div class="remove-btn" @click="removeTask(item.id)">
                        <Svg :class_name="'material-icons-outlined'" :name="'close'"></Svg>
                    </div>
                </div>
            </div>

            <div class="input-container">
                <input type="text" v-model="newTask" @keypress.enter="addTask"
                    :placeholder="isLimitReached && !hasFinishedTasks ? 'Limit reached (Remove some tasks)' : 'Add a task...'"
                    :disabled="isLimitReached && !hasFinishedTasks" class="todo-input" />
                <div v-if="newTask" class="enter-hint">
                    <Svg :class_name="'material-icons-outlined'" :name="'keyboard_return'"></Svg>
                </div>
            </div>
        </div>
    </Widget>
</template>

<script>
import Widget from "./Widget.vue";
import Svg from "../ui/Svg.vue";
import { useSettingsStore } from "@/settings";

export default {
    name: "TodoList",
    components: {
        Widget,
    },
    setup() {
        const settingsStore = useSettingsStore();
        return { settingsStore };
    },
    data() {
        return {
            newTask: "",
        };
    },
    computed: {
        isLimitReached() {
            return this.settingsStore.todoItems.length >= this.settingsStore.todoMaxTasks;
        },
        hasFinishedTasks() {
            return this.settingsStore.todoItems.some(item => item.done);
        }
    },
    methods: {
        addTask() {
            const text = this.newTask.trim();
            if (!text) return;

            if (this.isLimitReached) {
                // Try to delete oldest finished task
                const finishedIndex = this.settingsStore.todoItems.findIndex(item => item.done);
                if (finishedIndex !== -1) {
                    const items = [...this.settingsStore.todoItems];
                    items.splice(finishedIndex, 1);
                    this.settingsStore.setTodoItems(items);
                } else {
                    // Cannot add, limit reached and no finished tasks
                    return;
                }
            }

            const items = [...this.settingsStore.todoItems];
            items.push({
                id: Date.now(),
                text,
                done: false,
            });
            this.settingsStore.setTodoItems(items);
            this.newTask = "";

            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        toggleTask(item) {
            const items = this.settingsStore.todoItems.map(i => {
                if (i.id === item.id) {
                    return { ...i, done: !i.done };
                }
                return i;
            });
            this.settingsStore.setTodoItems(items);
        },
        removeTask(id) {
            const items = this.settingsStore.todoItems.filter(i => i.id !== id);
            this.settingsStore.setTodoItems(items);
        },
        scrollToBottom() {
            const container = this.$refs.tasksContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }
    },
};
</script>

<style scoped>
.todo-widget {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.todo-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
}

.title {
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    color: var(--color-tertiary-text);
    margin-bottom: 10px;
    text-align: center;
}

.tasks-container {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
}

.task-item {
    display: flex;
    align-items: center;
    padding: 4px 6px 4px 6px;
    gap: 8px;
    position: relative;
    border-radius: 5px;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
}

.task-item:hover {
    background-color: color-mix(in srgb, var(--color-secondary-background), var(--color-primary-text) 20%);
}

.checkbox {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--color-secondary-text);
    transition: color 0.2s ease;
}

.task-item:hover .checkbox {
    color: var(--color-primary-text);
}

.checkbox :deep(i) {
    font-size: 1.2rem !important;
}

.task-text {
    font-size: 0.95rem;
    color: var(--color-primary-text);
    cursor: pointer;
    flex-grow: 1;
    word-break: break-word;
    transition: all 0.2s ease;
}

.task-item.done .task-text {
    text-decoration: line-through;
    color: var(--color-tertiary-text);
    opacity: 0.6;
}

.remove-btn {
    opacity: 0;
    cursor: pointer;
    color: var(--color-tertiary-text);
    transition: all 0.2s ease;
}

.task-item:hover .remove-btn {
    opacity: 1;
}

.remove-btn:hover {
    color: #ff5555;
}

.remove-btn :deep(i) {
    font-size: 1.1rem !important;
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.todo-input {
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    padding: 8px 30px 8px 10px;
    color: var(--color-primary-text);
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.todo-input:focus {
    outline: none;
    border-color: var(--color-tertiary-text);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.todo-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-secondary-background);
}

.todo-input::placeholder {
    color: var(--color-secondary-text);
    font-size: 0.85rem;
}

.enter-hint {
    position: absolute;
    right: 8px;
    color: var(--color-tertiary-text);
    display: flex;
    align-items: center;
    pointer-events: none;
}

.enter-hint :deep(i) {
    font-size: 0.9rem !important;
}
</style>
