// index.js
// 获取应用实例
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({
  
  data: {
    system: {},
    visitFrTime: '',
    isProclaDataHave: true,   //有新闻信息
    isActDataHave: true,    //有活动信息
    isProjectDataHave: true,    //有项目信息
    pageLoading: true,
    isUserLogin:false,    //是否登录
    hadOpenId:false,
    hideAuthForm:true, //是否显示获取手机号码提示对话框
    swiperList:[], // 轮播图
    proclamations:[], // 公告
    productList:[],// 活动数据
    projectList:[],// 项目数据
    navbarActiveIndex:0,
    clientHeight:'',
    clientHeight2:'',
    clientHeight3:'',

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },

  // 事件处理函数
//公告点击跳转,跳转到外部链接
_handleProclaTitle:function(evt){
  console.log('nav news:'+ evt.currentTarget.dataset.noticeurl)

  wx.navigateTo({
     url: '/pages/outerWeb/outerWeb?url=' + evt.currentTarget.dataset.noticeurl
   
  })

},
showSwiperInfo: function (evt){
  console.log(evt.currentTarget.dataset.infotype+" " +evt.currentTarget.dataset.refurl+" " +evt.currentTarget.dataset.refid)

  var tr=evt.currentTarget.dataset.infotype
  if(tr=="新闻"){
    wx.navigateTo({
      url: '/pages/outerweb/outweb?url=' + evt.currentTarget.dataset.refurl
    })
  }else if(tr=="活动"){
    wx.navigateTo({
      url: '/pages/activeInfo/activeInfo?infoId=' + evt.currentTarget.dataset.refid
    })
  }
  else if(tr=="项目"){
    wx.navigateTo({
      url: '/pages/projectInfo/projectInfo?infoId=' + evt.currentTarget.dataset.refid
    })
  }


},
projectOntapDetail: function (evt){

  wx.navigateTo({
    url: '/pages/projectInfo/projectInfo?infoId='+ evt.currentTarget.dataset.proid
  })

},
  //查看更多新闻
  _handlelistToggle: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.navigateTo({
      url: '/pages/newsList/newsList'
    }) 

  },  
  
  showMoreAct: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.navigateTo({
      url: '/pages/activeList/activeList'
    }) 

  }, 
  actOntapDetail: function (evt) {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    console.log('act canshu='+evt.currentTarget.dataset.actid)

    // wx.navigateTo({
    //   url: '/pages/activeInfo/activeInfo?infoId='+ evt.currentTarget.dataset.actid
    // }) 
    if(evt.currentTarget.dataset.noticetit==1){
      wx.navigateTo({
        url: '/pages/activeWInfo/activeWInfo?infoId='+ evt.currentTarget.dataset.actid
      }) 
    }else{
      wx.navigateTo({
        url: '/pages/activeInfo/activeInfo?infoId='+ evt.currentTarget.dataset.actid
      }) 
    }
  

  }, 
  showMoreProject: function () {
    
    wx.switchTab({
      url: '/pages/project/project'
    })

  }, 
  //下拉刷新
  onPullDownRefresh() {
    //加载轮播图
    this.loadSwiper(false)

    //加载新闻
    this.loadNews(false)

    //加载活动
    this.loadActData(false)


  },
  onReachBottom: function() {
   // loadMoreView.loadMore()
  },

  // 页面开始加载 就会触发
  //显示页面，如果没有openid-->register,没有mobile-->login，如果cache里有mobile，直接显示内容
  onLoad: function(options){
    var that = this
    
    //扫二维码进来的
    if(options.scene){
      console.log("scene="+options.scene)
      getApp().globalData.defaultSalerPhone=decodeURIComponent(options.scene)
    }else{
      // getApp().globalData.defaultSalerPhone="123"
      // console.log("phone:"+getApp().globalData.defaultSalerPhone)
    }


    var timestamp =util.changeTimeStampFull(new Date());
    this.setData({
      visitFrTime:timestamp
    })
    
    //console.log('step one')
    //1 缓存中取mobile
    let mobile = wx.getStorageSync("mobile")
    console.log('step one:'+mobile)
    // 2 验证缓存中是否存有openId存在的标记 cacheBackHave = true
    let cacheBack = wx.getStorageSync("cacheBackHave")

    // 3 如果tempAuthResp为空或者为undefined,此处如何处理呢?
    // 3 验证后台库存
    // 3.1 如果不存在openId那就直接进公告
    app.promiseWXLogin().then(res => {
      
      console.log('step two')
      //如果res为true 则说明后台有对应openId 先保证后台存在数据
      if (res) {
        console.log('promiseWXLogin res='+res+ ' openid='+getApp().globalData.openId)
        http.post({
          url: 'WxApp/getBizUserInfoByWx',
          data: {
            wxid: getApp().globalData.openId
          },
          success: (res) => {
            if (res.code == "1") {
          
              this.setData({
                // username: res.name,
                // idCard: res.idno,
                // mobile: res.mobile,
                // address:res.address,
                // email:res.email,
                isUserLogin: true,
                hadOpenId: true
              })

              wx.setStorageSync("mobile", res.mobile)
              getApp().globalData.userCompany=res.company
              getApp().globalData.userName=res.name
              getApp().globalData.userMobile=res.mobile
              getApp().globalData.hasLogin=true
              getApp().globalData.hasOpenId=true

              console.log('index='+getApp().globalData.userCompany + getApp().globalData.userName+ getApp().globalData.userMobile)

            } else {
    
            }
          },
          fail: (res) => {
            console.log(res)
          }
        })
        
      }      
      else {       
          //如果res为false 则说明后台没有对应的openId 就跳转到公告
          this.setData({
            isUserLogin: false,
            hadOpenId: false,            
          })         
          app.globalData.hasLogin=false
          app.globalData.hasOpenId=false
          getApp().globalData.hadShowAuthForm=true;
          
          var enws = wx.getStorageSync('enws');

          if (enws != '2'){
            this.setData({           
              hideAuthForm:false
            })
          }

          //要显示获取手机号码对话框
      }

      that.loadIndexData()

      
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight,            
          });
        }
      })

    })

    //加载数据
    // that.loadIndexData().then(res => {
    //   console.log("加载首页数据")
    // })
    
    //that.loadIndexData()
    that.saveVisitLog()

  },
  
  loadIndexData: function(){
    var that = this

    //加载轮播图
    this.loadSwiper(true)

    //加载新闻      
    that.loadNews(true)

    //加载活动信息
    that.loadActData(true)

     //加载项目信息
     that.loadProjectData(true)

    return new Promise(function(resolve, reject){
      page = 0;
      wx.setNavigationBarTitle({
        title: '创享湾媒'
      })
      //暂时不用
      // loadMoreView = that.selectComponent("#loadMoreView")

      wx.getSystemInfo({
        success: function (res) {
          system: res
        }
      })
      

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.pageLoading = !1;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    


  },

  saveVisitLog: function(){
    return;
    
    let mobilet = wx.getStorageSync('mobile');
    if(mobilet==null || mobilet==""){
      return;
    }

    http.post({
      url: 'WxApp/saveUserVisitInfo',
      data: {
        memberName: '',
        memberPhone: mobilet,
        webUrl: '',
        webPage: '首页',
        fundName: '',
        prodId: '',
        frTime: this.data.visitFrTime,
        toTime: new Date()
      },
      success: (res) => {
        if (res.code == "1") {
                   
        } else {

        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
 /**
  * 页面相关事件处理函数 - 监听用户下拉动作
  */
  onPullDownRefresh: function() {
    page = 0;


    console.log("刷新公告信息")
    this.loadNews(false)

    this.loadActData(true)

    this.loadProjectData(true)

  },

  /**暂时不用
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //loadMoreView.loadMore()
  },
  /**
   * 加载新闻
   */
  loadNews: function (showLoading) {
    var that = this
    console.log('loadnews'+that.data.isUserLogin)

    http.post({
      url: 'WxApp/getLatestNews',
      showLoading: showLoading,
      data: {
        islogin: that.data.isUserLogin
      },
      success:(res)=>{
        console.log("ret:"+res.data)

        if(res.data.length == 0){
          console.log("没有新闻信息")
          that.setData({
            isProclaDataHave: false
          })
        }
        if(res.data.length > 0){
          console.log('newslist:'+res.data)
          that.setData({
            proclamations: res.data
          })
        }
      },
      fail:() => {
        console.log("没有新闻信息")
        that.setData({
          isProclaDataHave: false
        })
      }
    })
  },
  loadSwiper: function (showLoading) {
    var that = this
    console.log('loadSwiper:'+that.data.isUserLogin)

    http.post({
      url: 'WxApp/getRotationImage',
      showLoading: showLoading,
      data: {
        islogin: that.data.isUserLogin
      },
      success:(res)=>{
        if(res.data.length == 0){
          console.log("没有轮播图片信息")         
        }
        if(res.data.length > 0){
          that.setData({
            swiperList: res.data
          })
        }
      },
      fail:() => {
        console.log("没有轮播图片信息")        
      }
    })
  },
  //显示活动信息
  loadActData: function(showLoading) {
    var that = this
    let openid= wx.getStorageSync('wxOpenId');
    http.post({
      url: 'WxApp/getLatestAct',
      showLoading: showLoading,
      data:{       
        pageSize: 10,
        wxOpenid:openid
      },
      success:(res)=>{
        console.log('act'+res.data)

        if(res.data.length == 0){
          console.log("没有活动信息")   
          that.setData({
            isActDataHave: false
          })      
        }
        if(res.data.length > 0){
          that.setData({
            productList: res.data
          })
       
        }
        //暂时不用
        // loadMoreView.loadMoreComplete(res)
      },
      fail: ()=> {
        that.setData({
          isActDataHave: false
        })
        if(page != 0){
          //暂时不用
          // loadMoreView.loadMoreFail() 
        }
      }
    })
  },
  loadProjectData: function(showLoading) {
    var that = this
    http.post({
      url: 'WxApp/getLatestProject',
      showLoading: showLoading,
      data:{       
        pageSize: 10
      },
      success:(res)=>{

        if(res.data.length == 0){
          console.log("没有项目信息")   
          that.setData({
            isProjectDataHave: false
          })      
        }
        if(res.data.length > 0){
          that.setData({
            projectList: res.data
          })
        }
        
        
      },
      fail: ()=> {
        that.setData({
          isProjectDataHave: false
        })
        if(page != 0){
          //暂时不用
          // loadMoreView.loadMoreFail() 
        }
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },



  cancleAuth: function () {
    // wx.setStorageSync('enws', '2');
    console.log('cancel')
    this.setData({
      hideAuthForm: true
    })
    wx.setStorageSync('enws', '2');

  },
  getPhoneNumber: function(e){  
    
    //赋值，避免再次提示授权
    wx.setStorageSync('enws', '2');

    if(e.detail.errMsg=="getPhoneNumber:fail user deny"){       //用户决绝授权  
        //拒绝授权后弹出一些提示  
        //console.log("234")                   

    }else{      //允许授权        

      console.log("iv="+e.detail.iv)
      console.log("iv="+e.detail.encryptedData)
      console.log("openid="+getApp().globalData.openId)
      console.log("openid="+ wx.getStorageSync("wxOpenId"))

      http.post({
        url: 'WxApp/saveAuthMemberAndDecryptV2',
        data: {
          iv: e.detail.iv,
          encryData:e.detail.encryptedData,            
          wxOpenId:wx.getStorageSync("wxOpenId"),
          authPhone:'',
          salerPhone:getApp().globalData.defaultSalerPhone
        },
        success: (res) => {

          console.log("得到手机号解析返回:"+res.phoneNumber);   
          getApp().globalData.defaultAuthGetPhone=res.phoneNumber

          wx.setStorageSync("mobile", res.phoneNumber);
        },
        fail: (res) => {
          console.log(res)
        }
      })

        //console.log(e.detail.encryptedData)  
        // e.detail.encryptedData      //加密的用户信息  
        // e.detail.iv     //加密算法的初始向量  时要用到  
    }
    
    this.setData({
      hideAuthForm: true
    })
    
  },
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    console.log(event)
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
        
  },
  onBindAnimationFinish: function ({detail}) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
  },


})
