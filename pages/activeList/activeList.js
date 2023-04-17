// pages/activeList/activeList.js
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
    navbarTitle: ["全部","已参加"],
    isActDataHave: true,    //有活动信息
    productList:[],// 活动数据
    isMyActDataHave: true,    //有活动信息
    myproductList:[],// 活动数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.loadActData(true)
    this.loadMyActData(true)
  },
loadActData: function(showLoading) {
    var that = this
    let openid= wx.getStorageSync('wxOpenId');
    http.post({
      url: 'WxApp/getActList',
      showLoading: showLoading,
      data:{       
        pageSize: 10,
        wxOpenid: openid
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

  loadMyActData: function(showLoading) {
    var that = this
    let mobilet = wx.getStorageSync('mobile');
    let openid= wx.getStorageSync('wxOpenId');
    http.post({
      url: 'WxApp/getMyActList',
      showLoading: showLoading,
      data:{       
        mobile: openid
      },
      success:(res)=>{
        console.log('act'+res.data)

        if(res.data.length == 0){
          console.log("没有活动信息")   
          that.setData({
            isMyActDataHave: false
          })      
        }
        if(res.data.length > 0){
          that.setData({
            myproductList: res.data
          })
        }
        //暂时不用
        // loadMoreView.loadMoreComplete(res)
      },
      fail: ()=> {
        that.setData({
          isMyActDataHave: false
        })
        
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
  actOntapDetail: function (evt){
    console.log('act canshu='+evt.currentTarget.dataset.actid)
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

  onNavBarTap: function (event) {
    // 获取点击的navbar的index
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