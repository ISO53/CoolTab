<template>
    <div class="app">
        <Background />
        <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem soluta provident molestias laudantium
            ducimus nostrum exercitationem odio dolorum, nobis voluptatibus neque? Accusamus, id nesciunt. Rem nesciunt
            suscipit itaque odit distinctio. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime vitae
            dolores, accusamus ullam reprehenderit ea soluta, error unde natus iusto tempore magnam voluptatibus,
            sapiente nulla temporibus dignissimos deleniti doloremque ipsum?Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Impedit est numquam beatae quas itaque vel nihil! Architecto adipisci, assumenda
            voluptates, perferendis quaerat in aliquam maxime, provident impedit accusamus quidem odio. Lorem ipsum
            dolor, sit amet consectetur adipisicing elit. Unde quas quidem veniam voluptatem aspernatur cupiditate saepe
            nobis quae consequuntur at sapiente sint, cumque iusto adipisci doloremque dignissimos impedit nam
            architecto!
        </p>
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
