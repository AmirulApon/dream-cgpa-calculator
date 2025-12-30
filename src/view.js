const gradeToPoint = (grade) => {
	const map = {
		'A+': 4.0,
		'A': 3.75,
		'A-': 3.5,
		'B+': 3.25,
		'B': 3.0,
		'B-': 2.75,
		'C+': 2.5,
		'C': 2.25,
		'D': 2.0,
		'F': 0.0,
	};
	return map[grade] || 0;
};

const calcGPA = (courses) => {
	let credits = 0;
	let points = 0;
	courses.forEach((c) => {
		const cr = parseFloat(c.credit);
		const gp = gradeToPoint(c.grade);
		if (!isNaN(cr)) {
			credits += cr;
			points += cr * gp;
		}
	});
	return {
		credits,
		gpa: credits === 0 ? 0 : points / credits,
	};
};

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll(
		'.wp-block-dream-cgpa-calculator[data-semesters]'
	);

	blocks.forEach((block) => {
		let semesters;
		try {
			semesters = JSON.parse(block.dataset.semesters || '[]');
		} catch (e) {
			semesters = [];
		}

		let totalCredits = 0;
		let totalPoints = 0;

		let html = '';

		semesters.forEach((sem, index) => {
			const result = calcGPA(sem.courses || []);
			const semCredits = result.credits;
			const semGPA = result.gpa;

			totalCredits += semCredits;
			totalPoints += semGPA * semCredits;

			html += `<h3 class="cgpa-semester-title">${
				sem.name || 'Semester ' + (index + 1)
			}</h3>`;
			html += `
				<table class="cgpa-table">
					<thead>
						<tr>
							<th>Course Code</th>
							<th>Course Title</th>
							<th>Credit</th>
							<th>Grade</th>
							<th>Grade Point</th>
						</tr>
					</thead>
					<tbody>
			`;

			(sem.courses || []).forEach((c) => {
				const cr = parseFloat(c.credit) || 0;
				const gp = gradeToPoint(c.grade);
				html += `
					<tr>
						<td data-label="Course Code">${c.code || '-'}</td>
						<td data-label="Course Title">${c.title || '-'}</td>
						<td data-label="Credit">${cr || 0}</td>
						<td data-label="Grade">${c.grade || '-'}</td>
						<td data-label="Grade Point">${gp.toFixed(2)}</td>
					</tr>
				`;
			});

			html += `
					</tbody>
				</table>
				<p class="cgpa-semester-summary">
					<strong>Semester Credits:</strong> ${semCredits} &nbsp;&nbsp;
					<strong>Semester GPA:</strong> ${semCredits ? semGPA.toFixed(3) : '0.000'}
				</p>
			`;
		});

		const cgpa =
			totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(3);

		html += `
			<hr />
			<p class="cgpa-overall-summary">
				<strong>Total Earned Credits:</strong> ${totalCredits} &nbsp;&nbsp;
				<strong>Overall CGPA:</strong> ${cgpa}
			</p>
		`;

		const output = block.querySelector('.cgpa-output');
		if (output) {
			output.innerHTML = html;
		}
	});
});
