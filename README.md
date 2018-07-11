# EFX小程序框架

# 基本框架

与小程序原先的结构一致，只是在小程序基础上做了一些扩展，阅读此文档前最好能够先了解小程序开发

```
components #组件目录
configs #配置目录
pages #页面目录
store #状态仓库
    modules #各模块状态仓库
    store.js
utils #工具库
    client #第三方服务配置等
    efx #EFX框架
app.js #项目启动文件
app.json
aap.wxss
project.conifg.json
```

1.  ### app.js：项目启动文件

    初始化项目，文件地址：`./utils/efx/app/app.js`，`注：文档中js的引用地址均为相对地址，与实际使用可能存在偏差，请按实际情况进行调整`
    
    1.  绑定store
        
        引用store文件目录下的输出文件，绑定到app中，开启状态管理
        
        ```js
        import App from './utils/efx/app/app.js'
        import Store from './store/store.js'
        App({
          Store,
          ... //    其余代码与小程序一致
        })
        ```
        
    1.  监听页面生命周期
    
        监听page的生命周期函数名称与小程序一致，具体请查看文档[注册页面](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html)
        
        ```js
        App({
            //  监听所有页面的生命周期函数，在具体页面中同名函数执行之前执行
            page: {
                onLoad() {
                    //  函数的入参与小程序原先一致
                    //  this表示当前page对象
                },
                ... //  其余生命周期函数
            }
            ... //  其余代码与小程序一致
        })
        ```
        
1.  ### configs：配置文件(不可命名为current.js，因为系统中已使用)

    1.  api.map.js：api的接口地图配置，用于api的`fetchMap`类方法
    1.  app.js：项目配置，可以通过`Sys.get('APP_VAR')`获取
    
        ```js
        export default {
          //  运行环境：用于控制配置切换，与当前configs目录下其它config文件名称一致(production,development等)
          //  自定义环境，配置值需要在index.js中指定
          ENV: 'development',
          //  当前项目名称
          APP_NAME: '',
          //  版本号，版本号会存储在本地存储中
          VERSION: '0.0.0'
        }
        ```
    
    1.  development.js：开发环境配置
    
        ```js
        export default {
          //  api接口服务域名，也可以是数组
          apiServer: 'http://localhost',
          //  使用fapis时使用的token地址，因为小程序并没有cookie的概念，所以为了区别客户端使用token方案替代
          //  使用fetchToken之类接口发起请求前，都会先请求token
          //  数据格式[packName, clsName, params={}]  
          fapisToken: [],
          //  同上，通用接口服务的token设置
          //  数据格式[接口地址(auto直接使用apiServer), 其余参数]
          token: [],
          //  每次请求中附带token的参数名称
          tokenName: 'tk',
          //  token的缓存时间(ms)，0表示不缓存
          tokenCacheTime: 0,
          //  发起token请求后的数据处理，处理后返回具体的token值，系统会自动缓存
          //  res：接口返回的数据，type：接口服务类型(normal,fapis)
          tokenSave (res, type) {
            //  例如
            if (res.data && res.data.status == 1) {
              return res.data.tk
            }
            return ''
          }
        }
        ```
        
    1.  production.js：生产环境配置，利用`Config`与开发配置合并(深度)
    
        ```js
        import Config from '../utils/efx/config/config.js'
        import DevConfig from './development.js'
        
        //  生产环境配置
        //  与开发配置合并
        export default Config('production').add(DevConfig).add({
        })
        ```
        
    1.  index.js：所有配置的统一输出，如果需要设置其它的环境配置，需要在这里指定
    
        ```js
        //  configs目录下的所有配置文件必须在这里指定
        import development from './development.js'
        import production from './production.js'
        import apiMap from './api.map.js'
        import app from './app.js'
        
        //  可以使用Config('输出名称')获取对应配置对象
        //  多个点用小驼峰格式
        export {development, production, app, apiMap}
        ```
        
