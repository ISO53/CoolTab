<template>
    <button class="floating-button" :class="{small}" :disabled="disabled" @click="$emit('click')">
        <i class="material-icons-outlined">{{ icon }}</i>
        <span>{{ label }}</span>
    </button>
</template>

<script>
// Square icon button that expands to reveal its label on hover — the interaction
// of the original tour button, shared by the tour, save and share actions.
export default {
    name: "FloatingButton",
    props: {
        icon: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["click"],
};
</script>

<style scoped>
.floating-button {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 13px;
    border: none;
    background-color: var(--color-secondary-text);
    color: var(--color-primary-background);
    border-radius: 10px;
    font-size: 1rem;
    font-family: Satoshi-Medium;
    cursor: pointer;
    transition: width 200ms ease, background-color 200ms ease;
    overflow: hidden;
    white-space: nowrap;
}

.floating-button:hover:not(:disabled) {
    width: 140px;
    background-color: var(--color-primary-text);
}

.floating-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.floating-button > span {
    margin: 0 0 0 10px;
    opacity: 0;
    font-family: Satoshi-Bold;
    font-size: 0.95rem;
    transition: opacity 200ms ease;
}

.floating-button:hover:not(:disabled) > span {
    opacity: 1;
    transition-delay: 80ms;
}

.floating-button > i {
    margin: 0;
    line-height: 1.4rem;
    height: 1.4rem;
    font-size: 1.4rem;
    flex-shrink: 0;
}

/* Slightly smaller variant */
.floating-button.small {
    width: 42px;
    height: 42px;
    padding: 0 0 0 11px;
    border-radius: 9px;
}

.floating-button.small:hover:not(:disabled) {
    width: 124px;
}

.floating-button.small > span {
    font-size: 0.85rem;
}

.floating-button.small > i {
    line-height: 1.2rem;
    height: 1.2rem;
    font-size: 1.2rem;
}
</style>
