<template>
  <NavBar />
  <main>
    <transition name="fade" mode="out-in">
      <component :is="components[currentComponent]" />
    </transition>
  </main>
  <Footer />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import HomePage from './views/HomePage.vue'
import StylePage from './views/StylePage.vue'
import { useNavigation } from './navigation'

const { currentComponent } = useNavigation()

const components = {
  HomePage,
  StylePage
}
</script>

<style>
main {
  padding-top: 100px; /* Space for fixed navbar */
  min-height: 80vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
