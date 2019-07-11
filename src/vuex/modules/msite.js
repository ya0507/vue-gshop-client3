    /* 管理首页的模块 */

    import {
        reqAddress,
        reqCategorys,
        reqShops
    } from '../../api'
    import {
        RECEIVE_ADDRESS,
        RECEIVE_CATEGORYS,
        RECEIVE_SHOPS, 
    } from "../mutation-types"
    const state ={
        latitude: 40.10038, // 纬度
        longitude: 116.36867, // 经度
        
        address: {}, // 地址信息对象
        categorys: [], // 分类数组
        shops: [], //商家数组

    }
    const mutations ={
        [RECEIVE_ADDRESS](state, address) {
            state.address = address
        },

        [RECEIVE_CATEGORYS](state, categorys) {
            state.categorys = categorys
        },

        [RECEIVE_SHOPS](state, shops) {
            state.shops = shops
        },

    }
    const actions= { 
        /* 
        获取当前地址的异步action
        */
        async getAddress({commit, state}) {
        const { longitude, latitude } = state
        // 发异步ajax请求
        const result = await reqAddress(longitude, latitude)
        // 有了结果后, 提交mutation
        if (result.code===0) {
            const address = result.data
            commit(RECEIVE_ADDRESS, address)
        }
        },
    
        /* 
        获取分类列表的异步action
        */
        async getCategorys({commit}, callback) {
        // 发异步ajax请求
        const result = await reqCategorys()
        // 有了结果后, 提交mutation
        if (result.code===0) {
            const categorys = result.data
            commit(RECEIVE_CATEGORYS, categorys)
            // 在更新状态数据后执行回调函数
            typeof callback === 'function' && callback() // 发通知
        }
        },
    
        /* 
        获取商家列表的异步action
        */
        async getShops({commit, state}) {
        const { longitude, latitude } = state
        // 发异步ajax请求
        const result = await reqShops({longitude, latitude})
        // 有了结果后, 提交mutation
        if (result.code===0) {
            const shops = result.data
            commit(RECEIVE_SHOPS, shops)
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