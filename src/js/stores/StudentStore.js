import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class StudentStore extends EventEmitter {
	constructor() {
		super();
		this.students = [
			{
				id: 1,
				name: "Peter",
				gender: "M",
				grade: 12,
				front: "false",
				fourthCol: "false",
				testScore: 75
			},
			{
				id: 2,
				name: "Hannah",
				gender: "F",
				grade: 11,
				front: "false",
				fourthCol: "true",
				testScore: 103
			}
		];

		
	}

	// creates a new student and emmits a change event
	createStudent({ name, gender, grade, front, fourthCol, testScore }) {
		this.makeStudent({ name, gender, grade, front, fourthCol, testScore })
		this.emit("change");
	}

	// loads new students and emits a hange event
	loadStudents(students) {
		for(var i = 0; i < students.length; i++) {
			this.makeStudent(students[i]);
		}
		this.emit("change");
	}

	// makes a new student
	makeStudent({ name, gender, grade, front, fourthCol, testScore }) {
		const id = Date.now() + this.students.length;
		this.students.push({
			id,
			name,
			gender,
			grade,
			front,
			fourthCol,
			testScore
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
			}
			case "LOAD_STUDENTS": {
				this.loadStudents(action.students);
			}
		}
	}
}

const studentStore = new StudentStore;
dispatcher.register(studentStore.handleActions.bind(studentStore));
window.dispatcher = dispatcher;
window.bobAction = {type: "CREATE_STUDENT", student: {name: "bob", gender: "M", grade: 11, front: "false", fourthCol: "false", testScore: 123}};
export default studentStore;

