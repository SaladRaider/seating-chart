
export default class SeatingChart {
	constructor() {
		this.students = [];
	}

	// Set the student values
	setStudents(students) {
		this.students = students;
	}

	// Do an initial sort
	initSort(callBack) {

		if(typeof(Worker) == undefined) {
			console.log("Eror: Worker threads not supported");
			return;
		}

		var worker = new Worker("./js/workers/sort.js");

		worker.onmessage = function(e) {
			this.students = e.data.students;
			console.log("Finished init sort.");
			callBack(this.students);
			worker.terminate();
			worker = undefined;
		};

		worker.onerror = function(e) {
			console.log('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
			worker.terminate();
			worker = undefined;
		};

		// start worker
		worker.postMessage({cmd: "INIT_SORT", students: this.students});
		console.log("Started init sort worker");
	}

	getStudents() {
		return this.students;
	}
}