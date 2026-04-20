import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI, {Message,Loading} from 'element-ui'
import axios from "axios"
//将axios放到vue原型中去使用，this.$http
Vue.prototype.$http = axios
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css';
// 字体图标库
import 'font-awesome/css/font-awesome.min.css'
import './icons'

// 列表滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

//引入v-charts
import VCharts from 'v-charts'
Vue.use(VCharts);

//引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;


// 粒子特效
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.use(Vuex);
Vue.use(ElementUI, {size: 'small'});

Vue.prototype.basePath="http://community.byesame.com";
axios.defaults.baseURL='http://community.byesame.com';
/**
 * 封装axios方法，为不需要登录操作时使用
 * @param options配置
 */

let Axios = (options)=>{
  axios({
    url: options.url,
    method: options.method||'POST',
    data: options.data,
    params: options.data
  }).then(result=>{
    if (options.success) options.success(result.data)
  }).catch(err=>{
    let msg = err.response ? err.response.data:'请求异常'
    if (options.error){
      options.error(msg)
      Message.error(({message:msg,offset:150}))
    } else {
      Message.error(({message:msg,offset:150}))
    }
  })
};
Vue.prototype.$Axios = Axios;
/**
 * 携带token的axios
 * @param options
 */
let axiosToken = (options)=>{
  options.data.token = sessionStorage.token
  axios({
    url: options.url,
    method: options.method||'POST',
    data: options.data,
    params: options.data
  }).then(result=>{
    if (options.success) options.success(result.data)
  }).catch(err=>{
    let msg = err.response ? err.response.data:'请求异常'
    if (options.error){
      options.error(msg)
      Message.error(({message:msg,offset:150}))
    } else {
      Message.error(({message:msg,offset:150}))
    }
  })
};
Vue.prototype.$axiosToken = axiosToken;

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

// 路由跳转之前(登录 退出系统）
router.beforeEach((to,from,next)=>{
  let token = sessionStorage.getItem('token');
  // 注销
  if (to.path == '/logout'){
    // 清空
    sessionStorage.clear()
    // 跳转登陆页面
    next({path:'/login'})
  } else if (to.path == '/login'){
    // 判断是否为空，不为空跳转至首页
    if (token != null){
      next({path:'/Index'})
    }
  }else if (token == null){
    next({path:'/login'})
  }
  next()
});


// 图片放大预览等
// import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
// Vue.use(Viewer)
// Viewer.setDefaults({
//   Options: {
//     'inline': true, // 启用 inline 模式
//     'button': true, // 显示右上角关闭按钮
//     'navbar': true, // 显示缩略图导航
//     'title': true, // 显示当前图片的标题
//     'toolbar': true, // 显示工具栏
//     'tooltip': true, // 显示缩放百分比
//     'movable': true, // 图片是否可移动
//     'zoomable': true, // 图片是否可缩放
//     'rotatable': true, // 图片是否可旋转
//     'scalable': true, // 图片是否可翻转
//     'transition': true, // 使用 CSS3 过度
//     'fullscreen': true, // 播放时是否全屏
//     'keyboard': true, // 是否支持键盘
//     'url': 'data-source' // 设置大图片的 url
//   }
// });


// import  io from './components/page/personal/chat/socket.io'
// //套接字端口定义
// Vue.prototype.socket=io('http://community.byesame.com')

// // 引用vue-socket.io
// import VueSocket from 'vue-socket.io'
// Vue.use(new VueSocket({
//   debug: false,
//   connection:'http://community.byesame.com'
// }))

// Vue.prototype.socketpath="http://community.byesame.com",




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
