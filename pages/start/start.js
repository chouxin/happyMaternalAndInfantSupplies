//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    type: 0
  },
  goToIndex:function(){
    var that = this;
    //进入店铺前先取得的店铺的授权
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }else {
      that.setData({
        type: 1
      })
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          if(res.data.data.base.mobile){
            that.setData({
              type: 2
            }),
            wx.switchTab({
              url: '/pages/classification/index',
            });
          }else {
            that.setData({
              type: 1
            })
          }
        }
      }
    })
  },
  onLoad:function(){
    var that = this
    that.setData({
      background_color: app.globalData.globalBGColor,
      bgRed: app.globalData.bgRed,
      bgGreen: app.globalData.bgGreen,
      bgBlue: app.globalData.bgBlue
    })
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }else {
      that.setData({
        type: 1
      })
    }

    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          if(res.data.data.base.mobile){
            that.setData({
              type: 2
            })
          }
        }
      }
    })
  },
  onShow:function(){
    this.onLoad();
  },
  onReady: function(){
    var that = this;
    setTimeout(function(){
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(that.data.angle !== angle){
        that.setData({
          angle: angle
        });
      }
    });
  },
  getPhoneNumber: function (e) {
    console.log(e)
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      console.log(e.detail.errMsg)
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        console.log("绑定手机号--")
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            type: 2
          }),
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  }
});