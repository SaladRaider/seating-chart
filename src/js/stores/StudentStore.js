import { EventEmitter } from "events";
import SeatingChart from "../classes/SeatingChart.js";

import dispatcher from "../dispatcher.js";

class StudentStore extends EventEmitter {
	constructor() {
		super();
		this.students = [];		
	}

	// creates a new student and emmits a change event
	createStudent({ name, gender, grade, front, fourthCol, testScore }) {
		this.makeStudent({ name, gender, grade, front, fourthCol, testScore })
		this.emit("change");
	}

	// loads new students and emits a hange event
	loadStudents(students) {
		this.students = [];
		var sl = students.length;
		for(var i = 0; i < sl; i++) {
			this.makeStudent(students[i]);
		}
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
	sortStudents(timeout) {
		var initSeatingChart = new SeatingChart;
		initSeatingChart.setStudents(this.students);
		initSeatingChart.initSort((students) => {
			this.students = students;
			console.log("Done sorting");
			this.emit("change");
		});
	}

	// returns a list of all students
	getAll() {
		return this.students;
	}

	// handles all actions from the dispatcher
	handleActions(action) {
		switch(action.type) {
			case "CREATE_STUDENT": {
				this.createStudent(action.student);
				break;
			}
			case "LOAD_STUDENTS": {
				this.loadStudents(action.students);
				break;
			}
			case "SORT_STUDENTS": {
				this.sortStudents(action.timeout);
				break;
			}
		}
	}
}

const studentStore = new StudentStore;
dispatcher.register(studentStore.handleActions.bind(studentStore));
window.dispatcher = dispatcher;
export default studentStore;

