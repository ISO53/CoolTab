<template>
    <div class="dropdown-select" @click="toggleDropdown" v-click-outside="closeDropdown">
        <input
            class="form-input"
            type="text"
            v-model="inputValue"
            :placeholder="isOpen ? 'Enter ' + text + ' here...' : modelValue.length + ' ' + text + 's selected.'"
            @keyup.enter="addValue"
            @click.stop="openDropdown"
        />
        <ul v-if="isOpen" class="dropdown-options" @click.stop>
            <li v-for="(value, index) in modelValue" :key="index" class="dropdown-option">
                <p>{{ value }}</p>
                <button @click="removeValue(index)" class="delete-button">x</button>
            </li>
        </ul>
        <Svg :name="'keyboard_arrow_down'" :class="{rotate: isOpen}" class="arrow-logo"></Svg>
    </div>
</template>

<script>
export default {
    name: "DropdownList",
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        onSelect: {
            type: Function,
        },
        text: {
            type: String,
        },
    },
    data() {
        return {
            isOpen: false,
            inputValue: "",
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        closeDropdown() {
            this.isOpen = false;
        },
        openDropdown() {
            this.isOpen = true;
        },
        addValue() {
            const newValue = this.inputValue.trim();
            if (newValue && !this.modelValue.includes(newValue)) {
                const updatedValues = [...this.modelValue, newValue];
                this.$emit("update:modelValue", updatedValues);
                this.inputValue = "";
                if (this.onSelect) this.onSelect(updatedValues);
            }
        },
        removeValue(index) {
            const updatedValues = [...this.modelValue];
            updatedValues.splice(index, 1);
            this.$emit("update:modelValue", updatedValues);
            if (this.onSelect) this.onSelect(updatedValues);
        },
    },
};
</script>

<style scoped>
.dropdown-select {
    position: relative;
    background-color: var(--color-secondary-background);
    width: 100%;
    padding: 8px 12px 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid var(--color-border-line);
    transition: color 250ms ease;
    user-select: none;
    font-size: 1rem;
    font-family: Satoshi-Regular;
}

.arrow-logo {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 8px;
    right: 4px;
    transition: transform 250ms ease;
}

.rotate {
    transform: rotate(180deg);
}

.form-input {
    width: 90%;
    height: 100%;
    background-color: transparent;
    border: none;
    font-family: Satoshi-Medium;
    color: var(--color-secondary-text);
}

.form-input::placeholder {
    color: var(--color-tertiary-text);
}

.form-input:focus {
    outline: none;
}

.delete-button {
    background-color: transparent;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: var(--color-tertiary-text);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding: 5px;
    cursor: pointer;
    transition: background-color 250ms ease, color 250ms ease;
}

.delete-button:hover {
    background-color: var(--color-tertiary-background);
    color: var(--color-secondary-text);
}

.dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    list-style: none;
    padding: 5px;
    margin-top: 5px;
    max-height: 160px;
    overflow-y: auto;
    background-color: var(--color-secondary-background);
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid var(--color-border-line);
    user-select: none;
    z-index: 5;
}

.dropdown-option {
    padding: 5px 8px 5px 8px;
    cursor: default;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.dropdown-option p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
}
</style>
