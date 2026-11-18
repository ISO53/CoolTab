<template>
    <div ref="root" class="dropdown-button">
        <div class="split-button" :class="{open: isOpen}">
            <button class="action-segment" :disabled="disabled" @click="$emit('action')">
                <i v-if="icon" class="material-icons-outlined">{{ icon }}</i>
                <span>{{ action }}</span>
            </button>
            <button
                class="menu-segment"
                :disabled="disabled"
                :title="title"
                @click="toggle"
            >
                <i class="material-icons-outlined" :class="{rotate: isOpen}">keyboard_arrow_down</i>
            </button>
        </div>

        <Teleport to="body">
            <ul v-if="isOpen" ref="menu" class="dropdown-menu" :style="menuStyle">
                <li
                    v-for="item in items"
                    :key="item.id"
                    class="dropdown-menu-item"
                    :class="{danger: item.danger}"
                    @click="select(item)"
                >
                    <i class="material-icons-outlined">{{ item.icon }}</i>
                    <span>{{ item.label }}</span>
                </li>
            </ul>
        </Teleport>
    </div>
</template>

<script>
import {nextTick} from "vue";

export default {
    name: "DropdownButton",
    props: {
        action: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: "",
        },
        items: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["action", "select"],
    data() {
        return {
            isOpen: false,
            menuStyle: {},
        };
    },
    beforeUnmount() {
        this.removeListeners();
    },
    methods: {
        async toggle() {
            if (this.isOpen) {
                this.close();
                return;
            }
            this.isOpen = true;
            await nextTick();
            this.position();
            this.addListeners();
        },
        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            this.removeListeners();
        },
        select(item) {
            this.close();
            this.$emit("select", item);
        },
        position() {
            const trigger = this.$refs.root?.querySelector(".split-button");
            const menu = this.$refs.menu;
            if (!trigger || !menu) return;

            const rect = trigger.getBoundingClientRect();
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;

            // Right-align with the trigger, flipping above when there is no room below
            let top = rect.bottom + 6;
            if (top + menuHeight > window.innerHeight - 8) {
                top = rect.top - menuHeight - 6;
            }
            let left = rect.right - menuWidth;
            if (left < 8) left = 8;
            if (left + menuWidth > window.innerWidth - 8) {
                left = window.innerWidth - 8 - menuWidth;
            }

            this.menuStyle = {top: `${top}px`, left: `${left}px`};
        },
        onDocumentClick(event) {
            const root = this.$refs.root;
            const menu = this.$refs.menu;
            if (root?.contains(event.target) || menu?.contains(event.target)) return;
            this.close();
        },
        onKeydown(event) {
            if (event.key === "Escape") this.close();
        },
        addListeners() {
            document.addEventListener("click", this.onDocumentClick);
            document.addEventListener("keydown", this.onKeydown);
            // Closing on scroll keeps the menu anchored to its trigger
            window.addEventListener("scroll", this.close, true);
            window.addEventListener("resize", this.close);
        },
        removeListeners() {
            document.removeEventListener("click", this.onDocumentClick);
            document.removeEventListener("keydown", this.onKeydown);
            window.removeEventListener("scroll", this.close, true);
            window.removeEventListener("resize", this.close);
        },
    },
};
</script>

<style scoped>
.split-button {
    display: inline-flex;
    align-items: stretch;
}

.split-button:has(.action-segment:disabled) {
    opacity: 0.6;
}

.action-segment {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 2px solid var(--color-border-line);
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    border-radius: 8px 0 0 8px;
    font-family: Satoshi-Bold;
    font-size: 0.72rem;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 200ms ease;
}

.action-segment i {
    font-size: 1rem;
    line-height: 1;
}

/* Selector-style hover tint; also applied while the menu is open */
.action-segment:hover:not(:disabled),
.split-button.open .action-segment {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);
}

.action-segment:disabled {
    cursor: not-allowed;
}

.menu-segment {
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* No left border: the action segment's right border acts as the divider */
    border-width: 2px 2px 2px 0;
    border-style: solid;
    border-color: var(--color-border-line);
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    transition: background-color 200ms ease;
}

.menu-segment:hover:not(:disabled),
.split-button.open .menu-segment {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);
}

.menu-segment:disabled {
    cursor: not-allowed;
}

.menu-segment i {
    font-size: 1.1rem;
    transition: transform 200ms ease;
}

.menu-segment i.rotate {
    transform: rotate(180deg);
}
</style>

<style>
/* The menu is teleported to <body>, so its styles are unscoped */
.dropdown-menu {
    position: fixed;
    min-width: 150px;
    list-style: none;
    padding: 5px;
    margin: 0;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10002;
    user-select: none;
    animation: dropdown-menu-in 150ms ease;
    transform-origin: top right;
}

@keyframes dropdown-menu-in {
    from {
        opacity: 0;
        transform: scale(0.92);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.dropdown-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: Satoshi-Bold;
    font-size: 0.8rem;
    color: var(--color-primary-text);
    transition: background-color 150ms ease;
}

.dropdown-menu-item:hover {
    background-color: color-mix(in srgb, var(--color-tertiary-background), transparent 50%);
}

.dropdown-menu-item i {
    font-size: 1rem;
    color: inherit;
}

.dropdown-menu-item.danger,
.dropdown-menu-item.danger i {
    color: #ef4444;
}

.dropdown-menu-item.danger:hover {
    background-color: color-mix(in srgb, #ef4444, transparent 88%);
}
</style>
