<template>
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
                :disabled="isMessageShown || isRateLimited"
            />
        </div>

        <p v-if="isMessageShown" class="subtitle success-message">
            Success! Your style will be shared on
            <a href="https://iso53.github.io/CoolTab/#/style" target="_blank" rel="noopener noreferrer"
                >CoolTab Community Styles</a
            >
            in a couple of days after review.
        </p>

        <p v-if="errorMessage" :class="{ 'rate-limit-message': isRateLimited }">
            {{ errorMessage }}
        </p>

        <div class="button-group">
            <button
                v-if="showCancel"
                type="button"
                class="btn-cancel"
                @click="$emit('cancel')"
                :disabled="isMessageShown"
            >
                Cancel
            </button>
            <button
                type="submit"
                class="btn-submit"
                :disabled="
                    isMessageShown || isRateLimited || isLoading
                "
            >
                {{ isLoading ? "Sharing..." : "Share Style" }}
            </button>
        </div>
    </form>
</template>

<script>
// Share form extracted from ShareStyle.vue so the same flow can be presented both in
// the original overlay popup and inside the merged Styles tab.
import {useSettingsStore} from "@/settings";

export default {
    name: "ShareStyleForm",
    props: {
        showCancel: {
            type: Boolean,
            default: true,
        },
    },
    emits: ["cancel"],
    setup() {
        const settingsStore = useSettingsStore();
        return {settingsStore};
    },
    data() {
        return {
            isMessageShown: false,
            styleName: "",
            errorMessage: "",
            isRateLimited: false,
            isLoading: false,
        };
    },
    mounted() {
        // The form remounts each time it is shown, which is when the rate limit is checked
        if (this.checkRateLimit()) {
            this.isRateLimited = true;
            this.errorMessage = "You can only share 1 style per day. Please try again tomorrow.";
        }
    },
    methods: {
        checkRateLimit() {
            const lastShare = localStorage.getItem("last-share-timestamp");
            if (lastShare) {
                const lastShareTime = parseInt(lastShare);
                const now = Date.now();
                const oneDay = 24 * 60 * 60 * 1000;
                if (now - lastShareTime < oneDay) {
                    return true;
                }
            }
            return false;
        },
        async handleSubmit() {
            if (this.isLoading) return;

            if (this.checkRateLimit()) {
                this.isRateLimited = true;
                this.errorMessage = "You can only share 1 style per day. Please try again tomorrow.";
                return;
            }

            this.isLoading = true;
            this.errorMessage = "";

            try {
                const result = await this.settingsStore.shareUserStyle(this.styleName);

                if (result.success) {
                    localStorage.setItem("last-share-timestamp", Date.now().toString());
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
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.subtitle {
    color: var(--color-secondary-text);
    margin-top: -10px;
    text-align: center;
}

.success-message {
    color: var(--color-primary-text);
    font-weight: 500;
}

.rate-limit-message {
    color: var(--color-secondary-text);
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
    transition: border-color 200ms ease, background-color 200ms ease;
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
    transition: all 200ms ease;
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
