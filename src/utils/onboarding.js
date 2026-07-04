import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useSettingsStore } from "../settings";
import { translate } from "../i18n";

export function onboarding() {
	const settingsStore = useSettingsStore();

	return new driver({
		showProgress: true,
		animate: true,
		allowClose: false,
		allowKeyboardControl: false,
		disableActiveInteraction: true,
		onDestroyed: () => {
			// Clean up UI states when onboarding ends or is skipped
			const buttonsEl = document.querySelector("#Buttons");
			if (buttonsEl) {
				buttonsEl.classList.remove("revealed");
			}

			const sidebar = document.querySelector(".slide");
			if (sidebar && sidebar.style.display !== "none") {
				const closeBtn = document.querySelector(".sidebar-close-btn");
				if (closeBtn) {
					closeBtn.click();
				}
			}

			// Re-enable click interaction on buttons manually
			buttonsEl.childNodes.forEach((child) => {
				child.style.pointerEvents = "auto";
			});

			// Ensure onboarding is disabled in settings
			settingsStore.setOnboarding("Disabled");
		},
		steps: [
			{
				element: "#Buttons",
				popover: {
					title: translate("onboarding.step1Title"),
					description: translate("onboarding.step1Desc"),
					side: "right",
					align: "end",
				},
				onHighlightStarted: () => {
					// Close sidebar if open when starting the tour
					const sidebar = document.querySelector(".slide");
					if (sidebar && sidebar.style.display !== "none") {
						const closeBtn = document.querySelector(".sidebar-close-btn");
						if (closeBtn) {
							closeBtn.click();
						}
					}

					// Force show the buttons panel
					const buttonsEl = document.querySelector("#Buttons");
					if (buttonsEl) {
						buttonsEl.classList.add("revealed");
					}

					// Disable click interaction on buttons manually
					buttonsEl.childNodes.forEach((child) => {
						child.style.pointerEvents = "none";
					});
				},
			},
			{
				element: "#Buttons button:nth-child(1)",
				popover: {
					title: translate("onboarding.step2Title"),
					description: translate("onboarding.step2Desc"),
					side: "right",
					align: "center",
				},
				onHighlightStarted: () => {
					const gallery = document.querySelector(".gallery");
					if (!gallery) {
						const btn = document.querySelector("#Buttons button:nth-child(1)");
						if (btn) btn.click();
					}
				},
			},
			{
				element: ".gallery",
				popover: {
					title: translate("onboarding.step3Title"),
					description: translate("onboarding.step3Desc"),
					side: "top",
					align: "center",
				},
				onDestroyStarted: () => {
					const gallery = document.querySelector(".gallery");
					if (!gallery) {
						const btn = document.querySelector("#Buttons button:nth-child(1)");
						if (btn) btn.click();
					}
				},
			},
			{
				element: "#Buttons button:nth-child(2)",
				popover: {
					title: translate("onboarding.step4Title"),
					description: translate("onboarding.step4Desc"),
					side: "right",
					align: "center",
				},
				onHighlightStarted: () => {
					// Close wallpaper gallery
					const gallery = document.querySelector(".gallery");
					if (gallery) {
						const btn = document.querySelector("#Buttons button:nth-child(1)");
						if (btn) btn.click();
					}
				},
			},
			{
				element: "#Buttons button:nth-child(3)",
				popover: {
					title: translate("onboarding.step5Title"),
					description: translate("onboarding.step5Desc"),
					side: "right",
					align: "center",
				},
			},
			{
				element: ".grid",
				popover: {
					title: translate("onboarding.step6Title"),
					description: translate("onboarding.step6Desc"),
					side: "bottom",
					align: "center",
				},
				onHighlightStarted: () => {
					const btn = document.querySelector("#Buttons button:nth-child(3)");
					// Open the edit mode
					if (btn) btn.click();
				},
				onDeselected: () => {
					const btn = document.querySelector("#Buttons button:nth-child(3)");
					// Close the edit mode on the next step
					if (btn) btn.click();
				},
			},
			{
				element: "#Buttons button:nth-child(4)",
				popover: {
					title: translate("onboarding.step7Title"),
					description: translate("onboarding.step7Desc"),
					side: "right",
					align: "center",
				},
				onHighlightStarted: () => {
					// Open the sidebar for the next step
					const btn = document.querySelector("#Buttons button:nth-child(4)");
					if (btn) btn.click();
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step8Title"),
					description: translate("onboarding.step8Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					// Ensure we start from the top tab (Customization)
					setTimeout(() => {
						const tab = document.querySelector(".rail-btn:nth-child(1)");
						if (tab) tab.click();
					}, 50);
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step9Title"),
					description: translate("onboarding.step9Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(2)");
					if (tab) tab.click();
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step10Title"),
					description: translate("onboarding.step10Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(3)");
					if (tab) tab.click();
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step11Title"),
					description: translate("onboarding.step11Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(4)");
					if (tab) tab.click();
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step12Title"),
					description: translate("onboarding.step12Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(5)");
					if (tab) tab.click();
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: translate("onboarding.step13Title"),
					description: translate("onboarding.step13Desc"),
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(6)");
					if (tab) tab.click();
				},
			},
			{
				element: ".tour-button",
				popover: {
					title: translate("onboarding.step14Title"),
					description: translate("onboarding.step14Desc"),
					side: "right",
					align: "center",
				}
			}
		],
	});
}
