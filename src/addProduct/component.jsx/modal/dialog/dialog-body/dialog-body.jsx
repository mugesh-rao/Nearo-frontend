import { DialogContent, DialogContentText } from '@mui/material';
import classNames from '../../../../../utils/classNames';

const DialogBody = ({ message = '', icon = '', children, className = '' }) => {
	return (
		<DialogContent
			className={classNames('bg-white', className)}
			dividers={true}
		>
			{message && (
				<DialogContentText
					id="alert-dialog-description"
					className="text-center"
					children={message}
				/>
			)}
			{children}
		</DialogContent>
	);
};

export default DialogBody;
