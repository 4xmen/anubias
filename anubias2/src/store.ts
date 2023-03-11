import {createStore} from 'vuex' ;

const store = createStore({
    state() {
        return {
            count: 0,
            ide: {
                title: 'Anubias',
            }
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        changeIdeTitle(state,title) {
            document.querySelector('title')!.innerText = title;
            state.ide.title = title;
        }
    },
    actions:{
        setIdeTitle(context,title){
            context.commit('changeIdeTitle',title);
        }
    }

});

export default store;