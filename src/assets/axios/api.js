//引入封装的的请求
import { http } from './http'

const apiServe = {
  // login:function(data){
  //     return http('/login', 'post', data)
  // },
  //  login:(data)=>{
  //     return http('/login', 'post', data)
  // },
  // login:data=> http('/login', 'post', data)
  // },

  posterData: (data, method) => http("/poster/getPosterData", method, data),

  admin: (data, method) => http("/admin", method, data),
  adminGet: (data, method) => http("/admin/" + data.adminId, method, {}),
  //募捐活动
  donate: (data, method) => http("/activity", method, data),
  donateGet: (data, method) => http("/activity/" + data.activityId, method, {}),
}
//导出
export default apiServe;

/*
    在vue中引入apiServe
      apiServe.login({
        username: 'admin',
        password: '123456'
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })


      apiServe.login ===>http() ===>Promise() ===>resolve() 
      
      apiServe ===> resolve()
*/ 