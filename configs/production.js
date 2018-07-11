import Config from '../utils/efx/config/config.js'
import DevConfig from './development.js'

//  生产环境配置
//  与开发配置合并
export default Config('production').add(DevConfig).add({
})