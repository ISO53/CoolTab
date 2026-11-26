import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useSettingsStore } from "../settings";

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
					title: "CoolTab Features Tour",
					description: "Hover your mouse in this bottom-left corner to reveal the action buttons. These buttons let's you edit the widgets and access to settings panel.",
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
					title: "Edit Mode",
					description: "Click here to activate the edit mode.",
					side: "right",
					align: "center",
				},
			},
			{
				element: ".grid",
				popover: {
					title: "Edit Layout Mode",
					description: "In edit mode, you can resize widgets and drag them to relocate them anywhere on the layout grid.",
					side: "bottom",
					align: "center",
				},
				onHighlightStarted: () => {
					const btn = document.querySelector("#Buttons button:nth-child(1)");
					// Open the edit mode
					if (btn) btn.click();
				},
				onDeselected: () => {
					const btn = document.querySelector("#Buttons button:nth-child(1)");
					// Close the edit mode on the next step
					if (btn) btn.click();
				},
			},
			{
				element: "#Buttons button:nth-child(2)",
				popover: {
					title: "Sidebar",
					description: "Click here to open the sidebar.",
					side: "right",
					align: "center",
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: "Theme Tab",
					description: "On the theme tab you can adjust colors of your new tab by selecting from predefined color palettes that supports both light and dark themes.",
					side: "right",
					align: "center",
				},
				onHighlightStarted: () => {
					const slide = document.querySelector(".slide");
					if (slide && slide.style.display === "none") {
						slide.style.transition = "none";
						const btn = document.querySelector("#Buttons button:nth-child(2)");
						if (btn) btn.click();
						setTimeout(() => {
							slide.style.transition = "";
						}, 250);
					}
				},
				onHighlighted: () => {
					// Ensure we start from the top tab (Theme)
					setTimeout(() => {
						const tab = document.querySelector(".rail-btn:nth-child(1)");
						if (tab) tab.click();
					}, 50);
				},
			},
			{
				element: ".tabs-layout",
				popover: {
					title: "Personal Styles",
					description: "A style is a saved snapshot of all your settings, including background image, layout columns, colors, and widgets. You can manage your personal styles here.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(2)");
					if (tab) tab.click();
				},
			},
			{
				element: ".floating-actions",
				popover: {
					title: "Save Your Style",
					description: "Save your current design as a personal style. You can apply, share or delete any of your styles from the menu on their card.",
					side: "left",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(2)");
					if (tab) tab.click();
				},
			},
			{
				element: ".select-button",
				popover: {
					title: "Community Styles",
					description: "Use this filter to switch between your own styles and CoolTab community styles. Any community style can be saved to your collection or applied instantly.",
					side: "top",
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
					title: "Widget Switcher",
					description: "Enable or disable individual widgets like weather forecasts, clocks, stock tickers, location visualizers, calendars, and todo lists.",
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
					title: "General Settings",
					description: "Customize global preferences for your tab. Here you can configure wallpaper, search engines, search behavior, weather/stock update intervals, layout columns, and background size settings.",
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
					title: "About CoolTab",
					description: "Check the application version, explore release notes, and read more about the features of this tab manager.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(5)");
					if (tab) tab.click();
				},
			},
			{
				element: ".floating-button",
				popover: {
					title: "Tour",
					description: "You can run this tour anytime you want to learn about the features of CoolTab.",
					side: "right",
					align: "center",
				}
			}
		],
	});
}
