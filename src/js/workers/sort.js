
// INIT SORT

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


// GENETIC SORT

function geneticSort(students, geneticInfo, timeout) {
	// create new population from seed
	var population = [];
	var highestScore = 0;
	var mostFit = 0;
	var score = 0;
	var startTime = Date.now();
	var seed = students;

	// loop genetic simulation until timeout
	while(Date.now() - startTime < timeout) {

		// initialize population
		population = undefined;
		mostFit = 0;

		population = populate(seed, geneticInfo);
		for(var i = 0; i < geneticInfo.populationSize; i++) {
			score = calculateScore(population[i], geneticInfo);
			if(score > highestScore) {
				highestScore = score;
				mostFit = i;
				console.log("highestScore: " + score);
			}
		}

		seed = population[mostFit];
	}

	self.postMessage({students: seed});
}

function populate(students, geneticInfo) {
	var population = [];
	population.push(students);
	for(var i = 0; i < geneticInfo.populationSize - 1; i+=1) {
		population.push(createChild(students, geneticInfo));
	}

	return population;
}

function createChild(students, geneticInfo) {
	var newChild = students.slice(0);
	mutate(newChild, geneticInfo);
	return newChild;
}

function mutate(students, geneticInfo) {
	var rand1, rand2, temp, sl = students.length;
	for(var i = 0; i < geneticInfo.numMutations; i++) {
		rand1 = Math.floor(Math.random() * sl);
		rand2 = Math.floor(Math.random() * sl);
		swapStudent(students, rand1, rand2);
	}
}

function swapStudent(students, s1, s2) {
	var temp = students[s1];
	students[s1] = students[s2];
	students[s2] = temp;
}

function calculateScore(students, geneticInfo) {

	var sl = students.length;
	if(students[0] == undefined)
		return 0;

	var score = 0;

	/*
	1. request by student to sit in front
	2. high test scores with low test scores
	3. boy/girl ratio in seating group
	4. sitting with new people
	5. low test scores in front of class  {lower priority since high test will sit with low test}
	6. students don’t sit in column 4 twice
	*/
	
	const weights = geneticInfo.weights; 

	// calculate rule 1. score
	for(var i = 0; i < 6 && i < sl; i+=1) {
		if(students[i].front == "true") {
			score += weights[0];
		}
	}
	for(var i = 6; i < 12 && i < sl; i+=1) {
		if(students[i].front == "true") {
			score += weights[0] / 2;
		}
	}

	// calculate rule 2. score (high score with low score)
	
	// find min and max scores
	var min = (isNaN(students[0].testScore)) ? 0 : parseInt(students[0].testScore);
	var max = min;
	var cmpScore = 0;

	for(var i = 1; i < sl; i+=1) {
		if(isNaN(students[i].testScore))
			cmpScore = 0;
		else
			cmpScore = parseInt(students[i].testScore);

		if(cmpScore < min) {
			min = cmpScore;
		} else if (cmpScore > max) {
			max = cmpScore;
		}
	}

	// check neighbors
	var maxScoreDiff = max - min;
	var cmpScore2 = 0;
	for(var i = 0; i + 1 < sl; i+=2) {
		if(isNaN(students[i].testScore))
			cmpScore = 0;
		else
			cmpScore = parseInt(students[i].testScore);

		if(isNaN(students[i+1].testScore))
			cmpScore2 = 0;
		else
			cmpScore2 = parseInt(students[i+1].testScore);

		score += Math.pow(Math.abs(cmpScore - cmpScore2) / maxScoreDiff, 2) * weights[1];
	}

	// calculate rule 3. score (boy/girl ratio()
	for(var i = 0; i + 1 < sl; i+=2) {
		if(students[i].gender != students[i+1].gender) {
			score += weights[2];
		}
	}

	// calculate rule 5. score (low scores sit in front)
	var scoreBottomPerc;
	for(var j = 0; j * 6 < sl; j+=1) {
		for(var i = j*6; i < (j+1)*6 && i < sl; i+=1) {
			if(isNaN(students[i].testScore))
				cmpScore = 0;
			else
				cmpScore = parseInt(students[i].testScore);

			scoreBottomPerc = (maxScoreDiff - (cmpScore - min)) / maxScoreDiff;

			// only score the bottom 40%
			if(scoreBottomPerc > 0.60) {
				if(j < 3)
					score += (Math.pow(scoreBottomPerc, 2) * weights[4] / (j+1));
				else
					score -= (Math.pow(scoreBottomPerc, 2) * weights[4] / (6 - j));
			}
		}
	}

	return score;
}

self.onmessage = function(e) {
	switch(e.data.cmd) {
		case "INIT_SORT": {
			initSort(e.data.students);
			break;
		}
		case "GENETIC_SORT": {
			geneticSort(e.data.students, e.data.geneticInfo, e.data.timeout);
			break;
		}
	}
}


