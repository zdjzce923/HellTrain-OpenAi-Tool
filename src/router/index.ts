import type { RouterService } from '@/router/router.service'
import { routes } from '@/router/routes'

export default class RouterStart {
  constructor(private routerService: RouterService) {
    routerService.initRoutes(routes)
  }
}
