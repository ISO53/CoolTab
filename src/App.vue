<template>
    <div class="app">
        <Background />
        <Sidebar />
    </div>
</template>

<script>
import Background from "@/components/Background.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
    name: "App",
    components: {Background, Sidebar},
};
</script>

<style scoped>
.app {
    width: 100vw;
    height: 100vh;
}
</style>
