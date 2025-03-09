import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '@/views/LoginView.vue';
import RoomView from '@/views/RoomView.vue';
import RoomCreatorView from '@/views/RoomCreatorView.vue';
import DashboardView from './views/DashboardView.vue';
import { useAuth } from './stores/auth';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const router = createRouter({
    routes: [
        { name: "root", path: "/", redirect: "/dashboard" },
        { name: "login", meta: { requiresAuth: false }, path: "/login", component: LoginView },
        { name: "room", meta: { requiresAuth: true }, path: "/room", component: RoomView },
        { name: "dashboard", meta: { requiresAuth: true }, path: "/dashboard", component: DashboardView },
        { name: "creator", meta: { requiresAuth: true }, path: "/creator", component: RoomCreatorView }
    ],
    history: createWebHistory(import.meta.env.BASE_URL)
});

router.beforeEach((to, from) => {
    const auth = useAuth();
    if (to.meta.requiresAuth === true && !auth.auth) {
        return { name: "login" };
    } else if (to.meta.requiresAuth === false && auth.auth) {
        return { name: "dashboard" };
    }
});

export default router;
