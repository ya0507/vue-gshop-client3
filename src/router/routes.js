import MSite from '../pages/MSite/MSite.vue'
import Search from '../pages/Search/Search.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/shop/shop.vue'

/* shop下的子路由 */
import ShopGoods from '../pages/shop/ShopGoods.vue'
import ShopInfo from '../pages/shop/ShopInfo.vue'
import ShopRatings  from '../pages/shop/ShopRatings.vue'

export default [
  {
    path: '/msite',
    component: MSite,
    meta: {
      isShowFooter: true
    }
  },
  {
    path: '/search',
    component: Search,
    meta: {
      isShowFooter: true
    }
  },
  {
    path: '/order',
    component: Order,
    meta: {
      isShowFooter: true
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      isShowFooter: true
    }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/shop',
    component: Shop,
    children:[
      {
        path: '/shop/goods',
        component: ShopGoods
      },
      {
        path: '/shop/info',//也可以直接写'info'
        component: ShopInfo
      },
      {
        path: '/shop/ratings',
        component: ShopRatings
      },
      {
        path: '/shop', 
        redirect: '/shop/goods'
      }
    ]
  },


  {
    path: '/', // 项目根路径
    redirect: '/msite'
  }
]