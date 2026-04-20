import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Common from "@/components/common/common"
// import Login from "../views/Login.vue"
Vue.use(VueRouter);

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

let routes = [
    //登录

    {
        path: "/login",
        name: "Login",
        component: resolve => require(['@/views/Login.vue'], resolve),
        meta: { title: '登录' },
    },
    //首页
    // {
    //     path: "/",
    //     name: "common",
    //     component: Common,
    //     redirect: "/Index",
    //     children: [{
    //         path: "Index",
    //         name: "Index",
    //         // component: () => import("../components/common/Index/index")
    //         component: resolve => require(['@/components/common/Index/index'], resolve),
    //         meta: { title: '首页' },
    //     }]
    // },
    {
        path: "/index",
        name: "Index",
        component: resolve => require(['@/components/common/Index/index'], resolve),
        meta: { title: '首页' },
    },
    //房屋管理
    //房屋单元
    {
        path: "/house",
        component: Common,
        redirect: "/house/unit",
        children: [{
            path: "unit",
            name: "unit",
            // component: () => import("../components/page/house/unit/index")
            component: resolve => require(['@/components/page/house/unit/index.vue'], resolve),
            meta: { title: '房屋单元' },
        },
        ]
    },
    // 房号管理
    {
        path: "/house",
        component: Common,
        redirect: "/house/number",
        children: [{
            path: "number",
            name: "number",
            component: () => import("../components/page/house/number/index"),
            meta: { title: '房号管理' },
            // component: resolve => require(['../components/page/house/unit/index'], resolve),
        },
        ]
    },
    //房屋设备
    {
        path: "/house",
        component: Common,
        redirect: "/house/deviceInfo",
        children: [{
            path: "deviceInfo",
            name: "deviceInfo",
            component: () => import("../components/page/house/deviceInfo/index"),
            meta: { title: '房屋设备' },
        },
        ]
    },
    //房屋添加
     {
        path: "/house",
        component: Common,
        redirect: "/house/add",
        children: [{
            path: "add",
            name: "add",
            component: () => import("../components/page/house/add/add.vue"),
            meta: { title: '房屋设备' },
        },
        ]
    },
      //房号添加
     {
        path: "/house",
        component: Common,
        redirect: "/house/numAdd",
        children: [{
            path: "numAdd",
            name: "numAdd",
            component: () => import("../components/page/house/add/numAdd.vue"),
            meta: { title: '房屋设备' },
        },
        ]
    },

    // 车位信息
    {
        path: "/parking",
        component: Common,
        redirect: "/parking/parkMessage",
        children: [{
            path: "parkMessage",
            name: "parkMessage",
            component: () => import("../components/page/parking/parkMessage/parkIndex"),
            meta: { title: '车位信息' },
        },
        ]
    },

    // 车位订单
    {
        path: "/parking",
        component: Common,
        redirect: "/parking/parkPay",
        children: [{
            path: "parkPay",
            name: "parkPay",
            component: () => import("../components/page/parking/parkPay/parkOrder"),
            meta: { title: '车位订单' },
        },
        ]
    },

    // 缴费类型
    {
        path: "/pay",
        component: Common,
        redirect: "/pay/payType",
        children: [{
            path: "payType",
            name: "payType",
            component: () => import("../components/page/pay/payType/payIndex"),
            meta: { title: '缴费类型' },
        },
        
        ]
    },
    // 缴费信息
    {
        path: "/pay",
        component: Common,
        redirect: "/pay/payMessage",
        children: [{
            path: "payMessage",
            name: "payMessage",
            component: () => import("../components/page/pay/payMessage/payMessage.vue"),
            meta: { title: '缴费信息' },
        },
        
        ]
    },
    // 缴费信息
    {
        path: "/pay",
        component: Common,
        redirect: "/pay/userPay",
        children: [{
            path: "userPay",
            name: "userPay",
            component: () => import("../components/page/pay/payMessage/userPay"),
            meta: { title: '用户支付' },
        },
        ]
    },
    // 缴费信息
    {
        path: "/pay",
        component: Common,
        redirect: "/pay/payDetail",
        children: [{
            path: "payDetail",
            name: "payDetail",
            component: () => import("../components/page/pay/payMessage/payDetail"),
            meta: { title: '缴费信息详情' },
        },
        ]
    },
    // 缴费添加
    {
        path: "/pay",
        component: Common,
        redirect: "/pay/payAdd",
        children: [{
            path: "payAdd",
            name: "payAdd",
            component: () => import("../components/page/pay/payAdd/payadd.vue"),
            meta: { title: '缴费添加' },
        },
        
        ]
    },
    //普通用户管理
    {
        path: "/user",
        component: Common,
        redirect: "/user/userMessage",
        children: [{
            path: "userMessage",
            name: "userMessage",
            component: resolve => require(['@/components/page/user/userMessage/userIndex.vue'], resolve),
            meta: { title: '普通用户信息' },
        }
        ]
    },
    //管理员用户管理
    {
        path: "/user",
        component: Common,
        redirect: "/user/adminMessage",
        children: [{
            path: "adminMessage",
            name: "adminMessage",
            component: resolve => require(['@/components/page/user/adminMessage/adminIndex.vue'], resolve),
            meta: { title: '管理员信息' },
        }
        ]
    },
    //用户总表管理
    {
        path: "/user",
        component: Common,
        redirect: "/user/Message",
        children: [{
            path: "Message",
            name: "Message",
            component: resolve => require(['@/components/page/user/Message/Index.vue'], resolve),
            meta: { title: '用户总表查询' },
        }
        ]
    },

    //公告管理
    {
        path: "/service",
        component: Common,
        redirect: "/service/postMessage",
        children: [{
            path: "postMessage",
            name: "postMessage",
            component: resolve => require(['@/components/page/service/postMessage/post.vue'], resolve),
            meta: { title: '公告信息' },
        }
        ]
    },

    //维修处理
    {
        path: "/service",
        component: Common,
        redirect: "/service/repair",
        children: [{
            path: "repair",
            name: "repair",
            component: resolve => require(['@/components/page/service/repair/repairIndex.vue'], resolve),
            meta: { title: '维修处理' },
        }, {
            path: "smartRepair",
            name: "smartRepair",
            component: resolve => require(['@/components/page/service/repair/smartRepair.vue'], resolve),
            meta: { title: '智能设备维修' },
        }, {
            path: "houseRepair",
            name: "houseRepair",
            component: resolve => require(['@/components/page/service/repair/houseRepair.vue'], resolve),
            meta: { title: '家居设备维修' },
        }
        ]
    },

    // 反馈服务
    {
        path: "/service",
        component: Common,
        redirect: "/service/feedback",
        children: [{
            path: "feedback",
            name: "feedback",
            component: resolve => require(['@/components/page/service/feedback/feedIndex.vue'], resolve),
            meta: { title: '反馈服务' },
        }
        ]
    },


    // 菜单管理
    {
        path: "/menu",
        component: Common,
        redirect: "/menu/menuData",
        children: [{
            path: "menuData",
            name: "menuData",
            component: resolve => require(['@/components/page/menu/menuData/menuData.vue'], resolve),
            meta: { title: '菜单列表' },
        },
        {
            path: "menuSecond",
            name: "menuSecond",
            component: resolve => require(['@/components/page/menu/menuData/menuSecond.vue'], resolve),
            meta: { title: '二级菜单列表' },
        }
        ]
    },

    //密码修改
    {
        path: "/personal",
        component: Common,
        redirect: "/personal/change",
        children: [{
            path: "change",
            name: "change",
            component: resolve => require(['@/components/page/personal/change/pwdChange.vue'], resolve),
            meta: { title: '用户总表查询' },
        }
        ]
    },
     {
        path: "/personal",
        component: Common,
        redirect: "/personal/Message",
        children: [{
            path: "Message",
            name: "Message",
            component: resolve => require(['@/components/page/personal/message/index.vue'], resolve),
            meta: { title: '我的信息' },
        },
        ]
    },

    // {
    //     path: "/personal",
    //     component: Common,
    //     redirect: "/personal/joinChat",
    //     children: [{
    //         path: "joinChat",
    //         name: "joinChat",
    //         component: resolve => require(['@/components/page/personal/chat/joinChat.vue'], resolve),
    //         meta: { title: '加入群聊' },
    //     },
    //         {
    //             path: "chat",
    //             name: "chat",
    //             component: () => import("@/components/page/personal/chat/chat.vue"),
    //             meta: { title: '小区群聊' },
    //         }
    //     ]
    // },

    //
    // {
    //   path: "/index",
    //   name: "index",
    //   component: resolve => require(['@/components/common/IconSvg.vue'], resolve),
    //   meta: { title: '首页' },
    // },
    // {
    //   path: "/",
    //   name: "Home",
    //   component: Home
    // },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
        path: "*",
        name: "NotFound",
        component: () => import('@/components/NotFound')
    },
];
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new VueRouter({
    routes
});
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

// 全局守卫
// router.beforeEach((to, from, next) => {
//     if (to.path === "/login") {
//         return next();
//     }
//     let token = window.sessionStorage.getItem("token");
//     if (!token) {
//         return next("/login");
//     }
//     next();
// })
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, form, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = '登录' //此处写默认的title
    }
    next()
})



export default router;
