import { Dialog } from '@mui/material';
import DialogHeader from './dialog-header/dialog-header';
import DialogBody from './dialog-body/dialog-body';
import DialogFooter from './dialog-footer/dialog-footer';
import { useState } from 'react';

const CustomDialog = ({
	size = 'small',
	disabled,
	disableYes,
	disableNo,
	onNo,
	title = '',
	message = '',
	onYes,
	yesTitle = '',
	noTitle = '',
	open = false,
	children,
	className = '',
	iconName = '',
	bodyClassName = '',
	headerComponent,
	allowFullScreen = false,
	onClose,
	buttonSize = 'sm',
	fullWidth = false,
	addTitle = '',
	onAdd,
	closeArrow,
	fullScreen,
	...otherProps
}) => {
	const handleClose = () => {
		onClose ? onClose() : onNo();
	};
	return (
		<Dialog
			open={open}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth={true}

			fullScreen={fullScreen}
			
			disableRestoreFocus={true}
			maxWidth={
				size === 'small'
					? 'sm'
					: size === 'medium'
					? 'md'
					: size === 'large'
					? 'lg'
					: size === 'xlarge' && 'xl'
			}
			className={className}
			{...otherProps}
		>
			<DialogHeader
				title={title}
				onNo={handleClose}
				disabled={disabled}
				disableClose={disableNo}
				className={title ? 'justify-center' : ''}
				children={headerComponent}
				closeArrow={closeArrow}
				
			/>
			{(message || children || iconName) && (
				<DialogBody className={bodyClassName} message={message} icon={iconName}>
					{children}
				</DialogBody>
			)}
			{(noTitle || yesTitle) && (
				<DialogFooter
					disabled={disabled}
					disableYes={disableYes}
					disableNo={disableNo}
					onNo={() => (onNo())}
					onYes={onYes}
					noTitle={noTitle}
					yesTitle={yesTitle}
				/>
			)}
		</Dialog>
	);
};

export default CustomDialog;
