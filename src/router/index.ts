import { Injectable } from 'injection-js'
import { RouterService } from '@/router/router.service'
import { routes } from '@/router/routes'

export default class RouterStart {
  constructor(private routerService: RouterService) {
    routerService.initRoutes(routes)
  }
}
