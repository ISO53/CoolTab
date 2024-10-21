<template>
    <div class="grid-item" :style="itemStyle" @mousedown="mouseDownEvent">
        <slot></slot>
        <div v-if="this.$parent.editing" class="blanket"></div>
    </div>
</template>

<script>
export default {
    name: "GridItem",
    props: {
        p_x: {
            type: Number,
            required: true,
        },
        p_y: {
            type: Number,
            required: true,
        },
        p_width: {
            type: Number,
            default: 1,
        },
        p_height: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            mouseDown: true,
            clicked: {x: 0, y: 0},
            initialPosition: {x: this.modelValueX, y: this.modelValueY},
            x: this.p_x,
            y: this.p_y,
            width: this.p_width,
            height: this.p_height,
        };
    },
    methods: {
        mouseDownEvent(event) {
            if (!this.$parent.editing) return;
            
            this.mouseDown = true;
            this.clicked = {x: event.pageX, y: event.pageY};
            this.initialPosition = {x: this.x, y: this.y};

            window.addEventListener("mousemove", this.mouseMoveEvent);
            window.addEventListener("mouseup", this.mouseUpEvent);
        },
        mouseUpEvent(event) {
            this.mouseDown = false;
            window.removeEventListener("mousemove", this.mouseMoveEvent);
            window.removeEventListener("mouseup", this.mouseUpEvent);
        },
        mouseMoveEvent(event) {
            if (!this.mouseDown) return;

            // Calculate how much the mouse has moved since the click
            const dx = Math.floor((event.pageX - this.clicked.x) / this.$parent.step);
            const dy = Math.floor((event.pageY - this.clicked.y) / this.$parent.step);

            // Calculate new position based on the initial position + mouse movement / grid step
            let newX = this.initialPosition.x + dx;
            let newY = this.initialPosition.y + dy;

            // Get parent grid's dimensions
            const gridWidth = this.$parent.width / this.$parent.step;
            const gridHeight = this.$parent.height / this.$parent.step;

            // Boundary checks to prevent overflow
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + this.width > gridWidth) newX = gridWidth - this.width;
            if (newY + this.height > gridHeight) newY = gridHeight - this.height;

            // Update the position
            this.x = newX;
            this.y = newY;
        },
    },
    computed: {
        itemStyle() {
            return {
                left: `${this.$parent.step * this.x}px`,
                top: `${this.$parent.step * this.y}px`,
                width: `${this.$parent.step * this.width}px`,
                height: `${this.$parent.step * this.height}px`,
            };
        },
    },
};
</script>

<style scoped>
.grid-item {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1px 0 0 1px;
}

.blanket {
    background-color: rgba(125, 125, 125, 0.2);
    border: 1px solid rgba(125, 125, 125, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    cursor: move;
    user-select: none;

    transition: background-color 250ms ease;
}

.blanket:active {
    background-color: rgba(125, 125, 125, 0.3);
}
</style>
