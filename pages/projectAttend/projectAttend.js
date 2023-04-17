// pages/projectAttend/projectAttend.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    proId:'',
    proUrl:'',
    proName:'',
    proContent:'',
    proStatus:'',   
    proTime:'',
    userName:'',
    userCompany:'',
    userPhone:'',
    userMemo:'',
    userRoleSel:['','资金方','托管方','法律服务','第三方','其他'],
    roleIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('infoid='+options.infoid)

    this.setData({
      proId: options.infoid
    })
    
    this.getProjectInfo(options.infoid)   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  bindEduPickerChange: function(e) {    
    this.setData({
      roleIndex: e.detail.value
    })
  },
  getProjectInfo: function (infoId){
    let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
    http.post({
        url: 'WxApp/getBizProjectInfo',
        data: {              
            mobile: mobilet,
            wxid:getApp().globalData.openId,
            projectid: infoId
        },
        success: (res) => {
          if (res.code == "1") {
          
            this.setData({              
              proId:res.proId,
              proUrl:res.proUrl,
              proName:res.proName,
              proContent:res.proContent,
              proStatus:res.proStatus,    
              proTime:res.actTime,
              actSignNum:res.actSignNum,
              projectAttend:res.actHadSign    
            })

            this.setData({
              userName:getApp().globalData.userName,
              userCompany:getApp().globalData.userCompany,
              userPhone:getApp().globalData.userMobile,
            })
                     
          }
        },
        fail: (res) => {
          console.log(res)
        }
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
  
  projectJoin: function (evt) {
    let that=this

  if (that.data.userName.length ==0) {
    util.progressTips('联系人不得为空')
    return;
  }
  if (that.data.userPhone.length ==0) {
    util.progressTips('联系电话不得为空')
    return;
  }

  let pid=this.data.proId
  console.log('projectid='+pid)
  let mobilet = wx.getStorageSync('mobile');
  http.post({
    url: 'WxApp/saveProjectMember',
    data: {
      projectid: this.data.proId,
      signName: this.data.userName,
      phone: this.data.userPhone,
      company:this.data.userCompany,
      wxid:wx.getStorageSync("wxOpenId"),
      memo:this.data.commentSendText,      
    },
    success: (res) => {
      if (res.code == "1") {
        wx.showToast({
          title: '参加成功',
          icon: 'success',
          duration: 3000,
          success: function () {
            
            wx.reLaunch({
              url: '/pages/projectInfo/projectInfo?infoId='+pid
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
  userNameInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      userName: event.detail.value
    })
  },
  userPhoneInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      userPhone: event.detail.value
    })
  },
  userCompanyInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      userCompany: event.detail.value
    })
  },
  userMemoInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      userMemo: event.detail.value
    })
  },

})