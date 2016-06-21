import React from "react";

import Student from "./Student.js";
import * as StudentActions from "../actions/StudentActions.js";
import StudentStore from "../stores/StudentStore.js";

export default class Students extends React.Component {
	constructor() {
		super();

		this.state = {
			students: StudentStore.getAll()
		};

		this.getStudents = this.getStudents.bind(this);
	}

	componentWillMount() {
		StudentStore.on("change", this.getStudents);
	}

	componentWillUnmount() {
		StudentStore.removeListener("change", this.getStudents);
	}

	getStudents() {
		this.setState({
			students: StudentStore.getAll()
		});
	}

	loadStudents() {
		var fileInput = document.getElementById("fileInput");
		var file = fileInput.files[0];

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if(evt.target.readyState == FileReader.DONE) {
				StudentActions.loadStudents(evt.target.result);
			}
		}
		reader.readAsText(file)
	}

	render() {
		const { students } = this.state;

		const StudentComponents = students.map((student) => {
			return <Student key={student.id} {...student} />;
		});

		return (
			<div>
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<th>Name</th>
							<th>Gender</th>
							<th>Grade</th>
							<th>Front?</th>
							<th>4th Column?</th>
							<th>Test Score</th>
						</tr>
					</thead>
					<tbody>
						{StudentComponents}
					</tbody>
				</table>
				<input id="fileInput" type="file" onChange={this.loadStudents} />
			</div>
		);
	}
}