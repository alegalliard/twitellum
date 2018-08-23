import {createStore, applyMiddleware, combineReducers} from 'redux';
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

    if(acaoDisparadaPeloDev.type === 'LIKE')
    {
        const idTweetLikeado = acaoDisparadaPeloDev.idDoTweet;
        const listaNova = stateDentroDaStore.tweets.map(tweetAtual => {
            const {likeado, totalLikes, _id} = tweetAtual;
            if(idTweetLikeado === _id) {
                tweetAtual.likeado = !likeado
                tweetAtual.totalLikes = likeado ? totalLikes -1 : totalLikes+1
            }

            return tweetAtual;
        })

        return {
            ...stateDentroDaStore,
            tweets: listaNova
        }
    }

    return stateDentroDaStore
}

function notificacaoReducer(state = ' ', action) {
    if(action.type === 'ADD_NOTIFICACAO')
    {
        console.log('notificações')
        return action.msg;
    
    }
    return state;
}

export default createStore(
    combineReducers({
        tweets: tweetsReducer,
        notificacao: notificacaoReducer
    }),
    applyMiddleware(thunk)
);