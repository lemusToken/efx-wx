/**
 * canvas页面（图片）生成
 * @author xule
 */
export class WxCanvasPrint {
  constructor (id, ratio=1, scale=1) {
    this.ctx = wx.createCanvasContext(id)
    this.ratio = ratio
    this.scale = scale
  }

  getVal (val) {
    return val * this.scale * this.ratio
  }

  setTextStyle({ fontsize = 10, fontFamily = 'sans-serif', fontWeight, fontStyle, color, baseline = 'normal', align = 'left'}) {
    if (baseline) {
      this.ctx.setTextBaseline(baseline)
    }
    if (align) {
      this.ctx.setTextAlign(align)
    }
    if (fontsize) {
      fontsize = this.getVal(fontsize)
      //  font至少要提供字体族名和字体大小
      if (fontFamily) {
        const fontSizeInt = parseInt(fontsize)
        let font = []
        if (fontWeight) {
          font.push(fontWeight)
        }
        if (fontStyle) {
          font.push(fontStyle)
        }
        font.push(`${fontSizeInt}px`)
        font.push(fontFamily)
        this.ctx.font = font.join(' ')
      }
      else {
        //  设置字体大小
        this.ctx.setFontSize(fontsize)
      }
    }
    if (color) {
      //  设置字体颜色
      this.ctx.setFillStyle(color)
    }
  }

  setText(text, x, y) {
    x = this.getVal(x)
    y = this.getVal(y)
    //  设置文本和坐标
    this.ctx.fillText(text, x, y)
  }

  //  设置多行文本
  //  小程序无法获取单个字符的高宽，需要手动测量后填入
  setTextMultiLine(text, x, y, {lineWidth, perWordWidth, perWordHeight, lineHeight=0}) {
    //  获取字符串总宽度
    const totalTextWidth = text.length * perWordWidth
    //  每一行的可显示的字符数
    const totalLineNum = parseInt(lineWidth / perWordWidth)
    //  计算行数
    const row = Math.ceil(totalTextWidth / lineWidth)
    for (let i=0;i<row;i++) {
      if (i>=1) {
        this.setTextStyle({
          align: 'left'
        })
      }
      this.setText(text.substr(totalLineNum * i, totalLineNum), x, y + perWordHeight * i + lineHeight)
    }
  }

  //  绘制远程图片
  drawRemoteImage(url, x, y, w, h, isCircle=false, fn={}) {
    wx.getImageInfo({
      //  下载图片
      src: url,
      success: (res) => {
        if (res.path) {
          typeof fn.before === 'function' && fn.before(this.ctx)
          isCircle ? this.drawImageCircle(res.path, x, y, w) : this.drawImage(res.path, x, y, w, h)
          typeof fn.after === 'function' && fn.after(this.ctx)
        }
        else {
          typeof fn.error === 'function' && fn.error('download image fail')
        }
      },
      fail (res) {
        typeof fn.error === 'function' && fn.error(res)
      }
    })
  }

  //  绘制图片
  drawImage(path, x, y, w, h) {
    x = this.getVal(x)
    y = this.getVal(y)
    w = this.getVal(w)
    h = this.getVal(h)
    this.ctx.drawImage(path, x, y, w, h)
  }

  //  绘制圆角图片
  drawImageCircle(path, x, y, l) {
    this.ctx.save()
    this.ctx.beginPath()
    // x + w/2
    this.ctx.arc( this.getVal(x) + this.getVal(l) / 2, this.getVal(y) + this.getVal(l) / 2, this.getVal(l)/2, 0, 2 * Math.PI )
    this.ctx.clip()
    this.drawImage(path, x, y, l, l)
    this.ctx.restore()
  }

  //  多张图，一张接一张图片绘制
  drawImageOneByOne(list, fn={}, index=0) {
    if (!list[index] || !list[index].url) {
      typeof fn.allDone === 'function' && fn.allDone()
      return
    }
    this.drawRemoteImage(list[index].url, list[index].x, list[index].y, list[index].w, list[index].h, list[index].isCircle, {
      after: () => {
        typeof fn.done === 'function' && fn.done(list)
        index += 1
        this.drawImageOneByOne(list, fn, index)
      },
      error: fn.error
    })
  }

  draw(fn) {
    this.ctx.draw(true, fn)
  }

  //  生成图片页面
  print({images, text}) {
    return new Promise((resolve, reject) => {
      this.drawImageOneByOne(images, {
        allDone: () => {
          if (text) {
            for (let v of text) {
              if (v.style) {
                this.setTextStyle(v.style)
              }
              if (v.type === 'multiply') {
                this.setTextMultiLine(v.text, v.x, v.y, v.options)
              } else {
                this.setText(v.text, v.x, v.y)
              }
            }
          }
          this.draw(()=>{
            resolve()
          })
        },
        error: reject
      })
    })
  }

  getContext() {
    return this.ctx
  }
}

//  根据设备屏幕宽度绘制图片
export function adapterCanvasPrint(id, design, { images, text }, scale = 1) {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success(res) {
        const screenWidth = res.screenWidth
        const screenHeight = res.screenHeight
        const ratio = screenWidth / design
        const cvx = new WxCanvasPrint(id, ratio)
        const print = cvx.print({ images, text })
        print.then(() => {
          resolve()
        }).catch((res) => {
          reject(res)
        })
      }
    })
  })

}