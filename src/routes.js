import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import page404 from './pages/page404';
//awesome-react-components#tabs
//
const LogoutPage = () => {
    localStorage.removeItem('TOKEN');
    return <Redirect to="/login" />
}

class PrivateRoute extends Component {

    render() {
        if(localStorage.getItem('TOKEN')) {
            const ComponentIssoEhUmPattern = this.props.component;
            return (<Route component={ ComponentIssoEhUmPattern } />)
            //se eu não passar o route, as propriedades da Home não estarão acessíveis
            //return (  <ComponentIssoEhUmPattern /> )
        }
        return(
            <Redirect to="/login" />
        );       
    }
}

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <PrivateRoute path="/" exact component={Home} />
                <Route path="/login" component={LoginPage} />
                <Route path="/logout" component={LogoutPage} />
                <Route component={page404} />
            </Switch>
        )
    }
}