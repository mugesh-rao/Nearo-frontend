import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loader from "../utils/Loader.jsx";
import { useDispatch } from "react-redux";
const Logout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClickOpen = () => {
    setOpen(true);
  };
const Dispatch=useDispatch()
  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const do_logout = (data) =>
    apiRequest({
      url: "/login/logout",
      method: "post",
      data: data,
    });

  const { mutate, isLoading } = useMutation(do_logout, {
    onSuccess: (data) => {
      if (data?.data?.success == 1) {
        navigate("/");
        Cookies.set("session_id", "", { expires: 7 });
        toast.success(data?.data?.message);
        Dispatch({type:"logout"})
      }
      queryClient.invalidateQueries("low_stocks_data");
    },
    onError: (err) => {
      console.log(err);
    },
    retry: {
      maxAttempts: 3,
      delay: (attempt) => {
        return attempt * 1000;
      },
    },
  });

  const goto = useCallback(() => {
    const formData = new FormData();
    formData.append("session_id", Cookies.get("session_id"));
    mutate(formData);
  }, []);

  const Show = () => {
    return (
      <>
        {!isLoading ? (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                width: "20rem", 
              },
            }}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <h2 className="text-center text-black text-2xl ">
                  Are you sure ?
                </h2>
                <div className="flex justify-between mt-10 space-x-4">
                  <button onClick={goto} className="btn1 w-1/2">
                    Yes
                  </button>
                  <button onClick={handleClose} className="btn2 w-1/2">
                    No
                  </button>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
          <Loader />
        </div>
        )}
      </>
    );
  };

  return (
    <>
      <p
        onClick={handleClickOpen}
        className="flex items-center p-2 cursor-pointer"
      >
        <CiLogout className="text-2xl" />
        &nbsp; &nbsp; Loging Out
      </p>

      <Show />
    </>
  );
};

export default Logout;
