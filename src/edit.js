import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

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

export default function Edit({ attributes, setAttributes }) {
	const { semesters = [] } = attributes;

	// Initialize with one semester if empty
	useEffect(() => {
		if (semesters.length === 0) {
			setAttributes({ semesters: [{ name: __('Semester 1', 'dream-cgpa-calculator'), courses: [] }] });
		}
	}, []);

	const blockProps = useBlockProps();

	const addSemester = () => {
		const newSem = {
			name: sprintf(__('Semester %d', 'dream-cgpa-calculator'), semesters.length + 1),
			courses: []
		};

		setAttributes({
			semesters: [...semesters, newSem]
		});
	};

	const deleteSemester = (semIndex) => {
		const updated = semesters.filter((_, index) => index !== semIndex);
		setAttributes({ semesters: updated });
	};

	const updateSemesterName = (semIndex, name) => {
		const updated = [...semesters];
		updated[semIndex].name = name;
		setAttributes({ semesters: updated });
	};

	const addCourse = (semIndex) => {
		const updated = [...semesters];
		updated[semIndex].courses.push({
			code: "",
			title: "",
			credit: "",
			grade: ""
		});

		setAttributes({ semesters: updated });
	};

	const deleteCourse = (semIndex, courseIndex) => {
		const updated = [...semesters];
		updated[semIndex].courses = updated[semIndex].courses.filter((_, index) => index !== courseIndex);
		setAttributes({ semesters: updated });
	};

	const updateCourse = (semIndex, courseIndex, field, value) => {
		const updated = [...semesters];
		updated[semIndex].courses[courseIndex][field] = value;
		setAttributes({ semesters: updated });
	};

	// Calculate overall CGPA
	let totalCredits = 0;
	let totalPoints = 0;
	semesters.forEach((sem) => {
		const result = calcGPA(sem.courses || []);
		totalCredits += result.credits;
		totalPoints += result.gpa * result.credits;
	});
	const finalCGPA = totalCredits === 0 ? 0 : (totalPoints / totalCredits);

	return (
		<div {...blockProps} className="cgpa-editor">
			{semesters.map((sem, sIndex) => {
				const result = calcGPA(sem.courses || []);
				const semCredits = result.credits;
				const semGPA = result.gpa;

				return (
					<div key={sIndex} className="semester-box">
						<div className="semester-header">
							<input
								type="text"
								className="semester-name-input"
								value={sem.name}
								onChange={(e) => updateSemesterName(sIndex, e.target.value)}
								placeholder={__('Semester Name', 'dream-cgpa-calculator')}
							/>
							<button
								type="button"
								className="delete-semester-btn"
								onClick={() => deleteSemester(sIndex)}
								title={__('Delete Semester', 'dream-cgpa-calculator')}
							>
								×
							</button>
						</div>

						<table className="cgpa-table">
							<thead>
								<tr>
									<th>{__('Course Code', 'dream-cgpa-calculator')}</th>
									<th>{__('Course Title', 'dream-cgpa-calculator')}</th>
									<th>{__('Credit', 'dream-cgpa-calculator')}</th>
									<th>{__('Grade', 'dream-cgpa-calculator')}</th>
									<th>{__('Grade Point', 'dream-cgpa-calculator')}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{sem.courses.map((course, cIndex) => {
									const gp = gradeToPoint(course.grade);
									return (
										<tr key={cIndex}>
											<td>
												<input
													type="text"
													value={course.code}
													onChange={(e) =>
														updateCourse(sIndex, cIndex, "code", e.target.value)
													}
													placeholder={__('Code', 'dream-cgpa-calculator')}
													className="table-input"
												/>
											</td>
											<td>
												<input
													type="text"
													value={course.title}
													onChange={(e) =>
														updateCourse(sIndex, cIndex, "title", e.target.value)
													}
													placeholder={__('Course Title', 'dream-cgpa-calculator')}
													className="table-input"
												/>
											</td>
											<td>
												<input
													type="number"
													value={course.credit}
													onChange={(e) =>
														updateCourse(sIndex, cIndex, "credit", e.target.value)
													}
													placeholder="0"
													className="table-input"
													min="0"
													step="0.5"
												/>
											</td>
											<td>
												<select
													value={course.grade}
													onChange={(e) =>
														updateCourse(sIndex, cIndex, "grade", e.target.value)
													}
													className="table-select"
												>
													<option value="">-</option>
													<option>A+</option>
													<option>A</option>
													<option>A-</option>
													<option>B+</option>
													<option>B</option>
													<option>B-</option>
													<option>C+</option>
													<option>C</option>
													<option>D</option>
													<option>F</option>
												</select>
											</td>
											<td className="grade-point-cell">
												{gp > 0 ? gp.toFixed(2) : '-'}
											</td>
											<td>
												<button
													type="button"
													className="delete-course-btn"
													onClick={() => deleteCourse(sIndex, cIndex)}
													title={__('Delete Course', 'dream-cgpa-calculator')}
												>
													×
												</button>
											</td>
										</tr>
									);
								})}
								{sem.courses.length === 0 && (
									<tr>
										<td colSpan="6" className="empty-row">
											{__('No courses added yet. Click "Add Course" to add one.', 'dream-cgpa-calculator')}
										</td>
									</tr>
								)}
							</tbody>
						</table>

						<div className="semester-actions">
							<button type="button" onClick={() => addCourse(sIndex)} className="add-course-btn">
								{__('+ Add Course', 'dream-cgpa-calculator')}
							</button>
							<div className="semester-gpa-display">
								<strong>{__('Semester Credits:', 'dream-cgpa-calculator')}</strong> {semCredits} &nbsp;&nbsp;
								<strong>{__('Semester GPA:', 'dream-cgpa-calculator')}</strong> {semCredits ? semGPA.toFixed(3) : '0.000'}
							</div>
						</div>
					</div>
				);
			})}

			<div className="overall-summary">
				<button type="button" onClick={addSemester} className="add-semester-btn">
					{__('+ Add Semester', 'dream-cgpa-calculator')}
				</button>
				<div className="final-cgpa-display">
					<strong>{__('Total Earned Credits:', 'dream-cgpa-calculator')}</strong> {totalCredits} &nbsp;&nbsp;
					<strong>{__('Overall CGPA:', 'dream-cgpa-calculator')}</strong> {finalCGPA.toFixed(3)}
				</div>
			</div>
		</div>
	);
}
