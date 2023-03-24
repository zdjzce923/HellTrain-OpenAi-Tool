import { RouterView } from 'vue-router'
import { defineComponent } from 'vue'
import RouterStart from '@/router'
import { RouterService } from './router/router.service'
import './theme/app.scss'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'

class Routers {
  constructor() {
    const service = new RouterService()
    new RouterStart(service)
  }
}

export default defineComponent ({
    setup() {
        new Routers()
    },
    render() {
        return (
          <ConfigProvider locale={zhCN}>
            <RouterView />
          </ConfigProvider>
        )
      }
})
