
function initSort(students, cmp) {

	cmp = cmp || comparator;

	// Use heap sort by test scores
	var size = students.length, sl = students.length, halfl=Math.floor(sl / 2), temp = new Object;
	
	buildMaxHeap(students, cmp);
	
	for(var i = sl - 1; i > 0; i-= 1) {
		temp = students[0];
		students[0] = students[i];
		students[i] = temp;
		size -= 1;
		heapify(students, 0, size, cmp);
	}

	// Alternate high and low test scores
	var tempStudents = [];
	for(var i = 0; i < halfl; i+=1) {
		tempStudents.push(students[i]);
		tempStudents.push(students[sl-1-i]);
	}

	// if ood number, add middle student last
	if(sl % 2 == 1) {
		tempStudents.push(students[halfl]);
	}

	students = tempStudents;
	
	self.postMessage({students: students});
}

function heapify(students, index, heapSize, cmp) {
	var left = 2 * index + 1,
	right = 2 * index + 2,
	largest = index;

	if(left < heapSize && cmp(students[left].testScore, students[largest].testScore) > 0)
		largest = left;

	if(right < heapSize && cmp(students[right].testScore, students[largest].testScore) > 0)
		largest = right;

	if(largest !== index) {
		var temp = new Object;
		temp = students[index];
		students[index] = students[largest];
		students[largest] = temp;
		heapify(students, largest, heapSize, cmp);
	}
}

function buildMaxHeap(students, cmp) {
	var sl = students.length;
	var start = Math.floor(sl / 2.0);
	for(var i = start; i >= 0; i -= 1) {
		heapify(students, i, sl, cmp);
	}
	return students;
}

function comparator(a, b) {
	return (  (isNaN(a)) ? -1 : ( (isNaN(b)) ? 1 : (parseInt(a) - parseInt(b)) )  );
}

self.onmessage = function(e) {
	switch(e.data.cmd) {
		case "INIT_SORT": {
			initSort(e.data.students);
			break;
		}
	}
}