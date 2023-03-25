import { defineComponent, reactive, toRefs } from 'vue'

const TodoList = defineComponent({
  name: 'TodoList',
  setup() {
    const data = reactive({
      todoList: [1, 2, 3, 4, 5],
      doneList: [],
    })

    return {
      ...toRefs(data),
    }
  },
  render() {
    console.log('this.todoList', this.todoList)
    return(
      this.todoList.map(item => {
        return <div class="px-[10px] py-[5px] max-w-[30px] text-[blue] my-[20px] bg-slate-400">{item}</div>
      })
    )
  },
})

export default TodoList
