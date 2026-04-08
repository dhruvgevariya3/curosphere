import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);

      if (res.status === 200) {
        // Assuming the API response includes the user's roleId
        const roleId = res.data.data.roleId; // Adjust based on your API response structure
        console.log(roleId);
        localStorage.setItem("roleId", res.data.data.roleId._id); // Store roleId in localStorage
        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.roleId.name);

        toast.success("🎉 Login successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        setTimeout(() => {
          // Redirect based on roleId
          if (roleId == "67c5270436ac361840173a1a") {
            navigate("/patientdashboard"); // Admin dashboard
          } else if (roleId == "67c5c2418f21d7911dd5c66e") {
            navigate("/doctorprofile"); // Regular user dashboard
          } else {
            navigate("/"); // Default route if roleId is unknown
          }
        }, 2000);
      } else {
        toast.error("😞 Login failed. Invalid credentials.", {
          position: "top-center",
          autoClose: 2000,
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
      console.error("Login error:", error);
      toast.error(
        "😞 An error occurred during login. Please try again later.",
        {
          position: "top-center",
          autoClose: 2000,
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
    password: {
      required: {
        value: true,
        message: "Password is required",
      },
    },
  };

  return (
    <>
      <div className="container-fluid py-5 ">
        <ToastContainer
          position="top-right"
          autoClose={2000}
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
            <h3 className="mb-0">Welcome Back</h3>
            <p className="lead">Login to your account</p>
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
                  placeholder="Enter your email"
                  {...register("email", validationSchema.email)}
                />
                <span className="text-danger">{errors.email?.message}</span>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label fs-5 fw-bolder text-primary"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", validationSchema.password)}
                />
                <span className="text-danger">{errors.password?.message}</span>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  Login
                </button>
              </div>
            </form>
            <p className="mt-3 text-center">
              <Link to="/forgetpassword" className="text-primary">
                Forgot Password?
              </Link>
            </p>
            <p className="mt-2 text-center text-muted">
              Do not have an account?{" "}
              <Link to="/signup" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
