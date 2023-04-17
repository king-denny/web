// pages/myProjectList/myProjectLIst.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActiveIndex: 0,
    navbarTitle:['已完成','未完成'],
    companyName:'',
    userName:'',
    mobile:'',
    isProjectDataHave:true,
    projectList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      companyName: getApp().globalData.userCompany,
      userName:getApp().globalData.userName,
      mobile:getApp().globalData.userMobile,
    })
    
    this.loadActData(true)
  },
  loadActData: function(showLoading) {
    var that = this
    let mobilet = wx.getStorageSync('mobile');
    let openid= wx.getStorageSync('wxOpenId');
    http.post({
      url: 'WxApp/getMyProjectList',
      showLoading: showLoading,
      data:{       
        mobile:openid
      },
      success:(res)=>{
        console.log('act'+res.data)
        if(res.data.length == 0){
          console.log("没有活动信息")   
          that.setData({
            isProjectDataHave: false
          })      
        }
        if(res.data.length > 0){
          that.setData({
            projectList: res.data
          })
        }
        //暂时不用
        // loadMoreView.loadMoreComplete(res)
      },
      fail: ()=> {
        that.setData({
          isProjectDataHave: false
        })
       
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  projectOntapDetail: function (evt){

    wx.reLaunch({
      url: '/pages/projectInfo/projectInfo?infoId='+ evt.currentTarget.dataset.proid
    })
  
  },
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })      
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
  callMe: function () {

    util.progressTips('功能暂不开放')
  },
  
})