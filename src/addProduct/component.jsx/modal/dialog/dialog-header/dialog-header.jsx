import { DialogTitle, DialogActions } from "@mui/material";
import classNames from "../../../../../utils/classNames";
import { RxCross1 } from "react-icons/rx";

const DialogHeader = ({
  title,
  closeArrow = false,
  disabled,
  disableClose,
  onNo,
  className = "",
  children,
}) => {
  return (
    <DialogTitle
      id="alert-dialog-title"
      className={classNames(
        "relative flex items-center text-font w-full !h-[52px] px-4 text-base bg-white",
        className
      )}
    >
      {children ? (
        children
      ) : closeArrow ? (
        <span className="ml-2">{title}</span>
      ) : (
        title
      )}
      <DialogActions className="absolute right-0 p-1 py-auto">
        {!closeArrow && (
          <button
            name="CrossInactive"
            className="cursor-pointer"
            onClick={() => {
              if (!disabled && !disableClose) onNo && onNo();
            }}
            size="medium"
          >
            <RxCross1 />
          </button>
        )}
      </DialogActions>
    </DialogTitle>
  );
};

export default DialogHeader;
