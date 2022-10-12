import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from "uview-ui";
Vue.use(uView);
import {router,RouterMount} from './router.js'  //路径换成自己的
Vue.use(router)
Vue.config.productionTip = false
App.mpType = 'app'
import { install as http } from '@/uni_modules/gt-axios-request/js_sdk/install.js'
Vue.use(http)
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
