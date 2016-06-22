
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

	populate(students, numMutations, num) {
		var population = [];
		population.push(students);
		for(var i = 0; i < num - 1; i+=1) {
			population.push(this.createChild(students, numMutations));
		}

		return population;
	}

	createChild(students, numMutations) {
		var newChild = students.slice(0);
		this.mutate(newChild, numMutations);
		return newChild;
	}

	mutate(students, numMutations) {
		var rand1, rand2, temp, sl = students.length;
		for(var i = 0; i < numMutations; i++) {
			rand1 = Math.floor(Math.random() * sl);
			rand2 = Math.floor(Math.random() * sl);
			this.swapStudent(students, rand1, rand2);
		}
	}

	swapStudent(students, s1, s2) {
		var temp = students[s1];
		students[s1] = students[s2];
		students[s2] = temp;
	}

	calculateScore(students) {
		var sl = students.length;

		var score = 0; // Math.floor(Math.random() * 100);

		/*
		1. request by student to sit in front
		2. high test scores with low test scores
		3. boy/girl ratio in seating group
		4. sitting with new people
		5. low test scores in front of class  {lower priority since high test will sit with low test}
		6. students don’t sit in column 4 twice
		*/
		
		const weights = [
			10,		// 0. request by student to sit in front
			8,		// 1. high test scores with low test scores
			6,		// 2. boy/girl ratio in seating group
			4,		// 3. sitting with new people
			2,		// 4. low test scores in front of class  {lower priority since high test will sit with low test}
			1		// 5. students don’t sit in column 4 twice
		];

		// calculate rule 1. score
		for(var i = 0; i < 6 && i < sl; i+=1) {
			if(students[i].front == "true") {
				score += weights[0];
			}
		}

		return score;
	}

	getStudents() {
		return this.students;
	}
}