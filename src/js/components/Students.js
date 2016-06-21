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
		var studentFileInput = document.getElementById("studentFileInput");
		var testScoreFileInput = document.getElementById("testScoreFileInput");
		
		if(studentFileInput.value.length <= 0 || testScoreFileInput.value.length <= 0) {
			return;
		}

		var studentFile = studentFileInput.files[0];
		var testScoreFile = testScoreFileInput.files[0];
		var studentBlob = "";
		var testScoreBlob = "";

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if(evt.target.readyState == FileReader.DONE) {
				studentBlob = evt.target.result;
				reader.onloadend = function(evt) {
					if(evt.target.readyState == FileReader.DONE) {
						testScoreBlob = evt.target.result;
						StudentActions.loadStudents(studentBlob, testScoreBlob);
					}
				}
				reader.readAsText(testScoreFile);
			}
		}

		reader.readAsText(studentFile);
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
							<th>Seat</th>
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
				Student .csv File: <input id="studentFileInput" type="file" /><br />
				Test Scores .csv File: <input id="testScoreFileInput" type="file" /><br />
				<button class="btn btn-danger" onClick={this.loadStudents}>Load Students</button>
			</div>
		);
	}
}