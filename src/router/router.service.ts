import { getCurrentApp, Hook, VueService } from 'vue3-oop'
import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import conf from '@/config'

export class RouterService extends VueService {
  history = createWebHistory(conf.BASE_ROUTE)
  router!: Router
  get currentRoute() {
    return this.router.currentRoute.value
  }
  app = getCurrentApp()!
  initRoutes(routes: RouteRecordRaw[]) {
    this.router = createRouter({
      history: this.history,
      routes,
    })
    this.app.use(this.router)
  }
}
