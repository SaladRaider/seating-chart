import { EventEmitter } from "events";
import SeatingChart from "../classes/SeatingChart.js";

import dispatcher from "../dispatcher.js";

class StudentStore extends EventEmitter {
	constructor() {
		super();
		this.students = [];	
		this.seatingPartners = [];
		this.progress = "0%";
		this.score = 0;
	}

	// creates a new student and emmits a change event
	createStudent({ name, gender, grade, front, fourthCol, testScore }) {
		this.makeStudent({ name, gender, grade, front, fourthCol, testScore })
		this.emit("change");
	}

	// loads new students and emits a hange event
	loadStudents(students, seatingPartners) {
		this.students = [];
		var sl = students.length;
		for(var i = 0; i < sl; i++) {
			this.makeStudent(students[i]);
		}
		this.seatingPartners = seatingPartners;
		console.log("Loaded history. SeatingPartners: ", this.seatingPartners, "; FourthCols: ", this.fourthCols);
		this.emit("change");
	}

	// makes a new student
	makeStudent({ name, gender, grade, front, fourthCol, testScore }) {
		const id = Date.now() + this.students.length;
		const seat = this.students.length;
		this.students.push({
			id,
			seat,
			name,
			gender,
			grade,
			front,
			fourthCol,
			testScore
		});
	}

	// attempts to sort the students in a desireable fashion under a certain ammount of time
	sortStudents(timeout, geneticInfo) {
		var initSeatingChart = new SeatingChart;
		initSeatingChart.setStudents(this.students);
		initSeatingChart.initSort((students) => {
			this.students = students;

			// Get test score info to put into genetic info
			var min = (isNaN(students[0].testScore)) ? 0 : parseInt(students[0].testScore);
			var max = min;
			var cmpScore = 0;

			var sl = students.length;
			for(var i = 1; i < sl; i+=1) {
				if(isNaN(students[i].testScore))
					cmpScore = 0;
				else
					cmpScore = parseInt(students[i].testScore);

				if(cmpScore < min) {
					min = cmpScore;
				} else if (cmpScore > max) {
					max = cmpScore;
				}
			}

			geneticInfo.testScores = {
				min: min,
				max: max,
				median: (min + max) / 2
			};

			// start genetic algorithm sort
			initSeatingChart.geneticSort(timeout, this.seatingPartners, geneticInfo, (students, score) => {
				this.students = students;
				this.score = score

				console.log("Done with genetic sort");
				this.emit("change");
				//alert("Done sorting! :D");
			},
			(progress, students, score) => {
				this.progress = progress;
				this.students = students;
				this.score = score;
				this.emit("change");
				
			});

			console.log("Done with init sort");
			this.emit("change");
		});
	}

	download() {

		// create and download history.csv
		var fileStr = "";
		var { students, seatingPartners } = this;
		var sl = students.length, spl = seatingPartners.firstSeats.length;
		var index, samePartner = false;

		// generate history of everyone who sat next to each other
		for(var i = 0; i+1 < sl; i+=2) {
			if(students[i].name == "Empty Seat" || students[i+1].name == "Empty Seat") {
				continue;
			}

			samePartner = false;
			index = seatingPartners.firstSeats.indexOf(students[i].name);
		
			while(index !== -1) {
				if(seatingPartners.secondSeats[index] == students[i+1].name) {
					seatingPartners.numInstances[index]++;
					samePartner = true;
					console.log("same partner: ", seatingPartners.firstSeats[index], " & ", seatingPartners.secondSeats[index]);
					break;
				}

				index = seatingPartners.firstSeats.indexOf(students[i].name, index + 1);
			}

			if(samePartner)
				continue;

			index = seatingPartners.secondSeats.indexOf(students[i].name);
			while(index !== -1) {
				if(seatingPartners.firstSeats[index] == students[i+1].name) {
					seatingPartners.numInstances[index]++;
					samePartner = true;
					console.log("same partner: ", seatingPartners.firstSeats[index], " & ", seatingPartners.secondSeats[index]);
					break;
				}

				index = seatingPartners.secondSeats.indexOf(students[i].name, index + 1);
			}

			if(samePartner)
				continue;

			fileStr += "\"" + students[i].name + "\",\"" + students[i+1].name + "\",1\n";
		}

		for(var i = 0; i < spl; i++) {
			fileStr += "\"" + seatingPartners.firstSeats[i] + "\",\"" + seatingPartners.secondSeats[i] + "\"," + seatingPartners.numInstances[i] + "\n";
		}

		// create break signal in csv file
		fileStr += "_END_SEATING_PAIRS_\n";

		// generate history of those who sat in the 4th column
		for(var i = 2; i < sl; i+=6) {
			if(students[i].fourthCol !== "true")
				fileStr += "\"" + students[i].name + "\"\n";
		}

		for(var i = 0; i < sl; i++) {
			if(students[i].fourthCol == "true") {
				fileStr += "\"" + students[i].name + "\"\n";
			}
		}

		if(!fileStr.match(/^data:text\/csv/i)) {
			fileStr = "data:text/csv;charset=utf-8," + fileStr;
		}
		fileStr = encodeURI(fileStr);

		var currentDate = new Date();

		var link = document.createElement("a");
		link.setAttribute('href', fileStr);
		link.setAttribute('download', 'history' + currentDate.getFullYear() + "_" + currentDate.getMonth() + "_" + currentDate.getDate() + "_" + currentDate.getHours() + "_" + currentDate.getMinutes() + '.csv');
		link.click();

	}

