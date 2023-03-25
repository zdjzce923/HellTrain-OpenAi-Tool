import { defineComponent, onBeforeMount, onMounted } from 'vue'
import Galaxy from './component/galaxy/index'

const Home = defineComponent({
  name: 'Home',
  setup() {},
  render() {
    return (
      <div class="h-[100vh] w-[100vw]">
        <Galaxy></Galaxy>
      </div>
    )
  },
})

export default Home