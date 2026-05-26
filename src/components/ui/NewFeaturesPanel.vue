<template>
    <Transition name="toast">
        <div
            v-if="settingsStore.showUpdatePopup"
            class="update-toast"
            @mouseenter="pauseDismiss"
            @mouseleave="resumeDismiss"
        >
            <div class="toast-content">
                <span class="toast-text">
                    CoolTab has been successfully updated!
                    <a href="https://iso53.github.io/CoolTab/#/releases" target="_blank" class="changes-link" @click="dismiss">See changes</a>
                </span>
            </div>
        </div>
    </Transition>
</template>

<script>
import {useSettingsStore} from "@/settings";
import {watch, onMounted} from "vue";

export default {
    name: "NewFeaturesPanel",
    setup() {
        const settingsStore = useSettingsStore();
        let timeoutId = null;

        // check saved vs current version on startup
        settingsStore.checkVersionOnStart();

        function dismiss() {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            settingsStore.dismissUpdatePopup();
        }

        const autoDismiss = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (settingsStore.showUpdatePopup) {
                timeoutId = setTimeout(() => {
                    dismiss();
                }, 5000); // 5 seconds
            }
        };

        const pauseDismiss = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const resumeDismiss = () => {
            autoDismiss();
        };

        watch(() => settingsStore.showUpdatePopup, (newVal) => {
            if (newVal) {
                autoDismiss();
            }
        });

        onMounted(() => {
            autoDismiss();
        });

        return {settingsStore, dismiss, pauseDismiss, resumeDismiss};
    },
};
</script>

<style scoped>
.update-toast {
    position: fixed;
    top: 1vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.toast-content {
    pointer-events: auto;
    background: color-mix(in srgb, var(--color-secondary-background), transparent 15%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border-line);
    border-radius: 8px;
    padding: 8px 16px;
}

.toast-text {
    font-size: 0.85rem;
    font-family: Satoshi-Medium;
    color: var(--color-primary-text);
    line-height: 1.4;
}

.changes-link {
    color: var(--color-primary-text);
    text-decoration: underline;
    font-family: Satoshi-Bold;
    margin-left: 6px;
    transition: color 150ms ease;
    cursor: pointer;
}

.changes-link:hover {
    color: var(--color-secondary-text);
}

/* Transition Animations */
.toast-enter-active,
.toast-leave-active {
    transition: all 300ms ease;
}

.toast-enter-from {
    transform: translateY(-1vh) translateX(-50%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateY(-1vh) translateX(-50%);
    opacity: 0;
}
</style>
