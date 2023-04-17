// pages/Message/Message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActiveIndex: 0,
    navbarTitle:['我的关注','我的评论','谁评论我','我的发帖'],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })      
  },
})