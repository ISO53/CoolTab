<template>
    <div class="select-button">
        <button
            v-for="(option, index) in options"
            :key="index"
            :class="['select-button-option', {selected: modelValue === option}]"
            @click="selectOption(option)"
        >
            <span class="marquee-text">
                {{ $t('options.' + option) !== 'options.' + option ? $t('options.' + option) : option }}
            </span>
        </button>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "SelectButton",
    props: {
        modelValue: {
            type: String,
            default: "Cover",
        },
        options: {
            type: Array,
            required: true,
        },
        onSelect: {
            type: Function,
        },
    },
    data() {
        return {
            settingsStore: useSettingsStore(),
        };
    },
    mounted() {
        this.resizeObserver = new ResizeObserver(() => {
            this.checkAllOverflows();
        });
        this.$nextTick(() => {
            const options = this.$el.querySelectorAll(".select-button-option") || [];
            options.forEach(el => this.resizeObserver.observe(el));
        });
    },
    beforeUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    },
    watch: {
        options() {
            this.$nextTick(() => {
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect();
                    const options = this.$el.querySelectorAll(".select-button-option") || [];
                    options.forEach(el => this.resizeObserver.observe(el));
                }
            });
        },
        'settingsStore.language'() {
            this.$nextTick(() => this.checkAllOverflows());
        }
    },
    methods: {
        selectOption(option) {
            this.$emit("update:modelValue", option);
            this.onSelect(option);
        },
        checkAllOverflows() {
            const options = this.$el.querySelectorAll(".select-button-option") || [];
            options.forEach((el) => {
                const textEl = el.querySelector(".marquee-text");
                if (!textEl) return;
                
                el.classList.remove("is-overflowing");
                el.style.removeProperty("--scroll-distance");
                
                const scrollDist = textEl.offsetWidth - el.clientWidth;
                console.log(`[SelectButton] text: ${textEl.innerText.trim()}, textWidth: ${textEl.offsetWidth}, btnWidth: ${el.clientWidth}, scrollDist: ${scrollDist}`);
                if (scrollDist > 0) {
                    el.style.setProperty("--scroll-distance", `-${scrollDist + 8}px`); // +8px padding safety
                    el.classList.add("is-overflowing");
                }
            });
        }
    },
};
</script>

<style scoped>
.select-button {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    background-color: var(--color-secondary-background);
    width: 100%;
    min-height: 43px;
    height: auto;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid var(--color-border-line);
    transition: color 200ms ease;
    user-select: none;
    padding: 5px;
}

.select-button-option {
    background-color: transparent;
    border: none;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    transition: background-color 200ms ease;
    color: var(--color-secondary-text);
    height: 30px;
    padding: 0 4px 0 4px;
    font-size: 13px;
    font-family: Satoshi-Regular;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.select-button-option.is-overflowing {
    justify-content: flex-start;
    padding-left: 8px;
}

.marquee-text {
    display: inline-block;
    white-space: nowrap;
    will-change: transform;
    flex-shrink: 0;
}

.select-button-option:hover {
    background-color: color-mix(in srgb, var(--color-tertiary-text), transparent 80%);
}

.select-button-option.selected {
    background-color: color-mix(in srgb, var(--color-tertiary-background), transparent 50%);
    color: var(--color-primary-text);
}
</style>
