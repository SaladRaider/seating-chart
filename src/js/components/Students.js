import React from "react";

import Student from "./Student.js";
import * as StudentActions from "../actions/StudentActions.js";
import StudentStore from "../stores/StudentStore.js";

import $ from "jquery";


export default class Students extends React.Component {
	constructor() {
		super();

		this.state = {
			students: StudentStore.getAll(),
			progressStyle:  {
				width: "0%"
			},
			score: 0
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
			students: StudentStore.getAll(),
			progressStyle:  {
				width: StudentStore.getProgress()
			},
			score: StudentStore.getScore()
		});
		//generateTableDownload();
		//$("table").tableExport();
		console.log("Updating progress", this.state.progressStyle.width);
	}

	loadStudents() {
		var studentFileInput = document.getElementById("studentFileInput");
		var testScoreFileInput = document.getElementById("testScoreFileInput");
		var historyFileInput = document.getElementById("historyFileInput");

		if(studentFileInput.value.length <= 0 || testScoreFileInput.value.length <= 0) {
			console.log("Required files are missing.");
			return;
		}

		var studentFile = studentFileInput.files[0];
		var testScoreFile = testScoreFileInput.files[0];
		var historyFile = (historyFileInput.files[0] != null) ? historyFileInput.files[0] : "";
		var studentBlob = "";
		var testScoreBlob = "";
		var historyBlob = "";

		var reader = new FileReader();

		reader.onloadend = function(evt) {
			if(evt.target.readyState == FileReader.DONE) {
				studentBlob = evt.target.result;
				reader.onloadend = function(evt) {
					if(evt.target.readyState == FileReader.DONE) {
						testScoreBlob = evt.target.result;

						if(historyFile !== "") {
							console.log("Reading history file");
							reader.onloadend = function(evt) {
								if(evt.target.readyState == FileReader.DONE) {
									historyBlob = evt.target.result;
									
									StudentActions.loadStudents(studentBlob, testScoreBlob, historyBlob);
								}
							}
							reader.readAsText(historyFile);
						} else {
							StudentActions.loadStudents(studentBlob, testScoreBlob, historyBlob);
						}
					}
				}
				reader.readAsText(testScoreFile);
			}
		}

		reader.readAsText(studentFile);
	}

	setProgress(prog) {
		this.setState({
			progressStyle: {
				width: prog
			}
		});
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

		this.setProgress("0%");

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

		fileInputPopSize.value = 40;
		fileInputMutPerChild.value = 1;
		fileInputTimeout.value = 20;
		fileInputWeight1.value = 400;
		fileInputWeight2.value = 200;
		fileInputWeight3.value = 100;
		fileInputWeight4.value = 100;
		fileInputWeight5.value = 10;
		fileInputWeight6.value = 1;
	}

	download() {
		StudentActions.download();
	}

	exportXLS() {
		StudentActions.exportXLS(false);
	}

	exportXLS_N() {
		StudentActions.exportXLS(true);
	}

	render() {
		const { students } = this.state;

		var StudentSeats = students.map((student) => {
			if(student.fourthCol == "true") {
				return (
					<td key={student.id} class="col-xs-2 div-td" style={{backgroundColor: "#f88"}}>
					{ (student.front == "true") ? (<p><b>{student.name}</b></p>) : (<p>{student.name}</p>) }
					<p>{student.gender}</p>
					<p>{student.testScore}</p>
					</td>
				);
			} else {
				return (
					<td key={student.id} class="col-xs-2 div-td">
					{ (student.front == "true") ? (<p><b>{student.name}</b></p>) : (<p>{student.name}</p>) }
					<p>{student.gender}</p>
					<p>{student.testScore}</p>
					</td>
				);
			}
		});

		StudentSeats.reverse();

		var StudentRows = [];

		var ssl = StudentSeats.length;
		var cols;
		var letters = ["F", "E", "D", "C", "B", "A"];
		for(var j = 0; j * 6 < ssl; j++) {

			cols = [<td key={Math.random()*1000}>{letters[j]}</td>];
			for(var i = j*6; i < (j+1) * 6 && i < ssl; i++) {
				cols.push(StudentSeats[i]);
			}

			StudentRows.push(
				<tr key={Math.random()*1000}>{cols}</tr>
			);
		}

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
				History .csv File: <input class="form-control" id="historyFileInput" type="file" /><br />
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
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="40" id="pop-size" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Mutations per child</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="1" id="mut-per-child" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Timeout (s)</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="15" id="timeout" /></div>
				<br /><br />
				</div>

				<div class="row">
				<div class="col-xs-12"><h3>Weights:</h3></div>
				</div>

				<div class="row">
				<div class="col-xs-2"><label type="number" class="control-label">Request by student to sit in front</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="400" id="weight1" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">High w/ low score</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="200" id="weight2" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Boy/Girl alternating</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="100" id="weight3" /></div>
				<br /><br />
				</div>

				<div class="row">
				<div class="col-xs-2"><label type="number" class="control-label">Sitting w/ new people</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="100" id="weight4" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Low scores in front</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="10" id="weight5" /></div>
				<div class="col-xs-2"><label type="number" class="control-label">Don't sit in col 4 again</label></div>
				<div class="col-xs-2"><input type="number" class="form-control" defaultValue="1" id="weight6" /></div>
				</div>
				</div>
				
				<div class="col-xs-12">
				<br />
				<div class="progress">
				  <div class="progress-bar progress-bar-striped active" role="progressbar"
				  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={this.state.progressStyle}>
				    {this.state.progressStyle.width}
				  </div>
				</div>
				<button class="btn btn-success" onClick={this.sortStudents.bind(this)}>Sort Students</button>
				<button class="btn btn-danger" onClick={this.restoreDefaults.bind(this)}>Restore Defaults</button>
				<hr />
				</div>
				<br /><br />
				<div class="col-xs-12">
				<h3>Seating Chart Score: {this.state.score}</h3>
				<button class="btn btn-default csv" onClick={this.download.bind(this)}>Export History</button>
				<button class="btn btn-default xls" onClick={this.exportXLS.bind(this)}>Export Table</button>
				<button class="btn btn-default xls" onClick={this.exportXLS_N.bind(this)}>Export Table (Nick Names Only)</button>
				<br /><br />
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<th></th>
							<th>Col 1</th>
							<th>Col 2</th>
							<th>Col 3</th>
							<th>Col 4</th>
							<th>Col 5</th>
							<th>Col 6</th>
						</tr>
					</thead>
					<tbody>
						{StudentRows}
					</tbody>
				</table>
				</div>
				</div>
			</div>
		);
	}
}
