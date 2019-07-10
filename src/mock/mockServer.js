/* 使用mockjs，实现mock接口 */

import Mock from 'mockjs'
import data from './data.json'
//data在此处不是字符串， 是自动解析为js，可以相互转换(转换语法：JSON.stringify,JSON.parse) ｛json对象自动解析为js对象，json数组自动解析为js数值｝

// 后台接口返回的都是对象
Mock.mock('/goods',{code:0, data:data.goods})
Mock.mock('/ratings',{code:0, data:data.ratings})
Mock.mock('/info',{code:0, data:data.info})

console.log('mockserver启动了');
