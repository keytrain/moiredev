import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import ReactGA from 'react-ga';
import Analytics from './Analytics';

ReactGA.initialize('UA-53183138-1');

ReactDOM.render(
  (<Router>
    <Route path="/" component={Analytics}/>
  </Router>),
document.getElementById('root'));
