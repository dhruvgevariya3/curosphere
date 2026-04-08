import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "../../assets/designs/css/bootstrap.min.css";
import "../../assets/designs/lib/animate/animate.min.css";
import { useForm } from "react-hook-form";

export const UpdateDoctor = () => {
  const userId = localStorage.getItem("id");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isProfileExists, setIsProfileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const navigate = useNavigate();

  const getAllStates = async () => {
    try {
      const res = await axios.get("/state/all");
      setStates(res.data.data);
    } catch (error) {
      toast.error("Failed to load states");
      console.error("Error loading states:", error);
    }
  };

  const getCityByStateId = async (stateId) => {
    try {
      if (stateId) {
        const res = await axios.get(`city/getcitybystate/${stateId}`);
        setCities(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load cities");
      console.error("Error loading cities:", error);
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const watchStateId = watch("stateId");

  useEffect(() => {
    if (watchStateId) {
      getCityByStateId(watchStateId);
    }
  }, [watchStateId]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/doctor/getprofile/${userId}`);

        if (res.data.data) {
          setIsProfileExists(true);
          setDoctorId(res.data.data._id);
          getCityByStateId(res.data.data.stateId?._id || res.data.data.stateId);
          reset({
            firstName: res.data.data.firstName,
            lastName: res.data.data.lastName,
            specialization: res.data.data.specialization,
            qualification: res.data.data.qualification,
            experience: res.data.data.experience,
            contactNum: res.data.data.contactNum,
            about: res.data.data.about,
            stateId: res.data.data.stateId?._id || res.data.data.stateId,
            cityId: res.data.data.cityId?._id || res.data.data.cityId,
          });
        } else {
          setIsProfileExists(false);
          reset({
            firstName: "",
            lastName: "",
            specialization: "",
            qualification: "",
            experience: "",
            contactNum: "",
            about: "",
            stateId: "",
            cityId: "",
          });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Error checking doctor profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctorData();
  }, [userId, reset]);

  const submitHandler = async (data) => {
    try {
      let res;
      if (isProfileExists) {
        // Update existing profile
        res = await axios.put(`/doctor/updatedoctor/${doctorId}`, data);
      } else {
        // Create new profile
        data.userId = userId;
        res = await axios.post("/doctor/add", data);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(
          `🦄 Doctor Profile ${isProfileExists ? "Updated" : "Created"} Successfully!`,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          },
        );
        setTimeout(() => {
          navigate("/viewdoctor");
        }, 2200);
      } else {
        toast.error(
          `Failed to ${isProfileExists ? "update" : "create"} doctor profile.`,
        );
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(
        error.response?.data?.message ||
          `An error occurred while ${isProfileExists ? "updating" : "creating"} the doctor profile.`,
      );
    }
  };

  const validationSchema = {
    firstName: {
      required: { value: true, message: "First name is required" },
      minLength: { value: 2, message: "Minimum 2 characters required" },
    },
    lastName: {
      required: { value: true, message: "Last name is required" },
      minLength: { value: 2, message: "Minimum 2 characters required" },
    },
    specialization: {
      required: { value: true, message: "Specialization is required" },
      minLength: { value: 3, message: "Minimum 3 characters required" },
    },
    qualification: {
      required: { value: true, message: "Qualification is required" },
      minLength: { value: 3, message: "Minimum 3 characters required" },
    },
    experience: {
      required: { value: true, message: "Experience is required" },
      min: { value: 0, message: "Experience cannot be negative" },
      max: { value: 60, message: "Experience seems too high" },
    },
    contactNum: {
      required: { value: true, message: "Contact number is required" },
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    },
    stateId: {
      required: { value: true, message: "State is required" },
    },
    cityId: {
      required: { value: true, message: "City is required" },
    },
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <a
          href="index.html"
          className="navbar-brand d-flex align-items-center px-4 px-lg-5"
        >
          <h1 className="m-0 text-primary">
            <i className="far fa-hospital me-3" />
            Curosphere
          </h1>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <Link to="/doctorhomepage" className="nav-item nav-link active">
              Home
            </Link>
            <Link to="/about" className="nav-item nav-link">
              About
            </Link>
            <Link to="/service" className="nav-item nav-link">
              Services
            </Link>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Pages
              </a>
              <div className="dropdown-menu rounded-0 rounded-bottom m-0">
                <Link to="/feature" className="dropdown-item">
                  Features
                </Link>
                <Link to="/team" className="dropdown-item">
                  Our Doctor
                </Link>
                <Link to="/appointment" className="dropdown-item">
                  Appointment
                </Link>
                <Link to="/testimonial" className="dropdown-item">
                  Testimonial
                </Link>
                <Link to="/viewdoctor" className="dropdown-item">
                  View Doctor
                </Link>
              </div>
            </div>
            <Link to="/contact" className="nav-item nav-link">
              Contact
            </Link>
          </div>
          <Link
            to="/login"
            className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          >
            Logout
            <i className="fa fa-arrow-right ms-3" />
          </Link>
        </div>
      </nav>

      <div
        className="container p-5"
        style={{ maxWidth: "1600px", backgroundColor: "lightblue" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div
              className="card shadow p-5 rounded animate__animated animate__fadeIn"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
              />
              <h2
                className="text-center mb-4"
                style={{ color: "#007bff", fontWeight: "bold" }}
              >
                {isProfileExists
                  ? "Update Doctor Profile"
                  : "Create Doctor Profile"}
              </h2>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      First Name*
                    </label>
                    <input
                      type="text"
                      {...register("firstName", validationSchema.firstName)}
                      className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">
                        {errors.firstName.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      Last Name*
                    </label>
                    <input
                      type="text"
                      {...register("lastName", validationSchema.lastName)}
                      className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      Specialization*
                    </label>
                    <input
                      type="text"
                      {...register(
                        "specialization",
                        validationSchema.specialization,
                      )}
                      className={`form-control ${errors.specialization ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.specialization && (
                      <div className="invalid-feedback">
                        {errors.specialization.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      Qualification*
                    </label>
                    <input
                      type="text"
                      {...register(
                        "qualification",
                        validationSchema.qualification,
                      )}
                      className={`form-control ${errors.qualification ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.qualification && (
                      <div className="invalid-feedback">
                        {errors.qualification.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      Experience (years)*
                    </label>
                    <input
                      type="number"
                      {...register("experience", validationSchema.experience)}
                      className={`form-control ${errors.experience ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.experience && (
                      <div className="invalid-feedback">
                        {errors.experience.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      Contact Number*
                    </label>
                    <input
                      type="tel"
                      {...register("contactNum", validationSchema.contactNum)}
                      className={`form-control ${errors.contactNum ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    />
                    {errors.contactNum && (
                      <div className="invalid-feedback">
                        {errors.contactNum.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    About
                  </label>
                  <textarea
                    {...register("about")}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                    rows="3"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      State*
                    </label>
                    <select
                      {...register("stateId", validationSchema.stateId)}
                      className={`form-select ${errors.stateId ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                    >
                      <option value="">Select State</option>
                      {states?.map((state) => (
                        <option key={state._id} value={state._id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.stateId && (
                      <div className="invalid-feedback">
                        {errors.stateId.message}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: "#343a40" }}>
                      City*
                    </label>
                    <select
                      {...register("cityId", validationSchema.cityId)}
                      className={`form-select ${errors.cityId ? "is-invalid" : ""}`}
                      style={{ borderColor: "#ced4da" }}
                      disabled={!watchStateId}
                    >
                      <option value="">Select City</option>
                      {cities?.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityId && (
                      <div className="invalid-feedback">
                        {errors.cityId.message}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 py-2"
                  style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
                >
                  {isProfileExists ? "Update Profile" : "Create Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container-fluid bg-dark text-light footer pt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Address</h5>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                123 Street, New York, USA
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                +012 345 67890
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                info@example.com
              </p>
              <div className="d-flex pt-2">
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-twitter" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-youtube" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Services</h5>
              <a className="btn btn-link" href="">
                Cardiology
              </a>
              <a className="btn btn-link" href="">
                Pulmonary
              </a>
              <a className="btn btn-link" href="">
                Neurology
              </a>
              <a className="btn btn-link" href="">
                Orthopedics
              </a>
              <a className="btn btn-link" href="">
                Laboratory
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Quick Links</h5>
              <a className="btn btn-link" href="">
                About Us
              </a>
              <a className="btn btn-link" href="">
                Contact Us
              </a>
              <a className="btn btn-link" href="">
                Our Services
              </a>
              <a className="btn btn-link" href="">
                Terms &amp; Condition
              </a>
              <a className="btn btn-link" href="">
                Support
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Newsletter</h5>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: 400 }}
              >
                <input
                  className="form-control border-0 w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Your email"
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                ©{" "}
                <a className="border-bottom" href="#">
                  Your Site Name
                </a>
                , All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                Designed By{" "}
                <a className="border-bottom" href="https://htmlcodex.com">
                  HTML Codex
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#"
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
      >
        <i
          className="bi bi-arrow-up"
          style={{ position: "absolute", right: "13px" }}
        />
      </a>
      {/* Footer content remains the same as in your original file */}
    </>
  );
};
