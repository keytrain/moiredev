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
import ReactGA from 'react-ga';

ReactGA.initialize('UA-53183138-1');

function logPageView() {
  ReactGA.set({page: window.location.pathname + window.location.search});
  ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(
  (<Router onUpdate={logPageView}>
    <Switch>
      <Route exact path='/r/:series/:chapter/:page' component={Reader} />
      <Route path='/' component={App} />
    </Switch>
  </Router>),
document.getElementById('root'));
registerServiceWorker();
