<template>
    <div class="color-chooser">
        <div style="display: flex; flex-direction: row">
            <div
                v-for="(color, index) in colors"
                :key="index"
                :style="{backgroundColor: color}"
                class="color-box"
                :class="{selected: this.color === color}"
                @click="selectColor(color)"
            ></div>
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
    data() {
        return {
            color: null,
            colors: ["#fc613f", "#98dd98 ", "#92cef7 ", "#ebb882 ", "#f79fda", "#fafafa"],
        };
    },
    methods: {
        selectColor(color) {
            this.color = color;
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
}

.selected {
    border: 2px solid white;
}
</style>
