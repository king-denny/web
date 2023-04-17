// app.js
const http = require("/utils/js/http.js")

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    sysHttpUrl:'https://www.novanansha.com:8011/ns-system/',  //后台服务Url
    userInfo: null, //用户信息
    hasLogin: false,      //登录状态,判断缓存是否有mobile
    hasOpenId: false,     //db是否存在openid
    openId: '',            //对应openid
    sessionKey:'',
    userType: '0',          //用户类型,0-一般会员 1-注册会员,2-实名认证会员,3-销售员,4-管理人员,-1- 未知
    userCompany:'',
    userName: '',     //
    userMobile: '',        //用户电话
    hasIdChecked: false,
    hadStockChecked: false,
    defaultSalerPhone:'',   //小程序码对应的销售人员电话
    defaultAuthGetPhone:'',  //授权取得的手机号码
    hadShowAuthForm:false,   //是否已经提示过获取手机号码提示框
    showActSign:false,
    showActCheckIn:false,
    projectAttend:false
  },
  
  //自定义,登录判断,取code，得到openid,判断openid 是否存在
  //判断openid 是否存在,
  //added by wss ,增加返回其他信息
  promiseWXLogin: function () {
    var that = this
    return new Promise(function(resolve, reject){

      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            http.post({
              url: 'WxApp/authCode2Session',
              data: {
                //data为传递给后台的参数
                jsCode: res.code
              },
              success: (res) => {
                console.log("_handleWXLogin.res=", res)   

                if (res.hasOwnProperty("openid")) {
                  //放入缓存中,这里是给注册那边用的
                  that.globalData.openId=res.openid
                  that.globalData.sessionKey=res.session_key
                  wx.setStorageSync("wxOpenId", res.openid)
                  //查看后台数据库
                  http.post({
                    //这里单独开发
                    url: "/WxApp/checkIsOpenIdExit",
                    data: {
                      "wxOpenId": res.openid
                    },
                    success: (resp) => {
                      console.log("promiseWXLogin" +resp.code)
                      
                      var sucOrno = resp.code === 200
                      that.globalData.hasOpenId=true
                      wx.setStorageSync("cacheBackHave", sucOrno)
                      
                      resolve(sucOrno)
                    },
                    fail: (resp) => {

                      reject(false)
                    }
                  })
                }

              }
            })
          }
        },
        fail(res) {
          reject(res)
        }
      })
    })
  },  //end promiseWXLogin
  onShow: function(options){
    
  },
  onHide: function(){
  },
  onError: function(msg){

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options){

  }

  
})
