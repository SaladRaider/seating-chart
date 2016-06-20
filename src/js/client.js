import React from "react";
import ReactDOM from "react-dom";

class Layout extends React.Component {
	render() {
		return (
			<div class="container">
				<div class="row">
					<div class="col-xs-12">
						<h1>Ms. Kuso's Seating Chart</h1>
					</div>
				</div>
			</div>
		);
	}
}

const app = document.getElementById("app");

ReactDOM.render(<Layout />, app);