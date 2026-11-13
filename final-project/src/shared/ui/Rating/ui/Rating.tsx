import Star from '../../../assets/icons/star.svg?react';
import { Button } from '../../Button';

type RatingProps = {
	rating?: number;
	isEdit?: boolean;
	onChange?: (rating: number) => void;
};

export const Rating = ({
	rating = 0,
	isEdit = false,
	onChange,
}: RatingProps) => (
	<div aria-label={isEdit ? 'Выбор оценки' : `Оценка ${rating} из 5`}>
		{[1, 2, 3, 4, 5].map((value) => {
			const star = (
				<Star aria-hidden='true' fill={value <= rating ? 'gold' : 'gray'} />
			);
			return isEdit ? (
				<Button
					key={value}
					aria-label={`Оценка ${value} из 5`}
					aria-pressed={value === rating}
					style={{ background: 'none', border: 0, cursor: 'pointer' }}
					onClick={() => onChange?.(value)}>
					{star}
				</Button>
			) : (
				<span key={value}>{star}</span>
			);
		})}
	</div>
);
