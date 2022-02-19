import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Vote from './components/Vote';

const Routing = () => {
  return (
    <Router>
      <Header/>
      <Switch>
        <Route exact path = '/' component = {Home} />
        <Route exact path = '/register' component = {Register} />
        <Route exact path = '/vote' component = {Vote} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<Routing/>, document.getElementById('root'));