import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import Spinner from '../../components/Spinner'
import {Helmet} from 'react-helmet'
import PropTypes from 'prop-types';
import Modal from '../../components/Modal'

//regex para hashtags #(\S+)\b

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          novoTweet: '',
          tweets: [],
          tweetAtivo: {}
      }
      this.adicionaTweet = this.adicionaTweet.bind(this);
  }

  componentDidMount() {
    fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
    .then( respostaDoServidor => respostaDoServidor.json() )
    .then( tweetsVindosDoServidor => {
        this.setState( { tweets: tweetsVindosDoServidor } );
    } );
  }

  removerOTweet = (idDoTweet) => {
    const removeu =  this.state.tweets.filter( (tweet) => idDoTweet !== tweet._id );
    fetch(`http://twitelum-api.herokuapp.com/tweets/${idDoTweet}?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
        method: 'DELETE'
    })
    .then(serverResponse => serverResponse.json())
    .then(novaLista => {
        if(!novaLista.removidos)
            throw new Error(novaLista);

        this.setState({
            tweets: removeu
        })
    });
    
  }

  adicionaTweet(e) {
    e.preventDefault();
    
    if(this.state.novoTweet.length > 1 && 
        (!e.keyCode ) )
    {
        fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`, {
            method: 'POST',
            body: JSON.stringify({ conteudo: this.state.novoTweet })
        })
        .then(respostaDoServidor => respostaDoServidor.json() )
        .then(respostaConvertidaEmObjeto => {
            if(respostaConvertidaEmObjeto.code)
                throw new Error(respostaConvertidaEmObjeto.message);

            this.setState( {
                tweets: [ respostaConvertidaEmObjeto, ...this.state.tweets ]
            });
            this.setState({novoTweet: ''});

        })
        .catch(error => {
            console.log('ERROS:')
            console.log(error);
        })
        .finally(() => {
            
        });        
    }
  }

  abreModal = (idDoTweetQVaiNoModal) => {
      const tweetQVaiFicarAtivo = this.state.tweets.find(tweet => tweet._id === idDoTweetQVaiNoModal )
      console.log(tweetQVaiFicarAtivo)
      this.setState({
          tweetAtivo: tweetQVaiFicarAtivo
      });
  }
  
  render() {
    return (
      <Fragment>
        <Helmet>
            <title>Tweets ( {`${this.state.tweets.length}`} )</title>
        </Helmet>
        <Cabecalho>
            <NavMenu usuario="@alegalliard" />
        </Cabecalho>
        <div className="container">
            <Dashboard>
                <Widget>
                    <form className="novoTweet" onSubmit={this.adicionaTweet} 
                        onKeyUp={ this.adicionaTweet }>
                        <div className="novoTweet__editorArea">
                            <span className={ `novoTweet__status 
                            ${(this.state.novoTweet.length > 140) 
                                ? 'novoTweet__status--invalido' 
                                : ''  }`
                             }>
                            
                            {this.state.novoTweet.length}/140</span>
                            <textarea className="novoTweet__editor" 
                                onChange={ e => { this.setState({novoTweet: e.target.value }) }  }
                                placeholder="O que está acontecendo?"
                                value={this.state.novoTweet}
                                >
                            </textarea>
                        </div>
                        <button type="submit" className="novoTweet__envia"
                            disabled={ this.state.novoTweet.length > 140 
                                    || this.state.novoTweet.length <1 }>Tweetar</button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">                
                <Widget>
                    <div className="tweetsArea">                        
                        {         
                            this.state.tweets.map((tweetAtual, indice) => {
                                return <Tweet 
                                        key={tweetAtual._id} 
                                        id={tweetAtual._id} 
                                        texto={tweetAtual.conteudo}
                                        likeado={tweetAtual.likeado}
                                        totalLikes={tweetAtual.totalLikes}
                                        removivel={tweetAtual.removivel}
                                        usuario={tweetAtual.usuario}
                                        abreModalHandler={() => { this.abreModal(tweetAtual._id) }}
                                        removeHandler={() => { this.removerOTweet(tweetAtual._id) }} />
                            })
                        }
                    {(this.state.tweets.length === 0) ? <Spinner /> : '' }                        
                    </div>
                </Widget>
            </Dashboard>
        </div>
        <Modal isAberto={Boolean(this.state.tweetAtivo._id)}>
           { 
            Boolean(this.state.tweetAtivo._id) &&
            <Widget>
                <Tweet id={this.state.tweetAtivo._id} 
                texto={this.state.tweetAtivo.conteudo}
                usuario={this.state.tweetAtivo.usuario}
                likeado={this.state.tweetAtivo.likeado}
                totalLikes={this.state.tweetAtivo.totalLikes} />
            </Widget>
            }
        </Modal>
      </Fragment>
    );
  }
}
Tweet.propTypes = {
    id: PropTypes.string.isRequired,
    texto: PropTypes.string.isRequired,
    removivel: PropTypes.bool,
    likeado: PropTypes.bool,
    removeHandler: PropTypes.func,
    usuario: PropTypes.shape({
        foto: PropTypes.string.isRequired,
        nome: PropTypes.string,
        login: PropTypes.string,
    })
}

export default Home;

