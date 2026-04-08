import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    console.log("Forget Password email:", data.email);

    try {
      // Replace with your actual API endpoint for password reset request
      const res = await axios.post("/user/forgetpassword", data);
      console.log(res);

      if (res.status === 200) {
        toast.success("📧 Password reset link sent to your email!", {
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
          navigate("/login"); // Redirect to login page after success
        }, 5500);
      } else {
        toast.error("😞 Failed to send reset link. Please try again.", {
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
      console.error("Forget password error:", error);
      toast.error(
        "😞 An error occurred. Please check your email or try again later.",
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
    email: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
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
            <h3 className="mb-0">Forgot Password</h3>
            <p className="lead">Enter your email to reset your password</p>
          </div>
          <div className="card-body p-5">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label fs-5 fw-bolder text-primary"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your registered email"
                  {...register("email", validationSchema.email)}
                />
                <span className="text-danger">{errors.email?.message}</span>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  Send Reset Link
                </button>
              </div>
            </form>
            <p className="mt-3 text-center">
              Remember your password?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
