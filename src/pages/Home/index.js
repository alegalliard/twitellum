import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../containers/TweetContainer'
import Spinner from '../../components/Spinner'
import {Helmet} from 'react-helmet'
import PropTypes from 'prop-types';
import Modal from '../../components/Modal'
import * as TweetsActions from '../../actions/TweetsActions'
import '../../assets/css/notificacao.css'


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

  static contextTypes = {
      store: PropTypes.object
  }

  componentDidMount() {
    window.store = this.context.store;
    window.store.dispatch({ type: 'ADD_NOTIFICACAO', msg: 'Alo alo w brasil' })
    this.context.store.subscribe(() => {
        this.setState({
            tweets: this.context.store.getState().tweets.tweets,
            tweetAtivo: this.context.store.getState().tweets.tweetAtivo
        })
    })

    //sem o thunk
    // TweetsActions.carregaTweets(this.context.store)


    //com o thunk
    this.context.store.dispatch( TweetsActions.carregaTweets() );
  }

  fechaModal = (e) => {
    const el = e.target;
    const isModal = el.classList.contains( 'modal' );

    if(isModal) {
        //this.setState({tweetAtivo: {}})
        this.context.store.dispatch({ type: 'FECHA_MODAL' });
    }
  }

  

  adicionaTweet(e) {
    e.preventDefault();
    
    
    if(this.state.novoTweet.length > 1 && 
        (e.keyCode === 13 ) )
    {
         this.context.store.dispatch(TweetsActions.adicionaTweet(this.state.novoTweet));
         this.setState({novoTweet: ''});
    }
  }

  abreModal = (idDoTweetQVaiNoModal) => {
      this.context.store.dispatch({ type: 'ABRE_MODAL', idDoTweetQVaiNoModal });
  }
  
  render() {
    return (
      <Fragment>
        <Helmet>
            <title>Tweets ({`${this.state.tweets.length}`}  )</title>
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
                                        //removeHandler={() => { this.removerOTweet(tweetAtual._id) }} Foi pro componente do Tweet
                                        />
                            })
                        }
                    {(this.state.tweets.length === 0) ? <Spinner /> : '' }                        
                    </div>
                </Widget>
            </Dashboard>
        </div>
        <Modal isAberto={Boolean(this.state.tweetAtivo._id)}
        fechaModal={this.fechaModal}>
           { 
            Boolean(this.state.tweetAtivo._id) &&
            <Widget>
                <Tweet id={this.state.tweetAtivo._id} 
                        texto={this.state.tweetAtivo.conteudo}
                        usuario={this.state.tweetAtivo.usuario}
                        likeado={this.state.tweetAtivo.likeado}
                        removivel={this.state.tweetAtivo.removivel}
                        totalLikes={this.state.tweetAtivo.totalLikes} />
            </Widget>
            }
        </Modal>
        {
            this.context.store.getState().notificacao &&
            <div className="notificacaoMsg" onAnimationEnd={() => { this.context.store.dispatch({ type: 'REMOVE_NOTIFICACAO' }) } }>
                { this.context.store.getState().notificacao }
            </div>
        }}
        }
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

