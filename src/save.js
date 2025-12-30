import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { semesters = [] } = attributes;
	const blockProps = useBlockProps.save({
		'data-semesters': JSON.stringify(semesters),
	});

	return (
		<div {...blockProps}>
			<div className="cgpa-output">
				{__('CGPA will be calculated on the frontend…', 'dream-cgpa-calculator')}
			</div>
		</div>
	);
}
