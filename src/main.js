// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'iview/dist/styles/iview.css'
import router from './router'
import VueResource from 'vue-resource'
import iView from 'iview'
import store from './store'
import Cookies from 'js-cookie'
Vue.config.productionTip = false
Vue.use(iView)
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach(route => {
  iView.LoadingBar.finish()
})
Vue.use(VueResource)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      if (!Cookies.get('access')) {
        this.$router.push({
          name: 'login'
        })
      } else {
        this.$router.push({
          name: 'index'
        })
      }
    }
  },
  template: '<App/>',
  components: { App }
})
