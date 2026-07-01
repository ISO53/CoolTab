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

			// Ensure onboarding is disabled in settings
			settingsStore.setOnboarding("Disabled");
		},
		steps: [
			{
				element: "#Buttons",
				popover: {
					title: "CoolTab Features Tour",
					description: "Hover your mouse in this bottom-left corner to reveal the action buttons. Let's travel them one by one!",
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
				},
			},
			{
				element: "#Buttons button:nth-child(1)",
				popover: {
					title: "Explore Wallpapers",
					description: "Click here to open the wallpaper gallery. You can browse and select from a variety of beautiful backgrounds to personalize your tab.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const btn = document.querySelector("#Buttons button:nth-child(1)");
					if (btn) {
						const gallery = document.querySelector(".gallery");
						if (!gallery) {
							btn.click();
						}
					}
				},
			},
			{
				element: "#Buttons button:nth-child(2)",
				popover: {
					title: "Share Your Style",
					description: "Once you design a beautiful layout and color scheme, you can share it with the community here.",
					side: "right",
					align: "center",
				},
				onHighlightStarted: () => {
					// Close wallpaper gallery if it was opened
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
					title: "Edit Layout Mode",
					description: "Click this button to toggle edit mode. In edit mode, you can resize widgets and drag them to relocate them anywhere on the layout grid.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const btn = document.querySelector("#Buttons button:nth-child(3)");
					if (btn) {
						// Open the edit mode
						btn.click();
					}
				},
				onDeselected: () => {
					const btn = document.querySelector("#Buttons button:nth-child(3)");
					if (btn) {
						// Close the edit mode on the next step
						btn.click();
					}
				},
			},
			{
				element: "#Buttons button:nth-child(4)",
				popover: {
					title: "Settings Sidebar",
					description: "Open the sidebar to access more detailed customization options, styles, widget settings, and app info.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const btn = document.querySelector("#Buttons button:nth-child(4)");
					if (btn) {
						const sidebar = document.querySelector(".slide");
						if (!sidebar || sidebar.style.display === "none") {
							btn.click();
						}
					}
					// Ensure we start from the top tab (Customization)
					setTimeout(() => {
						const tab = document.querySelector(".rail-btn:nth-child(1)");
						if (tab) tab.click();
					}, 50);
				},
			},
			{
				element: ".rail-btn:nth-child(1)",
				popover: {
					title: "Color Palettes",
					description: "Choose from pre-configured color palettes or create your own custom theme colors for the text, backgrounds, and borders.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(1)");
					if (tab) tab.click();
				},
			},
			{
				element: ".rail-btn:nth-child(2)",
				popover: {
					title: "Personal Styles",
					description: "A style is a saved snapshot of all your settings, including background image, layout columns, colors, and active widgets. You can save, manage, and swap your personal styles here.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(2)");
					if (tab) tab.click();
				},
			},
			{
				element: ".rail-btn:nth-child(3)",
				popover: {
					title: "Community Styles",
					description: "Check out and apply stunning styles created and shared by other CoolTab users around the world.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(3)");
					if (tab) tab.click();
				},
			},
			{
				element: ".rail-btn:nth-child(4)",
				popover: {
					title: "Widget Switcher",
					description: "Enable or disable individual widgets like weather forecasts, clocks, stock tickers, location visualizers, calendars, and todo lists.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(4)");
					if (tab) tab.click();
				},
			},
			{
				element: ".rail-btn:nth-child(5)",
				popover: {
					title: "General Settings",
					description: "Customize global preferences for your tab. Here you can configure wallpaper, search engines, search behavior, weather/stock update intervals, layout columns, and background size settings.",
					side: "right",
					align: "center",
				},
				onHighlighted: () => {
					const tab = document.querySelector(".rail-btn:nth-child(5)");
					if (tab) tab.click();
				},
			},
			{
				element: ".rail-btn:nth-child(6)",
				popover: {
					title: "About CoolTab",
					description: "Check the application version, explore release notes, and read more about the features of this tab manager.",
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
					title: "Tour",
					description: "You can run this tour anytime you want to learn about the features of CoolTab.",
					side: "right",
					align: "center",
				}
			}
		],
	});
}
