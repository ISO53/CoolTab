import { ref, computed } from 'vue'

const currentPath = ref(window.location.hash || '#/')

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

export function useNavigation() {
  const navigate = (path) => {
    window.location.hash = path
  }

  const currentComponent = computed(() => {
    const path = currentPath.value.replace('#', '') || '/'
    if (path === '/style') return 'StylePage'
    return 'HomePage'
  })

  return {
    currentPath,
    navigate,
    currentComponent
  }
}
