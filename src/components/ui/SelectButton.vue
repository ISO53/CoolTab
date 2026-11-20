<template>
    <div class="select-button">
        <button
            v-for="(option, index) in options"
            :key="index"
            :class="['select-button-option', {selected: modelValue === optionLabel(option)}]"
            @click="selectOption(option)"
        >
            <Icon v-if="optionIcon(option)" :name="optionIcon(option)" />
            {{ optionLabel(option) }}
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
        optionLabel(option) {
            return typeof option === "object" ? option.label : option;
        },
        optionIcon(option) {
            return typeof option === "object" ? option.icon : null;
        },
        selectOption(option) {
            this.$emit("update:modelValue", this.optionLabel(option));
            if (this.onSelect) this.onSelect(this.optionLabel(option));
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
    transition: color 200ms ease;
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
    transition: background-color 200ms ease;
    color: var(--color-secondary-text);
    height: 30px;
    padding: 0 10px 0 10px;
    font-family: Satoshi-Regular;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.select-button-option svg {
    width: 1.1rem;
    height: 1.1rem;
    user-select: none;
}

.select-button-option:hover {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);
}

.select-button-option.selected {
    background-color: color-mix(in srgb, var(--color-tertiary-background), transparent 50%);
    color: var(--color-primary-text);
}
</style>
