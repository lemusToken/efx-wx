//  开发环境配置
export default {
  //  可以是数组
  apiServer: ['http://localhost', 'http://local.demoapi.net'],
  //  fapis token参数
  fapisToken: ['app_client.xiaochengxu.go_home', 'GET_TOKEN', {type: 'app'}],
  token: ['{apiServer.1}/token.php'],
  //  每次请求中token的参数名称
  tokenName: 'tk',
  //  token的缓存时间
  tokenCacheTime: 0,
  //  token从接口获取后的数据
  tokenSave (res, type) {
    if (type === 'normal' && res.data && res.data.status == 1) {
      return res.data.data.token
    }
    else if (type === 'fapis') {
      return '1313'
    }
    return ''
  }
}