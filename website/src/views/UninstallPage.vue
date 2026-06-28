<template>
	<div class="uninstall-page container">
		<div class="split-layout">
			<!-- Left side: Text -->
			<div class="left-content animate-fade-in">
				<h1 class="gradient-text font-outfit">
					Sorry to see you leave
				</h1>
				<p class="subtitle">
					Your feedback is incredibly valuable to help us improve
					CoolTab. Let us know why you uninstalled.
				</p>
			</div>

			<!-- Right side: Survey Form -->
			<div>
				<!-- Form view -->
				<div
					v-if="!submitted"
					class="survey-card"
					key="form"
				>
					<form @submit.prevent="submitFeedback">
						<div class="survey-section">
							<h2 class="section-title font-outfit">
								Why did you uninstall CoolTab?
							</h2>
							<p class="section-desc">Select all that apply</p>

							<div class="options-grid">
								<label
									v-for="(option, index) in surveyOptions"
									:key="index"
									class="option-card"
									:class="{
										selected: selectedOptions.includes(
											option.value,
										),
									}"
								>
									<input
										type="checkbox"
										:value="option.value"
										v-model="selectedOptions"
										class="hidden-checkbox"
									/>
									<div class="option-content">
										<span
											class="option-icon"
											v-html="option.icon"
										></span>
										<div class="option-text">
											<span class="option-label">{{
												option.label
											}}</span>
											<span class="option-sublabel">{{
												option.sublabel
											}}</span>
										</div>
									</div>
									<div class="checkbox-indicator">
										<svg
											class="check-svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline
												points="20 6 9 17 4 12"
											></polyline>
										</svg>
									</div>
								</label>
							</div>
						</div>

						<div class="feedback-section">
							<h2 class="section-title font-outfit">
								Tell us more (optional)
							</h2>
							<p class="section-desc">
								Please share any specific bugs, missing
								features, or suggestions you have.
							</p>
							<textarea
								v-model="customFeedback"
								placeholder="Type your feedback here..."
								class="feedback-textarea"
								rows="4"
							></textarea>
						</div>

						<div v-if="errorMsg" class="error-banner">
							{{ errorMsg }}
						</div>

						<div class="action-section">
							<button
								type="submit"
								class="btn-primary submit-btn"
								:disabled="submitting"
							>
								<span v-if="submitting" class="spinner"></span>
								<span v-else>Submit Feedback</span>
							</button>
							<a href="#/" class="back-link">Return to Home</a>
						</div>
					</form>
				</div>

				<!-- Success view -->
				<div v-else class="success-card" key="success">
					<div class="success-content">
						<div class="success-icon-wrapper">
							<svg
								class="success-check-svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle
									cx="12"
									cy="12"
									r="10"
									class="circle-draw"
								/>
								<polyline
									points="16 9 11 14 8 11"
									class="check-draw"
								/>
							</svg>
						</div>
						<h2 class="success-title font-outfit">
							Feedback Submitted
						</h2>
						<p class="success-desc">
							Thank you for sharing your experience. We appreciate
							your feedback and will use it to make CoolTab
							better.
						</p>
						<div class="success-actions">
							<a
								href="https://github.com/ISO53/CoolTab"
								target="_blank"
								rel="noopener noreferrer"
								class="btn-secondary"
							>
								Check GitHub
							</a>
							<a href="#/" class="btn-primary">
								Return to Home
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const submitted = ref(false);
const submitting = ref(false);
const selectedOptions = ref([]);
const customFeedback = ref("");
const errorMsg = ref("");

