import './styles/main.scss'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useConfiguration } from './stores/configuration'
import { useAuth } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

const configuration = useConfiguration();
const auth = useAuth();

function ls_set(name: string, value?: any) {
    if (value === undefined) {
        localStorage.removeItem(name);
        return;
    }
    localStorage.setItem(name, JSON.stringify(value));
}

function ls_get(name: string): any | undefined {
    const stored = localStorage.getItem(name);
    if (stored === null) {
        return;
    }
    return JSON.parse(stored);
}


configuration.$subscribe((mutation, state) => {
    ls_set("configuration.server_url", state.server_url);
});

auth.$subscribe((mutation, state) => {
    ls_set("auth.session", state.session);
});

configuration.server_url = ls_get("configuration.server_url");
auth.session = ls_get("auth.session");

import server from './lib/Server'

const server_promise = server.init(configuration, auth);

router.beforeEach(async (to, from) => {
    await server_promise;
});

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth === true && !auth.auth) {
        return { name: "login" };
    } else if (to.meta.requiresAuth === false && auth.auth) {
        return { name: "dashboard" };
    }
});

import { setTheme } from './lib/theme'
setTheme();

app.use(router);

app.mount('#app')


