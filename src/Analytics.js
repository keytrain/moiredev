import React, { Component } from 'react';
import ReactGA from 'react-ga';
import App from './App'
import {
  Route,
  Switch
} from 'react-router-dom';
import Reader from './Reader';

class Analytics extends Component {
  constructor(props) {
    super(props)

    // Initial page load - only fired once
    this.sendPageChange(props.location.pathname, props.location.search)
  }

  componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search) {
      this.sendPageChange(nextProps.location.pathname, nextProps.location.search)
    }
  }

  sendPageChange(pathname, search='') {
    const page = pathname + search
    ReactGA.set({page});
    ReactGA.pageview(page);
  }

  render() {
    return (
    <Switch>
      <Route exact path='/r/:series/:chapter/:page' component={Reader} />
      <Route path="/" component={App}/>
    </Switch>   
    )
  }
}

export default Analytics;