/**
 * store合并
 * 注意：合并后同名项会被覆盖
 */
export default (data) => {
  let { states, commits, getters, actions } = {}
  for (let v of Object.keys(data)) {
    for (let vv of Object.keys(data[v])) {
      switch (vv) {
        //  合并状态
        case 'state':
          states = states ? { ...states, ...data[v][vv] } : data[v][vv]
          break
        //  合并动作
        case 'actions':
          actions = actions ? { ...actions, ...data[v][vv] } : data[v][vv]
          break
        //  合并过滤器
        case 'getters':
          getters = getters ? { ...getters, ...data[v][vv] } : data[v][vv]
          break
        //  合并状态提交
        case 'commits':
          commits = commits ? { ...commits, ...data[v][vv] } : data[v][vv]
          break
      }
    }
  }
  return { states, actions, getters, commits }
}