const surveyOptions = [
	{
		value: "missing-features",
		label: "Missing Features",
		sublabel: "I needed features that are not available yet",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
	},
	{
		value: "usability",
		label: "Difficult to Use",
		sublabel: "It was hard to configure or navigate",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
	},
	{
		value: "design",
		label: "UI & Layout Design",
		sublabel: "I did not like the visual design or layout",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
	},
	{
		value: "distracting",
		label: "Too Distracting",
		sublabel: "It interfered with my focus or workflow",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8v7a4 4 0 0 0-2 3h16a3.89 3.89 0 0 0-1.26-2.26"/><path d="M2 2l20 20"/></svg>`,
	},
	{
		value: "alternative",
		label: "Found Alternative",
		sublabel: "I switched to another startpage extension",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
	},
	{
		value: "other",
		label: "Other Reason",
		sublabel: "I prefer to specify below in the comments",
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
	},
];

const submitFeedback = async () => {
	if (selectedOptions.value.length === 0 && !customFeedback.value.trim()) {
		errorMsg.value = "Please select at least one option or write a comment.";
		return;
	}

	submitting.value = true;
	errorMsg.value = "";

	// Map selected option values to their professional labels
	const mappedOptions = selectedOptions.value.map(val => {
		const opt = surveyOptions.find(o => o.value === val);
		return opt ? opt.label : val;
	});

	// Fallback to "Other Reason" if custom text is provided without checkboxes checked
	if (mappedOptions.length === 0 && customFeedback.value.trim()) {
		mappedOptions.push("Other Reason");
	}

	try {
		const response = await fetch("https://cool-tab-api.vercel.app/api/uninstall-feedback", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				options: mappedOptions,
				tellUsMore: customFeedback.value.trim() || undefined
			})
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.msg || "Failed to submit feedback. Please try again.");
		}

		submitted.value = true;
	} catch (err) {
		errorMsg.value = err.message || "An unexpected network error occurred.";
	} finally {
		submitting.value = false;
	}
};
</script>

<style scoped>
.uninstall-page {
	padding-bottom: 120px;
	max-width: 1200px !important;
	margin: 0 auto;
}

.split-layout {
	display: grid;
	grid-template-columns: 1fr 1.2fr;
	gap: 80px;
	margin-top: 120px;
	align-items: start;
}

.left-content {
	position: sticky;
	top: 140px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-align: left;
}

.gradient-text {
	font-size: 3.5rem;
	font-weight: 800;
	letter-spacing: -0.03em;
	margin-bottom: 20px;
	line-height: 1.15;
	background: linear-gradient(135deg, #ffffff 30%, #8c8c8c 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.font-outfit {
	font-family: "Outfit", sans-serif;
}

.subtitle {
	color: var(--text-muted);
	font-size: 1.15rem;
	line-height: 1.65;
	margin-bottom: 32px;
	max-width: 480px;
}

.survey-section,
.feedback-section {
	margin-bottom: 36px;
}

.section-title {
	font-size: 1.8rem;
	font-weight: 600;
	margin-bottom: 6px;
	color: #ffffff;
	letter-spacing: -0.01em;
}

.section-desc {
	font-size: 0.9rem;
	color: var(--text-muted);
	margin-bottom: 20px;
}

.options-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
}

.option-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px;
	border-radius: 12px;
	backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.06);
	cursor: pointer;
	transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	user-select: none;
}

.option-card:hover {
	background: rgba(255, 255, 255, 0.03);
	border-color: rgba(255, 255, 255, 0.15);
}

.option-card.selected {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.4);
	box-shadow: 0 4px 20px rgba(255, 255, 255, 0.03);
}

.hidden-checkbox {
	position: absolute;
	opacity: 0;
	width: 0;
	height: 0;
}

.option-content {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	flex: 1;
	padding-right: 8px;
}

.option-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 34px;
	height: 34px;
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.04);
	color: rgba(255, 255, 255, 0.7);
	flex-shrink: 0;
	transition: all 0.25s ease;
}

.option-icon :deep(svg) {
	width: 18px;
	height: 18px;
}

.option-card:hover .option-icon {
	background: rgba(255, 255, 255, 0.08);
	color: #ffffff;
}

.option-card.selected .option-icon {
	background: rgba(255, 255, 255, 0.1);
	color: #ffffff;
}

