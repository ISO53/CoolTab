<template>
    <div class="select-button">
        <button
            v-for="(option, index) in options"
            :key="index"
            :class="['select-button-option', {selected: selectedValue === option}]"
            @click="selectOption(option)"
        >
            {{ option }}
        </button>
    </div>
</template>

<script>
export default {
    name: "SelectButton",
    data() {
        return {
            selectedValue: "Cover",
            options: ["Auto", "Cover", "Contain", "None"],
        };
    },
    created() {
        const objectFit = localStorage.getItem("background-image-fit");
        if (objectFit) this.selectedValue = objectFit;
    },
    methods: {
        selectOption(option) {
            this.selectedValue = option;
            localStorage.setItem("background-image-fit", this.selectedValue);
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
    background-color: rgb(20, 20, 20);
    color: rgb(200, 200, 200);
    width: 100%;
    height: 43px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid rgb(50, 50, 50);
    transition: color 250ms ease;
    user-select: none;

    display: flex;
    gap: 10px;
}

.select-button-option {
    background-color: transparent;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 250ms ease;
    color: rgb(200, 200, 200);
    height: 30px;
    padding: 0 10px 0 10px;
}

.select-button-option:hover {
    background-color: rgba(75, 75, 75, 0.5);
}

.select-button-option.selected {
    background-color: rgba(100, 100, 100, 0.5);
    color: white;
}
</style>
