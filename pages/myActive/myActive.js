// pages/myActive/myActive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '王世桑',
    mobile: '138*****970',
    navbarActiveIndex:0
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

  actOntapDetail: function () {
    // this.setData({
    //   showMore: !this.data.showMore
    // })
    wx.navigateTo({
      url: '/pages/activeInfo/activeInfo'
    })

  }, 
projectOntapDetail: function (evt){
  wx.navigateTo({
    url: '/pages/projectInfo/projectInfo'
  })
},
})