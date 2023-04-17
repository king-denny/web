// pages/newsList/newsList.js

var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    proclamations:[], // 新闻信息
    isProclaDataHave:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadNews(true)
  },
  loadNews: function (showLoading) {
    var that = this
    // console.log('loadnews'+that.data.isUserLogin)

    http.post({
      url: 'WxApp/getNewsList',
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
  _handleProclaTitle:function(evt){
    console.log('12333')
    // console.log("my nav:"+ evt.currentTarget.dataset.noticeurl)
  
    // wx.navigateTo({
    //   url: '/pages/outerweb/outweb?url=' + evt.currentTarget.dataset.noticeurl
    // })
  
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
  showNewsInfo: function (evt){
    
    wx.navigateTo({
      url: '/pages/newsInfo/newsInfo?infoId=' + evt.currentTarget.dataset.infoid
    })  
  },
  
_handleProclaTitle:function(evt){

  wx.navigateTo({
    url: '/pages/outerweb/outweb?url=' + evt.currentTarget.dataset.noticeurl
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
})