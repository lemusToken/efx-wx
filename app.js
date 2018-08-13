import App from './utils/efx/app/app.js'
import Store from './store/store.js'

App.use({
  install ({mixin}, App, Sys, Page) {
    mixin ({
      onLaunch () {
        console.log('mixin launch')
      },
      page: {
        onLoad() {
          console.log('app onload', this)
        }
      }
    })
  }
})
App.use({Store})
//app.js
App({
  onLaunch: function () {
    console.log('launch')
  }
})