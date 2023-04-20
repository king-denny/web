// pages/activeInfo/activeInfo.js

var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showActSign: true,
    showActCheckIn: true,
    actId:'',
    actUrl:'',
    actName:'',
    actContent:'',
    actStatus:'',
    actPos:'',
    actTime:'',
    actTTime:'',
    actNum:'',
    actChg:'',
    actSignNum:'',
    actCheckNum:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('infoid='+options.infoId)
    this.setData({
      actId: options.infoId
    })

    // if(getApp().globalData.userName=='' || getApp().globalData.userMobile=='' ||getApp().globalData.userCompany=='')
    // {
    //   wx.reLaunch({
    //     url: '/pages/myInfo/myInfo?infoId=2'
    //   })  
    // }

    // this.setData({
    //   showActSign: getApp().globalData.showActSign,
    //   showActCheckIn: getApp().globalData.showActCheckIn,
    // })

    this.getActInfo(options.infoId)   

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

            console.log( res.actTime)

            this.setData({              
              actUrl:res.actUrl,
              actName:res.actName,
              actContent:res.actContent,
              actStatus:res.actStatus,
              actPos:res.actPos,
              actTime: res.actTime,
              actTTime:res.actTTime,
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
  actSignUp: function (evt) {
    // console.log("123")

    // wx.reLaunch({
    //   url: '/pages/activeSignUp/activeSignUp?actid='+this.data.actId
    // })

    wx.navigateTo({
      url: '/pages/activeQuestionare/activeQuestionare?actid='+this.data.actId
    })

  }, 
  actCheckIn: function (evt) {
    wx.reLaunch({
      url: '/pages/activeCheckIn/activeCheckIn?actid='+this.data.actId
    })
   
  }, 
  showmyQuestion: function (evt) {
    wx.reLaunch({
      url: '/pages/activeQuestionare/activeQuestionare?actid='+this.data.actId
    })
   
  },
})