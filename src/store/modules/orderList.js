import Vue from 'vue'

const state = {
  orderList: [],
  params: {}
}
const getters = {
  getOrderList: state => state.orderList
}

const actions = {
  fetchOrderList ({commit, state}) {
    Vue.http.get('http://localhost:3000/getData', state.params)
    .then((res) => {
      commit('updateOrderList', res.data)
    }, (err) => {
      console.log(err)
    })
  }
}

const mutations = {
  updateOrderList (state, payload) {
    state.orderList = payload
  },
  updateParams (state, {key, val}) {
    state.params[key] = val
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}// eslint-disable-line