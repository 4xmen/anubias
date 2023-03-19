import anubias from './views/anubias.vue';
import { Component } from 'vue';

function view(name: string): Component {
    return () => import(`./views/${name}.vue`);
}

const routes = [
    { path: '/', component: anubias },
    {
        path: '/settings',
        name: 'Settings',
        component: view('settings'),
    }
];

export  default  routes;