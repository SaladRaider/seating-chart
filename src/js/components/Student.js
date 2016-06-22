import React from "react";
import { withRouter } from "react-router";

export default withRouter(class Student extends React.Component {
	render() {
		const { num, seat, name, gender, grade, front, fourthCol, testScore } = this.props;
		return (
			<tr>
				<td>{num}</td>
				<td>{seat}</td>
				<td>{name}</td>
				<td>{gender}</td>
				<td>{grade}</td>
				<td>{front}</td>
				<td>{fourthCol}</td>
				<td>{testScore}</td>
			</tr>
		);
	}
});