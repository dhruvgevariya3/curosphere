import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log("errors", errors);
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    // In a real application, you would send this data to your backend API
    console.log("Signup data:", data);

    // Example API call (replace with your actual API endpoint)
    try {
      let roleId = "";
      if (data.role === "doctor") {
        roleId = "67c5c2418f21d7911dd5c66e"; // Replace with actual doctor role ID
      } else if (data.role === "patient") {
        roleId = "67c5270436ac361840173a1a"; // Replace with actual patient role ID
      }
      data.roleId = roleId;

      if (!roleId) {
        toast.error("😞 Please select a role.", {
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
        return; // Stop the signup process if no role is selected
      }

      const res = await axios.post("/user/signup", data);
      console.log(res); //axios object
      console.log(res.data); //api response...

      if (res.status === 201) {
        toast.success("🎉 Account created successfully! Please log in.", {
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
          navigate("/login");
        }, 2000);
      } else {
        toast.error("😞 Signup failed. Please try again.", {
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
      console.error("Signup error:", error);
      toast.error(
        "😞 An error occurred during signup. Please try again later.",
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
    name: {
      required: {
        value: true,
        message: "Name is required",
      },
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters long",
      },
    },
    gendervalidator: {
      required: {
        value: true,
        message: "Gender is required",
      },
    },
    contactvalidator: {
      required: {
        value: true,
        message: "contact required",
      },
    },
    agevalidator: {
      required: {
        value: true,
        message: "age required",
      },
    },
    role: {
      required: {
        value: true,
        message: "Please select a role",
      },
    },
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
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
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
          className="row justify-content-center"
          style={{ marginTop: "-40px", marginBottom: "-25px" }}
        >
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg bg-white rounded-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3 className="mb-0">Create Your Account</h3>
                <p className="lead">Join our community!</p>
              </div>
              <div
                className="card-body p-5"
                style={{ marginTop: "-15px", marginBottom: "-10px" }}
              >
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fs-5 fw-bolder text-primary"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fname"
                      placeholder="Enter your first name"
                      {...register("firstName", validationSchema.name)}
                    />
                    <span className="text-danger">{errors.name?.message}</span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fs-5 fw-bolder text-primary"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lname"
                      placeholder="Enter your last name"
                      {...register("lastName", validationSchema.name)}
                    />
                    <span className="text-danger">{errors.name?.message}</span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="age"
                      className="form-label fs-5 fw-bolder text-primary"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      placeholder="Enter your Age"
                      {...register("bornyear", validationSchema.agevalidator)}
                    />
                    <span className="text-danger">
                      {errors.agevalidator?.message}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="contactnum"
                      className="form-label fs-5 fw-bolder text-primary"
                    >
                      Contact Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="contactnum"
                      placeholder="Enter your Contact Number"
                      {...register(
                        "contactNum",
                        validationSchema.contactvalidator,
                      )}
                    />
                    <span className="text-danger">
                      {errors.contactvalidator?.message}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fs-5 fw-bolder text-primary">
                      Gender
                    </label>
                    <br />
                    <div className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="male"
                        id="male"
                        {...register(
                          "gender",
                          validationSchema.gendervalidator,
                        )}
                      />
                      <label className="form-check-label" htmlFor="male">
                        Male
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="female"
                        id="female"
                        {...register(
                          "gender",
                          validationSchema.gendervalidator,
                        )}
                      />
                      <label className="form-check-label" htmlFor="female">
                        Female
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="other"
                        id="other"
                        {...register(
                          "gender",
                          validationSchema.gendervalidator,
                        )}
                      />
                      <label className="form-check-label" htmlFor="other">
                        Other
                      </label>
                    </div>
                    <span className="text-danger">
                      {errors.gendervalidator?.message}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fs-5 fw-bolder text-primary">
                      Role
                    </label>
                    <br />
                    <div className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="doctor"
                        id="doctor"
                        {...register("role", validationSchema.role)}
                      />
                      <label className="form-check-label" htmlFor="doctor">
                        Doctor
                      </label>
                    </div>
                    <div className="form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        value="patient"
                        id="patient"
                        {...register("role", validationSchema.role)}
                      />
                      <label className="form-check-label" htmlFor="patient">
                        Patient
                      </label>
                    </div>
                    <span className="text-danger">{errors.role?.message}</span>
                  </div>
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
                    <span className="text-danger">
                      {errors.password?.message}
                    </span>
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-center">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