1.  ### pages：小程序页面目录，页面目录可以自己定义，只要在app.json中指定正确路径即可

    1.  一般的页面代码结构
    
        ```js
        //  页面js demo
        import Page from '../../utils/efx/app/page.js'
        
        Page({
            storeGetters: {
                //  store中定义的getters，store文件名/具体getter：当前页面的数据变量名(可以通过this.data.数据名获取)
                'getters': 'current'
            },
            ... //  与小程序一致
        })
        
        ```
        
    1.  页面继承（数据合并，浅拷贝）
    
        ```js
        //  例
        import Page from '../../utils/efx/app/page.js'
        import PageRedirect from '../../utils/efx/app/pages/redirect/redirect.js'
        
        //  合并页面
        Page.extend(PageRedirect, {
            //  当前页面的数据
        }, {
            //  被合并页面中，这里是PageRedirect，可以通过this.getExtendParam()获取以下数据
            homePath: '/pages/index/index',
            menuList: [],
            urlKeys: ['pp', 'p'],
            webPath: '/pages/web/web?url='
          }
        )
        ```
    
1.  ### componets：组件

    1.  一般的组件结构
    
        ```js
        import Component from '../../utils/efx/app/component.js'
        Component({
            methods: {
                //  微信小程序组件内自定义方法只能在method中定义
                storeGetters () {
                    //  store中定义的getters，store文件名/具体getter：当前页面的数据变量名(可以通过this.data.数据名获取)
                    'getters': 'current'
                }
            },
            ... //  与小程序一致
        })
        ```
        
    1.  组件继承（数据合并，浅拷贝）
    
        ```js
        //  组件继承与页面继承基本相同
        //  微信小程序的组件可以直接继承，不需要通过这种方式
        import Component from '../../app/component.js'
        Component.extend('某个组件', {
        })
        ```
        
# 基本功能

配置合并；数据的深浅拷贝和合并；数据请求，内置fapis三方支持(私有项目，可能没公开)，状态管理(与vuex相同)等

1.  ### 系统变量或者方法

    1.  define：添加，只读
    
        ```js
        import Sys from '../../utils/efx/app/sys.js'
        Sys.define('somekey', 'somedata')
        ```
        
    1.  获取
    
        ```js
        import Sys from '../../utils/efx/app/sys.js'
        Sys.get('somekey')
        
        //  系统内置
        //  获取当前appid，一个随机数值
        Sys.get('APPID')
        //  获取一个随机数字
        Sys.get('uKey')
        //  获取store对象
        Sys.get('$STORE')
        //  获取当前的运行环境
        Sys.get('ENV')
        //  获取当前项目的版本
        Sys.get('VERSION')
        //  获取配置目录下app.js中设置的值
        Sys.get('APP_VAR')
        //  获取当前的页面对象
        Sys.get('getCurrentPage')
        //  获取随机字符
        Sys.get('uName', name)
        ```

1.  ### 配置

    1.  获取配置
    
        ```js
        import Config from '../utils/efx/config/config.js'
        //  configs/index.js中输出的模块，均可以通过Config直接获取
        Config('development')
        //  获取当前环境下的配置
        Config('current')
        
        ```
    1.  `add`：合并配置
    
        ```js
        import Config from '../utils/efx/config/config.js'
        //  深度合并
        Config.
            //  与其余Config对象合并
            add(Config('development')).
            //  与对象合并
            add({}).
            //  输出配置
            get()
        ```
    1.  `get`: 输出配置
    
        ```js
        import Config from '../utils/efx/config/config.js'
        //  输出配置
        Config('current').get()
        ```
        
