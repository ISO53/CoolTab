<template>
	<div class="preview-card" :style="previewStyle">
		<!-- Ambient background: current palette colors, blurred and mixed -->
		<div class="ambient">
			<span class="blob b1"></span>
			<span class="blob b2"></span>
			<span class="blob b3"></span>
			<span class="blob b4"></span>
		</div>

		<!-- Rest of the view: widget-shaped placeholders, blurred -->
		<div class="page">
			<span class="shape clock"></span>
			<span class="shape search"></span>
			<span class="shape wide"></span>
			<span class="shape small-a"></span>
			<span class="shape small-b"></span>
		</div>
		<div class="page-overlay"></div>

		<!-- Centered mock panel: placeholders only, no text -->
		<div class="mock-panel">
			<div class="card-header">
				<span class="avatar"></span>
				<div class="lines">
					<span class="bar accent-line"></span>
					<span class="bar line"></span>
				</div>
			</div>
			<span class="bar pill-row"></span>
			<span class="bar pill-row"></span>
			<div class="card-footer">
				<span class="bar accent-pill"></span>
				<span class="bar pill"></span>
			</div>
		</div>

		<span class="preview-chip">Preview</span>
	</div>
</template>

<script>
export default {
	name: "ThemePreview",
	props: {
		previewPalette: {
			type: Object,
			default: null,
		},
	},
	computed: {
		previewStyle() {
			const palette = this.previewPalette;
			if (!palette) return {};

			// Override the theme CSS variables locally, scoped to this card
			const style = {};
			for (const key in palette) {
				if (Object.hasOwn(palette, key) && key.startsWith("color_")) {
					style[`--${key.replaceAll("_", "-")}`] = palette[key];
				}
			}
			return style;
		},
	},
};
</script>

<style scoped>
.preview-card {
	position: relative;
	width: 100%;
	height: 280px;
	border-radius: 16px;
	border: 1px solid var(--color-border-line);
	background-color: var(--color-primary-background);
	overflow: hidden;
}

/* ── Ambient palette glow ── */
.ambient {
	position: absolute;
	inset: 0;
}

.blob {
	position: absolute;
	border-radius: 50%;
	filter: blur(70px);
}

.b1 {
	width: 65%;
	height: 85%;
	top: -25%;
	left: -15%;
	background-color: var(--color-secondary-text);
	opacity: 0.5;
}

.b2 {
	width: 55%;
	height: 75%;
	bottom: -30%;
	right: -15%;
	background-color: var(--color-tertiary-text);
	opacity: 0.45;
}

.b3 {
	width: 50%;
	height: 70%;
	top: 20%;
	left: 50%;
	background-color: var(--color-secondary-background);
	opacity: 0.9;
}

.b4 {
	width: 45%;
	height: 65%;
	bottom: -20%;
	left: 25%;
	background-color: var(--color-border-line);
	opacity: 0.5;
}

/* ── Blurred page behind the mock panel ── */
.page {
	position: absolute;
	inset: 0;
	filter: blur(10px);
}

.shape {
	position: absolute;
	background-color: var(--color-secondary-background);
	border: 1px solid var(--color-border-line);
	border-radius: 12px;
	opacity: 0.75;
}

.shape.clock {
	width: 90px;
	height: 90px;
	border-radius: 50%;
	top: 14%;
	left: 66%;
	background-color: var(--color-tertiary-background);
}

.shape.search {
	width: 34%;
	height: 34px;
	border-radius: 10px;
	top: 40%;
	left: 62%;
}

.shape.wide {
	width: 22%;
	height: 70px;
	top: 60%;
	left: 70%;
	background-color: var(--color-tertiary-background);
}

.shape.small-a {
	width: 90px;
	height: 60px;
	top: 18%;
	left: 40%;
}

.shape.small-b {
	width: 70px;
	height: 44px;
	top: 72%;
	left: 56%;
	border-radius: 10px;
}

.page-overlay {
	position: absolute;
	inset: 0;
	background-color: color-mix(in srgb, var(--color-primary-background), transparent 68%);
}

/* ── Centered mock panel ── */
.mock-panel {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 55%;
	height: 68%;
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 16px 18px;
	background-color: var(--color-primary-background);
	border: 1px solid color-mix(in srgb, var(--color-border-line), transparent 50%);
	border-radius: 14px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	box-sizing: border-box;
}

.bar {
	display: block;
	border-radius: 6px;
	background-color: color-mix(in srgb, var(--color-primary-text), transparent 80%);
}

.card-header {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
	margin-bottom: 4px;
}

.avatar {
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: var(--color-secondary-text);
	flex-shrink: 0;
}

.lines {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.bar.accent-line {
	width: 55%;
	height: 7px;
	background-color: var(--color-secondary-text);
}

.bar.line {
	width: 75%;
	height: 7px;
}

.bar.pill-row {
	width: 100%;
	height: 14px;
	border-radius: 7px;
	background-color: color-mix(in srgb, var(--color-border-line), transparent 35%);
}

.card-footer {
	display: flex;
	flex-direction: row;
	gap: 8px;
	margin-top: auto;
}

.bar.accent-pill {
	width: 38%;
	height: 18px;
	border-radius: 9px;
	background-color: var(--color-secondary-text);
}

.bar.pill {
	width: 30%;
	height: 18px;
	border-radius: 9px;
	background-color: color-mix(in srgb, var(--color-border-line), transparent 35%);
}

/* ── Chip ── */
.preview-chip {
	position: absolute;
	top: 12px;
	left: 12px;
	padding: 4px 12px;
	border-radius: 999px;
	background-color: var(--color-secondary-background);
	border: 1px solid var(--color-border-line);
	color: var(--color-primary-text);
	font-family: Satoshi-Bold;
	font-size: 0.72rem;
	z-index: 3;
}
</style>
