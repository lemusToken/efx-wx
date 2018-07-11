/**
 * 变量hash值计算
 */
const weakMap = new WeakMap()
//  对象hash初始值
let hashObjectId = 0
//  对象hash的标识字段
const UID_HASH_KEY = Symbol('UID_HASH_KEY')
//  字符串超出一定长度才会缓存hash结果
const STRING_HASH_CACHE_MIN_STRLEN = 16
//  字符串hash缓存的最大容量
const STRING_HASH_CACHE_MAX_SIZE = 255
//  字符串hash缓存当前大小
let STRING_HASH_CACHE_SIZE = 0
//  字符串hash缓存
let stringHashCache = {}

//  V8使用32位表示对象和数值，高位1位用于标识对象还是smi整数(SMall Integer)
function smi (i32) {
  return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff)
}

//  字符串hash
function hashString (str) {
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1]
  let isLong = str.length > STRING_HASH_CACHE_MIN_STRLEN
  let hashed = stringHashCache[str]
  if (hashed === undefined) {
    hashed = 0
    for (let ii = 0; ii < str.length; ii++) {
      hashed = (31 * hashed + str.charCodeAt(ii)) | 0
    }
    hashed = smi(hashed)
    if (isLong) {
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0
        stringHashCache = {}
      }
      STRING_HASH_CACHE_SIZE++
      stringHashCache[str] = hashed
    }
  }
  return hashed
}

//  对象hash
function hashObject (obj) {
  let hashed = obj[UID_HASH_KEY] ? obj[UID_HASH_KEY] : weakMap.get(obj)
  if (hashed !== undefined) return hashed
  hashed = ++hashObjectId
  if (hashObjectId & 0x40000000) {
    hashObjectId = 0
  }
  obj.nodeType !== undefined ? obj[UID_HASH_KEY] = hashed : weakMap.set(obj, hashed)
  return hashed
}

//  数字
function hashNum (num) {
  if (num !== num || num === Infinity) {
    return 0
  }
  //  取整
  let h = num | 0
  if (h !== num) {
    h ^= num * 0xffffffff
  }
  while (num > 0xffffffff) {
    num /= 0xffffffff
    h ^= num
  }
  return smi(h)
}

//  hash
export default function hash (o) {
  if (o === false || o === null || o === undefined) {
    return 0
  }
  if (typeof o.valueOf === 'function') {
    o = o.valueOf()
    if (o === false || o === null || o === undefined) {
      return 0
    }
  }
  if (o === true) {
    return 1
  }
  const type = typeof o
  if (type === 'number') {
    return hashNum(o)
  }
  if (type === 'string') {
    return hashString(o)
  }
  if (type === 'object' || type === 'function') {
    return hashObject(o)
  }
  if (typeof o.toString === 'function') {
    return hashString(o.toString())
  }
  return ''
}