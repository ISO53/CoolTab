<template>
    <div
        class="grid-item"
        :class="this.$parent.editing ? 'resize-' + (p_resize.includes('/') ? 'square' : p_resize) : ''"
        :style="itemStyle"
        @mousedown="mouseDownEvent"
    >
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
        p_resize: {
            type: String,
            default: "square",
        },
    },
    watch: {
        p_x(newVal) {
            this.x = newVal;
        },
        p_y(newVal) {
            this.y = newVal;
        },
        p_width(newVal) {
            this.width = newVal;
        },
        p_height(newVal) {
            this.height = newVal;
        },
    },
    data() {
        return {
            dragging: false,
            resizing: false,
            clicked: {x: 0, y: 0},
            initialPosition: {x: this.modelValueX, y: this.modelValueY},
            x: this.p_x,
            y: this.p_y,
            width: this.p_width,
            height: this.p_height,
        };
    },
    methods: {
        emitChanges() {
            this.$emit("update-position", {x: this.x, y: this.y});
            this.$emit("update-size", {width: this.width, height: this.height});
        },
        mouseDownEvent(event) {
            if (!this.$parent.editing) return;

            // If clicked on right bottom corner of the div, it is being resized, don't drag it.
            const rect = this.$el.getBoundingClientRect();
            const cornerSize = 10;
            this.resizing = event.clientX >= rect.right - cornerSize && event.clientY >= rect.bottom - cornerSize;
            if (this.resizing) {
                window.addEventListener("mousemove", this.mouseMoveEvent);
                window.addEventListener("mouseup", this.mouseUpEvent);
                return;
            }

            this.dragging = true;
            this.clicked = {x: event.pageX, y: event.pageY};
            this.initialPosition = {x: this.x, y: this.y};

            window.addEventListener("mousemove", this.mouseMoveEvent);
            window.addEventListener("mouseup", this.mouseUpEvent);
        },
        mouseUpEvent(event) {
            if (this.resizing) {
                this.resizing = false;
                const rect = this.$el.getBoundingClientRect();

                switch (this.p_resize) {
                    case "square":
                        // Square resizing, width and height must match
                        const w = Math.round(rect.width / this.$parent.step);
                        const h = Math.round(rect.height / this.$parent.step);
                        const size = Math.max(Math.min(w, h), 1);
                        this.width = size;
                        this.height = size;
                        break;
                    case "horizontal":
                        // Horizontal resizing, don't change height
                        this.width = Math.max(Math.round(rect.width / this.$parent.step), 1); // size can be minimum 1
                        break;
                    case "vertical":
                        // Vertical resizing, don't change width
                        this.height = Math.max(Math.round(rect.height / this.$parent.step), 1); // size can be minimum 1
                        break;
                    default:
                        // Case for aspect ratio elements like "2/1"
                        const [aspectWidth, aspectHeight] = this.p_resize.split("/").map(Number);
                        if (aspectWidth && aspectHeight) {
                            // Calculate the target width and height based on the aspect ratio
                            const aspectRatio = aspectWidth / aspectHeight;

                            // Determine the width and height based on the aspect ratio and available space
                            const calcWidth = Math.round(rect.width / this.$parent.step);
                            const calcHeight = Math.round(calcWidth / aspectRatio);

                            // Ensure minimum size of 1 for both dimensions
                            this.width = Math.max(calcWidth, 1);
                            this.height = Math.max(calcHeight, 1);
                        }
                        break;
                }

                // Emit size changes after resizing
                this.emitChanges();
            }

            this.dragging = false;
            window.removeEventListener("mousemove", this.mouseMoveEvent);
            window.removeEventListener("mouseup", this.mouseUpEvent);

            // Emit position changes after dragging
            this.emitChanges();
        },
        mouseMoveEvent(event) {
            if (!this.dragging) return;

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

.resize-vertical {
    resize: vertical;
    overflow: hidden;
}

.resize-horizontal {
    resize: horizontal;
    overflow: hidden;
}

.resize-square {
    resize: both;
    overflow: hidden;
}

.blanket {
    background-color: color-mix(in srgb, var(--color-border-line), transparent 80%);
    border: 1px solid color-mix(in srgb, var(--color-border-line), transparent 60%);
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
    background-color: color-mix(in srgb, var(--color-border-line), transparent 40%);
}
</style>
