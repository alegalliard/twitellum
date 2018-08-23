import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'

const stateInicial = {tweets:[], tweetAtivo: ''};

function tweetsReducer(stateDentroDaStore = stateInicial, acaoDisparadaPeloDev) {
    if(acaoDisparadaPeloDev.type === 'CARREGA_TWEETS')
    {
        return {
            ...stateDentroDaStore,
            tweets: acaoDisparadaPeloDev.tweets
        }
    }

    if(acaoDisparadaPeloDev.type === 'ADD_TWEET')
    {
        const tweetsAntigos = stateDentroDaStore.tweets;
        const tweetNovo = acaoDisparadaPeloDev.tweet;
        return {
            ...stateDentroDaStore,
            tweets: [tweetNovo, ...tweetsAntigos]            
        };
    }

    if(acaoDisparadaPeloDev.type === 'REMOVE_TWEET')
    {
        const idDoTweetQueVaiSumir = acaoDisparadaPeloDev.idDoTweetQueVaiSumir;
        const listaAtualizadaDeTweets = stateDentroDaStore.tweets.filter(tweetAtual => {
            return tweetAtual._id !== idDoTweetQueVaiSumir
        })
        
        return {
            ...stateDentroDaStore,
            tweets: listaAtualizadaDeTweets,
            tweetAtivo: {}
        }
    }

    if(acaoDisparadaPeloDev.type === 'ABRE_MODAL')
    {
        const idDoTweetQVaiNoModal = acaoDisparadaPeloDev.idDoTweetQVaiNoModal;
        const tweetQVaiFicarAtivo = stateDentroDaStore.tweets.find(tweet => tweet._id === idDoTweetQVaiNoModal )
        return {
            ...stateDentroDaStore,
            tweetAtivo: tweetQVaiFicarAtivo
        }
    }

    if(acaoDisparadaPeloDev.type === 'FECHA_MODAL')
    {
        return {
            ...stateDentroDaStore,
            tweetAtivo: {}
        }
    }

    return stateDentroDaStore
}

export default createStore(tweetsReducer, applyMiddleware(thunk));