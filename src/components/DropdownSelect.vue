<template>
    <div class="dropdown-select" @click="toggleDropdown" v-click-outside="closeDropdown">
        <div>{{ modelValue || "Select an Option" }}</div>

        <ul v-if="isOpen" class="dropdown-options">
            <li
                v-for="(value, index) in values"
                :key="index"
                @click.stop="
                    selectValue(value);
                    closeDropdown();
                "
                class="dropdown-option"
            >
                {{ value }}
            </li>
        </ul>

        <img :class="{rotate: isOpen}" class="arrow-logo" src="@/components/icons/arrow-down.svg" alt="" />
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "DropdownSelect",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    props: {
        modelValue: {
            type: String,
            default: "Google",
        },
        values: {
            type: Array,
            required: true,
        },
        onSelect: {
            type: Function,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        closeDropdown() {
            this.isOpen = false;
        },
        selectValue(value) {
            this.$emit("update:modelValue", value);
            this.onSelect(value);
        },
    },
};
</script>

<style scoped>
.dropdown-select {
    position: relative;
    background-color: rgb(20, 20, 20);
    color: rgb(200, 200, 200);
    width: 100%;
    padding: 8px 12px 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid rgb(50, 50, 50);
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
    background-color: rgb(20, 20, 20);
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid rgb(50, 50, 50);
    user-select: none;
}

.dropdown-options::-webkit-scrollbar {
    width: 8px;
    margin: 2px;
}

.dropdown-options::-webkit-scrollbar-track {
    background-color: transparent;
    overflow: hidden;
}

.dropdown-options::-webkit-scrollbar-thumb {
    background-color: rgba(75, 75, 75, 0.5);
    border-radius: 10px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
    background-color: rgba(75, 75, 75, 1);
}

.dropdown-option {
    padding: 5px 8px 5px 8px;
    cursor: pointer;
    border-radius: 5px;
}

.dropdown-option:hover {
    background-color: rgba(75, 75, 75, 0.5);
}
</style>
