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
						The algorithm used in this generator is using mutation and selection only, without crossover.
						Steps to generate a seating chart:
						<ol>
							<li><p>Load a student roster .csv file and test score .csv file. You may also load a "history[...].csv" file if you have generated one from a previous seating chart. Make sure that the order of the test scores in the test scores file corresponds to the same order of students in the student roster.</p></li>
							<li>
								<p>Edit the genetic algorithm factors. The default values should be sufficient. However, if you can try to change them to optimize your results. Here are a description of some: </p>
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
							<li><p>Press "Sort Students" and wait until the timeout time is over.</p></li>
							<li><p>Scroll down to see the generated seating chart.</p></li>
							<li><p>Press "Export History" to export a "history[...].csv file.</p></li>
							<li><p>Press "Export Table" to export the seating chart .xls file.</p></li>
						</ol>
						The seating chart lists the students name, their gender, and their test score. Those who wish to sit in front are bolded. Those who have already sat in the 4<sup>th</sup> column are highlighted in red. The exported .xls seating chart will <b>only</b> have the names of the students with no extra information.
					</p>
				</div>
			</div>
		);
	}
}