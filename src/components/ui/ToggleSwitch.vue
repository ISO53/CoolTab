<template>
    <label class="switch">
        <input type="checkbox" v-model="isChecked" @click="toggle" />
        <span class="slider"></span>
    </label>
</template>

<script>
export default {
    name: "ToggleSwitch",
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            isChecked: this.modelValue,
        };
    },
    methods: {
        toggle() {
            this.isChecked = !this.isChecked;
            this.$emit("update:modelValue", this.isChecked);
        },
    },
    watch: {
        modelValue(newValue) {
            this.isChecked = newValue;
        },
    },
};
</script>

<style>
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 35px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-secondary-background);
    border: 2px solid var(--color-border-line);
    transition: 0.4s;
    border-radius: 10px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: var(--color-tertiary-text);
    transition: 250ms ease;
    border-radius: 5px;
}

input:checked + .slider {
    background-color: var(--color-tertiary-background);
}

input:checked + .slider:before {
    transform: translateX(25px);
    background-color: var(--color-secondary-text);
}
</style>
