import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      // Your are free to add whatever logic here.
      // On first visit
      next('/tab1')
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/UI/ThePanelTabsVertical.vue')
  },
  {
    path: '/tab1',
    name: 'tab1',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/UI/ThePanelTabsVertical.vue')
  },
  {
    path: '/tab2',
    name: 'tab2',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/UI/ThePanelTabsVertical.vue')
  },
  {
    path: '/tab3',
    name: 'tab3',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/UI/ThePanelTabsVertical.vue')
  },
  {
    path: '/layers',
    name: 'layers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../components/UI/ThePanelTabsVertical.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
