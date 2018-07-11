import Page from '../../utils/efx/app/page.js'
import PageRedirect from '../../utils/efx/app/pages/redirect/redirect.js'

// pages/redirect/redirect.js?q=
Page.extend(PageRedirect, {

}, {
    homePath: '/pages/index/index',
    menuList: [],
    urlKeys: ['pp', 'p'],
    webPath: '/pages/web/web?url='
  }
)