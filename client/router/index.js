import Vue from 'vue'
import Router from 'vue-router'
import post from '../views/post'
import image from '../views/image'
import errorPage from '../views/error'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: post,
      props: route => ({
        startPage: route.query.page ? parseInt(route.query.page) : 1,
        startTags: route.query.tags ? decodeURIComponent(route.query.tags).split('+') : [],
      })
    },
    {
      path: '/:id',
      component: image,
      props: route => ({
        id: parseInt(route.params.id)
      })
    },
    {
      path: '/e/:number',
      component: errorPage,
      props: route => ({ number: route.params.number })
    },
    // {
    //   path: '*',
    //   component: errorPage,
    //   props: { number: 404 }
    // }

  ]
})
