import { createRouter, createWebHistory } from 'vue-router'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import StudentDashboard from '../components/StudentDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'  // Default route redirects to login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }  // Public route
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }  // Public route
  },
  {
    path: '/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true }  // Protected route - requires authentication
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Navigation Guard
 * Runs before every route change to check authentication
 */
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.meta.requiresAuth;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // If route requires auth and no token exists
  if (requiresAuth && !token) {
    console.log('⛔ Access denied - No token found');
    console.log(`Redirecting from ${to.path} to /login`);
    
    // Redirect to login page
    next('/login');
  } 
  // If user has token and tries to access login/register
  else if ((to.path === '/login' || to.path === '/register') && token) {
    console.log('ℹ️ User already logged in');
    console.log(`Redirecting from ${to.path} to /dashboard`);
    
    // Redirect to dashboard
    next('/dashboard');
  }
  // Otherwise, allow navigation
  else {
    next();
  }
});

export default router
