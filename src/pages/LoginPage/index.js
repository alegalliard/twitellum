import React, { Component } from 'react'
import Widget from '../../components/Widget'

import './loginPage.css'


class LoginPage extends Component {
    logar = (e) => {
        e.preventDefault();
        const login = this.inputLogin.value;
        const senha = this.inputSenha.value;
        const dadosDeLogin = {
            login: login,
            senha: senha
        }

        fetch('http://twitelum-api.herokuapp.com/login', {
            method: 'POST',
            body: JSON.stringify(dadosDeLogin)
        })
        .then(respostaDoServidor => respostaDoServidor.json())
        .then(respostaEmObjeto => {
            if(respostaEmObjeto.token) {
                localStorage.setItem('TOKEN', respostaEmObjeto.token);
                this.props.history.push('/');
            } else {
                throw new Error('Login inválido');
            }
        })
        .catch(error => {
            console.log('erro')
            console.log(error)
        })

    }
    render() {
        return (
            <div className="loginPage">
                <div className="container">
                    <Widget>
                        <h1 className="loginPage__title">Twitelum</h1>
                        <form className="loginPage__form" action="/" onSubmit={this.logar}>
                            <div className="loginPage__inputWrap">
                                <label className="loginPage__label" htmlFor="login">Login</label> 
                                <input className="loginPage__input" 
                                    ref={ (inputLogin) => this.inputLogin = inputLogin }
                                    type="text" id="login" name="login"/>
                            </div>
                            <div className="loginPage__inputWrap">
                                <label className="loginPage__label" htmlFor="senha">Senha</label> 
                                <input className="loginPage__input" type="password" 
                                ref={ (inputSenha) => this.inputSenha = inputSenha }
                                id="senha" name="senha"/>
                            </div>
                            {/* <div className="loginPage__errorBox">
                                Mensagem de erro!
                            </div> */}
                            <div className="loginPage__inputWrap">
                                <button className="loginPage__btnLogin" type="submit">
                                    Logar
                                </button>
                            </div>
                        </form>
                    </Widget>
                </div>
            </div>
        )
    }
}


export default LoginPage