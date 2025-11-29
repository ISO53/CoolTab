<template>
    <div class="grid" ref="grid">
        <!-- Canvas for rendering grid points -->
        <canvas :class="{hide: !editing}" ref="gridCanvas" class="grid-canvas" :width="width" :height="height"></canvas>

        <!-- Slot to add Grid Items dynamically -->
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Grid",
    props: {
        cols: {type: Number, default: 20},
        editing: {type: Boolean, default: false},
        dotColor: {type: String, default: "#c8c8c8"},
    },
    data() {
        return {
            width: 0,
            height: 0,
            step: 0,
            animationFrameId: null,
            time: 0,
        };
    },
    mounted() {
        window.addEventListener("resize", this.update);
        this.update();
        if (this.editing) this.startAnimation();
    },
    watch: {
        editing(newVal) {
            if (newVal) {
                this.startAnimation();
            } else {
                cancelAnimationFrame(this.animationFrameId);
            }
        },
        cols() {
            this.update();
        },
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.update);
        cancelAnimationFrame(this.animationFrameId);
    },
    methods: {
        drawGridPoints() {
            const canvas = this.$refs.gridCanvas;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = this.dotColor;

            // Adjust dot size based on animation time
            const scale = 1.5 + Math.sin(this.time * 0.05) * 0.5;

            for (let x = 0; x <= this.width; x += this.step) {
                for (let y = 0; y <= this.height; y += this.step) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
        update() {
            this.width = this.$refs.grid.offsetWidth;
            this.height = this.$refs.grid.offsetHeight;
            this.step = this.width / this.cols;

            requestAnimationFrame(this.drawGridPoints);
        },
        startAnimation() {
            const animate = () => {
                this.time += 1;
                this.drawGridPoints();
                this.animationFrameId = requestAnimationFrame(animate);
            };
            this.animationFrameId = requestAnimationFrame(animate);
        },
    },
};
</script>

<style scoped>
.grid {
    width: 100%;
    height: 100%;
    position: relative;
}

.grid-canvas {
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.hide {
    opacity: 0;
}
</style>
