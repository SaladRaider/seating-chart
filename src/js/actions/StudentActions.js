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

export function sortStudnets() {
	dispatcher.dispatch({
		type: "SORT_STUDENTS"
	});
}

export function loadStudents(studentTextBlob, testScoreTextBlob, historyBlob) {
	var studentTextLines = studentTextBlob.split("\n");
	var testScoreTextLines = testScoreTextBlob.split("\n");
	
	var students = [];
	var seatingPartners = [];
	var fourthCols = [];

	var sll = studentTextLines.length;
	for(var i = 0; i < sll; i++) {
		var textProps = studentTextLines[i].split(",");
		var textProps2 = testScoreTextLines[i + 1].split(",");
		
		if(textProps[1] != null) {
			var newStudent = new Object;
			newStudent.name = (textProps[0] != null && textProps[1] != null) ? (textProps[0].replace("\"", "") + "," + textProps[1].replace("\"", "")) : "";
			newStudent.gender = (textProps[2] != null) ? textProps[2] : "";
			newStudent.grade = (textProps[3] != null) ? textProps[3] : "";
			newStudent.front = (textProps[4] != null) ? ((textProps[4].indexOf("yes") != -1) ? "true" : "false") : "false";
			newStudent.fourthCol = (textProps[5] != null) ? ((textProps[5].indexOf("yes") != -1) ? "true" : "false") : "false";
			newStudent.testScore = (textProps2[2] != null) ? textProps2[2] : -1;

			students.push(newStudent);
		}
	}



	if(historyBlob.length > 0) {
		var historyTextLines = historyBlob.split("_END_SEATING_PAIRS_");
		seatingPartners = historyTextLines[0].split("\n");
		fourthCols = historyTextLines[1].split("\n").map((fc) => {
			return fc.replace("\"", "").replace("\"", "");//.replace("  ", " ");
		});

		var spl = seatingPartners.length;
		for(var i = 0; i < spl; i++) {
			seatingPartners[i] = seatingPartners[i].split(",").map((sp) => { return sp.trim().replace("\"", ""); });
		}

		var fIndex = 0;
		var sl = students.length;
		for(var i = 0; i < sl; i++) {
			fIndex = fourthCols.indexOf(students[i].name);
			if(fIndex !== -1) {
				students[i].fourthCol = "true";
			}
		}
	}

	dispatcher.dispatch({
		type: "LOAD_STUDENTS",
		students: students,
		seatingPartners: seatingPartners,
		fourthCols: fourthCols
	});
}

export function sortStudents(timeout, geneticInfo) {
	console.log("sorting students with parameters: ", timeout, ", ", geneticInfo);
	dispatcher.dispatch({
		type: "SORT_STUDENTS",
		geneticInfo: geneticInfo,
		timeout: timeout
	});
}


export function download() {
	console.log("downloading...");
	dispatcher.dispatch({
		type: "DOWNLOAD"
	});
}

