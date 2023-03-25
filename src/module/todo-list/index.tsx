import {
  Button,
  Checkbox,
  Input,
  message,
  type CheckboxOptionType,
} from 'ant-design-vue'
import { defineComponent, reactive, toRefs } from 'vue'

type Todo = CheckboxOptionType & Record<string, string | boolean>
const TodoList = defineComponent({
  name: 'TodoList',
  setup() {
    const data = reactive({
      todoList: [] as Todo[],
      doneList: [] as Todo[],
      todoVal: '',
    })

    const addTodo = () => {
      if (data.todoVal) {
        data.todoList.push({
          label: data.todoVal,
          value: data.todoVal,
          checked: false,
        })
        data.todoVal = ''
      } else {
        message.error('待办事项为空')
      }
    }

    const doneChecked = () => {
      data.doneList = [...data.doneList, ...data.todoList.filter(item => item.checked)]
      data.todoList = data.todoList.filter(item => !item.checked)
    }

    const deleteTodo = () => {
      data.todoList = data.todoList.filter(item => !item.checked)
    }

    return {
      ...toRefs(data),
      addTodo,
      doneChecked,
      deleteTodo
    }
  },
  render() {
    return (
      <section class="py-[50px] text-center">
        <header class="mb-[20px] text-[30px]">TodoList</header>

        <div class="">
          <Input
            v-model:value={this.todoVal}
            class="max-w-[200px]"
            placeholder="请输入待办事项"></Input>
          <Button type="primary" onClick={this.addTodo} class="ml-[20px]">
            添加
          </Button>
        </div>

        <div class={'flex flex-col items-center'}>
          <header class="mb-[20px] mt-[15px] text-[20px]">待办事项</header>

          {this.todoList.map(todo => {
            return <Checkbox v-model:checked={todo.checked}>{todo.value}</Checkbox>
          })}

          <div class={'mt-[15px]'}>
            <Button onClick={this.doneChecked} type="primary" class="mr-[20px]">
              完成
            </Button>
            <Button onClick={this.deleteTodo}>刪除</Button>
          </div>

        </div>

        <div class={'flex flex-col items-center'}>
          <header class="mb-[20px] mt-[15px] text-[20px]">已完成</header>
          {this.doneList.map(todo => {
            return <div>{todo.value}</div>
          })}
        </div>

      </section>
    )
  },
})

export default TodoList
