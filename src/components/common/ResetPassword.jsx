import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export const ResetPassword = () => {
  const token = useParams().token;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const obj = {
      token: token,
      password: data.newPassword, // Corrected: Use data.newPassword
    };

    try {
      // Replace with your actual API endpoint to reset the password
      const res = await axios.post("/user/resetpassword", obj);
      console.log(res.data);

      if (res.status === 200) {
        toast.success("🔑 Password reset successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/login");
        }, 5500);
      } else {
        toast.error("😞 Failed to reset password. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        "😞 An error occurred during password reset. Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        },
      );
    }
  };

  const validationSchema = {
    newPassword: {
      required: {
        value: true,
        message: "New password is required",
      },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
      },
    },
    confirmPassword: {
      required: {
        value: true,
        message: "Confirm password is required",
      },
      validate: (value) =>
        value === watch("newPassword") || "Passwords do not match",
    },
  };

  return (
    <>
      <div className="container-fluid py-5 ">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <div
          className="card shadow-lg bg-white rounded-lg"
          style={{ maxWidth: "600px", marginLeft: "30%" }}
        >
          <div className="card-header bg-primary text-white text-center py-4">
            <h3 className="mb-0">Reset Password</h3>
            <p className="lead">Enter your new password</p>
          </div>
          <div className="card-body p-5">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mb-3">
                <label
                  htmlFor="newPassword"
                  className="form-label fs-5 fw-bolder text-primary"
                >
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  placeholder="Enter your new password"
                  {...register("newPassword", validationSchema.newPassword)}
                />
                <span className="text-danger">
                  {errors.newPassword?.message}
                </span>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fs-5 fw-bolder text-primary"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  {...register(
                    "confirmPassword",
                    validationSchema.confirmPassword,
                  )}
                />
                <span className="text-danger">
                  {errors.confirmPassword?.message}
                </span>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