.option-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.option-label {
	font-size: 0.95rem;
	font-weight: 600;
	color: #ffffff;
}

.option-sublabel {
	font-size: 0.8rem;
	color: var(--text-muted);
	line-height: 1.35;
}

.checkbox-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	border-radius: 5px;
	border: 2px solid rgba(255, 255, 255, 0.2);
	transition: all 0.2s ease;
	flex-shrink: 0;
}

.check-svg {
	width: 10px;
	height: 10px;
	color: #000000;
	opacity: 0;
	transform: scale(0.5);
	transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46);
}

.option-card.selected .checkbox-indicator {
	background: #ffffff;
	border-color: #ffffff;
}

.option-card.selected .check-svg {
	opacity: 1;
	transform: scale(1);
}

.feedback-textarea {
	width: 100%;
	padding: 14px;
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.08);
	color: #ffffff;
	font-family: inherit;
	font-size: 0.95rem;
	line-height: 1.5;
	resize: vertical;
	transition: all 0.25s ease;
}

.feedback-textarea:focus {
	outline: none;
	border-color: rgba(255, 255, 255, 0.3);
	box-shadow: 0 0 20px rgba(255, 255, 255, 0.04);
}

.feedback-textarea::placeholder {
	color: rgba(255, 255, 255, 0.3);
}

.error-banner {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: left;
}

.action-section {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-top: 20px;
}

.submit-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 160px;
	height: 44px;
}

.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.spinner {
	width: 18px;
	height: 18px;
	border: 2px solid rgba(0, 0, 0, 0.1);
	border-top-color: #000000;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.back-link {
	color: var(--text-muted);
	font-size: 0.9rem;
	font-weight: 500;
	transition: color 0.2s ease;
}

.back-link:hover {
	color: #ffffff;
	text-decoration: underline;
}

/* Success Card Styling */
.success-card {
	padding: 60px 40px;
	border-radius: 24px;
	text-align: center;
}

.success-content {
	max-width: 440px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.success-icon-wrapper {
	color: #ffffff;
	margin-bottom: 24px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	width: 72px;
	height: 72px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
}

.success-check-svg {
	width: 38px;
	height: 38px;
}

.circle-draw {
	stroke-dasharray: 63;
	stroke-dashoffset: 63;
	animation: drawCircle 0.6s ease-out forwards;
}

.check-draw {
	stroke-dasharray: 15;
	stroke-dashoffset: 15;
	animation: drawCheck 0.4s ease-out 0.4s forwards;
}

@keyframes drawCircle {
	to {
		stroke-dashoffset: 0;
	}
}

@keyframes drawCheck {
	to {
		stroke-dashoffset: 0;
	}
}

.success-title {
	font-size: 1.8rem;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 12px;
	letter-spacing: -0.02em;
}

.success-desc {
	color: var(--text-muted);
	font-size: 1rem;
	line-height: 1.55;
	margin-bottom: 32px;
}

.success-actions {
	display: flex;
	gap: 12px;
	width: 100%;
	justify-content: center;
}

.btn-secondary {
	background: transparent;
	color: #ffffff;
	padding: 10px 20px;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.15);
	font-weight: 600;
	font-size: 0.95rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-secondary:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.3);
	transform: translateY(-2px);
}

/* Responsive details */
@media (max-width: 992px) {
	.split-layout {
		grid-template-columns: 1fr;
		gap: 48px;
		margin-top: 80px;
	}

	.left-content {
		position: static;
		align-items: center;
		text-align: center;
	}

	.gradient-text {
		font-size: 2.8rem;
	}

	.subtitle {
		max-width: 600px;
	}
}

@media (max-width: 576px) {
	.options-grid {
		grid-template-columns: 1fr;
	}

	.action-section {
		flex-direction: column;
		align-items: stretch;
		gap: 16px;
		text-align: center;
	}

	.success-actions {
		flex-direction: column;
	}

	.btn-secondary,
	.btn-primary {
		width: 100%;
	}
}
</style>
