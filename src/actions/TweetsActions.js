export const removeTweet = (idDoTweet) => {

    return function(dispatch)
    {
        fetch(`http://twitelum-api.herokuapp.com/tweets/${idDoTweet}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'DELETE'
        })
        .then(serverResponse => serverResponse.json()) //validação colocar aqui
        .then(novaLista => {
            if(!novaLista.removidos)
                throw new Error(novaLista);

            dispatch({ type: 'REMOVE_TWEET', idDoTweetQueVaiSumir: idDoTweet});
            
        });
    }
}

export const adicionaTweet = (novoTweet) => {
    return function(dispatch)
    {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'POST',
            body: JSON.stringify({ conteudo: novoTweet })
        })
        .then(respostaDoServidor => respostaDoServidor.json() )
        .then(respostaConvertidaEmObjeto => {
            if(respostaConvertidaEmObjeto.code)
                throw new Error(respostaConvertidaEmObjeto.message);
            
            dispatch({ type: 'ADD_TWEET', tweet: respostaConvertidaEmObjeto });

        })
        .catch(error => {
            console.log('ERROS:')
            console.log(error);
        })
        .finally(() => {
            
        }); 
    }
}

// Action creartor (async) = cria uma ação q mexe na store
export const carregaTweets = (store) => {
    return function(dispatch) {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
        .then( respostaDoServidor => respostaDoServidor.json() )
        .then( tweetsVindosDoServidor => {
            //this.setState( { tweets: tweetsVindosDoServidor } );

            //agora com redux
            dispatch({ type: 'CARREGA_TWEETS', tweets: tweetsVindosDoServidor });
        } );
    }
}