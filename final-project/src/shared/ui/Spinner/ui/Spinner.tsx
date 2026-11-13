import classNames from 'classnames';
import s from './Spinner.module.css';

export const Spinner = () => {
	return (
		<div
			className={classNames(s['wrapper'])}
			role='status'
			aria-label='Загрузка'>
			<div className={classNames(s['loader'])}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};
