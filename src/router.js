/**
 * router page
 */
import Vue from "vue";
import Router from "vue-router";


Vue.use(Router);
export default new Router({
    // mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: view('MainAppPage')
        },
        {
            path: "/project",
            name: "project",
            component: view('ProjectPage')
        },
        {
            path: "/projectLoaded",
            name: "projectLoaded",
            component: view('ProjectLoadedPage')
        },
        {
            path: "/emulator",
            name: "emulator",
            component: view('EmulatorPage')
        },
        {
            path: "/setting",
            name: "setting",
            component: view('SettingPage')
        },
        {
            path: "/about",
            name: "About",
            component: view('AboutPage')
        },
    ]
});


/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * @param  {string}   name     the filename (basename) of the view to load.
 */
function view(name) {
    return function (resolve) {
        require(['@/components/pages/' + name + '.vue'], resolve);
    };
}

