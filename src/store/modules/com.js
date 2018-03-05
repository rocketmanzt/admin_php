import * as types from '../types'

/**
 * App通用配置
 */
const state = {
  news: {},
  users: {}
}

const actions = {
}

const getters = {
  news: state => state.news,
  users: state => state.users
}

const mutations = {
  [types.SET_NEWS] (state, news) {
    state.news = news
  },
  [types.SET_USERS] (state, users) {
    state.users = users
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}// eslint-disable-line