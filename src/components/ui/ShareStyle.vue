<template>
    <div>
        <Transition name="overlay">
            <div v-if="isOpen" class="overlay" @click="toggleShareStyle">
                <div v-if="isOpen" class="share-style-div" @click.stop>
                    <h1>Share Your Style</h1>
                    <p class="subtitle">Share your custom style with the CoolTab community</p>
                    <br />

                    <form @submit.prevent="handleSubmit" class="share-form">
                        <div class="form-group">
                            <label for="styleName">Style Name</label>
                            <input
                                type="text"
                                id="styleName"
                                v-model="styleName"
                                placeholder="Enter a unique style name"
                                required
                                maxlength="50"
                                :disabled="isMessageShown"
                            />
                        </div>

                        <p v-if="isMessageShown" class="subtitle success-message">
                            Success! Your style will be shared on
                            <a href="https://iso53.github.io/CoolTab/styles" target="_blank" rel="noopener noreferrer"
                                >CoolTab Community Styles</a
                            >
                            in a couple of days after review.
                        </p>

                        <p v-if="errorMessage" class="error-message" :class="{ 'rate-limit-message': isRateLimited }">
                            {{ errorMessage }}
                        </p>

                        <div class="button-group">
                            <button
                                type="button"
                                class="btn-cancel"
                                @click="toggleShareStyle"
                                :disabled="isMessageShown"
                            >
                                Cancel
                            </button>
                            <button type="submit" class="btn-submit" :disabled="isMessageShown">Share Style</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";

export default {
    name: "ShareStyle",
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            isOpen: false,
            isMessageShown: false,
            styleName: "",
            errorMessage: "",
            isRateLimited: false,
        };
    },
    methods: {
        toggleShareStyle() {
            this.isOpen = !this.isOpen;
            this.styleName = "";
            this.isMessageShown = false;
            this.errorMessage = "";
            this.isRateLimited = false;
        },
        async handleSubmit() {
            const result = await this.settingsStore.shareUserStyle(this.styleName);
            
            if (result.success) {
                this.isMessageShown = true;
                this.isRateLimited = false;
                this.errorMessage = "";
            } else if (result.isRateLimit) {
                this.isRateLimited = true;
                this.errorMessage = "You can only share 1 style per day. Please try again tomorrow.";
            } else {
                this.isRateLimited = false;
                this.errorMessage = result.error || "Unknown error";
            }
        },
    },
};
</script>

<style scoped>
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(10px);
    background-color: color-mix(in srgb, var(--color-primary-background), transparent 80%);
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay-enter-active,
.overlay-leave-active {
    transition: backdrop-filter 250ms ease, background-color 250ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
    backdrop-filter: none;
    background-color: transparent;
}

.overlay-enter-active > .share-style-div,
.overlay-leave-active > .share-style-div {
    transition: transform 250ms ease, opacity 250ms ease;
}

.overlay-enter-from > .share-style-div,
.overlay-leave-to > .share-style-div {
    transform: scale(50%);
    opacity: 0;
}

.share-style-div {
    width: fit-content;
    height: fit-content;
    background-color: var(--color-primary-background);
    border: 2px solid var(--color-border-line);
    z-index: 10000;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.share-style-div > h1 {
    font-family: Satoshi-Bold;
    font-size: 3rem;
}

.share-style-div > p {
    font-family: Satoshi-Light;
    font-size: 1rem;
}

.share-style-div a {
    position: relative;
    text-decoration: none;
    color: var(--color-tertiary-text);
    font-weight: bold;
    transition: color 250ms ease;
}

.share-style-div a:hover {
    color: var(--color-secondary-text);
}

.share-style-div a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background-color: var(--color-tertiary-text);
    transform: scaleX(0%);
    transition: transform 250ms ease;
}

.share-style-div a:hover::after {
    transform: scaleX(100%);
}

.subtitle {
    color: var(--color-secondary-text);
    margin-top: -10px;
    text-align: center;
}

.success-message {
    color: var(--color-primary-text);
    font-weight: 500;
}

.error-message {
    color: #ef4444;
    font-family: Satoshi-Medium;
    font-size: 0.95rem;
    text-align: center;
    padding: 12px 16px;
    border-radius: 10px;
    background-color: color-mix(in srgb, #ef4444, transparent 90%);
    border: 1px solid color-mix(in srgb, #ef4444, transparent 70%);
    margin-top: -10px;
}

.rate-limit-message {
    color: #f59e0b;
    background-color: color-mix(in srgb, #f59e0b, transparent 90%);
    border-color: color-mix(in srgb, #f59e0b, transparent 70%);
}

.share-form {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-family: Satoshi-Bold;
    font-size: 0.95rem;
    color: var(--color-primary-text);
}

.form-group input {
    padding: 12px 16px;
    border-radius: 10px;
    border: 2px solid var(--color-border-line);
    background-color: color-mix(in srgb, var(--color-primary-background), var(--color-border-line) 5%);
    color: var(--color-primary-text);
    font-family: Satoshi-Light;
    font-size: 1rem;
    transition: border-color 250ms ease, background-color 250ms ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--color-tertiary-text);
    background-color: var(--color-primary-background);
}

.form-group input::placeholder {
    color: var(--color-secondary-text);
    opacity: 0.6;
}

.button-group {
    display: flex;
    gap: 12px;
    margin-top: 10px;
}

.button-group button {
    flex: 1;
    padding: 12px 24px;
    border-radius: 10px;
    font-family: Satoshi-Bold;
    font-size: 1rem;
    cursor: pointer;
    transition: all 250ms ease;
    border: 2px solid transparent;
}

.btn-cancel {
    background-color: transparent;
    border-color: var(--color-border-line);
    color: var(--color-secondary-text);
}

.btn-cancel:hover {
    background-color: color-mix(in srgb, var(--color-border-line), transparent 80%);
    border-color: var(--color-secondary-text);
    color: var(--color-primary-text);
}

.btn-submit {
    background-color: var(--color-tertiary-text);
    color: var(--color-primary-background);
    border-color: var(--color-tertiary-text);
}

.btn-submit:hover {
    background-color: var(--color-secondary-text);
    border-color: var(--color-secondary-text);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-tertiary-text), transparent 50%);
}

.btn-submit:active {
    transform: translateY(0);
}

.form-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: color-mix(in srgb, var(--color-border-line), transparent 90%);
}

.btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-cancel:disabled:hover {
    background-color: transparent;
    border-color: var(--color-border-line);
    color: var(--color-secondary-text);
}

.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-submit:disabled:hover {
    transform: none;
    box-shadow: none;
    background-color: var(--color-tertiary-text);
    border-color: var(--color-tertiary-text);
}
</style>
