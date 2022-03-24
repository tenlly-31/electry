import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = ()=> import('../components/login.vue')
const Home = ()=> import('../components/home.vue')
const Welcome = ()=> import('../components/welcome.vue')
const Users = ()=> import('../components/user/users.vue')
const Rights = ()=> import('../components/power/rights.vue')
const Roles = ()=> import('../components/power/Roles.vue')
const Cate = ()=> import('../components/goods/cate.vue')
const Params = ()=> import('../components/goods/params.vue')
const List = ()=> import('../components/goods/List.vue')
const Add = ()=> import('../components/goods/Add.vue')
const Order = ()=> import('../components/order/Order.vue')
const Report = ()=> import('../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }

    ]
  }
]

//vue中引用
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 在request拦截器中展示进度条
  NProgress.start()
  if (to.path === '/login') {
    // 清除token缓存
    window.sessionStorage.clear()
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

router.afterEach(transition => {
  NProgress.done()
})
export default router
