import React from "react";
import { Link, withRouter } from "react-router";

export default withRouter(class Layout extends React.Component {
	render() {
		return (
			<div class="container">
				<div class="row">
					<div class="col-xs-12">
						<h1>Ms. Kuso's Seating Chart</h1>
						<Link class="btn btn-success" to="/">Home</Link>
						<Link class="btn btn-success" to="help">Help</Link>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
});