import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/components/pages/MainAppPage.vue";
import ProjectPage from "@/components/pages/ProjectPage";


Vue.use(Router);
export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage
        },
        {
            path: "/project",
            name: "project",
            component: ProjectPage
        },
    ]
});