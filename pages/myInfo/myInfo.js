// pages/myInfo/myInfo.js
var loadMoreView, page
var util = require('../../utils/js/util.js');
const http = require("../../utils/js/http.js")
var interval = null //倒计时函数
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showPeople: false,
    time: '获取验证码', //倒计时 
    currentTime: 60, //限制60s
    isClick: false, //获取验证码按钮，默认允许点击
    username: '',
    company: '',
    companyTitle: '',
    idCard: '',
    mobile: '',
    address: '',
    email: '',
    authCode: '',
    eduList: ['', '博士', '硕士', '本科', '大专', '中专', '高中'],
    eduIndex: 0,
    eduValue:'',
    occList: ['', '企事业单位负责人', '专业技术人员', '办事人员和有关人员', '社会生产服务和生活服务人员', '中农、林、牧、渔业生产及辅助人员', '其他从业人员'],
    occIndex: 0,
    salerIndex: 0,
    salerValue:'',
    salerHad: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getFundList()
    if (options.infoId) {
      // console.log("infoId" + options.infoId)
      wx.setNavigationBarTitle({
        title: '完善个人信息'
      })
    }

    this.getUserInfos();
  },

  getUserInfos: function () {

    let mobilet = wx.getStorageSync('mobile');
     //app.globalData.userMobile;
    console.log('mobile:' + mobilet)

    http.post({
      url: 'WxApp/getBizUserInfo',
      data: {
        mobile: mobilet
      },
      success: (res) => {
        if (res.code == "1") {
          this.setData({
            username: res.name,
            idCard: res.idno,
            mobile: res.mobile,
            company: res.company,
            companyTitle: res.companyTitle,
            address: res.address,
            email: res.email,
            eduIndex: this.getEduIndex(res.eduLevel),
            occIndex: this.getOccIndex(res.occupation),
            salerIndex: 0
          })

        } else {

        }
      },
      fail: (res) => {
      console.log(res)
      }
    })

  },
  clickfield() {
    this.setData({
      show: true,
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  oncancel() {
    this.setData({ show: false });
  },
  onConfirm(e) {

    this.setData({ show: false,
      eduValue:e.detail.value,
      eduIndex: e.detail.index
    });
  },

  clickPeople() {
    this.setData({
      showPeople: true,
    })
  },
  onClosePeople() {
    this.setData({ showPeople: false });
  },
  oncancelPeople() {
    this.setData({ showPeople: false });
  },
  onConfirmPeople(e) {

    this.setData({ 
      showPeople: false ,
      salerValue:e.detail.value,
      salerIndex: e.detail.index
    });
  },
  
  gainAuthCodeAction: function () {
   
    let that = this;
    /*第一步：验证手机号码*/
    var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/; // 判断手机号码的正则
    if (that.data.mobile.length == 0) {
      util.progressTips('手机号码不能为空')
      return;
    }

    if (that.data.mobile.length < 11) {
      util.progressTips('手机号码长度有误！')
      return;
    }

    if (!myreg.test(that.data.mobile)) {
      util.progressTips('错误的手机号码！')
      return;
    }
    /*第二步：设置计时器*/
    // 先禁止获取验证码按钮的点击
    that.setData({
      isClick: true,
    })
    // 60s倒计时 setInterval功能用于循环，常常用于播放动画，或者时间显示
    var currentTime = that.data.currentTime;
    interval = setInterval(function () {
      currentTime--; //减
      that.setData({
        time: currentTime + '秒后获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          isClick: false
        })
      }
    }, 1000);
    /*第三步：请求验证码接口，并记录服务器返回的验证码用于判断，这里服务器也可能不返回验证码，那验证码的判断交给后台*/
    http.post({
      url: 'WxApp/send',
      data: {
        mobile: this.data.mobile
      },
      success: (res) => {
        if (res.code == "1") {

        } else {
          //请求失败，立刻可以重新获取验证码
          clearInterval(interval)
          that.setData({
            time: '获取验证码',
            currentTime: 60,
            isClick: false
          })
        }
      },
      fail: (res) => {
        //请求失败，立刻可以重新获取验证码
        clearInterval(interval)
        that.setData({
          time: '获取验证码',
          currentTime: 60,
          isClick: false
        })
      }
    })

  },

  updateBtnClick: function () {
    console.log(this.data.username,this.data.company,this.data.idCard,this.data.companyTitle,this.data.mobile,this.data.address,this.data.email,this.data.eduIndex,this.data.salerIndex,this.data.authcodeInput,);
    let that = this;
    var userName = that.data.username;
    var mobile = that.data.mobile;
    var idCard = that.data.idCard;
    //var authCode = that.data.authCode;
    // 判断账户、密码、验证码
    var myreg = /^1(3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{8}$/;
    var userNameReg = /^[\u4E00-\u9FA5A-Za-z]+$/;
    var idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    var taiwanIDreg = /^[A-Z][0-9]{9}$/;
    var xianggangIDreg = /^[A-Z][0-9]{6}\([0-9A]\)$/;
    var aomenIDreg = /^[157][0-9]{6}\([0-9]\)$/;
    var mailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    //let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/\
    if (userName == '') {
      util.progressTips('用户姓名不能为空！')
      return;
    }
    if (this.data.company == '') {
      util.progressTips('公司不能为空！')
      return;
    }
    if (this.data.authcodeInput == '') {
      util.progressTips('验证码不能为空！')
      return;
    }

    if (that.data.username.length > 10) {
      util.progressTips('用户姓名不能多于10个字符！')
      return;
    }
    if (mobile.length == 0) {
      util.progressTips('手机号码不能为空！')
      return;
    }

    if (mobile.length < 11) {
      util.progressTips('手机号码长度有误！')
      return;
    }

    if (!myreg.test(mobile)) {
      util.progressTips('错误的手机号码！')
      return;
    }

    if (that.data.email.length > 0) {
      if (!mailReg.test(that.data.email)) {
        util.progressTips('邮箱格式不合法！')
        return;
      }
    }
 
    // http.post({
    //   url: 'WxApp/updateUserInfo',
    //   data: {
    //     userName: userName,
    //     identityCard: idCard,
    //     mobile: mobile,
    //     company: this.data.company,
    //     companyTitle: this.data.companyTitle,
    //     address: this.data.address,
    //     email: this.data.email,
    //     authCode: '',
    //     edu: this.data.eduList[this.data.eduIndex],
    //     occ: '',
    //     inc: '',
    //     inv: '',
    //     risk: '',
    //     str: '',
    //     fund: '',
    //     saler: '',
    //     wxOpenid: wx.getStorageSync("wxOpenId")
    //   },
    //   success: (res) => {
    //     if (res.code == "1") {
    //       wx.showToast({
    //         title: '修改成功',
    //         icon: 'success',
    //         duration: 3000,
    //         success: function () {
    //           // wx.switchTab({
    //           //   url: '/pages/my/my'
    //           // })
    //           //写在登录成功里面：数据缓存(同步)：用户姓名，身份证号，手机号
    //           wx.setStorageSync("userName", userName);
    //           wx.setStorageSync("idCard", idCard);
    //           wx.setStorageSync("mobile", mobile);
    //           wx.setStorageSync("company", that.data.company);


    //           getApp().globalData.userMobile = mobile
    //           getApp().globalData.userName = userName
    //           getApp().globalData.userCompany = that.data.company

    //         }
    //       })

    //     } else {
    //       wx.showToast({
    //         title: res.msg,
    //         icon: 'none',
    //         duration: 3000,
    //       })
    //     }
    //   },
    //   fail: (res) => {
    //     console.log(res)
    //   }
    // })

  },
  /**
   * 用户名和密码 
   * */
  // userNameInput: function (event) {
  //   this.setData({
  //     username: event.detail.value
  //   })
  // },
  // phoneInput: function (event) {
  //   this.setData({
  //     mobile: event.detail.value
  //   })
  // },
  // companyInput: function (event) {
  //   this.setData({
  //     company: event.detail.value
  //   })
  // },
  // companyTitleInput: function (event) {
  //   this.setData({
  //     companyTitle: event.detail.value
  //   })
  // },

  // idCardInput: function (event) {
  //   this.setData({
  //     idCard: event.detail.value
  //   })
  // },

  // mobileInput: function (event) {
  //   this.setData({
  //     mobile: event.detail.value
  //   })
  // },
  // showPopup() {
  //   this.setData({
  //     show: true
  //   });
  // },

  // authcodeInput: function (event) {
  //   // console.log("password==", event.detail.value)
  //   this.setData({
  //     authCode: event.detail.value
  //   })
  // },
  // addressInput: function (event) {
  //   // console.log("password==", event.detail.value)
  //   this.setData({
  //     address: event.detail.value
  //   })
  // },
  // emailInput: function (event) {
  //   // console.log("password==", event.detail.value)
  //   this.setData({
  //     email: event.detail.value
  //   })
  // },
  // bindEduPickerChange: function (e) {
  //   console.log(e.detail.value);
  //   this.setData({
  //     eduIndex: e.detail.value
  //   })
  // },
  // bindOccPickerChange: function (e) {
  //   this.setData({
  //     occIndex: e.detail.value
  //   })
  // },
  // bindIncPickerChange: function (e) {
  //   this.setData({
  //     incIndex: e.detail.value
  //   })
  // },
  // bindInvPickerChange: function (e) {
  //   this.setData({
  //     invIndex: e.detail.value
  //   })
  // },
  // bindRiskPickerChange: function (e) {
  //   this.setData({
  //     riskIndex: e.detail.value
  //   })
  // },
  // bindStrPickerChange: function (e) {
  //   this.setData({
  //     strIndex: e.detail.value
  //   })
  // },
  // bindFundPickerChange: function (e) {
  //   this.setData({
  //     fundIndex: e.detail.value
  //   })
  // },
  // bindSalerPickerChange: function (e) {
  //   this.setData({
  //     salerIndex: e.detail.value
  //   })
  // },

  getEduIndex: function (eduname) {
    var ii = 0
    for (var i = 0; i < this.data.eduList.length; ++i) {
      if (this.data.eduList[i] == eduname) {
        ii = i;
        break;
      }
    }
    // this.setData({
    //   eduIndex: ii
    // })
    return ii;
  },
  getOccIndex: function (iname) {
    var ii = 0
    for (var i = 0; i < this.data.occList.length; ++i) {
      if (this.data.occList[i] == iname) {
        ii = i;
        break;
      }
    }
    // this.setData({
    //   occIndex: ii
    // })
    return ii;
  },
  // getIncIndex: function (iname) {
  //   var ii = 0
  //   for (var i = 0; i < this.data.incList.length; ++i) {
  //     if (this.data.incList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }
  //   // this.setData({
  //   //   incIndex: ii
  //   // })
  //   return ii;
  // },
  // getInvIndex: function (iname) {
  //   var ii = 0
  //   for (var i = 0; i < this.data.invList.length; ++i) {
  //     if (this.data.invList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }
  //   // this.setData({
  //   //   invIndex: ii
  //   // })
  //   return ii;
  // },
  // getRiskIndex: function (iname) {
  //   var ii = 0
  //   for (var i = 0; i < this.data.riskList.length; ++i) {
  //     if (this.data.riskList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }
  //   // this.setData({
  //   //   riskIndex: ii
  //   // })
  //   return ii;
  // },
  // getStrIndex: function (iname) {
  //   var ii = 0
  //   for (var i = 0; i < this.data.strList.length; ++i) {
  //     if (this.data.strList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }
  //   // this.setData({
  //   //   strIndex: ii
  //   // })
  //   return ii;
  // },
  // getFundIndex: function (iname) {

  //   // console.log("fundname:" + iname + " " + this.data.fundList.length)
  //   var ii = 0

  //   // setTimeout(function () {

  //   for (var i = 0; i < this.data.fundList.length; ++i) {
  //     if (this.data.fundList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }


  //   // }, 600);


  //   // this.setData({
  //   //   fundIndex: ii
  //   // })
  //   return ii;
  // },
  // getSalerIndex: function (iname) {
  //   console.log("salername:" + iname)
  //   var ii = 0
  //   for (var i = 0; i < this.data.salerList.length; ++i) {
  //     if (this.data.salerList[i] == iname) {
  //       ii = i;
  //       break;
  //     }
  //   }
  //   // this.setData({
  //   //   salerIndex: ii
  //   // })

  //   if (ii > 0) {
  //     this.setData({
  //       salerHad: true
  //     })
  //   }
  //   return ii;
  // },
})