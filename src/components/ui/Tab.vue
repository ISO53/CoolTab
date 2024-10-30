<template>
    <transition name="tab-switch">
        <div class="tab" v-if="$parent.selectedTabLabel === label">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: "Tab",
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    inject: ["registerTab"],
    mounted() {
        this.registerTab(this.label);
    },
};
</script>

<style scoped>
.tab {
    width: 100%;
    height: 90%;
    overflow: auto;
    position: absolute;
    top: 60px;
    left: 0;
}

.tab-switch-enter-active,
.tab-switch-leave-active {
    transition: opacity 250ms ease, transform 250ms ease;
}

.tab-switch-enter-from,
.tab-switch-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
