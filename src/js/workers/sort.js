
function initSort(students) {

	// Use heap sort by test scores
	var size = students.length, sl = students.length, temp = new Object;
	buildMaxHeap(students);
	for(var i = sl - 1; i > 0; i-= 1) {
		copyStudentValues(temp, students[0]);
		copyStudentValues(students[0], students[i]);
		copyStudentValues(students[i], temp);
		size -= 1;
		heapify(students, 0, size);
	}
	
	self.postMessage({students: students});
}

function heapify(students, index, heapSize) {
	var left = 2 * index + 1,
	right = 2 * index + 1,
	largest = index;

	if(left < heapSize && students[left].testScore > students[largest].testScore)
		largest = left;

	if(right < heapSize && students[right].testScore > students[largest].testScore)
		largest = right;

	if(largest !== index) {
		var temp = new Object;
		copyStudentValues(temp, students[largest]);
		copyStudentValues(students[largest], students[index]);
		copyStudentValues(students[index], temp);
		heapify(students, largest, heapSize);
	}
}

function buildMaxHeap(students) {
	var start = Math.floor(students.length / 2);
	var sl = students.length;
	for(var i = start; i >= 0; i -= 1) {
		heapify(students, i, sl);
	}
	return students;
}

function copyStudentValues(student1, student2) {
	student1.seat = student2.seat;
	student1.name = student2.name;
	student1.gender = student2.gender;
	student1.grade = student2.grade;
	student1.front = student2.front;
	student1.fourthCol = student2.fourthCol;
	student1.testScore = student2.testScore;
}

self.onmessage = function(e) {
	switch(e.data.cmd) {
		case "INIT_SORT": {
			initSort(e.data.students);
			break;
		}
	}
}