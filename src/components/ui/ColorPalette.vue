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
    name: "ColorPalette",
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

</style>