	exportXLS(nickNamesOnly) {
		var { students } = this;
		var letters = ["F", "E", "D", "C", "B", "A"];
		var StudentsXLS = "\tCol 1\tCol 2\tCol 3\tCol 4\tCol 5\tCol 6";
		var sl = students.length;
		var studentsRev = students.slice(0).reverse();
		var firstName = "";
		var lastName = "";
		var parenPos = -1;
		var commaPos = -1;
		for(var i = 0; i < sl; i++) {
			if(i % 6 == 0) {
				StudentsXLS += "\r\n"+letters[Math.round(i/6)];
			}

			if(nickNamesOnly) {
				parenPos = studentsRev[i].name.indexOf("(");
				commaPos = studentsRev[i].name.indexOf(",");
				if(parenPos !== -1) {
					firstName = studentsRev[i].name.substring(parenPos + 1, studentsRev[i].name.length - 1);
					lastName = studentsRev[i].name.substring(0, commaPos);
				} else {
					firstName = studentsRev[i].name.substring(commaPos + 1, studentsRev[i].name.length);
					lastName = studentsRev[i].name.substring(0, commaPos);
				}
			} else {
				commaPos = studentsRev[i].name.indexOf(",");
				firstName = studentsRev[i].name.substring(commaPos + 1, studentsRev[i].name.length);
				lastName = studentsRev[i].name.substring(0, commaPos);
			}

			StudentsXLS += "\t"+firstName + " " + lastName;
		}
		if(!StudentsXLS.match(/^data:text\/vnd.ms-excel/i)) {
			StudentsXLS = "data:application/vnd.ms-excel;charset=utf-8," + StudentsXLS;
		}
		StudentsXLS = encodeURI(StudentsXLS);

		var currentDate = new Date();
		var link = document.createElement("a");
		link.setAttribute('href', StudentsXLS);
		link.setAttribute('download', 'seatingChart' + currentDate.getFullYear() + "_" + currentDate.getMonth() + "_" + currentDate.getDate() + "_" + currentDate.getHours() + "_" + currentDate.getMinutes() + '.xls');
		link.click();
	}

	// returns a list of all students
	getAll() {
		return this.students;
	}

	getProgress() {
		return this.progress;
	}

	getScore() {
		return this.score;
	}

	// handles all actions from the dispatcher
	handleActions(action) {
		switch(action.type) {
			case "CREATE_STUDENT": {
				this.createStudent(action.student);
				break;
			}
			case "LOAD_STUDENTS": {
				this.loadStudents(action.students, action.seatingPartners);
				break;
			}
			case "SORT_STUDENTS": {
				this.sortStudents(action.timeout, action.geneticInfo);
				break;
			}
			case "DOWNLOAD": {
				this.download();
				break;
			}
			case "EXPORT_XLS": {
				this.exportXLS(action.nickNamesOnly);
				break;
			}
		}
	}
}

const studentStore = new StudentStore;
dispatcher.register(studentStore.handleActions.bind(studentStore));
window.dispatcher = dispatcher;
export default studentStore;

