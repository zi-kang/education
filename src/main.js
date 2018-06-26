import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/global.css'
import './assets/css/icon.css'

import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$ajax = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
