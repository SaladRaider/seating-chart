
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
		console.log("Started init sort worker");
	}

	populate(population, numMutations, num) {
		for(var i = 0; i < num; i+=1) {
			population.push(this.createChild(numMutations));
		}
	}

	createChild(numMutations) {
		var newChild = this;
		newChild.mutate(numMutations);
		return newChild;
	}

	mutate(numMutations) {
		var rand1, rand2, temp, sl = this.students.length;
		for(var i = 0; i < numMutations; i++) {
			rand1 = Math.floor(Math.random() * sl);
			rand2 = Math.floor(Math.random() * sl);
			this.swapStudent(rand1, rand2);
		}
	}

	swapStudent(s1, s2) {
		var temp = this.students[s1];
		this.students[s1] = this.students[s2];
		this.students[s2] = temp;
	}

	calculateScore() {
		this.score = Math.floor(Math.random() * 100);
		return this.score;
	}

	getStudents() {
		return this.students;
	}
}