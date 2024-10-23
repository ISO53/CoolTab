<template>
    <div class="color-chooser">
        <div
            v-for="(color, index) in ['#fc613f', '#98dd98', '#92cef7', '#ebb882', '#f79fda', '#fafafa']"
            :key="index"
            :style="{backgroundColor: color}"
            class="color-box"
            :class="{selected: modelValue === color}"
            @click="selectColor(color)"
        >
            A
        </div>

        <span>|</span>

        <div>
            <input type="color" id="head" @input="selectColor($event.target.value)" />
            <label for="head"></label>
        </div>
    </div>
</template>

<script>
export default {
    name: "ColorChooser",
    props: {
        modelValue: {
            type: String,
            default: "#fc613f",
        },
        onSelect: {
            type: Function,
        }
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
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    background: conic-gradient(red, orange, yellow, green, blue, violet, red);
}

.color-box {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 2px solid rgb(50, 50, 50);
    margin: 0;
    padding: 0;
    cursor: pointer;
    margin-right: 5px;
    color: black;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    font-size: 0.9rem;
}

.selected {
    border: 2px solid white;
}
</style>
