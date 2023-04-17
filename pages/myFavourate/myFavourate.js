// pages/myFavourate/myFavourate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    mobile: '',
    company:'',
    newsTypeList:[{"nid":"1","nname":"时事",checked: false},{"nid":"2","nname":"南沙区投资信息",checked: false},{"nid":"3","nname":"大湾区新闻",checked: false},{"nid":"4","nname":"科技新闻",checked: false}],
    projectTypeList:[{"pid":"1","pname":"跨境人才类项目",checked: false},{"pid":"2","pname":"创业投资型项目",checked: false},{"pid":"3","pname":"高新技术项目",checked: false},
    {"pid":"4","pname":"投入小项目",checked: false},{"pid":"5","pname":"工业互联网类型",checked: false}],
    actTypeList:[{"aid":"1","aname":"沙龙",checked: false},{"aid":"2","aname":"高尔夫",checked: false},{"aid":"3","aname":"鉴赏类活动",checked: false},{"aid":"4","aname":"户外活动",checked: false}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      
      userName: getApp().globalData.userName,
      company:getApp().globalData.userCompany,
      mobile: getApp().globalData.userMobile,
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
  updateBtnClick: function () {
      wx.switchTab({
        url: '/pages/my/my'
      })
  },
  newTypeSwitch: function (options) {
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    // 索引对应内容
    var item = that.data.newsTypeList[index];
    // 选中，未选中状态切换
    item.checked = !item.checked;
    // 更新
    that.setData({
      newsTypeList: that.data.newsTypeList
    });
  },
  actTypeSwitch: function (options) {
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    // 索引对应内容
    var item = that.data.actTypeList[index];
    // 选中，未选中状态切换
    item.checked = !item.checked;
    // 更新
    that.setData({
      actTypeList: that.data.actTypeList
    });
  },
  projectTypeSwitch: function (options) {
    let that = this;
    // 按钮索引
    var index = options.currentTarget.dataset.index;
    // 索引对应内容
    var item = that.data.projectTypeList[index];
    // 选中，未选中状态切换
    item.checked = !item.checked;
    // 更新
    that.setData({
      projectTypeList: that.data.projectTypeList
    });
  }

})