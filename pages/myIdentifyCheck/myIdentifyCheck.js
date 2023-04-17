var loadMoreView, page
var util = require('../../utils/js/util.js');
const http = require("../../utils/js/http.js")
var interval = null //倒计时函数
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwoord: '',    
    authCode: '',
    time: '获取验证码', //倒计时 
    currentTime: 60, //限制60s
    isClick: false, //获取验证码按钮，默认允许点击
    username: '',
    idCard: '',
    mobile: '',
    idCheckStr: '',
    phoneCheckStr:'',
    isDone: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // let mobilet = wx.getStorageSync('mobile')
    // let userlet = wx.getStorageSync('userName'); 
    // this.setData({
    //   mobile: mobilet,
    //   username:userlet,
    //   idCard:''
    // })

    //this.getUserInfos();

  },

  getUserInfos: function (){
      
    let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
    http.post({
      url: 'WxApp/getBizUserInfo',
      data: {
        mobile: mobilet
      },
      success: (res) => {
        if (res.code == "1") {

          this.setData({
            username: res.name,
            idCard: res.idno,
            mobile: res.mobile            
          })
          
        } else {

        }
      },
      fail: (res) => {
        console.log(res)
      }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  

  authcodeInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      authCode: event.detail.value
    })
  },

  /**
   * 获取验证码
   */
  gainAuthCodeAction: function () {
    console.log(this.data.username);
    let that = this;
    /*第一步：验证手机号码*/
    var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/; // 判断手机号码的正则
    if (that.data.mobile.length == 0) {
      util.progressTips('手机号码不能为空')
      return;
    }

    if (that.data.mobile.length < 11) {
      util.progressTips('手机号码长度有误！')
      return;
    }

    if (!myreg.test(that.data.mobile)) {
      util.progressTips('错误的手机号码！')
      return;
    }
    /*第二步：设置计时器*/
    // 先禁止获取验证码按钮的点击
    that.setData({
      isClick: true,
    })
    // 60s倒计时 setInterval功能用于循环，常常用于播放动画，或者时间显示
    var currentTime = that.data.currentTime;
    interval = setInterval(function () {
      currentTime--; //减
      that.setData({
        time: currentTime + '秒后获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          isClick: false
        })
      }
    }, 1000);
    /*第三步：请求验证码接口，并记录服务器返回的验证码用于判断，这里服务器也可能不返回验证码，那验证码的判断交给后台*/
    http.post({
      url: 'WxApp/send',
      data: {
        mobile: this.data.mobile
      },
      success: (res) => {
        if (res.code == "1") {

        } else {
          //请求失败，立刻可以重新获取验证码
          clearInterval(interval)
          that.setData({
            time: '获取验证码',
            currentTime: 60,
            isClick: false
          })
        }
      },
      fail: (res) => {
        //请求失败，立刻可以重新获取验证码
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          isClick: false
        })
      }
    })

  },

  /**
   * 注册
   */
  loginBtnClick: function () {
    let that = this;

    var userNamel = that.data.username;
    var mobilel = that.data.mobile;
    var idCardl = that.data.idCard;
    var authCode = that.data.authCode;
    // 判断账户、密码、验证码
    var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/;
    var userNameReg = /^[\u4E00-\u9FA5A-Za-z]+$/;
    var idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    var taiwanIDreg = /^[A-Z][0-9]{9}$/;
    var xianggangIDreg = /^[A-Z][0-9]{6}\([0-9A]\)$/;
    var aomenIDreg = /^[157][0-9]{6}\([0-9]\)$/;
    if (userNamel == null) {
      util.progressTips('用户姓名不能为空！')
      return;
    }

    if (!userNameReg.test(userNamel)) {
      util.progressTips('用户姓名不合法！')
      return;
    }

    if (that.data.username[0].charCodeAt() <= 57 && that.data.username[0].charCodeAt() >= 48) {
      util.progressTips('用户姓名不能以数字开头！')
      return;
    }

    if (that.data.username.length > 10) {
      util.progressTips('用户姓名不能多于10个字符！')
      return;
    }

    if (!(idCardReg.test(idCardl) || taiwanIDreg.test(idCardl) || xianggangIDreg.test(idCardl) || aomenIDreg.test(idCardl))) {
      util.progressTips('身份证号不合法！')
      return;
    }

    if (mobilel.length == 0) {
      util.progressTips('手机号码不能为空！')
      return;
    }

    if (mobilel.length < 11) {
      util.progressTips('手机号码长度有误！')
      return;
    }

    if (!myreg.test(mobilel)) {
      util.progressTips('错误的手机号码！')
      return;
    }

    if (authCode.length == 0) {
      util.progressTips('验证码不能为空')
      return;
    }

    http.post({
      url: 'WxApp/bizUserIdCheck',
      data: {
        wxOpenId: wx.getStorageSync("wxOpenId"), 
        userName: userNamel,
        userIdNo: idCardl,
        phone: mobilel,
        authCode: this.data.authCode               
      },
      success: (res) => {
        if (res.code == "1") {
          wx.showToast({
            title: '验证完成',
            icon: 'success',
            duration: 3000,
            success: function () {
              // wx.switchTab({
              //   url: '/pages/index/index'
              // })
              
            }
          })

          this.setData({
            isDone: true,
            idCheckStr: res.idcheckStr,
            phoneCheckStr: res.phonecheckStr         
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

  }


  
})