
// INIT SORT

function initSort(students, cmp) {

	cmp = cmp || comparator;

	// remove empty seats
	var tempArray = students.splice(0);
	students = [];

	var tal = tempArray.length;
	for(var i = 0; i < tal; i++) {
		if(tempArray[i].name !== "Empty Seat") {
			students.push(tempArray[i]);
		} else {
			console.log("removed empty seat");
		}
	}

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
	var oldScore = 0;
	var now = Date.now();
	var startTime = now;
	var seed = [];
	var updateInterval = 100;
	var startInterval = now;
	var noBetterSolution = 0;
	var dangerOfConvergence = getDangerOfConvergence(geneticInfo);

	console.log("danger of convergence: ", dangerOfConvergence);

	// convert from s to ms
	timeout *= 1000;

	var excludedSeats = [
		[28],
		[28, 26],
		[28, 26, 25],
		[28, 29, 34, 35]
	];

	const emptySeats = Math.min(36 - students.length, 4);

	var j = 0;
	for(var i = 0; i < 36; i++) {
		if(emptySeats > 0)
		if(excludedSeats[emptySeats - 1].indexOf(i) !== -1) {
			seed.push({
				id: Math.random() * 100,
				name: "Empty Seat", 
				gender: "", 
				grade: "",
				front: "",
				fourthCol: "",
				testScore: geneticInfo.testScores.median
			});
			continue;
		}

		seed.push(students[j]);
		j++;
	}

	console.log("seed",seed);

	// loop genetic simulation until timeout
	while(now - startTime < timeout) {
		// initialize population
		population = undefined;
		mostFit = 0;
		oldScore = highestScore;

		population = populate(seed, geneticInfo);
		for(var i = 0; i < geneticInfo.populationSize; i++) {
			score = calculateScore(population[i], geneticInfo);
			if(score > highestScore) {
				highestScore = score;
				mostFit = i;
				console.log("highestScore: " + score);
			}
		}

		if(oldScore == highestScore) {
			noBetterSolution++;

			if(noBetterSolution > dangerOfConvergence) {
				geneticInfo.numMutations++;
				geneticInfo.populationSize += 10;
				dangerOfConvergence = getDangerOfConvergence(geneticInfo);
				console.log("adaptive change: populationSize: ", 
					geneticInfo.populationSize, ", numMutations: ", 
					geneticInfo.numMutations, ", dangerOfConvergence: ",
					dangerOfConvergence);
			}
		} else {
			noBetterSolution = 0;
		}

		seed = population[mostFit];

		if(now > startInterval + updateInterval) {
			self.postMessage({
				type: "UPDATE_PROGRESS", 
				students: seed, 
				progress: (Math.round((Date.now() - startTime) / timeout * 10000) / 100) + "%", 
				score: highestScore
			});
			startInterval = now;
		}

		now = Date.now();
	}

	self.postMessage({type: "UPDATE_PROGRESS", progress: "100%", score: highestScore});
	self.postMessage({type: "FINISHED", students: seed, score: highestScore});
}

function getDangerOfConvergence(geneticInfo) {
	// (36*35) / populationSize)^numMutations
	return Math.pow(36*35 / geneticInfo.populationSize, geneticInfo.numMutations);
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
	if(students[s1].name == "Empty Seat" || students[s2].name == "Empty Seat")
		return;

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
	for(var j = 0; j < 3; j++) {
		for(var i = j * 6; i < (j+1)*6 && i < sl; i+=1) {
			if(students[i].front == "true") {
				score += weights[0] / (1 + (j / 1000));
			}
		}
	}

	// calculate rule 2. score (high score with low score)
	// check neighbors
	var maxScoreDiff = geneticInfo.testScores.max - geneticInfo.testScores.min;
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

			scoreBottomPerc = (maxScoreDiff - (cmpScore - geneticInfo.testScores.min)) / maxScoreDiff;

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

var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
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