1.  ### 数据

    1.  存储
    
        ```js
        import {Storage} from '../../utils/efx/data/index.js'
        //  全局对象
        const normalGlobal = Storage()
        //  获取小程序全局对象的存储对象
        //  对象直接存储在小程序的全局变量上，用于替代getApp().globalData的直接调用
        const wxGlobal = Storage('WxGlobal')
        //  微信小程序本地存储
        const wxLocal = Storage('WxLocal')
        
        //  设置数据(val可以是{})
        //  timeout过期时间，单位ms，默认为0不过期
        //  WxGlobal没有过期设置
        wxLocal.set('key', 'val', 'timeout')
        //  获取数据
        wxLocal.get('key')
        //  删除数据
        wxLocal.remove('key')
        ```
        
    1.  合并、克隆（`注意：为了避免因为修改引用类型数据的属性造成预料外的修改，请使用merge，set等方法修改数据`）
    
        ```js
        import {Clone} from '../../utils/efx/data/index.js'
        const source = {
            demo: {
                hello: 'world'
            }
        }
        let target
        //  生成实例
        const DataClone = Clone(source)
        //  浅拷贝
        target = DataClone.clone()
        //  深拷贝
        target = DataClone.cloneDeep()
        //  合并
        //  待合并的对象；是否需要拷贝，否则对象结构共享(引用，只拷贝对象地址不新增内存，修改对象属性时可能会造成多处修改)，
        target = DataClone.merge({}, true)
        //  多项合并，与合并类似
        target = DataClone.merges([{}, {}], true)
        //  设置某项值
        //  如果是字符串，用点表示路径嵌套的结构
        //  如果是数组，按顺序表示路径嵌套的结构
        DataClone.set('demo.hello', 'something')
        //  获取数据
        target = DataClone.get()
        ```
        
    1.  数据判断
    
        ```js
        import {Ifs} from '../../utils/efx/data/index.js'
        
        let val
        //  判断val是否是null
        Ifs.isNull(val)
        //  判断数据类型与Object.prototype.toString.call(val)效果等同
        //  type：Object,Boolean,Number,String,Function,Array,Date,RegExp,Object,NodeList,HTMLCollection,Map,WeakMap,Set,WeakSet等
        Ifs.is('Array', val)
        //  判断空值，{}, [], null, undefined, 0, ''
        Ifs.realEmpty(val)
        ```
        
1.  ### fetch请求

    ```js
    import Fetch from '../../utils/efx/fetch/fetch.js'
    //  url地址，请求方式（GET、POST等），请求数据{}，请求头{}
    Fetch(url, method, data, header)
    ```
    
1.  ### 接口

    1.  默认方式
    
        ```js
        import apis from '../../utils/efx/api/api.normal.js'
        //  与Fetch参数一致
        //  当url为{apiServer}时，从配置中获取apiServer的第一项值(如果apiServer是数组)
        //  为{apiServer.num}时，从配置中获取apiServer的第num项值
        //  当配置中的apiServer不是数组时，直接返回apiServer的值，忽略num
        apis.fetch('{apiServer}', method, data, header)
        //  请求token，返回数据后的操作在配置中的tokenSave处理，tokenSave()返回不为空则会缓存，缓存时间在配置中的tokenCacheTime指定
        //  token的地址最好在配置中的token中指定[url, method, params, header]
        //  当没有输入参数，直接用配置中的token
        //  当输入参数只有一项，并且是{}时，直接与配置中的请求参数合并
        //  当输入参数大于一项，与配置逐项进行合并，各项意义与配置项相同
        apis.fetchToken(...params)
        //  请求token成功后再请求接口，并且请求参数中会附带token值，此参数名称可以在配置中的tokenName中指定
        apis.fetchWithToken('{apiServer}', method, data, header)
        //  通过configs目录下的api.map.js中定义的数据发起请求
        //  path是字符串，用.表示嵌套层级
        //  params参数同fetchToken
        apis.fetchWithMap('path', ...params)
        //  参数同上，不同点在于会先发起token请求
        apis.fetchWithTokenMap('path', ...params)
        ```
        
    1.  fapis方式（第三方模块）
    
        1.  配置：需要在utils/client/fapis下指定
        
            ```
            fapi.config.development.js #development用于区分不同环境时运行的配置，与运行环境名称相同
            fapi.config.production.js
            index.js #统一输出模块
            ```
        
        1.  接口：
    
            ```js
            import fapis from '../../utils/efx/api/wx.api.fapis.js'
            //  fapis的接口配置需要在utils/client/fapis下指定，如何配置具体见fapis服务端
            //  fapis请求中需要的包名、类名、数据{}
            fapis.fetch('package', 'class', params)
            //  请求token，处理同apis.fetchToken
            //  token的地址最好在配置中的fapisToken中指定[package, class, params]
            //  当没有输入参数，直接用配置中的fapisToken
            //  当输入参数只有一项，并且是{}时，直接与配置中的请求参数合并
            //  当输入参数大于一项，与配置逐项进行合并，各项意义与配置项相同
            fapis.fetchToken(...params)
            fapis.fetchWithToken('package', 'class', params)
            //  path同apis.fetchWithMap，params规则同fapis.fetchToken
            fapis.fetchWithMap('path', ...params)
            //  path同apis.fetchWithTokenMap，params规则同fapis.fetchToken
            fapis.fetchWithTokenMap('path', ...params)
            ```
            
