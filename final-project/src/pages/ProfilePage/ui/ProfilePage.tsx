import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '../../../features/auth/api/authApi';
import { Button } from '../../../shared/ui/Button';
import { ButtonBack } from '../../../shared/ui/ButtonBack';
import { Input } from '../../../shared/ui/Input';
import { Spinner } from '../../../shared/ui/Spinner';
import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import styles from './ProfilePage.module.css';

export const ProfilePage = WithProtection(function ProfilePage() {
	const { data: profile, isLoading, refetch } = useGetProfileQuery();
	const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
	const [error, setError] = useState('');

	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const fields = new FormData(form);
		const password = fields.get('password');
		const body = password
			? { password: String(password) }
			: {
					name: String(fields.get('name')).trim(),
					email: String(fields.get('email')).trim(),
					about: String(fields.get('about')).trim(),
					avatarPath: String(fields.get('avatarPath')).trim(),
			  };
		setError('');
		try {
			await updateProfile(body).unwrap();
			if (password) form.reset();
			toast.success('Данные профиля сохранены');
		} catch {
			setError('Не удалось сохранить данные профиля.');
		}
	}

	if (isLoading) return <Spinner />;
	if (!profile)
		return (
			<>
				<p role='alert'>Не удалось загрузить профиль</p>
				<Button onClick={refetch}>Повторить</Button>
			</>
		);

	return (
		<section className='container'>
			<ButtonBack />
			<h1 className={styles.form__title}>Мои данные</h1>
			<form className={styles.form} onSubmit={save}>
				<div className={styles.form__row}>
					<label className={styles.form__label}>
						Имя
						<Input
							className={styles.input}
							name='name'
							defaultValue={profile.name}
							required
						/>
					</label>
					<label className={styles.form__label}>
						О себе
						<Input
							className={styles.input}
							name='about'
							defaultValue={profile.about}
						/>
					</label>
				</div>
				<div className={styles.form__row}>
					<label className={styles.form__label}>
						Ссылка на аватар
						<Input
							className={styles.input}
							name='avatarPath'
							type='url'
							defaultValue={profile.avatarPath}
						/>
					</label>
					<label className={styles.form__label}>
						Email
						<Input
							className={styles.input}
							name='email'
							type='email'
							defaultValue={profile.email}
							required
						/>
					</label>
				</div>
				<Button type='submit' className={styles.form__btn} disabled={saving}>
					Сохранить профиль
				</Button>
			</form>
			<h2 className={styles.form__title}>Изменить пароль</h2>
			<form className={styles.form} onSubmit={save}>
				<label>
					Новый пароль
					<Input
						className={styles.input}
						name='password'
						type='password'
						minLength={6}
						required
					/>
				</label>
				<Button type='submit' className={styles.form__btn} disabled={saving}>
					Сохранить пароль
				</Button>
			</form>
			{error && <p role='alert'>{error}</p>}
		</section>
	);
});
