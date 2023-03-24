import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
import conf from '@/config'

export class RouterService {
  history = createWebHistory(conf.BASE_ROUTE)
  router!: Router
  get currentRoute() {
    return this.router.currentRoute.value
  }
  app = getCurrentInstance()!.appContext.app
  initRoutes(routes: RouteRecordRaw[]) {
    this.router = createRouter({
      history: this.history,
      routes,
    })
    this.app.use(this.router)
  }
}
