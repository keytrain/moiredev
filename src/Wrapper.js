import React, { Component } from "react"
import App from "./App"
import { Route, Switch } from "react-router-dom"
import Reader from "./Reader"

class Wrapper extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/r/:series/:chapter/:page" component={Reader} />
        <Route path="/" component={App} />
      </Switch>
    )
  }
}

export default Wrapper
