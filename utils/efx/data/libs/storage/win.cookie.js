import Base from './base'

export default class WinCookie extends Base {
  constructor () {
    super()
    this.engine = this.check() ? document.cookie : false
  }

  check () {
    return this.isDocument() && !!document.cookie
  }

  setItem (key, val, timeout = 0, path = '/', domain = '') {
    let sCookie = key + '=' + encodeURIComponent(this.input(val))
    let expires = timeout

    if (expires && typeof expires === 'number') {
      const e = new Date()
      e.setTime(e.getTime() + timeout)
      expires = e.toUTCString()
    }

    sCookie += '; expires=' + expires + '; path=' + path

    if (domain === '.') {
      let host = window.location.host.replace(/:.*$/, '')
      //  检测ip
      if (!/^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(host)) {
        let domainData = host.split('.')
        domainData.shift()
        domain = '.' + domainData.join('.')
        sCookie += '; domain=' + domain
      }
    }
    document.cookie = sCookie
  }

  getItem(key) {
    const aCookie = this.engine.split('; ')

    for (let i = 0; i < aCookie.length; i++) {
      const aCrumb = aCookie[i].split('=')
      if (key === aCrumb[0]) return this.output(decodeURIComponent(aCrumb[1]))
    }
    return ''
  }

  set (key, val, timeout = 0, path = '/', domain = '') {
    this.setItem(key, val, timeout, path, domain)
  }

  get (key) {
    return this.getItem(key)
  }

  remove (key) {
    document.cookie = key + '=; expires=Fri, 31 Dec 1999 23:59:59 GMT;'
  }
}