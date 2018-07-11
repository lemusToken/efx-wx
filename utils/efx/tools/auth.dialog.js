export default (scope, label, {success, fail, complete, openSetting})=>{
  wx.getSetting({
    success: res => {
      if (res.authSetting[scope]) {
        // 已经授权
        typeof success === 'function' && success()
      }
      //  授权失败，弹出去配置页的窗口
      else if (scope !== 'scope.userInfo' && res.authSetting[scope] === false) {
        typeof openSetting === 'function' && openSetting()
        wx.showModal({
          title: '需要授权',
          content: `您点击了拒绝授权，将无法正常${label}，请打开配置页面重新授权`,
          cancelText: '取消',
          confirmText: '打开配置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success,
                fail
              })
            }
            else if (res.cancel) {
              typeof fail === 'function' && fail()
            }
          },
          fail,
          complete
        })
      }
      //  微信授权弹框
      else {
        wx.authorize({
          scope: scope,
          success,
          fail,
          complete
        })
      }
    }
  })
}