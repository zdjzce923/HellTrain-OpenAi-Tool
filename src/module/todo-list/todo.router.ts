import type { RouteRecordRaw } from 'vue-router'
import TodoList from './index'
const routes: RouteRecordRaw[] = [
  {
    path: '/todo-list',
    component: TodoList,
  },
]
export default routes
