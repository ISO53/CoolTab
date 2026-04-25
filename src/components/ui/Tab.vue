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
        icon: {
            type: String,
            required: false,
            default: "settings",
        },
    },
    inject: ["registerTab"],
    mounted() {
        this.registerTab({ label: this.label, icon: this.icon });
    },
};
</script>

<style scoped>
.tab {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20px 18px;
}

.tab-switch-enter-active,
.tab-switch-leave-active {
    transition: opacity 200ms ease, transform 200ms ease;
}

.tab-switch-enter-from,
.tab-switch-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
