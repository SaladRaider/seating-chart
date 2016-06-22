
export default class SeatingChart {
	constructor() {
		this.students = [];
		this.score = 0;
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
		console.log("Init sort worker finished");
	}

	geneticSort(timeout, callBack) {
		if(typeof(Worker) == undefined) {
			console.log("Eror: Worker threads not supported");
			return;
		}

		var worker = new Worker("./js/workers/sort.js");

		worker.onmessage = function(e) {
			this.students = e.data.students;
			console.log("Genetic sort worker finished.");
			callBack(this.students.splice(0));
			worker.terminate();
			worker = undefined;
		};

		worker.onerror = function(e) {
			console.log('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
			worker.terminate();
			worker = undefined;
		};

		// start worker
		worker.postMessage({cmd: "GENETIC_SORT", students: this.students.splice(0), timeout: timeout});
		console.log("Started genetic sort worker");
	}

	getStudents() {
		return this.students;
	}
}