import api from '@/utils/api'
import axios from 'axios'
const state = {
  fruitList: [],
  params: {}
}
const getters = {
  getFruitList: state => state.fruitList
}

const actions = {
  fetchFruitList ({commit, state}) {
    axios.post(api.select, state.params)
    .then((res) => {
      commit('updateFruitList', res.data.data)
    }, (err) => {
      console.log(err)
    })
  }
}

const mutations = {
  updateFruitList (state, payload) {
    state.fruitList = payload
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