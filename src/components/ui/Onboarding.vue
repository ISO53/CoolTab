<template>
	<Teleport to="body">
		<Transition name="onboarding">
			<div v-if="this.settingsStore.onboarding === 'Enabled'" class="onboarding">
				<h1>Welcome to CoolTab!</h1>
				<p>
					Click below to explore the core features and customization
					options of CoolTab. You can also relaunch this guided tour
					at any time from the sidebar.
				</p>
				<div class="buttons">
					<button class="button secondary" @click="skipOnboarding">Skip</button>
					<button class="button primary" @click="startOnboarding">Get Started</button>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script>
import { useSettingsStore } from "@/settings";
import { onboarding } from "@/utils/onboarding";

export default {
	name: "Onboarding",
	setup() {
		const settingsStore = useSettingsStore();
		return { settingsStore };
	},
	methods: {
		skipOnboarding() {
			this.settingsStore.setOnboarding("Disabled");
		},
		startOnboarding() {
			this.settingsStore.setOnboarding("Disabled");
			onboarding().drive();
		},
	},
};
</script>

<style scoped>
.onboarding {
	width: 30vw;
	position: absolute;
	top: 2vh;
	left: 2vh;
	background: color-mix(in srgb, var(--color-primary-background), transparent 40%);
	backdrop-filter: blur(10px);
	color: var(--color-primary-text);
	border: 2px solid var(--color-border-line);
	border-radius: 8px;
	padding: 16px;
	z-index: 9000;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.onboarding-enter-active, .onboarding-leave-active {
	transition: transform 200ms ease, opacity 200ms ease;
}

.onboarding-enter-from, .onboarding-leave-to {
	transform: scale(0.75);
	opacity: 0;
}

.onboarding > h1 {
	font-family: Satoshi-Bold;
	font-size: 2rem;
	line-height: 2rem;
}

.buttons {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}

.button {
	display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: Satoshi-Bold;
    font-size: 0.9rem;
    white-space: nowrap;
    user-select: none;
}

.secondary {
	background-color: transparent;
    color: var(--color-secondary-text);
    transition: color 200ms ease;
}

.secondary:hover {
	color: var(--color-primary-text);
}

.primary {
	background-color: var(--color-secondary-text);
    color: var(--color-primary-background);
    transition: background-color 200ms ease;
}

.primary:hover {
	background-color: var(--color-primary-text);
}
</style>

<!-- Add driver.js custom CSS to global styles -->
<style>
.driver-popover {
	background: color-mix(in srgb, var(--color-primary-background), transparent 40%);
	backdrop-filter: blur(10px);
	color: var(--color-primary-text);
	border: 2px solid var(--color-border-line);
	border-radius: 8px;
	padding: 16px;
}

.driver-popover-arrow-side-right {
	border: 10px solid var(--color-border-line);
	border-left-color: transparent;
	border-bottom-color: transparent;
	border-top-color: transparent;
}

.driver-popover-title {
	font-family: Satoshi-Bold;
}

.driver-popover-description {
	font-family: Satoshi-Regular;
}

.driver-popover-footer-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 10px;
    font-family: Satoshi-Bold;
    font-size: 0.9rem;
}

.driver-popover-prev-btn {
	background-color: transparent !important;
    color: var(--color-secondary-text);
    transition: color 200ms ease;
}

.driver-popover-next-btn {
	background-color: var(--color-secondary-text) !important;
    color: var(--color-primary-background);
    transition: background-color 200ms ease;
}

.driver-popover-prev-btn:hover {
	color: var(--color-primary-text);
}

.driver-popover-next-btn:hover {
	background-color: var(--color-primary-text) !important;
}
</style>
