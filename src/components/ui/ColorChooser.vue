<template>
    <div class="color-chooser">
        <div>{{ modelValue }}</div>

        <div>
            <input type="color" id="head" @input="selectColor($event.target.value)" />
            <label for="head" :style="{background: modelValue}"></label>
        </div>
    </div>
</template>

<script>
export default {
    name: "ColorChooser",
    props: {
        modelValue: {
            type: String,
            default: "#000",
        },
        onSelect: {
            type: Function,
        },
    },
    methods: {
        selectColor(color) {
            this.$emit("update:modelValue", color);
            this.onSelect(color);
        },
    },
};
</script>

<style scoped>
.color-chooser {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    width: 100%;
    height: 43px;
    padding: 8px 6px 8px 12px;
    border-radius: 10px;
    border: 2px solid var(--color-border-line);
    transition: color 250ms ease;
}

input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

label {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    border: 2px solid var(--color-border-line);
}
</style>