1.  ### 事件

    ```js
    import Event from '../../utils/efx/observer/event.js'
    
    //  注册事件
    Event.on('事件类型', callback)
    //  销毁事件
    Event.off('事件类型')
    //  触发事件
    Event.emit('事件类型', ...params)
    //  触发事件，绑定上下文
    //  用于绑定on回调函数中的this
    Event.emitWith(context, '事件类型', ...params)
    ```
    
1.  ### 数据观察者

    ```js
    import Ob from '../../utils/efx/observer/ob.js'
    
    //  设置数据
    Ob.setData('数据名', val)
    //  获取数据
    Ob.data['数据名']
    //  监听数据修改，同一个数据可同时监听多次，按加入先后顺序执行
    Ob.watch('数据名', callback)
    //  onceFlag：与上述不同，当匹配到该标识字符串时，watch只会添加一次，即，数据变更后，只会执行一次回调函数
    Ob.watch('数据名', callback, onceFlag)
    //  移除该数据的监听
    Ob.removeWatch('数据名')
    ```
    
# 状态管理

核心概念与vuex基本一致，状态定义上基本一致使用上有略微区别，可以查看[vuex的文档](https://vuex.vuejs.org/zh/)

简单的讲：一个store中的module由state、getters、commits、actions组成，业务代码中无法直接改变某个module中的state，必须通过`dispatch(某个模块/某个action)`发起，由
`action`触发`commit`，由`commit`改变`state`，最终在`getter`中返回需要的状态，业务代码中调用`getter`获取
    
1.  store：状态仓库，由多个moudle组成

    ```js
    //  store目录下的所有module均需要先导入
    import Store from '../utils/efx/store/store.js'
    //  各模块名和模块路径
    import test from './modules/test.js'
    
    //  modules属性需要包含所有模块名
    export default Store({
      modules: {
        test
      }
    })
    ```
    
1.  modules

    1.  `state`：状态，用于描述当前组件所处的场景
    1.  `getters`：获取状态，返回处理好的state，框架中getters可以在page或者component中定义
    1.  `commits`：`vuex`中是`mutation`，提交状态变更，给状态变量赋值
    1.  `actions`：提交`commits`，这里可以处理异步操作，当异步完成时再调用`commit`即可
    
    ```js
    //  模块示例
    const state = {
        open: false
    }
    const getters = {
        getOpen (state) {
            return state.open
        }
    }
    const commits = {
        setOpen (state, payload) {
            state.open = payload.open
        }
    }
    const actions = {
        run ({ commit, dispatch, rootState }) {
            commit('setOpen', {
                open: true
            })
        }
    }
    export default {state, getters, commits, actions}
    ```
    
1.  dispatch：发起状态变更

    1.  page
    
        ```js
        import Page from '../../utils/efx/app/page.js'
        
        Page({
            onLoad (e) {
                this.$Store.dispatch('模块名/某个action名')
            }
        })
        ```
        
    1.  component
    
        ```js
        import Component from '../../utils/efx/app/component.js'
        
        Component({
            attached () {
                this.$Store().dispatch('模块名/某个action名')
            }
        })
        ```        
    
1.  获取状态

    获取状态需要正确设置`storeGetters`
    
    1.  page
    
        ```js
        import Page from '../../utils/efx/app/page.js'
        
        Page({
            onLoad (e) {
                let data = this.data.current
            }
            storeGetters: {
                //  store中定义的getters，模块名/具体getter：当前页面的数据变量名(可以通过this.data.数据名获取)
                'getters': 'current'
            },
            ... //  与小程序一致
        })
        ```
        
    1.  component
    
        ```js
        import Component from '../../utils/efx/app/component.js'
        
        Component({
            attached () {
                let data = this.data.current
            },
            methods: {
                //  微信小程序组件内自定义方法只能在method中定义
                storeGetters () {
                    //  store中定义的getters，模块名/具体getter：当前页面的数据变量名(可以通过this.data.数据名获取)
                    'getters': 'current'
                }
            },
            ... //  与小程序一致
        })
        ```
        
1.  中间件：实现多个方法间的单向资源共享

    ```js
    import Middleware from '../../utils/efx/middleware/middle.js'
    
    //  生成中间件
    //  fn：处理的方法，actName：触发下一步处理的函数名，默认为next
    //  生成实例时也可以不传参，通过use添加即可
    const middle = new Middleware(fn, actName)
    
    //  第一种类型：函数
    let op = (context, next) => {
        // 处理
        // 将处理后的context，传给下一步
        // context在一个中间件实例中是共享的，注意数据覆盖的情况
        // 调用next后，才能把执行权限交给下一步
        next(context)
    }
    
    //  第二种类型：对象
    let op = {
        next (context, next) {
            //  同第一种情况
        }
    }
    
    //  第三种类型：类实例
    class some {
        next (context, next) {
            //  同第一种情况
        }
    }
    let op = new some()
    
    //  处理中间件
    //  context由上一步传入，显式的调用next才能触发下一次的处理
    //  如果op是个对象，op中的next方法已被占用，可以通过actName指定其它函数名
    middle.use(op, actName)
    ```

1.  canvas：用于通过配置生成图片

    ```js
    import { WxCanvasPrint, adapterCanvasPrint} from '../../utils/efx/canvas/wx.canvas.print.js'
    
    //  配置
    //  图片中的文案
    const text = [
        {
            //  字符串样式
            style: {
                //  字体，默认是sans-serif
                fontFamily: 'SimSun',
                //  字体大小
                fontsize: 25,
                //  字体粗细
                fontWeight: 'bolder',
                //  字体变体
                fontStyle: 'italic',
                //  字体颜色
                color: '#333333',
                //  字体在水平对齐的方式[top,middle,bottom,normal]
                baseline: 'middle',
                //  文字的对齐方式（相对于左上角坐标点）[left,center,right]
                align: 'center'
            },
            //  文案
            text: '文本',
            //  字符串左上角横轴坐标
            x: 91,
            //  字符串左上角纵轴坐标
            y: 699
        },
        {
            //  设置多行文本（段落）样式，超过一行自动分行
            type: 'multiply',
            //  同上
            style: {
                fontsize: 27,
                color: '#333333'
            },
            text: '长段落',
            x: 132,
            y: 830,
            options: {
                //  一行文字的最大长度，超过另起一行
                lineWidth: 550,
                //  每个字体的大致宽度
                perWordWidth: 30,
                //  每个字体的大致高度
                perWordHeight: 30
            }
          }
    ]
    //  图片中的其它图片资源
    //  小程序中图片需要先下载，注意图片下载的安全域名设置是否正确
    const images = [
        {
            url: '远程地址',
            x: 0,
            y: 0,
            //  图片的宽度
            w: 750,
            //  图片的高度
            h: 1200
        }
    ]
    //  id：小程序中的canvas标签中的canvas-id属性
    //  ratio：比例，生成的图片会根据该比例等比缩放
    //  生成图片前要先设置canvas的高宽样式，否则生成的图片可能与预想中有差距
    //  生成实例
    const cvx = new WxCanvasPrint(id, ratio)
    //  绘制图片
    const print = cvx.print({ images, text })
    print.then(() => {
        //  图片绘制成功后的操作
    }).catch((res) => {
        //  失败捕获
        console.log(res)
    })
    
    //  根据屏幕宽度自适应生成图片
    adapterCanvasPrint(id, '设计图宽度', {images, text}).then(() => {
        //  图片绘制成功后的操作
    }).catch((res) => {
        //  失败捕获
        console.log(res)
    })
    ```
    
# 工具

1.  授权框

微信小程序中，授权框只弹出一次（scope.userInfo除外），下一次需要用户去配置页授权。
`scope`请查看微信文档[scope](https://developers.weixin.qq.com/miniprogram/dev/api/authorize-index.html)

```js
import AuthDialog from '../../utils/efx/tools/auth.dialog.js'

AuthDialog('scope.writePhotosAlbum', '保存图片', {
    //  授权成功  
    success () {},
    //  授权失败
    fail () {}，
    //  授权结束
    complete () {},
    //  授权失败后，再次打开弹框
    openSetting () {}
})
```

1.  url解析

```js
import Url from '../../utils/efx/tools/url.js'
const url = 'https://www.site.com:8080/?app=http://locahost?a=1&u=1&o=1#abc'

let result
let except
//  url：要解析的链接，except：正则，忽略解析的部分
result = Url.parse(url, except)
//  解析结果打印：
//  {
//      host: 'www.site.com',
//      params: {
//          app: 'http://locahost?a',
//          o: '1',
//          u: '1'
//      },
//      path: '/',
//      port: '8080',
//      protocol: 'https',
//      uri: '/?app=http://locahost?a=1&u=1&o=1#abc'
//  }
console.log(result)
//  正则匹配部分做为一个整体不解析
except = /app=(.*?)&o=/
result = Url.parse(url, except)
//  添加了except后的解析结果打印：
//  {
//      host: 'www.site.com',
//      params: {
//          app: 'http://locahost?a=1&u=1',
//          o: '1'
//      },
//      path: '/',
//      port: '8080',
//      protocol: 'https',
//      uri: '/?app=http://locahost?a=1&u=1&o=1#abc'
//  }
console.log(result)
```

# 内置页面

js使用`Page.extend`进行继承，页面中用`import`引入模板

1.  h5展示页：跳转到该页面后展示网页

```js
import Page from '../../utils/efx/app/page.js'
import PageWeb from '../../utils/efx/app/pages/web/web.js'

//  继承
Page.extend(PageWeb, {

}, {
    //  参数的名称，决定跳转到该页面的参数名字
    //  例：/pages/web/web?url=https://www.site.com，这里参数名就是url
    url: 'url'
})
```

```html
<!-- 页面中 -->
<import src="../../utils/efx/app/pages/web/web.wxml" />
<template is="web" data="{{src: src}}"/>
```

1.  跳转页：根据跳转参数跳转到不同页面

微信小程序的业务二维码，可以指定该跳转页，具体请查看文档[普通二维码](https://developers.weixin.qq.com/miniprogram/introduction/qrcode.html)

```js
import Page from '../../utils/efx/app/page.js'
import PageRedirect from '../../utils/efx/app/pages/redirect/redirect.js'

//  pages/redirect/redirect.js?q=/pages/index/index
//  pages/redirect/redirect.js?q=https://www.site.com
//  pages/redirect/redirect.js?q=https://www.site.com?p=
Page.extend(PageRedirect, {

}, {
    //  默认跳转地址，可以设置首页
    homePath: '/pages/index/index',
    //  小程序自带底部导航的页面地址
    //  小程序中跳转导航页面与直接跳转有差异，需要单独处理
    menuList: [],
    //  用于解析小程序业务二维码扫描后的地址
    urlKeys: ['pp', 'p'],
    //  如果是网址的跳转地址
    webPath: '/pages/web/web?url='
  }
)
```

# 内置组件

1.  once：once标签中的内容单张页面中只加载一次。

    可用于一个组件由多个组件组成，在一张页面中又需要多次使用该组件，但是该组件内部包含的组件又只需要加载一次的情况

    1.  继承于框架组件，可定制

        ```js
        import Component from '../../utils/efx/app/component.js'
        // components/once.js
        Component({
          /**
           * 组件的属性列表
           */
          properties: {
            //  组件名称，默认是当前页面地址
            name: {
              type: String,
              value: ''
            }
          }
        ```
        
        ```js
        //  once.json，组件配置部分
        {
          "component": true,
          "usingComponents": {
            "once_efx": "../../utils/efx/components/once/once"
          }
        }
        ```
        
        ```html
        <!-- 页面部分 -->
        <!--components/once.wxml-->
        <once_efx name="{{name}}">
          <slot></slot>
        </once_efx>
        ```
        
    1.  直接使用框架中的组件
    
        ```js
        //  页面json文件
        //  pages/index.json
        {
          "usingComponents": {
            "once": "../../utils/efx/app/components/once/once"
          }
        }
        ```
        
1.  link：跳转，也可用于跳转时发起请求，用于埋点处理点

    ```js
    //  页面json文件
    //  pages/index.json
    {
      "usingComponents": {
        "once": "../../utils/efx/app/components/link/link"
      }
    }
    ```
    
    ```html
    <!--
    point-server-map：
    可以在page的js中设置pointServerMap时，也可以用Storage('WxGlobal').set('pointServerMap')全局定义
    类似的对象结构
    {
        埋点方法名 (val) {
            //  val是埋点值
            //  发起请求
        }  
    }
    -->
    <link 
    url="跳转地址" web="小程序中网页的跳转页面地址，默认/pages/web/web?u=" 
    block-type="[inline, block]默认inline" link-type="[空, redirect, tab]默认空" 
    height="高度，默认auto" width="宽度，默认auto" 
    point-server-map="埋点配置地图" point-type="埋点方法名" point-val="埋点值">
    </link>
    ```