import { createRouter, createWebHistory } from 'vue-router'
import { isEmpty } from 'lodash';
import store from '../stores';

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/home'
    },
    {
      children:[
        {
          path:      '',
          name:      "Home",
          meta: {
            title:     'Home',
            protected: false,
          },          
          component: () => import('@/views/home/Index.vue')
        },
        {
          path: 'login',
          name: "Login",
          meta: {
            title:     'Login',
            protected: false,
          },
          component: () => import('@/views/home/Login.vue')
        },
        {
          path: 'register',
          name: "Register",
          meta: {
            title:    'Register',
            protected: false,
          },
          component: () => import('@/views/home/Register.vue')
        }, 
        {
          path: 'forgot',
          name: "Forgot",
          meta: {
            title:     'Forgot Password',
            protected:  false,
          },
          component: () => import('@/views/home/Forgot.vue')
        }, 
        {
          path: 'chatbot',
          name: "Chatbot",
          meta: {
            title: 'Login',
            protected:  true,
          },
          component: () => import('@/views/home/Chatbot.vue')
        },         
      ],
      path: '/home',
      component: () => import('@/views/layouts/Landing.vue')
    },
    {
      path: '/dashboard',
      children:[
        {
          path: '',
          name: "Overview",
          meta: {
            title:     'Overview',
            protected:  true,
            state: 0
          },
          component: () => import('@/views/dashboard/Overview.vue')
        },
        {
          path: 'apps',
          children: [
            {
              path: '',
              name: "Apps",
              meta: {
                title:     'Apps',
                protected:  true,
                state: 0
              },
              component: () => import('@/views/dashboard/Apps.vue')
            },
            {
              path: 'create',
              name: "CreatApp",
              meta: {
                title:     'Create app',
                protected:  true,
                state: 0
              },
              component: () => import('@/views/dashboard/show/CreateApp.vue')
            }        
          ],
        }, 
        {
          path: 'clients',
          name: "Clients",
          meta: {
            title: 'Clients',
            protected:  true,
            state: 1
          },
          component: () => import('@/views/dashboard/Clients.vue')
        },
        {
          path: 'company',
          name: "Company",
          meta: {
            title: 'Company',
            protected:  true,
            state: 2
          },
          component: () => import('@/views/dashboard/Company.vue')
        },        
        {
          path: 'profile',
          name: "Profile",
          meta: {
            title: 'Profile',
            protected:  true,
            state: 0
          },
          component: () => import('@/views/dashboard/Profile.vue')
        },       
        {
          path: 'system',
          name: "System",
          meta: {
            title: 'System',
            protected:  true,
            state: 2
          },
          component: () => import('@/views/dashboard/System.vue')
        },                                      
        {
          path: 'staff',
          name: "Staff",
          meta: {
            title: 'Staff',
            protected:  true,
            state: 2
          },
          component: () => import('@/views/dashboard/Users.vue')
        },
      ],
      component: () => import('@/views/layouts/Dashboard.vue')
    }
  ]
});

router.beforeEach( (to, from, next) => {
  const { name: routeName, meta: { state } } = to;
  store.commit('loader',true);
  window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
  window.scrollTo({top: 0, behavior: 'smooth'});
  console.log(store.getters.authUser);
  switch( !isEmpty(store.getters.authUser) ){
    case true:
      if( routeName == "Login"){
        next({name:"Overview"});
      } else {
        const { getters: { authUser:{ role: { name: roleName, state: roleState } } } } = store;
        if( roleState >= state ){
          next();
        } else {
          next({name:"Forbidden"})
        }
      }   
    break;
    case false:
      // store.commit('auth',{});
      if( to.name != "Login" ){
        router.push({ name: "Login" });
      }
      next();
    break;
  }

});

router.afterEach((to, from,failure) => {
  store.commit('loader',false);
})


export default router
