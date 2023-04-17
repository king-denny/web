// pages/project/project.js
var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()

// wx.navigateTo({
//   url: '/pages/outerweb/outweb?url=' + evt.currentTarget.dataset.noticeurl
// })

Page({

    /**
     * 页面的初始数据
     */
    data: {
      visitFrTime: '',
      visitTitle: '',
       navbarActiveIndex: 0,
       navbarTitle: ["全部","在办"],
         isProjectDataHave: true,
         projectList:[], // 项目列表
         isMyProjectDataHave: true,
         MyprojectList:[], // 我的项目列表
         clientHeight: '',
         isUserLogin:false,
         tabTxt: ['类型', '范围', '排序'],//分类
         tab: [true, true, true],
         typeList: [
          { 'id': '1', 'title': '创投' }, 
          { 'id': '2', 'title': '人力劳务' }, 
          { 'id': '3', 'title': '不动产投资' },         
          { 'id': '4', 'title': '其它' }
          ],
          billfdate: '',
          billtdate: '',
          queryFrNum:'',
          queryToNum:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      // if(getApp().globalData.userName=='' || getApp().globalData.userMobile=='' ||getApp().globalData.userCompany=='')
      // {
      //   wx.reLaunch({
      //     url: '/pages/myInfo/myInfo?infoId=2'
      //   })  
      // }

      var type_id = 0;
      var sort_id = 0;
      var sort_type_id = 0;
      var that = this

      var DATEF = util.formatDateLastY(new Date());
      var DATE = util.formatDate(new Date());
      this.setData({
        billfdate: DATEF,
        billtdate: DATE
      })

      this.loadAllProjectData(true)

      this.loadMyProjectData(true)

      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight
          });
        }
      })



    },
    loadAllProjectData: function(showLoading) {
      var that = this
      let mobilet = wx.getStorageSync('mobile');
      let openid= wx.getStorageSync('wxOpenId');
      http.post({
        url: 'WxApp/getProjectList',
        showLoading: showLoading,
        data:{       
          mobile:openid
        },
        success:(res)=>{
          console.log('act'+res.data)
          if(res.data.length == 0){
            console.log("没有项目信息")   
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
    loadMyProjectData: function(showLoading) {
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
              isMyProjectDataHave: false
            })      
          }
          if(res.data.length > 0){
            that.setData({
              MyprojectList: res.data
            })
          }
          //暂时不用
          // loadMoreView.loadMoreComplete(res)
        },
        fail: ()=> {
          that.setData({
            isMyProjectDataHave: false
          })
         
        }
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

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
    
bindFDateChange: function(e) {
  console.log('日期1发送选择改变，携带值为', e.detail.value)
  this.setData({
    tab: [true, true, true],  
    billfdate: e.detail.value
  })
  //this.getAccountList()
},
bindTDateChange: function(e) {
  console.log('日期2发送选择改变，携带值为', e.detail.value)
  this.setData({
    billtdate: e.detail.value
  })
  //this.getAccountList()
},

filterTab: function (e) {
  var data = [true, true, true], index = e.currentTarget.dataset.index;
  data[index] = !this.data.tab[index];
  this.setData({
    tab: data
  })
},

//筛选项点击操作
filter: function (e) {
  var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
  switch (e.currentTarget.dataset.index) {
    case '0':
      tabTxt[0] = txt;
      self.setData({
        tab: [true, true, true],
        tabTxt: tabTxt,
        type_id: id,
        type_txt: txt
      });
      break;
    case '1':
      tabTxt[1] = txt;
      self.setData({
        tab: [true, true, true],
        tabTxt: tabTxt,
        sort_id: id,
        sort_txt: txt
      });
      break;
    case '2':
      tabTxt[2] = txt;
      self.setData({
        tab: [true, true, true],
        tabTxt: tabTxt,
        sort_type_id: id,
        sort_type_txt: txt
      });
      break;
  }
   // 充值页码
   this.pagenum = 1;
   this.pagesize = 20;
  //数据筛选
  // self.getDataList();
},
projectOntapDetail:function(evt){

  console.log('目标url', evt.currentTarget.dataset.noticeurl)
  // wx.navigateTo({
  //   url: '/pages/outerWeb/outWeb?url=' + evt.currentTarget.dataset.noticeurl
  // })
  wx.navigateTo({
    url: '/pages/projectInfo/projectInfo?infoId='+ evt.currentTarget.dataset.proid
  })
},

pubProject:function(evt){
  util.progressTips('功能暂不开放')
},

})