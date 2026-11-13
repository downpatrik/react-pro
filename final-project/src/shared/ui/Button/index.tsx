import type { ComponentPropsWithRef } from 'react';

export function Button({
	type = 'button',
	...props
}: ComponentPropsWithRef<'button'>) {
	return <button type={type} {...props} />;
}
