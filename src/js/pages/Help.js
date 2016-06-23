import React from "react";

export default class HomePage extends React.Component {
	render() {
		return (
			<div class="row">
				<div class="col-xs-12">
					<h1>Help Page</h1>
					<p>
						This seating chart generator uses a form of a genetic algorithm. If you would like to learn more about genetic algorithms, this is a good read: <a target="_blank" href="https://www.doc.ic.ac.uk/~nd/surprise_96/journal/vol1/hmw/article1.html">https://www.doc.ic.ac.uk/~nd/surprise_96/journal/vol1/hmw/article1.html</a>
						<br /><br />
						The algorithm used in this generator is using mutation and selection only, without crossover. This should result in a parallel, noise-tolerant, hill-climbing result. Keep this in mind when adjusting any variables that affect the algorithm. I might try using crossover later on to see if it produces better results.
						Steps to generate a seating chart:
						<ol>
							<li><p>Load a student roster .csv file and test score .csv file. Make sure that the order of the test scores in the test scores file corresponds to the same order of students in the student roster.</p></li>
							<li>
								<p>Edit the genetic algorithm factors. Here are a description of some: </p>
								<p>Genetic Algorithm Independent Variables:</p>
								<ul>
									<li><p>Population Size: This is the fixed populatoin size for all the generated seating charts.</p></li>
									<li><p>Mutations Per Child: This is the number of mutations that are inflicted on the new children of the "fittest" parents.</p></li>
									<li><p>Timeout: This is the ammount of time the algorithm will run. The longer this is set, the more accurate the seating chart will be.</p></li>
								</ul>
							</li>
							<li>
								<p>Edit the genetic weights. The higher the weight, the more that factor will be prioritized.</p>
							</li>
							<li><p>Press "Sort Students" and wait untill the timeout time is over. You will be notified once the time is up.</p></li>
							<li><p>Scroll down to see the generated seating chart.</p></li>
						</ol>
						Right now, the seating chart lists the students name, their gender, whether or not they requested to be in front, and their test score. The graphical representation of the seating chart right now is just temporary, and will be imporved later on.
					</p>
				</div>
			</div>
		);
	}
}