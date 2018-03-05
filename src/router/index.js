import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: 'error-404',
      component: () => import('@/views/error-page/404.vue')
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: 'userList',
          name: 'userList',
          component: () => import('@/views/userList'),
          meta: {
            requireAuth: true,
            breadCrumb: ['用户管理', '用户列表']
          }
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('@/views/shop'),
          meta: {
            requireAuth: true,
            breadCrumb: ['商品管理', '商品列表']
          }
        },
        {
          path: 'fruit',
          name: 'fruit',
          component: () => import('@/views/fruit'),
          meta: {
            requireAuth: true,
            breadCrumb: ['商品列表', '水果产品']
          }
        },
        {
          path: 'upload',
          name: 'upload',
          component: () => import('@/views/upload'),
          meta: {
            requiresAuth: true,
            breadCrumb: ['商品管理', '图片上传']
          }
        },
        {
          path: 'uploadbanner',
          name: 'uploadbanner',
          component: () => import('@/views/uploadbanner'),
          meta: {
            breadCrumb: ['首页管理', 'banner图片']
          }
        },
        {
          path: 'upload1',
          name: 'upload1',
          component: () => import('@/views/upload1'),
          meta: {
            breadCrumb: ['商品管理', '图片上传1']
          }
        },
        {
          path: 'message',
          name: 'messsage',
          component: () => import('@/views/message'),
          meta: {
            requireAuth: true,
            breadCrumb: ['留言管理', '留言列表']
          }
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('@/views/news'),
          meta: {
            requireAuth: true,
            breadCrumb: ['新闻管理', '新闻列表']
          }
        },
        {
          path: 'newsBanner',
          name: 'newsBanner',
          component: () => import('@/views/newsBanner'),
          meta: {
            requireAuth: true,
            breadCrumb: ['新闻管理', '新闻大图']
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },
    {
      path: '/icon',
      name: 'icon',
      component: () => import('@/views/icon')
    }
  ]
})
