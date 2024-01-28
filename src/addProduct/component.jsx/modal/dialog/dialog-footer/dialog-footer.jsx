import { DialogActions } from "@mui/material";
import classNames from "../../../../../utils/classNames";

const DialogFooter = ({
  noTitle,
  yesTitle,
  onNo,
  onYes,
  disabled,
  disableNo,
  disableYes,
  size = "sm",
  className,
}) => {
  return (
    <DialogActions
      className={classNames(
        noTitle && yesTitle ? "justify-between" : "justify-center",
        "px-4",
        className
      )}
    >
      {noTitle && (
        <button className="btn2" onClick={onNo}>
          {noTitle}
        </button>
      )}

      {yesTitle && (
        <button className="btn1" onClick={onYes}>
          {yesTitle}
        </button>
      )}
    </DialogActions>
  );
};

export default DialogFooter;
