import { defineComponent, onBeforeMount, onMounted } from 'vue'
import Galaxy from './component/galaxy/index'

export default defineComponent({
  setup() {},
  render() {
    return (
      <div class="h-[100vh] w-[100vw]">
        <Galaxy></Galaxy>
      </div>
    )
  },
})
