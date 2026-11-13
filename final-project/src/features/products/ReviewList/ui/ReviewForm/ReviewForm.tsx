import { useActionState, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../../../shared/ui/Button';
import { Rating } from '../../../../../shared/ui/Rating';
import { useCreateReviewMutation } from '../../../api/productsApi';
import styles from './ReviewForm.module.css';

export function ReviewForm({ productId }: { productId: string }) {
	const [text, setText] = useState('');
	const [rating, setRating] = useState(0);
	const [createReview] = useCreateReviewMutation();
	const [error, submit, pending] = useActionState(async () => {
		const trimmedText = text.trim();
		if (!trimmedText || rating === 0) return 'Укажите оценку и напишите отзыв.';
		try {
			await createReview({
				productId,
				text: trimmedText,
				rating,
			}).unwrap();
			setText('');
			setRating(0);
			toast.success('Отзыв опубликован');
			return null;
		} catch {
			return 'Не удалось отправить отзыв. Повторите попытку.';
		}
	}, null);

	return (
		<form action={submit} className={styles.form}>
			<fieldset disabled={pending}>
				<legend>Оценка товара</legend>
				<Rating isEdit rating={rating} onChange={setRating} />
				<textarea
					aria-label='Текст отзыва'
					className={styles.input + ' ' + styles.textarea}
					value={text}
					placeholder='Напишите текст отзыва'
					onChange={(event) => setText(event.target.value)}
					required
				/>
				<Button
					type='submit'
					className={styles.form__btn + ' ' + styles.pramary}>
					{pending ? 'Отправляем…' : 'Отправить отзыв'}
				</Button>
			</fieldset>
			{error && <p role='alert'>{error}</p>}
		</form>
	);
}
