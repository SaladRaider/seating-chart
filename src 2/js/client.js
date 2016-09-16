import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Layout from "./pages/Layout.js";
import HomePage from "./pages/HomePage.js";
import Help from "./pages/Help.js";

const app = document.getElementById("app");

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={HomePage}></IndexRoute>
			<Route path="help" component={Help}></Route>
		</Route>
	</Router>, 
	app);