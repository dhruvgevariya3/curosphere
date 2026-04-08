import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "../../assets/designs/css/bootstrap.min.css";
import "../../assets/designs/lib/animate/animate.min.css";

export const AddDoctor = () => {
  const [states, setstates] = useState([]);
  const [cities, setcities] = useState([]);
  const navigate = useNavigate();
  const getAllStates = async () => {
    const res = await axios.get("/state/all");
    setstates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    const res = await axios.get("city/getcitybystate/" + id);
    setcities(res.data.data);
  };

  useEffect(() => {
    getAllStates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    const userId = localStorage.getItem("id");
    data.userId = userId;

    const formData = new FormData();
    formData.append("specialization", data.specialization);
    formData.append("experience", data.experience);
    formData.append("qualification", data.qualification);
    formData.append("stateId", data.stateId);
    formData.append("cityId", data.cityId);
    formData.append("contactNum", data.contactNum);
    formData.append("image", data.image[0]);
    formData.append("about", data.about);
    formData.append("userId", data.userId);
    try {
      const res = await axios.post("/doctor/addwithfile", formData);
      if (res.status === 201) {
        toast.success("🦄 Doctor Profile Added Successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/doctorhomepage");
        }, 2200);
      } else {
        toast.error("Failed to add doctor profile.");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("An error occurred while adding the doctor profile.");
    }
  };

  const validationSchema = {
    specvalidator: {
      required: { value: true, message: "Specialization required" },
    },
    qualificationvalidator: {
      required: { value: true, message: "Qualification required" },
    },
    experiencevalidator: {
      required: { value: true, message: "Experience required" },
    },
    ppvalidator: { required: { value: true, message: "Picture required" } },
    contactvalidator: {
      required: { value: true, message: "Contact required" },
    },
  };

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {" "}
          {/* Increased column width to accommodate two fields per row */}
          <div
            className="card shadow p-4 rounded animate__animated animate__fadeIn"
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
              Add Doctor Profile
            </h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    {...register(
                      "specialization",
                      validationSchema.specvalidator,
                    )}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">
                    {errors.specialization?.message}
                  </span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    Qualification
                  </label>
                  <input
                    type="text"
                    {...register(
                      "qualification",
                      validationSchema.qualificationvalidator,
                    )}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">
                    {errors.qualification?.message}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    Experience
                  </label>
                  <input
                    type="number"
                    {...register(
                      "experience",
                      validationSchema.experiencevalidator,
                    )}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">
                    {errors.experience?.message}
                  </span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    {...register("image", validationSchema.ppvalidator)}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">{errors.image?.message}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    Contact Number
                  </label>
                  <input
                    type="number"
                    {...register(
                      "contactNum",
                      validationSchema.contactvalidator,
                    )}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">
                    {errors.contactNum?.message}
                  </span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    About
                  </label>
                  <input
                    type="text"
                    {...register("about")}
                    className="form-control"
                    style={{ borderColor: "#ced4da" }}
                  />
                  <span className="text-danger">{errors.about?.message}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    SELECT STATE
                  </label>
                  <select
                    {...register("stateId")}
                    onChange={(event) => {
                      getCityByStateId(event.target.value);
                    }}
                    className="form-select"
                    style={{ borderColor: "#ced4da" }}
                  >
                    <option value="">SELECT STATE</option>
                    {states?.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" style={{ color: "#343a40" }}>
                    SELECT CITY
                  </label>
                  <select
                    {...register("cityId")}
                    className="form-select"
                    style={{ borderColor: "#ced4da" }}
                  >
                    <option value="">SELECT CITY</option>
                    {cities?.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
