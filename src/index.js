import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import App from './App';
import Reader from './Reader';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  (<Router>
    <Switch>
      <Route exact path='/r/:series/:chapter/:page' component={Reader} />
      <Route path='/' component={App} />
    </Switch>
  </Router>),
document.getElementById('root'));
registerServiceWorker();
