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

	sortStudents() {
		var fileInputPopSize = document.getElementById("pop-size");
		var fileInputMutPerChild = document.getElementById("mut-per-child");
		var fileInputTimeout = document.getElementById("timeout");
		var fileInputWeight1 = document.getElementById("weight1");
		var fileInputWeight2 = document.getElementById("weight2");
		var fileInputWeight3 = document.getElementById("weight3");
		var fileInputWeight4 = document.getElementById("weight4");
		var fileInputWeight5 = document.getElementById("weight5");
		var fileInputWeight6 = document.getElementById("weight6");

		StudentActions.sortStudents(
			parseInt(fileInputTimeout.value),
			{
				populationSize: parseInt(fileInputPopSize.value),
				numMutations: parseInt(fileInputMutPerChild.value),
				weights: [
					parseInt(fileInputWeight1.value),
					parseInt(fileInputWeight2.value),
					parseInt(fileInputWeight3.value),
					parseInt(fileInputWeight4.value),
					parseInt(fileInputWeight5.value),
					parseInt(fileInputWeight6.value)
				]
			}
		);
	}

	restoreDefaults() {
		var fileInputPopSize = document.getElementById("pop-size");
		var fileInputMutPerChild = document.getElementById("mut-per-child");
		var fileInputTimeout = document.getElementById("timeout");
		var fileInputWeight1 = document.getElementById("weight1");
		var fileInputWeight2 = document.getElementById("weight2");
		var fileInputWeight3 = document.getElementById("weight3");
		var fileInputWeight4 = document.getElementById("weight4");
		var fileInputWeight5 = document.getElementById("weight5");
		var fileInputWeight6 = document.getElementById("weight6");

		fileInputPopSize.value = 100;
		fileInputMutPerChild.value = 5;
		fileInputTimeout.value = 1000;
		fileInputWeight1.value = 1000000;
		fileInputWeight2.value = 100000;
		fileInputWeight3.value = 10000;
		fileInputWeight4.value = 1000;
		fileInputWeight5.value = 100;
		fileInputWeight6.value = 10;
	}

	render() {
		const { students } = this.state;

		const StudentComponents = students.map((student, i) => {
			return <Student key={student.id} num={i} {...student} />;
		});

		var StudentSeats = students.map((student) => {
			return (
				<div key={student.id} class="col-xs-2 div-td">
				<p>{student.name}</p>
				<p>{student.gender}</p>
				<p>{student.front}</p>
				<p>{student.testScore}</p>
				</div>
			);
		});
		StudentSeats.reverse();
		//[];
		/*var excludedSeats = [
			[28],
			[26, 24],
			[26, 24, 23],
			[26, 27, 32, 33]
		];

		const emptySeats = Math.min(36 - students.length, 4);
		var j = students.length - 1;

		if(students.length >= 32) {
			for(var i = 35; i >= 0; i-=1) {
				if(excludedSeats[emptySeats - 1].indexOf(i) !== -1) {
					StudentSeats.push(
						<div key={Math.random() * 100} class="col-xs-2 div-td">
						</div>
					);
				} else {
					StudentSeats.push(
						<div key={students[j].id} class="col-xs-2 div-td">
						<p>{students[j].name}</p>
						<p>{students[j].gender}</p>
						<p>{students[j].front}</p>
						<p>{students[j].testScore}</p>
						</div>
					);
					j-=1;
				}
			}
		}*/
		

		return (
			<div>
				<div class="form-group col-xs-12">
				Student .csv File: <input class="form-control" id="studentFileInput" type="file" /><br />
				Test Scores .csv File: <input class="form-control" id="testScoreFileInput" type="file" /><br />
				<button class="btn btn-success" onClick={this.loadStudents}>Load Students</button><br />
				<hr />
				</div>

				<br />
				<div class="form-group">

				<div class="col-xs-12">
				<div class="row">
				<div class="col-xs-12"><h3>Genetic Algorithm Independent Variables:</h3></div>
				</div>

				<div class="row">
				<div class="col-xs-2"><label type="number" class="control-label" >Population Size</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="100" id="pop-size" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Mutations per child</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="5" id="mut-per-child" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Timeout (ms)</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="1000" id="timeout" /></div>
				<br /><br />
				</div>

				<div class="row">
				<div class="col-xs-12"><h3>Weights:</h3></div>
				</div>

				<div class="row">
				<div class="col-xs-2"><label type="number" class="control-label">Request by student to sit in front</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="1000000" id="weight1" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">High w/ low score</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="100000" id="weight2" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Boy/Girl alternating</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="10000" id="weight3" /></div>
				<br /><br />
				</div>

				<div class="row">
				<div class="col-xs-2"><label type="number" class="control-label">Sitting w/ new people</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="1000" id="weight4" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Low scores in front</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="100" id="weight5" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Don't sit in col 4 again</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="10" id="weight6" /></div>
				</div>
				</div>
				
				<div class="col-xs-12">
				<br />
				<button class="btn btn-success" onClick={this.sortStudents}>Sort Students</button>
				<button class="btn btn-danger" onClick={this.restoreDefaults}>Restore Defaults</button>
				<hr />
				</div>
				<br /><br />
				<div class="col-xs-12">
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<th>Seat</th>
							<th>ID</th>
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

				<div class="table table-bordered table-hover">
					{StudentSeats}
				</div>
				</div>
				</div>
			</div>
		);
	}
}