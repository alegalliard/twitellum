import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import page404 from './pages/page404';

/*function estaAutenticado() {
    if(!window.localStorage.getItem('TOKEN'))
        this.props.history.push('/login');
}*/
class PrivateRoute extends Component {

    render() {
        if(localStorage.getItem('TOKEN')) {
            const ComponentPattern = this.props.component;
            return (
                <ComponentPattern />
            )
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
                <Route component={page404} />
            </Switch>
        )
    }
}