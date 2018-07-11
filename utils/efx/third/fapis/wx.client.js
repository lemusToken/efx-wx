import {Storage} from '../../data/index.js'
import Client from './base.js'
import Sys from '../../app/sys.js'

const storage = Storage('WxLocal')
const APP_VAR = Sys.get('APP_VAR')
const request = Client(APP_VAR.ENV)

export default {
  request
}