// 之前调用的axios都是使用官方的默认配置，现在我们要做一个自定义的axios
// 1 引入 axios
import axios from 'axios'
import { Message } from 'element-ui'
//引入路由实例
import router from '@/router'
//引入vuex
import store from '@/store'
let url=""
// 自动判断环境是开发环境还是本地环境
//如果是本地环境拼接的接口前缀是http://joint.byesame.com
if(process.env.NODE_ENV == 'development'){
    url = "http://community.byesame.com"
}
//如果是开发环境/线上环境，拼接的接口前缀是http://sb.com
else{
    url = "http://community.byesame.com"
}

// 2 自定义配置axios，创建一个axios实例
const serve = axios.create({
    //baseURL相当于axios.defaults.baseURL，相当于给接口配置了一个接口前缀
    //  process.env.VUE_APP_BASE_API自动到vue.config.js中去匹配接口前缀
    baseURL: url,
    //设置超时时间，请求超过10s结束请求
    timeout: 10000,
    //设置请求头---默认的axios的请求头不是json  后续再调接口单独时候就不需要每个接口都添加请求头了
    headers: {
        'Content-Type': "application/x-www-form-urlencoded"
    }
});
// 请求拦截---发送请求的路上干了什么事？ 设置请求头
serve.interceptors.request.use((config) => {
    // console.log(config,"请求拦截")
    //除了登录和注册接口以外必须传递token
    if(config.url!="/login" && config.url!="/register"){
        // config.headers.token = localStorage.getItem("token")
        config.headers.token = store.state.login.token

    }
    return config;
})
// 响应拦截---请求成功之后干什么事情？判断状态码，如果是200那么就在这里返回数据，如果失败那么返回弹出信息
serve.interceptors.response.use((res) => {
    //   console.log(res,"响应拦截") 
    //如果是200那么就返回数据，否则弹出提示
    if (res.data.code == 200) {
        return res.data
    } else if (res.data.code == 199 || res.data.code == 101) { // 199缺少必要参数   101用户名密码错误
        Message({
            type: 'error',
            message: res.data.msg
        })
        return false
    } else if (res.data.code == 401) { //token验证失败
        Message({
            type: 'error',
            message: res.data.msg
        })
        // 跳转到登录页面
        router.replace("/")
        return false
    } else {
        Message({
            type: 'error',
            message: "系统错误"
        })
        return false
    }
})
export { serve };
export const http = (url, method, data) => {
        return new Promise((resolve, reject) => {
            serve({
                method: method,
                url: url,
                // 如果是get那么就是params否则就是data
               [method == "get"? "params" : "data"]: data
            }).then((res) => {
                if (res.code == 200) {
                    resolve(res)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }




// export const http = (url, method = "get", data) => {
//     if (method == "get") {
//         return new Promise((resolve, reject) => {
//             serve({
//                 method: method,
//                 url: url,
//                 params: data
//             }).then((res) => {
//                 // res == res.data
//                 if (res.code == 200) {
//                     resolve(res)
//                 }
//             }).catch((err) => {
//                 reject(err)
//             })
//         })
//     }
//     // 其它请求：post,put,delete
//     else{
//          return new Promise((resolve, reject) => {
//             serve({
//                 method: method,
//                 url: url,
//                 data: data
//             }).then((res) => {
//                 // res == res.data
//                 if (res.code == 200) {
//                     resolve(res)
//                 }
//             }).catch((err) => {
//                 reject(err)
//             })
//         })
//     }
// }



/*
    封装创建自定义axios目的：
        1 第一接口前缀的统一管理。
        2 在请求拦截中设置请求头，节省代码
        3 在响应拦截在配置状态码弹出不同的提示，节省代码
    
    问万一哪天后端的接口路径全部发生了改变？不可能挨着组件去修改。所以我们要对接口的路径进行统一管理。全部放到一个js中
    
serve({
    method:"",
    url:"",
    data/params:""
}).then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

*/
