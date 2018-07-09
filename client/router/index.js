import Vue from 'vue'
import Router from 'vue-router'
import post from '../views/post'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: post
    },
    {
      path: '/post/#{id}',
      // component: img
    }
  ]
})
