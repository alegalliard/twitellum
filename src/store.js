import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'

const stateInicial = [];

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS')
    {
        return acaoDisparadaPeloDev.tweets;
    }

    if(acaoDisparadaPeloDev.type === 'ADD_TWEET')
    {
        const tweetsAntigos = stateDentroDaStore;
        const tweetNovo = acaoDisparadaPeloDev.tweet;
        return [tweetNovo, ...tweetsAntigos];
    }

    if(acaoDisparadaPeloDev.type === 'REMOVE_TWEET')
    {
        const idDoTweetQueVaiSumir = acaoDisparadaPeloDev.idDoTweetQueVaiSumir;
        const listaAtualizadaDeTweets = stateDentroDaStore.filter(tweetAtual => {
            return tweetAtual._id !== idDoTweetQueVaiSumir
        })
        return listaAtualizadaDeTweets;
    }

    return stateDentroDaStore
}

export default createStore(tweetsReducer, applyMiddleware(thunk));