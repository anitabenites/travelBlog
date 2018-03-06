import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import ViewPost from './components/ViewPost';

let router =  (
    <Router history={browserHistory}>
        <Route path = '/' component={Login}></Route>
        <Route path = '/home' component={Home}></Route> 
        <Route path = '/login' component={Login}></Route> 
        <Route path = '/signup' component={Signup}></Route> 
        <Route path = '/profile' component={Profile}></Route>
        <Route path = '/createPost' component={CreatePost}></Route>
        <Route path = '/post/:id' component={ViewPost}></Route>
    </Router>
);

ReactDOM.render(
    router,
    document.getElementById('app')
);;