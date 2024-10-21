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
        };
    },
    mounted() {
        window.addEventListener("resize", this.update);
        this.update();
    },
    unmounted() {
        window.removeEventListener("resize", this.update);
    },
    methods: {
        drawGridPoints() {
            const canvas = this.$refs.gridCanvas;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = this.dotColor;

            for (let x = 0; x <= this.width; x += this.step) {
                for (let y = 0; y <= this.height; y += this.step) {
                    ctx.fillRect(x - 1, y - 1, 2, 2);
                }
            }
        },
        update() {
            this.width = this.$refs.grid.offsetWidth;
            this.height = this.$refs.grid.offsetHeight;
            this.step = this.width / this.cols;

            requestAnimationFrame(this.drawGridPoints);
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
