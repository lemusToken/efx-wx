import test from './modules/test.js'
import test1 from './modules/test1.js'
import box from './modules/box.js'
import share_button from './modules/share_button.js'
import api from './modules/api.js'
import {Store} from '../utils/efx/store/index.js'

export default Store({
  modules: {
    test, test1, box, share_button
  }
})