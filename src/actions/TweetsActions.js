

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