import { defineComponent } from "vue";
import Sketch from './component/galaxy/index'

export default defineComponent ({
  setup() {
    new Sketch({
      dom: document.getElementById("container"),
    });
    
  },
  render() {
    return (
      <div class="w-[100vw]" id="container">
      </div>
    )
  }
})