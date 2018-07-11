const parseParams = function (str, eq = null, and = null) {
  return eq && and ? str.replace(RegExp(eq, 'g'), '=').replace(RegExp(and, 'g'), '&') : str
}

export default {
  //  except：正则，表示例外情况，不解析url中的&和=号
  //  例如参数中带有http://此类地址
  parse (url, except) {
    let els
    let res = {}
    let index
    //  protocol
    if ((index = url.indexOf(':')) > -1) {
      els = url.split(':')
      res.protocol = url.substring(0, index)
      url = url.substring(index).replace('://', '')
    }
    else {
      res.protocol = ''
    }
    index = url.indexOf('/')
    //  host
    res.host = url.substring(0, index)
    url = url.substring(index)
    if ((index = res.host.indexOf(':')) > -1) {
      res.port = res.host.substring(index+1)
      res.host = res.host.substring(0, index)
    }
    else {
      res.port = ''
    }
    //  uri
    res.uri = url
    //  path
    if ((index = url.indexOf('?')) > -1) {
      res.path = url.substring(0, index)
      url = url.substring(index+1)
    }
    else {
      res.path = ''
    }
    //  去掉#号以及后面部分
    if ((index = url.indexOf('#')) > -1) {
      url = url.substr(0, index)
    }
    //  解析参数
    let tmp
    const rid = Math.random() * 10000 | 0
    //  =替换
    const eqFlag = '<' + rid + '>'
    //  &替换
    const andFlag = '@' + rid + '@'
    if (except) {
      url = url.replace(except, function (str, m) {
        return str.replace(m, m.replace(/&/g, andFlag).replace(/=/g, eqFlag))
      })
    }
    if (url.indexOf('&') > -1) {
      els = url.split('&')
      res.params = {}
      tmp = []
      for (let i = 0; i < els.length; i++) {
        tmp = els[i].split('=')
        res.params[tmp[0]] = except ? parseParams(tmp[1], eqFlag, andFlag) : tmp[1]
      }
    }
    else if (url.indexOf('=') > -1) {
      tmp = url.split('=')
      res.params = {}
      res.params[tmp[0]] = except ? parseParams(tmp[1], eqFlag, andFlag) : tmp[1]
    }
    return res
  },
  create (url, data) {
    let params = null
    if (Array.isArray(data)) {
      params = data.join('&')
    }
    else {
      params = []
      for (let v in data) {
        if (data.hasOwnProperty(v)) {
          params.push(v+'='+data[v])
        }
      }
      params = params.join('&')
    }
    url = url + '?' + params
    return url
  }
}