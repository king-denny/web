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
    isGoodsDataHave: true,  
    pageLoading: true,
    isUserLogin:false,    //是否登录
    hadOpenId:false,
    hideAuthForm:true, //是否显示获取手机号码提示对话框
    swiperList:[{
        "url":"http://www.panda-cargo.com.cn/sw2.jpg",
        "id":"0"
    },{
        "url": "http://www.panda-cargo.com.cn/sw1.jpg",
        "id": "1"
    },{
        "url": "http://www.sg-fund.com/images/kg2.png",
        "id": "2"
    }], // 轮播图
    proclamations:[{"id":1,"noticeType":"新闻","noticeTitle":"关于运维时间的通知","noticeUrl":"www.cc"},{"id":2,"noticeType":"新闻","noticeTitle":"南沙区开展新的人口普查","noticeUrl":"www.cc"},{"id":3,"noticeType":"新闻","noticeTitle":"3月3日创享湾沙龙活动","noticeUrl":"www.cc"}], // 公告
    productList:[],// 产品数据
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
//公告点击跳转
_handleProclaTitle:function(evt){

  wx.reLaunch({
    url: '/pages/newsInfo/newsInfo'
  }) 

  // if(!this.pageLoading) {
  //   if (evt.currentTarget.id) {
  //     this.pageLoading = !0;
  //     wx.navigateTo({
  //       url: '/pages/proclaDetail/proclaDetail?id=' + evt.currentTarget.id+"&tit="+evt.currentTarget.dataset.noticetit
  //     })
  //   }
  // }

},
showBizInfo: function (evt){
  // console.log(evt.currentTarget.dataset.infoid)
  var tr=evt.currentTarget.dataset.infoid
  if(tr==0){
  wx.reLaunch({
    url: '/pages/companyList/companyList'
  }) }
  else if(tr==1){
    wx.reLaunch({
      url: '/pages/activeInfo/activeInfo'
    })
  }
  else{
    wx.reLaunch({
      url: '/pages/projectInfo/projectInfo'
    })
  }


},
projectOntapDetail: function (evt){
  wx.reLaunch({
    url: '/pages/projectInfo/projectInfo'
  })
},

/**
 * 跳转到项目详情页面
 */
_handleHotProdNav:function(evt){
  //根据用户类型跳转
  if(this.data.isUserLogin){
    wx.navigateTo({
      url: '/pages/sgFundInfo/sgFundInfo?prodId=' + evt.currentTarget.dataset.prodid
    })
  }else{
    //未登录
    if(this.data.hadOpenId){
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }else{
      

    }

  }
 

},


  //查看更多
  _handlelistToggle: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.reLaunch({
      url: '/pages/newsList/newsList'
    }) 

  },  
  
  showMoreAct: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.reLaunch({
      url: '/pages/activeList/activeList'
    }) 

  }, 
  actOntapDetail: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.reLaunch({
      url: '/pages/activeInfo/activeInfo'
    }) 

  }, 
  showMoreProject: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.switchTab({
      url: '/pages/project/project'
    })

  }, 
  //下拉刷新
  onPullDownRefresh() {
    //加载轮播图

    //加载公告
    this.loadProcla(false)
    //加载产品
    this.loadData(false)
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
    // 2 验证缓存中是否存有openId存在的标记 cacheBackHave = true
    let cacheBack = wx.getStorageSync("cacheBackHave")

    // 3 如果tempAuthResp为空或者为undefined,此处如何处理呢?
    // 3 验证后台库存
    // 3.1 如果不存在openId那就直接进公告
    app.promiseWXLogin().then(res => {
      
      console.log('step two')
      //如果res为true 则说明后台有对应openId 先保证后台存在数据
      if (res) {
        console.log('res='+res)
        //大前提下,如果缓存中存在mobile那么默认进首页
        if (mobile) {
          console.log('mobile='+mobile)
          this.setData({
            isUserLogin: true,
            hadOpenId: true
          })
         
          app.globalData.hasLogin=true
          app.globalData.hasOpenId=true
          
       
          // that.loadIndexData().then(res => {
          //   console.log("加载首页数据")
          // })
          // return
        } else {

          console.log('mobile='+mobile)
          //2.1 大前提下,如果mobile不存在,但是缓存中有openId,说明注册过了,就跳转到登录
          if (cacheBack) {
            
            this.setData({
              isUserLogin: false,
              hadOpenId: true
            })
           
            app.globalData.hasOpenId=true
            app.globalData.hasLogin=false
            
          }
        }
        
      }
      //如果res为false 则说明后台没有对应的openId 就跳转到公告
      else {       
          
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
    return new Promise(function(resolve, reject){
      page = 0;
      wx.setNavigationBarTitle({
        title: '胜冠投资'
      })
      //暂时不用
      // loadMoreView = that.selectComponent("#loadMoreView")

      wx.getSystemInfo({
        success: function (res) {
          system: res
        }
      })
      //加载轮播图

      //加载公告
      
      that.loadProcla(true)
      //加载产品
      that.loadData(true)
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
    this.loadProcla()

    this.loadData(true)
  },

  /**暂时不用
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //loadMoreView.loadMore()
  },
  /**
   * 加载公告
   */
  loadProcla: function (showLoading) {
    var that = this
    console.log('islogin'+that.data.isUserLogin)
    http.post({
      url: 'WxApp/theNoticesNew',
      showLoading: showLoading,
      data: {
        islogin: that.data.isUserLogin
      },
      success:(res)=>{
        if(res.data.length == 0){
          console.log("没有公告信息")
          that.setData({
            isProclaDataHave: false
          })
        }
        if(res.data.length > 0){
          that.setData({
            proclamations: res.data
          })
        }
      },
      fail:() => {
        console.log("没有公告信息")
        that.setData({
          isProclaDataHave: false
        })
      }
    })
  },
  
  //显示基金信息
  loadData: function(showLoading) {
    var that = this
    http.post({
      url: 'WxApp/theBestThreeProd',
      showLoading: showLoading,
      data:{
        pageNum: page + 1,
        pageSize: 10
      },
      success:(res)=>{
        var items = that.data.productList
        if(page == 0) {
          items = res.data
          wx.stopPullDownRefresh()
        } else {
          items = items.concat(res.data)
        }
        if (items ==null || items.length == 0){
          console.log("没有基金信息")
          that.setData({
            isGoodsDataHave: false
          })
        }
        if(items.length > 0){
          that.setData({
            productList: items
          }) 
        }
        //暂时不用
        // loadMoreView.loadMoreComplete(res)
      },
      fail: ()=> {
        that.setData({
          isGoodsDataHave: false
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
      http.post({
        url: 'WxApp/saveAuthMemberAndDecryptV2',
        data: {
          iv: e.detail.iv,
          encryData:e.detail.encryptedData,            
          wxOpenId:getApp().globalData.openId,
          authPhone:'',
          salerPhone:getApp().globalData.defaultSalerPhone
        },
        success: (res) => {
          console.log("解析返回:"+res.phoneNumber);   
          getApp().globalData.defaultAuthGetPhone=res.phoneNumber
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
