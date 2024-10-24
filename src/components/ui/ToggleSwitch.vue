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
    background-color: rgb(20, 20, 20);
    border: 2px solid rgb(50, 50, 50);
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
    background-color: rgb(200, 200, 200);
    transition: 250ms ease;
    border-radius: 5px;
}

input:checked + .slider {
    background-color: rgb(75, 75, 75);
}

input:checked + .slider:before {
    transform: translateX(25px);
    background-color: white;
}
</style>
