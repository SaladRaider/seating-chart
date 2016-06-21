import dispatcher from "../dispatcher.js";

export function createStudent({name, gender, grade, front, fourthCol, testScore}) {
	dispatcher.dispatch({
		type: "CREATE_STUDENT",
		student: {
			name,
			gender,
			grade,
			front,
			fourthCol,
			testScore
		}
	});
}

export function deleteStudent(id) {
	dispatcher.dispatch({
		type: "DELETE_STUDENT",
		id
	});
}

export function loadStudents(textBlob) {
	var textLines = textBlob.split("\n");
	var students = [];

	for(var i = 0; i < textLines.length; i++) {
		var textProps = textLines[i].split(",");
		
		if(textProps[1] != null) {
			var newStudent = new Object;
			newStudent.name = (textProps[0] != null && textProps[1] != null) ? (textProps[0].replace("\"", "") + ", " + textProps[1].replace("\"", "")) : "";
			newStudent.gender = (textProps[2] != null) ? textProps[2] : "";
			newStudent.grade = (textProps[3] != null) ? textProps[3] : "";
			newStudent.front = (textProps[4] != null) ? ((textProps[4] == "yes") ? "true" : "false") : "false";
			newStudent.fourthCol = (textProps[5] != null) ? ((textProps[5] == "yes") ? "true" : "false") : "false";
			newStudent.testScore = (textProps[6] != null) ? textProps[6] : -1;

			students.push(newStudent);
		}
	}

	dispatcher.dispatch({
		type: "LOAD_STUDENTS",
		students
	});
}