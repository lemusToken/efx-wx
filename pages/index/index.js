import Page from '../../utils/efx/app/page.js'

Page({
  data: {
    open: ''
  },
  onLoad () {
    console.log('page onLoad')
    this.$Store.dispatch('box/open')
    console.log(this.data.open)
  },
  storeGetters: {
    'box/getBoxState': 'open'
  }
})