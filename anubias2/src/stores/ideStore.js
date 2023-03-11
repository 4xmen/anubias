
const ideStore = {
    state: () => ({
        title: 'Anubias',
        tabs: {},
        components: {
            collapsed: false,
        },
        properties: {
            collapsed: false,
        },
        pages: {
            collapsed: false,
        },
    }),
    mutations: {
        changeIdeTitle(state, title) {
            document.querySelector('title').innerText = title;
            state.title = title;
        },
        toggleComponentsCollapse(state){
            state.components.collapsed = !state.components.collapsed;
        },
        togglePropertiesCollapse(state){
            state.properties.collapsed = !state.properties.collapsed;
        },
        togglePagesCollapse(state){
            state.pages.collapsed = !state.pages.collapsed;
        },
    },
    actions: {
        setIdeTitle(context, title) {
            context.commit('changeIdeTitle', title);
        },
        toggleComponentsCollapse(context){
            context.commit('toggleComponentsCollapse');
        },
        togglePropertiesCollapse(context){
            context.commit('togglePropertiesCollapse');
        },
        togglePagesCollapse(context){
            context.commit('togglePagesCollapse');
        },
    },
    getters: {}
};

export  default  ideStore;