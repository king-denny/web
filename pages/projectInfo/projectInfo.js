// pages/projectInfo/projectInfo.js

var loadMoreView, page
const http = require("../../utils/js/http.js")
const util = require("../../utils/js/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectAttend:false,  //是否参加
    hadComment:true,
    commentNum:0,
    navbarActiveIndex:0,
    buttonLeft: 0,
    progress: 0,
    precent:'召集',
    // showProSign: true,    
    proId:'',
    proUrl:'',
    proName:'',
    proContent:'',
    proStatus:'',    
    actTime:'',
    actNum:'',   
    proSignNum:'',
    commentList:[],
    commentPriList:[],
    commentSendText:'',
    memberList:[],
    pit:''


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    console.log(   wx.getStorageSync('pit'));
 
    console.log('infoid='+options.infoId)
    this.setData({
      pit:wx.getStorageSync('pit'),
      proId: options.infoId
    })
    this.getProjectInfo(options.infoId)   
    // this.setData({
    //   projectAttend: getApp().globalData.projectAttend
    // })
    this.getProjectCommentInfo(options.infoId,0)   
    
    this.getProjectCommentInfo(options.infoId,1)
    
    this.getProjectMemberInfo(options.infoId)

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
            console.log('hadsign='+res.actHadSign  )
            this.setData({              
              proId:res.proId,
              proUrl:res.proUrl,
              proName:res.proName,
              proContent:res.proContent,
              proStatus:res.proStatus,    
              actSignNum:res.actSignNum,
              projectAttend:res.actHadSign    
            })

            // this.setData({
            //   showActSign: !res.actHadSign,
            //   showActCheckIn: !res.actHadCheck,
            // })
                     
          }
        },
        fail: (res) => {
          console.log(res)
        }
    })

},
getProjectMemberInfo: function (infoId){
  let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
  http.post({
      url: 'WxApp/getProjectMemberList',
      data: {                        
        projectid: infoId
      },
      success: (res) => {
        this.setData({              
          memberList:res.data,           
        })
       
      },
      fail: (res) => {
        console.log(res)
      }
  })

},

getProjectCommentInfo: function (infoId,qtype){
  let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;

  console.log("getProjectCommentInfo")
  console.log("infoId"+infoId)

  http.post({
      url: 'WxApp/getProjectComment',
      data: {                        
          projectid: infoId,
          qtype: qtype
      },
      success: (res) => {
          
        if(qtype==1){
          this.setData({              
            commentPriList:res.data,           
          })
        }else{
          this.setData({              
            commentList:res.data,      
            commentNum:res.data.length     
          })
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

  iJoin: function (evt) {

    wx.navigateTo({
      url: '/pages/projectAttend/projectAttend?infoid='+this.data.proId
    })
 },
 
 onBindAnimationFinish: function ({detail}) {
  // 设置data属性中的navbarActiveIndex为当前点击的navbar
  if(this.data.projectAttend){
    this.setData({
      navbarActiveIndex: detail.current
    })
  }

},
showMyGroupInfo: function (evt){
  this.setData({
    navbarActiveIndex: 1
  })
},
showCommentInfo: function (evt){
  this.setData({
    navbarActiveIndex: 0
  })
},
commentInput: function (event) {
  // console.log("password==", event.detail.value)
  this.setData({
    commentSendText: event.detail.value
  })
},
sendComment: function (evt){
  let that=this

  if (that.data.commentSendText.length ==0) {
    util.progressTips('评论内容不得为空')
    return;
  }

  let mobilet = wx.getStorageSync('mobile');
  http.post({
    url: 'WxApp/saveCommentInfo',
    data: {
      projectid: this.data.proId,
      qtype: this.data.navbarActiveIndex,
      mobile: mobilet,
      wxid:wx.getStorageSync("wxOpenId"),
      commentInfo:this.data.commentSendText,      
    },
    success: (res) => {
      if (res.code == "1") {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 3000,
          success: function () {
            
            // wx.switchTab({
            //   url: '/pages/my/my'
            // })
            

            that.getProjectCommentInfo(that.data.proId,that.data.navbarActiveIndex)  
            

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

  this.setData({
    commentSendText: ''
  })

  // console.log("what="+this.data.proId)
  

},
})