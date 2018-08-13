export default (store, context) => {
  if (!store) return
  const getters = context.storeGetters
  if (getters) {
    store.bindGetters((name, val) => {
      context.setData({
        [name]: typeof val === 'undefined' ? '' : val
      })
    }, getters, context.route)
  }
}