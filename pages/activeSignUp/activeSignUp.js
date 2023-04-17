// pages/activeSignUp/activeSignUp.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signName:'',
    signMobile:'',
    signCompany:'',
    signNum:'1',
    messContent:'',
    actId:'',
    actUrl:'',
    actName:'',
    actContent:'',
    actStatus:'',
    actPos:'',
    actTime:'',
    actNum:'',
    actChg:'',
    actSignNum:'',
    actCheckNum:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      console.log('参数 id='+options.actid)
      
      this.setData({              
        signName:getApp().globalData.userName,
        signMobile:getApp().globalData.userMobile,
        signCompany:getApp().globalData.userCompany, 
        actId: options.actid
      })
      this.getActInfo(options.actid)   
  },
  getActInfo: function (infoId){
    let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
    http.post({
        url: 'WxApp/getBizActInfo',
        data: {              
            mobile: mobilet,
            wxid:getApp().globalData.openId,
            actid: infoId
        },
        success: (res) => {
          if (res.code == "1") {
          
            this.setData({              
              actUrl:res.actUrl,
              actName:res.actName,
              actContent:res.actContent,
              actStatus:res.actStatus,
              actPos:res.actPos,
              actTime:res.actTime,
              actNum:res.actNum,
              actChg:res.actChg,
              actSignNum:res.actSignNum,
              actCheckNum:res.actCheckNum     
            })

            this.setData({
              showActSign: !res.actHadSign,
              showActCheckIn: !res.actHadCheck,
            })

            // if(!res.actHadSign){
            //   this.setData({
            //     showActSign: true,
            //     showActCheckIn: false,
            //   })
            // }else{
            //   if(!res.actHadSign){

            //   }else{

            //   }
            // }

            
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
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  userNameInput: function (event) {
    this.setData({
      signName: event.detail.value
    })
  },
  mobileInput: function (event) {
    this.setData({
      signMobile: event.detail.value
    })
  },
  companyInput: function (event) {
    this.setData({
      signCompany: event.detail.value
    })
  },
  signNumInput: function (event) {
    this.setData({
      signNum: event.detail.value
    })
  },
  messInput: function (event) {
    this.setData({
      messContent: event.detail.value
    })
  },
  actSignUp: function () {
    let that = this;
    
    var userName = that.data.signName;
    var mobile = that.data.signMobile;
    var company=that.data.signCompany;

   

    // 判断账户、密码、验证码
    var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/;
    var userNameReg = /^[\u4E00-\u9FA5A-Za-z]+$/;
    

    //let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/

    if (userName == null) {
      util.progressTips('用户姓名不能为空！')
      return;
    }
    if (company == null) {
      util.progressTips('公司名称不能为空！')
      return;
    }

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
    
    console.log("actid="+this.data.actId)
    console.log("signName="+this.data.signName)
    console.log("signMobile="+this.data.signMobile)
    console.log("signCompany="+this.data.signCompany)
    console.log("signNum="+this.data.signNum)
    console.log("messContent="+this.data.messContent)
    console.log("opid="+wx.getStorageSync("wxOpenId"))

    http.post({
      url: 'WxApp/bizActSignUp',
      data: {
        actId: this.data.actId,
        userName: this.data.signName,
        mobile: this.data.signMobile,
        company:this.data.signCompany,
        signNum:this.data.signNum,
        memo: this.data.messContent,       
        authCode: '',                              
        wxOpenid: wx.getStorageSync("wxOpenId")
      },
      success: (res) => {
        if (res.code == "1") {

          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 3000,
            success: function () {
              wx.switchTab({
                url: '/pages/index/index',
              })   
            }
          })

        } else {
          console.log(res.msg)
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
})