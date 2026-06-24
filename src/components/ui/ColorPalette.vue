<template>
	<div class="color-palette">
		<div ref="ring" class="color-ring">
			<div class="ring" :style="ringStyle"></div>
			<div class="center"></div>
			<div class="thumb" :style="thumbStyle" @mousedown="startDrag" />
		</div>
		<div ref="slider" class="color-slider">
			<div>
				<h3>Dull</h3>
				<h3>Pastel</h3>
				<h3>Vibrant</h3>
			</div>
			<input
				class="slider-input"
				type="range"
				min="0"
				max="0.45"
				step="0.01"
				v-model="chroma"
				@input="updateChroma"
				:style="chromaBarStyle"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: "ColorPalette",
	data() {
		return {
			size: 220,
			thickness: 40,
			hue: 0,
			chroma: 0.5,
			fixed_lightness: 0.7,
			dragging: false,
		};
	},
	computed: {
		center() {
			return this.size / 2;
		},
		radius() {
			return this.size / 2 - this.thickness / 2;
		},
		angleRad() {
			return (this.hue * Math.PI) / 180;
		},
		thumbX() {
			return this.center + this.radius * Math.cos(this.angleRad);
		},
		thumbY() {
			return this.center + this.radius * Math.sin(this.angleRad);
		},
		thumbStyle() {
			return {
				left: `${this.thumbX}px`,
				top: `${this.thumbY}px`,
				background: `oklch(${this.fixed_lightness} ${this.chroma} ${this.hue + 90})`,
			};
		},
		ringStyle() {
			return {
				background: `conic-gradient(
					oklch(${this.fixed_lightness} ${this.chroma} 0),
					oklch(${this.fixed_lightness} ${this.chroma} 45),
					oklch(${this.fixed_lightness} ${this.chroma} 90),
					oklch(${this.fixed_lightness} ${this.chroma} 135),
					oklch(${this.fixed_lightness} ${this.chroma} 180),
					oklch(${this.fixed_lightness} ${this.chroma} 225),
					oklch(${this.fixed_lightness} ${this.chroma} 270),
					oklch(${this.fixed_lightness} ${this.chroma} 315),
					oklch(${this.fixed_lightness} ${this.chroma} 360)
				)`,
			};
		},
		chromaBarStyle() {
			const start = `oklch(${this.fixed_lightness} 0 ${this.hue + 90})`;
			const end = `oklch(${this.fixed_lightness} 0.45 ${this.hue + 90})`;
			return {
				background: `linear-gradient(90deg, ${start}, ${end})`,
				borderRadius: "10px",
				border: "none",
				appearance: "none",
				width: "100%",
				padding: "0 5px 0 1px",
			};
		},
	},
	methods: {
		updateHue(e) {
			const rect = this.$refs.ring.getBoundingClientRect();
			const x = e.clientX - rect.left - this.center;
			const y = e.clientY - rect.top - this.center;
			let angle = Math.atan2(y, x);
			angle = (angle * 180) / Math.PI;
			if (angle < 0) angle += 360;
			this.hue = angle;
			this.$emit("update:hue", this.hue);
		},
		startDrag(e) {
			this.dragging = true;
			this.updateHue(e);
			window.addEventListener("mousemove", this.onMove);
			window.addEventListener("mouseup", this.stopDrag);
		},
		updateChroma(e) {
			// v-model already updated chroma; emit and force a repaint if needed
			this.$emit("update:chroma", this.chroma);
		},
		onMove(e) {
			if (!this.dragging) return;
			this.updateHue(e);
		},
		stopDrag() {
			this.dragging = false;
			window.removeEventListener("mousemove", this.onMove);
			window.removeEventListener("mouseup", this.stopDrag);
		},
	},
	beforeUnmount() {
		window.removeEventListener("mousemove", this.onMove);
		window.removeEventListener("mouseup", this.stopDrag);
	},
};
</script>

<style scoped>
.color-palette {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
}

.color-ring {
	position: relative;
	user-select: none;
	width: 220px;
	height: 220px;
}

.ring {
	position: absolute;
	inset: 0;
	border-radius: 50%;
}

.color-slider input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 16px;
	height: 35px;
	border: 5px solid var(--color-primary-background);
	border-radius: 10px;
	margin: 2px;
	cursor: e-resize;
}

/* Firefox */
.color-slider input[type="range"]::-moz-range-thumb {
	appearance: none;
	width: 16px;
	height: 35px;
	border: 5px solid var(--color-primary-background);
	border-radius: 10px;
	margin: 2px;
	cursor: e-resize;
}

.center {
	position: absolute;
	top: 40px;
	left: 40px;
	width: 140px;
	height: 140px;
	border-radius: 50%;
	background: var(--color-primary-background);
}

.thumb {
	position: absolute;
	cursor: grab;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 5px solid var(--color-primary-background);
	transform: translate(-50%, -50%);
}

.thumb:active {
	cursor: grabbing;
}

.color-slider {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: fit-content;
	align-items: center;
	font-size: 12px;
}

.color-slider > div {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 5px;
	color: var(--color-tertiary-text);
}
</style>
