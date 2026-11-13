import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import styles from './Modal.module.css';

type ModalProps = {
	title: string;
	children: ReactNode;
	onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
	const titleId = useId();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const backdropPress = useRef(false);

	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const trigger = document.activeElement;
		dialog.showModal();
		closeRef.current?.focus();
		return () => {
			dialog.close();
			if (trigger instanceof HTMLElement && trigger.isConnected)
				trigger.focus();
		};
	}, []);

	const root = document.getElementById('modal-root');
	if (!root) throw new Error('Отсутствует #modal-root');

	// Escape and the close button provide the keyboard equivalents for backdrop dismissal.
	/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Native dialog backdrop */
	return createPortal(
		<dialog
			ref={dialogRef}
			className={styles.overlay}
			aria-labelledby={titleId}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onPointerDown={(event) => {
				backdropPress.current = event.target === event.currentTarget;
			}}
			onPointerUp={(event) => {
				if (event.target !== event.currentTarget) backdropPress.current = false;
			}}
			onPointerCancel={() => {
				backdropPress.current = false;
			}}
			onClick={(event) => {
				if (backdropPress.current && event.target === event.currentTarget)
					onClose();
				backdropPress.current = false;
			}}>
			<div className={styles.panel}>
				<header className={styles.heading}>
					<h2 id={titleId}>{title}</h2>
					<Button ref={closeRef} aria-label='Закрыть' onClick={onClose}>
						×
					</Button>
				</header>
				{children}
			</div>
		</dialog>,
		root
	);
	/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
}
