import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/page/home/index';
import Platform from '@/page/platform/index';
import Setinfor from '@/page/setinfor/index';
import Select from '@/page/select/index';


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/plat',
      name:'Platform',
      component:Platform
    },
    {
      path:'/setinfor',
      name:'Setinfor',
      component:Setinfor
    },
    {
      path:'/selectmd',
      name:'Selectmd',
      component:Select
    }
  ]
})
