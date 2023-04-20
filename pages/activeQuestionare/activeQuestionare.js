var util = require('../../utils/js/util.js');
const http = require("../../utils/js/http.js")
var interval = null //倒计时函数
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actId:'',   
    username: '',
    idCard: '',
    mobile: '',
    idCheckStr: '',
    phoneCheckStr:'',
    questionNum:0,  
    questionContent:'',
    haveOpt:false,
    question:[{
      questionType:'1',
      questionDefaultVal:'你的公司名称'
    },
    {
      questionType:'1',
      questionDefaultVal:'你的年龄'
    },{
      questionType:'2',
      questionDefaultVal:'你的性别',
      questionSelList:[{type:'男',value:1},{type:'女',value:2}]

    },
    {
      questionType:'3',
      questionDefaultVal:'你的公司规模',
      questionSelList:['小','大','中']
    },
    {
      questionType:'1',
      questionDefaultVal:'你的职位'
    }
  ],
    questionType:'',    //问题类型
    questionDefaultVal:'',  //问题默认内容 company
    questionAnswerStr:'',
    questionSelList:[], //问题选项
    questionAnswer:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //问卷记录,针对单选题
    questionBlankAnswer:['','','','','','','','','','','','','','','','','',''], //问卷记录,针对单选题
    showPreBtn:false,
    nextBtnText:'开始',
    radioCheckVal:0,
    checkFinish:false,
    checkSumScore:0,
    checkResult:'',
    totalQNum:11,
    answerResultList:[]
  },
  answerInput: function (event) {
    // console.log("password==", event.detail.value)
    this.setData({
      questionAnswerStr: event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.getUserInfos()
    this.setData({
      actId: options.actid
    })

    //如果存在答案，要载入
    this.getActAnswer()

    this.getQuestionNare();
    

  },
  getActAnswer: function (){
      
    let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
    let wxid = wx.getStorageSync('wxOpenId'); //app.globalData.userMobile;

    
    console.log("actid="+this.data.actId+" openid="+wxid)
    http.post({
      url: 'WxApp/getActAnswerList',
      data: {
        actid: this.data.actId,
        wxopenid: wxid
      },
      success: (res) => {
        console.log(res)

       

          if(res.data.length > 0){
            for(let i=0; i<res.data.length; i++){
               console.log('scoreval='+res.data[i].scoreVal)
                this.data.questionAnswer[i+1]=res.data[i].scoreVal
                this.data.questionBlankAnswer[i+1]=res.data[i].result
                console.log('value'+this.data.questionAnswer[i+1])
                console.log('value blank'+this.data.questionBlankAnswer[i+1])
            }

            this.setData({
              answerResultList: res.data,                
            })

          }
          
         
          
         
      },
      fail: (res) => {
        console.log(res)
      }
    })

  },

  getUserInfos: function (){
      
    let mobilet = wx.getStorageSync('mobile'); //app.globalData.userMobile;
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
            mobile: res.mobile            
          })
          
        } else {

        }
      },
      fail: (res) => {
        console.log(res)
      }
    })

  },
  getQuestionNare: function (){

    this.data.questionNum=this.data.questionNum+1
    let qno=this.data.questionNum;
        
    http.post({
      url: 'WxApp/getQuestion',
      data: {
        qno: qno
      },
      success: (res) => {

        console.log("问题类型"+res.ques.questionType)

        if (res.code == "1") {      
          this.setData({            
             haveOpt: res.hadOpt,
             questionSelList: res.quesopt,
             questionContent: res.ques.content,
             questionType:res.ques.questionType,    //问题类型
             questionDefaultVal:res.ques.defaultValue,  //问题默认内容    
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

  radioChange(e){
    this.data.radioCheckVal=e.detail.value
    //console.log("选择值"+e.detail.value)


    // const items = this.data.questionSelList
    // for (let i = 0, len = items.length; i < len; ++i) {
    //   if(items[i].isSel){
    //     console.log("选择第"+i+" 个 值"+items[i].scoreVal)
    //     this.data.radioCheckVal=items[i].scoreVal
    //   }
    //   // items[i].checked = items[i].value === e.detail.value

    // }

     //radioCheckVal

  },
  nextQ: function () {

    if(this.data.questionNum==this.data.totalQNum){
      this.uploadQuestionaire()

      wx.switchTab({
        url: '/pages/index/index'
      })  

      return
    }

    //计算分数，显示客户等级
    if(this.data.questionNum==14){

      let alist=this.data.questionAnswer
      // var qsum=Number(alist[3])+Number(alist[4])+Number(alist[5])+Number(alist[6])+Number(alist[7])+Number(alist[8])+Number(alist[9])+Number(alist[10])+Number(alist[11])+Number(alist[12])+Number(alist[13])+Number(alist[14])
      // let resultstr=''

      //console.log("分数合计:"+qsum)
      
      this.setData({            
        checkFinish: true,
        // checkSumScore: qsum,
        // checkResult: resultstr,                      
     }) 
    }

    //判断是否选择选项
    if(this.data.radioCheckVal==0 && this.data.haveOpt ){
      util.progressTips('选项不能为空')
      return;
    }else{

    }

    this.data.questionAnswer[this.data.questionNum]=this.data.radioCheckVal
    this.data.questionBlankAnswer[this.data.questionNum]=this.data.questionAnswerStr

    if((this.data.questionNum==6 ||this.data.questionNum==8) && this.data.radioCheckVal==2){
      this.data.questionNum=this.data.questionNum+2
    }else
    { 
      this.data.questionNum=this.data.questionNum+1
    }
    // this.setData({ 
    //   questionNum:this.data.questionNum+1
    // })

    let qno=this.data.questionNum;        
    http.post({
      url: 'WxApp/getQuestion',
      data: {
        qno: qno
      },
      success: (res) => {
        if (res.code == "1") {      

          this.data.radioCheckVal=this.data.questionAnswer[this.data.questionNum]

          this.setData({            
            haveOpt: res.hadOpt,
            questionSelList: res.quesopt,
            questionContent: res.ques.content,
            questionType:res.ques.questionType,    //问题类型
            questionDefaultVal:res.ques.defaultValue,  //问题默认内容                      
         }) 

         if(res.ques.defaultValue=='company'){
           this.setData({   
             questionAnswerStr:getApp().globalData.userCompany
           })
         }else{
           this.setData({   
             questionAnswerStr:''
           })
         }

          //如果之前有过选择，并且有选项
          var selval=this.data.questionAnswer[this.data.questionNum]
          console.log('before valu='+selval)
          var selstr=this.data.questionBlankAnswer[this.data.questionNum]
          if(res.hadOpt){
            console.log('选择题')
             if(selval>0){
                for (let i = 0, len = res.quesopt.length; i < len; ++i) {
                    if(res.quesopt[i].scoreVal==selval){                     
                      res.quesopt[i].isSel=true
                      break
                    }
                }
             } 
          }else{
            if(selstr!=''){
              this.setData({  
                questionAnswerStr:selstr
              })
            }
          }

          this.setData({                       
            questionSelList: res.quesopt                            
         }) 
          
        } 

      },
      fail: (res) => {
        console.log(res)
      }
    })

    // console.log("123"+this.data.questionNum)

    if(this.data.questionNum>1)
    {
      if(this.data.questionNum==this.data.totalQNum){
        this.setData({            
          showPreBtn: true,
          nextBtnText: '完成' //签名                   
      })      
      }else{
          this.setData({            
            showPreBtn: true,
            nextBtnText: '下一步'                   
        })      
    }
    }else{
      this.setData({            
        showPreBtn: false,       
        nextBtnText: '开始'            
     })   
    }

  },
  preQ: function () {

    if(this.data.questionNum==1){
      return
    }
    
    this.data.questionNum=this.data.questionNum-1
    // this.setData({            
    //   questionNum: this.data.questionNum-1                      
    // }) 

    let qno=this.data.questionNum;        
    http.post({
      url: 'WxApp/getQuestion',
      data: {
        qno: qno
      },
      success: (res) => {
        if (res.code == "1") {      
          this.data.radioCheckVal=this.data.questionAnswer[this.data.questionNum]

          //如果之前有过选择，并且有选项
          var selval=this.data.questionAnswer[this.data.questionNum]
          var selstr=this.data.questionBlankAnswer[this.data.questionNum]
          if(res.hadOpt){
             if(selval>0){
                for (let i = 0, len = res.quesopt.length; i < len; ++i) {
                    if(res.quesopt[i].scoreVal==selval){
                      res.quesopt[i].isSel=true
                      break
                    }
                }
             } 
          }else{
            // if(res.ques.questionType==3){

            // }
            if(selstr!=''){
              this.setData({  
                questionAnswerStr:selstr
              })
            }else{
              this.setData({  
                questionAnswerStr:''
              })
            }

          }

          this.setData({            
             haveOpt: res.hadOpt,
             questionSelList: res.quesopt,
             questionContent: res.ques.content,
             questionType:res.ques.questionType,    //问题类型
             questionDefaultVal:res.ques.defaultValue,  //问题默认内容   
          }) 

        } 

      },
      fail: (res) => {
        console.log(res)
      }
    })


    if(this.data.questionNum>1)
    {
      this.setData({            
        showPreBtn: true,
        nextBtnText: '下一步',
        checkFinish:false,
        checkSumScore:0,
        checkResult:''                   
     })           
    }else{
      this.setData({            
        showPreBtn: false,       
        nextBtnText: '开始',
        checkFinish:false,
        checkSumScore:0,
        checkResult:''            
     })   
    }


  },
  //上传答卷信息
  uploadQuestionaire: function () {
    let mobilel=this.data.mobile
    let usernamel=this.data.username
    let anlist=this.data.questionAnswer
    let balist=this.data.questionBlankAnswer
    let checkresult=this.data.checkResult
    var asum=this.data.checkSumScore
    let actid=this.data.actId
    let openid= wx.getStorageSync('wxOpenId');
    http.post({
      url: 'WxApp/uploadQuestionnaire',
      data: {
        actId:actid,
        wxOpenId:openid,
        mobile:mobilel,
        username: usernamel,
        alist: anlist,
        blist:balist,
        checkstr:checkresult,
        checksum:asum
      },
      success: (res) => {
        if (res.code == "1") {                
        
        } 
      },
      fail: (res) => {
        console.log("上传出错"+res)
      }
    })

  }



  
})