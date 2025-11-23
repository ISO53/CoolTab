<template>
    <div>
        <Transition name="overlay">
            <div v-if="settingsStore.showUpdatePopup" class="overlay" @click="close">
                <div v-if="settingsStore.showUpdatePopup" class="panel" @click.stop>
                    <div class="header">
                        <img src="@/components/icons/cooltab_logo.svg" draggable="false" />
                        <h1>CoolTab Just Got a New Release!</h1>
                    </div>
                    <div class="release-body" v-if="releaseHtml" v-html="releaseHtml"></div>

                    <br />

                    <div class="actions">
                        <button @click="close">Close</button>
                        <button @click="dontShowAgain">Don't show again</button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import {useSettingsStore} from "@/settings";
import {computed} from "vue";
import {marked} from "marked";

export default {
    name: "NewFeaturesPanel",
    setup() {
        const settingsStore = useSettingsStore();

        // check saved vs current version on startup
        settingsStore.checkVersionOnStart();

        function dismiss() {
            settingsStore.dismissUpdatePopup();
        }

        function close() {
            settingsStore.hideUpdatePopup();
        }

        function dontShowAgain() {
            settingsStore.dismissUpdatePopup();
        }

        const releaseHtml = computed(() => {
            const md = settingsStore.releaseNotes && settingsStore.releaseNotes.body;
            if (!md) return "";
            try {
                return marked.parse(md);
            } catch (e) {
                return "<pre>Could not render release notes</pre>";
            }
        });

        return {settingsStore, dismiss, close, dontShowAgain, releaseHtml};
    },
};
</script>

<style scoped>
.new-features {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
}

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

.overlay-enter-active > .panel,
.overlay-leave-active > .panel {
    transition: transform 250ms ease, opacity 250ms ease;
}

.overlay-enter-from > .panel,
.overlay-leave-to > .panel {
    transform: scale(50%);
    opacity: 0;
}

.panel {
    max-width: 50vw;
    height: fit-content;
    background-color: var(--color-primary-background);
    border: 2px solid var(--color-border-line);
    z-index: 10000;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
}

.panel > p {
    font-family: Satoshi-Light;
    font-size: 1rem;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.header > img {
    width: 64px;
    height: 64px;
    align-self: center;
    margin-right: 12px;
}

.header > h1 {
    font-family: Satoshi-Bold;
    font-size: 2rem;
}

.release-body {
    max-height: 50vh;
    overflow: auto;
    margin: 12px 0;
}

.actions {
    width: 100%;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.actions > button {
    background-color: var(--color-secondary-background);
    color: var(--color-secondary-text);
    padding: 8px 12px 8px 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    border: 2px solid var(--color-border-line);
    transition: color 250ms ease, border-color 250ms ease;
    user-select: none;
}

.actions > button:hover {
    color: var(--color-primary-text);
    border-color: var(--color-secondary-text);
}

.btn.link {
    background: transparent;
    text-decoration: underline;
}

</style>
