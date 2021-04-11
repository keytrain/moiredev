import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "./index.css";
import { HashRouter as Router, Route } from "react-router-dom";

import Wrapper from "./Wrapper";

ReactDOM.render(
  <Router>
    <Route path="/" component={Wrapper} />
  </Router>,
  document.getElementById("root")
);
