const Queues = []

const mixin = function (data, input) {
  return data = {
    ...data,
    ...input
  }
}

export default {
  add (data) {
    Queues.push(data)
  },
  on () {

  },
  extend (data) {
    for (let v of Queues) {
      if (typeof v.install === 'function') {
        v.install({
          mixin: (input) => {
            data = mixin(data, input)
          }
        })
      }
      else if (typeof v === 'function') {
        data = mixin(data, {
          [Reflect.get(v, 'name')]: v
        })
      }
      else if (typeof v === 'object') {
        data = mixin(data, v)
      }
    }
    return data
  }
}