<template>
    <div class="select-button">
        <button
            v-for="(option, index) in options"
            :key="index"
            :class="['select-button-option', {selected: modelValue === option}]"
            @click="selectOption(option)"
        >
            {{ option }}
        </button>
    </div>
</template>

<script>
export default {
    name: "SelectButton",
    props: {
        modelValue: {
            type: String,
            default: "Cover",
        },
        options: {
            type: Array,
            required: true,
        },
        onSelect: {
            type: Function,
        },
    },
    methods: {
        selectOption(option) {
            this.$emit("update:modelValue", option);
            this.onSelect(option);
        },
    },
};
</script>

<style scoped>
.select-button {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    background-color: var(--color-secondary-background);
    width: 100%;
    height: 43px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid var(--color-border-line);
    transition: color 250ms ease;
    user-select: none;
    padding: 5px;
    display: flex;
    gap: 5px;
}

.select-button-option {
    background-color: transparent;
    border: none;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    transition: background-color 250ms ease;
    color: var(--color-secondary-text);
    height: 30px;
    padding: 0 10px 0 10px;
    font-family: Satoshi-Regular;
}

.select-button-option:hover {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);
}

.select-button-option.selected {
    background-color: color-mix(in srgb, var(--color-secondary-text), transparent 50%);
    color: var(--color-primary-text);
}
</style>
