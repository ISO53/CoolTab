<template>
    <div class="number-picker">
        <button class="btn" @click="updateNumber('-')" :class="{disabled: modelValue === min}">-</button>
        <h1>{{ modelValue }}</h1>
        <button class="btn" @click="updateNumber('+')" :class="{disabled: modelValue === max}">+</button>
    </div>
</template>

<script>
export default {
    name: "NumberPicker",
    props: {
        modelValue: {
            type: Number,
            default: 10,
        },
        min: {
            type: Number,
            required: false,
        },
        max: {
            type: Number,
            required: false,
        },
        step: {
            type: Number,
            required: true,
        },
        onSelect: {
            type: Function,
        },
    },
    data() {
        return {
            number: Math.floor((this.min + this.max) / 2),
        };
    },
    methods: {
        updateNumber(val) {
            let number = 0;
            if (val === "+") {
                number = this.modelValue + this.step <= this.max ? this.modelValue + this.step : this.modelValue;
            } else {
                number = this.modelValue - this.step >= this.min ? this.modelValue - this.step : this.modelValue;
            }
            this.$emit("update:modelValue", number);
            this.onSelect(number);
        },
    },
};
</script>

<style scoped>
.number-picker {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    font-size: 0.7rem;
    font-family: Satoshi-Regular;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    padding: 8px 5px 8px 5px;
    border-radius: 10px;
    border: 2px solid var(--color-border-line);
    user-select: none;
    max-height: 43px;
    font-size: 0.45rem;
}

.btn {
    width: 30px;
    height: 30px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--color-tertiary-text);
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 250ms ease, color 250ms ease;
}

.btn:hover {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);;
    color: var(--color-secondary-text);
}

.disabled {
    opacity: 0.5;
    cursor: none;
    pointer-events: none;
}
</style>
