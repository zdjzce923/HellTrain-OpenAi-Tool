import type { RouteRecordRaw } from 'vue-router'
import Home from '../module/home'
// 自动收集子模块的路由
let childRoutes: RouteRecordRaw[] = []
const moduleRoutes = import.meta.glob('../module/**/*.router.ts', {
  eager: true,
  import: 'default',
})

Object.keys(moduleRoutes)
  .map(k => moduleRoutes[k as string] as RouteRecordRaw | RouteRecordRaw[])
  .filter(Boolean)
  .forEach(k => (childRoutes = childRoutes.concat(k)))


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    children: childRoutes,
  },
]
export { routes }
