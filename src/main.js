import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/global.less'
import './assets/css/icon.less'
import './assets/css/addCourse.less'
import './assets/css/course.less'
import './assets/css/courseDesc.less'
import './assets/css/contentDescPage.less'
import './assets/css/addContent.less'
import './assets/css/contentModify.less'

import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueJsonp from 'vue-jsonp'

Vue.use(VueQuillEditor)
Vue.use(VueJsonp)


Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$ajax = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
