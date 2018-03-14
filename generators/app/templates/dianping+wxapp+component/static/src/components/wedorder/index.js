const API = {
    //页面初始化
    IntUrl:`/wed/ajax/shopweb/common_bookinguser`,
    //验证码url
    codeUrl:`/wed/ajax/shopweb/common_bookingsms`,
    //预约url
    bookingUrl:`/wed/ajax/shopweb/unibookinguser`
}
Component({
    properties: {
     config: {
      type: Object,
      value: {}
      },
      //<OBSERVER>  占坑请勿删除
      shopOptions: {
          type: Object,
          value: {},
          observer: '_shopOptionsChange'
          //</OBSERVER>  占坑请勿删除
        },
        requestDomain: {
            //  登陆域名，默认显示，可以配置beta
            type: String,
            value: 'https://m.dianping.com'
        },
    },

    //<DATA>  占坑请勿删除
    data:{
      showModalStatus:false,
      tel:"",
      showCodeModalStatus:false,
      showTimeout:false,
      code:"",
      showCode:"",
      timer:null,
      time:60,
      btnText:"",
      shopTel:"",
      title:'',
      btnText:'',
      infoList:[]
  },
  //</DATA>占坑请勿删除
  created(){
  },
  ready(){
    this.pageInt();
    // console.log(this.data);
  },
  methods:{
      pageInt(){
        if (!this.data.shopOptions.shopId){
            return wx.showModal({
                title:"提示",
                showCancel:false,
                content:"组件必须要穿shopId哦~"
            })
          } 
          wx.request({
              url:this.data.requestDomain + API.IntUrl,
              data:{
                  shopId:this.data.shopOptions.shopId
              },
              success:(res)=>{
                  let result = res.data;
                  if(result.code == 200){
                        if (!!result.msg.userPhone){
                            this.setData({
                                tel: result.msg.userPhone
                            })
                        }
                        if (!!result.msg.toShopPresent){
                            let toShop = {};
                            toShop.tag = "到店礼";
                            toShop.intro = result.msg.toShopPresent;
                            this.setData({
                                'infoList[0]':toShop
                            })
                        }
                        if (!!result.msg.orderPresent){
                            let orDer = {};
                            orDer.tag = "订单礼";
                            orDer.intro = result.msg.orderPresent;
                            this.setData({
                                'infoList[1]':orDer
                            })
                        }
                        this.setData({
                            title:result.msg.bookingTitle || '大众点评特别礼遇',
                            btnText:result.msg.bookingButtonText || '预约到店'
                        })

                  }else{
                      wx.showModal({
                          title:"提示",
                          showCancel:false,
                          content:result.msg  || "系统繁忙,请稍后再试"
                      })
                  }
              }
          });
      },
      bindCodeOp(e){
          this.setData({
              code:e.detail.value
          });
      },
      bindTelOp(e){
          this.setData({
              tel:e.detail.value
          });
      },
      timeoutOp(){
          this.setData({
              showTimeout:true,
              time:60
          });
          let timer = setInterval(()=>{
              let data = this.data;
              let nowTime = data.time-1;
              if(nowTime <=0){
                  this.setData({
                      showTimeout:false
                  });
                  clearInterval(timer);
              }else{
                this.setData({
                    time:nowTime
                });
              }
          },1000);

          this.setData({
              timer:timer
          })

      },
      callPhone(){
          let data = this.data;
          wx.makePhoneCall({
              phoneNumber:data.config.shopTel
          })
      },
      closeCodeModal(){
          this.setData({
              showCodeModalStatus:false,
              code:""
          });
      },
      openCodeModal(){
          this.setData({
            showCodeModalStatus:true
          });
      },
      getCodeOp(){
          let data = this.data;
          let self = this;
          
          wx.request({
              url:this.data.requestDomain + API.codeUrl,
              data:{
                  mobileNo:data.tel
              },
              success:(res)=>{
                  let result = res.data;
                  if(result.code == 200){
                      self.timeoutOp();
                  }else{
                      wx.showModal({
                          title:"提示",
                          showCancel:false,
                          content:result.msg  || "系统繁忙,请稍后再试"
                      })
                  }
              }
          });
      },
      submitOp(){
          let data = this.data;
          let self = this;
          if(/^1\d{10}/.test(data.tel)){
            wx.request({
              url:this.data.requestDomain + API.bookingUrl,
              method:"POST",
              header:{
                  "Content-Type":"application/x-www-form-urlencoded"
              },
              data:{
                    userPhone:data.tel,
                    shopId:data.shopOptions.shopId || data.config.shopId,
                    verifyCode:data.code,
                    authId:data.shopOptions.authId || 1000,
                },
                success:(res)=>{
                    let code = res.data.code;
                    if(code == 200){
                        self.closeCodeModal();
                        self.hideModal();
                        let msg = res.data.msg.string;
                        wx.showModal({
                            title:"提示",
                            showCancel:false,
                            content: msg
                        });
                      }else if(code == 201){
                          self.openCodeModal();
                      }else{
                        let msg = res.data.msg.string;
                          wx.showModal({
                              title:"提示",
                              showCancel:false,
                              content: msg
                          });
                      }
                }
            });
          }else{
             wx.showModal({
                title:"提示",
                content:"请输入正确的手机号码",
                showCancel:false
             })
          }
      },
      showModal: function () {
        // 显示遮罩层
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: true
        })
        setTimeout(function () {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export()
          })
        }.bind(this), 200)
      },
      hideModal: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
          animationData: animation.export(),
        })
        setTimeout(function () {
          animation.translateY(0).step()
          this.setData({
            animationData: animation.export(),
            showModalStatus: false
          })
        }.bind(this), 200)
      }
  }
})