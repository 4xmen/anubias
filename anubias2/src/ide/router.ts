import anubias from './views/anubias.vue';
import welcome from './views/welcome.vue';
import {Component} from 'vue';

// This function is used to create a lazy-loaded Vue component.
// It takes a name parameter which is used to determine the path to the component Vue file.
function view(name: string): Component {
    // The returned function is used to lazy-load the Vue component using dynamic import().
    return () => import(`./views/${name}.vue`);
}

// This is an array of objects that defines the application's routes.
// Each object represents a route and contains its path, name, and component.
// The component information is obtained by calling the 'view()' function
// which returns a lazy-loaded Vue component using the path name.
const routes = [
    {
        path: '/',
        name: 'welcome',
        component: welcome
    },
    {
        path: '/main',
        name: 'main',
        component: anubias,
    },
    {
        path: '/settings',
        name: 'settings',
        component: view('settings'),
    },
    {
        path: '/new-project',
        name: 'new-project',
        component: view('new-project'),
    },
    {
        path: '/about',
        name: 'about',
        component: view('about'),
    },
    {
        path: '/welcome',
        name: 'welcome',
        component: view('welcome'),
    },
    {
        path: '/devops',
        name: 'devops',
        component: view('devops'),
    },
    {
        path: '/emulators',
        name: 'emulators',
        component: view('emulators'),
    },
];

// Export the routes object as default to be used by other modules
export default routes;
