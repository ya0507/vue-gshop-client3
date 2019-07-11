/* 
vuex最核心管理对象store
*/
import Vue from 'vue'
import Vuex, {Store} from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 引入模块
import shop from '../vuex/modules/shop.js'
import user from '../vuex/modules/user.js'
import msite from '../vuex/modules/msite.js'
// 声明使用vue插件
Vue.use(Vuex)


export default new Store({
  mutations,
  actions,
  getters,
  modules: {//配置应用中所有功能相关的配置
    msite,
    user,
    shop

  }
})