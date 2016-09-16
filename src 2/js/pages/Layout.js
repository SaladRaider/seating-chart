import React from "react";
import { Link, withRouter } from "react-router";

export default withRouter(class Layout extends React.Component {
	render() {
		return (
			<div class="container">
				<div class="row">
					<h1>Ms. Kuso's Seating Chart Generator</h1>
					<Link class="btn btn-default" to="/">Home</Link>
					<Link class="btn btn-default" to="help">Help</Link>
					{this.props.children}
				</div>
			</div>
		);
	}
});