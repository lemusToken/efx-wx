import './whatwg-fetch.js'

const toUrlParams = (obj) => {
  let url = ''
  function serialize (obj) {
    let arr = Object.entries(obj)
    arr.forEach(v => {
      if (Object.prototype.toString.call(v[1]) === '[object Object]') {
        serialize(v[1])
      }
      else {
        url += v.join('=') + '&'
      }
    })
  }
  serialize(obj)
  return url.substring(0, url.length - 1)
}

export default (url, method = 'GET', data = {}, header = {}) => {
  method = method.toUpperCase()
  if (method === 'GET') {
    return data ? fetch(url + '?' + toUrlParams(data)) : fetch(url)
  }
  else {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        ...header
      },
      body: toUrlParams(data)
    })
  }
}