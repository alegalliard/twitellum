import {createStore} from 'redux';

const stateInicial = [];

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS')
    {
        return acaoDisparadaPeloDev.tweets;
    }

    return stateDentroDaStore
}

export default createStore(tweetsReducer);