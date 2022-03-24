import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/css/public.css'

import axios from 'axios'

// 导入插件
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



Vue.use(VueQuillEditor, /* { default global options } */)

Vue.component('tree-table', TreeTable)

// 进度条插件
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config=>{
  
  // 挂载token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 此回调函数必须返回config
  return config
})

// 在response中隐藏进度条
// axios.interceptors.response.use(config=>{
//   NProgress.done()
    //  return config
// })


// 格式化时间的过滤器
Vue.filter('dateFormat', origin=>{
  const dt = new Date(origin)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const min = (dt.getMinutes() + '').padStart(2, '0')
  const sec = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${sec}`
})

// 将axios挂载到原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
