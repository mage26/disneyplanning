import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import Attractions from './views/attractions.vue'
import Create from './views/createTrip.vue'
import Edit from './views/editTrip.vue'
import Summary from './views/tripSummary.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/attractions/:tripId',
      name: 'attractions',
      component : Attractions
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/edit/:tripId',
      name: 'edit-trip',
      component: Edit
    },
    {
      path: '/vacation/:tripId',
      name: 'trip-summary',
      component: Summary,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
