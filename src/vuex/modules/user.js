/* 管理用户的模块 */

import {reqAutoLogin } from '../../api'

import { 
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_TOKEN,
    RESET_TOKEN,
  } from "../mutation-types"
const state ={
  user:{},//用户保存登陆用户信息的对象
  token:localStorage.getItem('token_key'),
}
const mutations ={

[RECEIVE_USER](state, {user}) { 
state.user = user
  },
[RESET_USER](state) {
state.user = {}
  },
[RECEIVE_TOKEN](state, {token}) { 
state.token = token
  },
[RESET_TOKEN](state) { 
state.token = ''
  },
    
}
const actions= {
     // 用于保存用户信息
       /* 1.持久化保存user
          2.在state中保存user */
          recordUser({commit},user){
            // 将user的token保存到localstorge中（为了长久保存）
            localStorage.setItem('token_key',user.token)
            // 将token保存在state中
            commit(RECEIVE_TOKEN,{token:user.token})
            // 将user保存到state中
             delete user.token
            // 将user保存到state中
            commit(RECEIVE_USER,{user})
          },
      
        // 退出登陆
         logout({commit}){
          // 重置状态中的user
          commit(RESET_USER)
          // 重置状态中的token
          commit(RESET_TOKEN)
          // 清除local中保存的token
          localStorage.removeItem('tokey_key')  
         },
      
      
         /* 自动登录 */
        async autoLogin({commit,state}){
          // 取出token（token保存在state中）
          const token =state.token
          if(token){
            const result = await  reqAutoLogin()
            if(result.code===0){
             const user  = result.data
              commit(RECEIVE_USER,{user})
            }
          }
       
        },
    
}
const getters ={

}


export default {
    state,
    mutations,
    actions,
    getters
}