// pages/my/my.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
var util = require('../../utils/js/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      visible: false,
      /** 下拉刷新，下拉加载参数 */
      totalPage: 1, //总页数page
      pagenum: 1,
      pagesize: 4,
      // loading: false, // "上拉加载"的变量，默认false，隐藏 
      // loaded: false, //“没有数据”的变量，默认false，隐藏
      // isDown: false, //下拉是否查询
      // hidden: true, //用于控制当 scroll-view 滚动到底部时，显示 “数据加载中...” 的提示
      userName: '',
      company:'',
      mobile: '',
      mobileAll: '',
      messContent:'',
      topFixed:false,// 控制滚动固定
      initTop:0, // 标题初始的高度
      userType: 0,
      idCheckedStatus:'0',
      stockCheckedStatus: '0',
      maskFlagHiden: true,
      pubCommentList:[],
      priCommentList:[],


        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
      },

      onTap() {
        this.setData({
          visible: !this.data.visible
        })
      },
      //上拉加载更多
      onReachBottom() {
        console.log("上拉加载更多")
        // 判断还有没有下一页数据
        if (this.data.pagenum >= this.data.totalPage) {
          wx.showToast({
            title: '没有下一页数据了',
          });
        } else {
          this.setData({
            pagesize: this.data.pagesize + 4,
          })
          this.gainMoreLoadingListData();
          console.log('%c' + "有下一页数据", 'color:#fff;background:linear-gradient(to right,red ,pink)');
        }
      },
    
      //下拉刷新
      onPullDownRefresh() {
        //充值数组
        // this.setData({
        //   dataList: []
        // })
        // 充值页码
        this.setData({
          pagesize: 4,
        })
    
      },
      //获取个人信息
      getUserInfos: function (){
  
        let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
      
        http.post({
          url: 'WxApp/getBizUserInfo',
          data: {
            mobile: mobilet
          },
          success: (res) => {
  
            console.log("getBizUserInfo:"+res)
            if (res.code == "1") {
  
              this.setData({
                userType: res.usertype,
                mobileAll:mobilet
              })
              
              getApp().globalData.userType=res.usertype
  
              console.log("身份验证验证"+res.namecheck)
              console.log("双录验证"+res.stockcheck)
              
              var m1 = res.namecheck;
              var m2 = res.stockcheck;
  
              this.setData({
                idCheckedStatus: m1,
                stockCheckedStatus: m2
              })
  
            } else {
    
            }
          },
          fail: (res) => {
            console.log(res)
          }
        })
  
      },
      
      onLoad: function () {
          //如果个人信息不完善，跳转
          console.log("app="+getApp().globalData.userName+getApp().globalData.userMobile+getApp().globalData.userCompany)
          
          // if(getApp().globalData.userName=='' || getApp().globalData.userMobile=='' ||getApp().globalData.userCompany=='')
          // {
          //   wx.reLaunch({
          //     url: '/pages/myInfo/myInfo?infoId=2'
          //   })  
          // }

          this.setData({
            canIUseGetUserProfile: true,
            userName: getApp().globalData.userName,
            company:getApp().globalData.userCompany,
            mobile: getApp().globalData.userMobile,
          })

          //获取个人信息,是否验证
          //this.getUserInfos()
         
          if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true
            })
          }

        //获取标题距离顶部的初始高度
          this.getScrollTop(this);
            
      },
      getScrollTop(that){
          if (that.data.initTop == 0) {
              //获取节点距离顶部的距离
              wx.createSelectorQuery().select('#bigTitle').boundingClientRect(function (rect) {
                  if (rect && rect.top > 0) {
                      var initTop = parseInt(rect.top);
                      that.setData({
                          initTop: initTop
                      });
                  }
              }).exec();
          }
      },
        onPageScroll:function(e){
            var that = this;
            var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
            //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
            var isSatisfy = scrollTop >= that.data.initTop ? true : false;
            //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
            if (that.data.topFixed === isSatisfy) {
                return false;
            }
            that.setData({
                topFixed: isSatisfy
            });
        },
    
      /**
       * 联系我们
       */
      callMe: function () {

        wx.makePhoneCall({
          phoneNumber: '13822267970'
        })
        // this.setData({
        //   maskFlagHiden: false
        // })
  
      },
      sendCleck: function () {
  
        let that = this;
          
        var mobile = that.data.mobileAll;
        var memo = that.data.messContent;
        //var authCode = that.data.authCode;
  
        // 判断账户、密码、验证码
        var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/;
  
        if (mobile.length == 0) {
          util.progressTips('手机号码不能为空！')
          return;
        }
    
        if (mobile.length < 11) {
          util.progressTips('手机号码长度有误！')
          return;
        }
    
        if (!myreg.test(mobile)) {
          util.progressTips('错误的手机号码！')
          return;
        }
  
        if (memo == null) {
          util.progressTips('咨询信息不能为空！')
          return;
        }
  
        http.post({
          url: 'WxApp/sendMail',
          data: {         
            mobile: mobile,
            content: memo          
          },
          success: (res) => {
            if (res.code == "1") {
                          
                this.setData({
                  maskFlagHiden: true,
                  messContent:''
                })  
              
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 3000,
                success: function () {                
                  
                }
              })
    
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 3000,
              })
            }
          },
          fail: (res) => {
            console.log(res)
          }
        })
  
      },
      cancelSend: function () {
        this.setData({
          maskFlagHiden: true
        })
      },
      /**
       * 产品详情
       */
      showmyfavinfo: function (evt){
        console.log(evt)
        wx.navigateTo({
          url: '/pages/myFavourate/myFavourate?infoId=' + evt.currentTarget.dataset.infoid
        })
      },
      showMyBasicInfo: function (evt){
        console.log(evt)
        wx.navigateTo({
          url: '/pages/myInfo/myInfo?infoId=' + evt.currentTarget.dataset.infoid
        })  
      },
      showmyAcinfo: function (evt){
        console.log(evt)
        wx.navigateTo({
          url: '/pages/mySalonList/mySalonList?infoId=' + evt.currentTarget.dataset.infoid
        })  
      },
      showmyProinfo: function (evt){
        console.log(evt)
        wx.navigateTo({
          url: '/pages/myProjectList/myProjectLIst?infoId=' + evt.currentTarget.dataset.infoid
        })  
      },
      showmyVip: function (e){
        console.log(e)
        wx.navigateTo({
          url: '/pages/myVip/myVip?infoId=' + e.currentTarget.dataset.infoid
        })  
      },
      showmyMessage: function (e){
        console.log(e)
        wx.navigateTo({
          url: '/pages/Message/Message?infoId=' + e.currentTarget.dataset.infoid
        })  
      },

      doIdCheck: function (evt){      
        
        
        wx.navigateTo({
          url: '/pages/myIdentifyCheck/myIdentifyCheck'
        })
  
      },
      
      phoneInput: function (event) {
        // console.log("password==", event.detail.value)
        this.setData({
          mobileAll: event.detail.value
        })
      },
      messInput: function (event) {
        // console.log("password==", event.detail.value)
        this.setData({
          messContent: event.detail.value
        })
      },


     
      // onLoad() {
      //   if (wx.getUserProfile) {
      //     this.setData({
      //       canIUseGetUserProfile: true
      //     })
      //   }
      // },
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
      }

})