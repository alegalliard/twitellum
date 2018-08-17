import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import Spinner from '../../components/Spinner'

//regex para hashtags #(\S+)\b

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
          novoTweet: '',
          tweets: []
      }
      this.adicionaTweet = this.adicionaTweet.bind(this);
  }

  componentDidMount() {
    fetch(`http://twitelum-api.herokuapp.com/tweets?X-AUTH-TOKEN=${localStorage.getItem('TOKEN')}`)
    .then( respostaDoServidor => respostaDoServidor.json() )
    .then( tweetsVindosDoServidor => {
        this.setState( { tweets: tweetsVindosDoServidor } );
        console.log(tweetsVindosDoServidor)
    } );
  }

  adicionaTweet(e) {
    e.preventDefault();
    
    if(this.state.novoTweet.length > 1 && 
        (e.keyCode === 13 || !e.keyCode ) )
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

            console.log(respostaConvertidaEmObjeto);
        })
        .catch(error => {
            console.log('ERROS:')
            console.log(error);
        })
        .finally(() => {
            
        });

        

        
    }
  }
  
  render() {
    return (
      <Fragment>
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
                                        key={indice} 
                                        texto={tweetAtual.conteudo}
                                        likeado={tweetAtual.likeado}
                                        totalLikes={tweetAtual.totalLikes}
                                        usuario={tweetAtual.usuario} />
                            })
                        }
                    {(this.state.tweets.length == 0) ? <Spinner /> : '' }                        
                    </div>
                </Widget>
            </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default Home;
