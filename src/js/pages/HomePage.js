import React from "react";
import Students from "../components/Students.js";

export default class HomePage extends React.Component {
	render() {
		return (
			<div class="row">
				<div class="col-xs-12">
					<h1>Home Page</h1>
				</div>
				<Students />
			</div>
		);
	}
}