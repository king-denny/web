// pages/companyInfo/companyInfo.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  showMyBasicInfo: function (evt){
    console.log(evt)
    wx.navigateTo({
      url: '/pages/companyInfo/companyInfo?infoId=' + evt.currentTarget.dataset.infoid
    })  
  },
  callCorp: function () {

    wx.makePhoneCall({
      phoneNumber: '13925184199'
    })
    // this.setData({
    //   maskFlagHiden: false
    // })

  },

})