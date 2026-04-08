import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaClinicMedical,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobeAmericas,
  FaInfoCircle,
} from "react-icons/fa";

export const Clinic = () => {
  const id = localStorage.getItem("id");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasClinic, setHasClinic] = useState(false);
  const [clinicId, setClinicId] = useState(null);
  const navigate = useNavigate();

  const getAllStates = async () => {
    try {
      const res = await axios.get("/state/all");
      setStates(res.data.data);
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to load states");
    }
  };

  const getCityByStateId = async (id) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${id}`);
      setCities(res.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
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
  } = useForm();

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await axios.get(`/clinic/doctor/${id}`);
        if (res.data.data && res.data.data.length > 0) {
          const clinic = res.data.data[0];
          setHasClinic(true);
          setClinicId(clinic._id);

          // Reset form with clinic data
          reset({
            clinicName: clinic.clinicName,
            timing: clinic.timing,
            address: clinic.address,
            contactNum: clinic.contactNum,
            pincode: clinic.pincode,
            latitude: clinic.latitude,
            longitude: clinic.longitude,
            about: clinic.about,
            stateId: clinic.stateId?._id || clinic.stateId,
            cityId: clinic.cityId?._id || clinic.cityId,
            doctorId: id,
          });

          // If stateId exists, fetch cities for that state
          if (clinic.stateId) {
            getCityByStateId(clinic.stateId._id || clinic.stateId);
          }
        } else {
          setHasClinic(false);
          // Set default values for new clinic
          reset({
            doctorId: id,
          });
        }
      } catch (error) {
        console.error("Error fetching clinic:", error);
        toast.error("Failed to load clinic data");
      }
    };

    fetchClinic();
  }, [id, reset]);

  const submitHandler = async (data) => {
    setIsSubmitting(true);

    try {
      let res;
      if (hasClinic) {
        // Update existing clinic
        res = await axios.put(`/clinic/update/${clinicId}`, data);
      } else {
        // Create new clinic
        res = await axios.post("/clinic/add", data);
        setClinicId(res.data.data._id);
        setHasClinic(true);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(
          `🦄 Clinic ${hasClinic ? "Updated" : "Added"} Successfully!`,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          },
        );
        setTimeout(() => {
          navigate("/doctordashboard");
        }, 2200);
      } else {
        toast.error(`Failed to ${hasClinic ? "update" : "add"} clinic.`);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(
        `An error occurred while ${hasClinic ? "updating" : "adding"} the clinic.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = {
    clinicNameValidator: {
      required: { value: true, message: "Clinic Name is required" },
    },
    timingValidator: {
      required: { value: true, message: "Timing is required" },
    },
    addressValidator: {
      required: { value: true, message: "Address is required" },
    },
    contactValidator: {
      required: { value: true, message: "Contact number is required" },
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    },
    latitudeValidator: {
      required: { value: true, message: "Latitude is required" },
      min: { value: -90, message: "Latitude must be between -90 and 90" },
      max: { value: 90, message: "Latitude must be between -90 and 90" },
    },
    longitudeValidator: {
      required: { value: true, message: "Longitude is required" },
      min: { value: -180, message: "Longitude must be between -180 and 180" },
      max: { value: 180, message: "Longitude must be between -180 and 180" },
    },
    pincodeValidator: {
      required: { value: true, message: "Pincode is required" },
      pattern: {
        value: /^[0-9]{6}$/,
        message: "Please enter a valid 6-digit pincode",
      },
    },
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-weight-bold">
            Welcome Back,{" "}
            <span className="text-primary font-weight-bold"></span>
          </h4>
          {/* <small className="text-secondary">Gynecologist, MBBS.MD</small> */}
        </div>
        <div className="d-flex align-items-center">
          {/* <button className="btn btn-primary mr-2">
            <NotificationsIcon /> <span className="badge badge-danger ml-1">3</span>
          </button>
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            SS
          </div> */}
        </div>
      </div>

      <div className="container-fluid px-0">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10" style={{ width: "1200px" }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white py-3">
                <div className="d-flex align-items-center justify-content-center">
                  <FaClinicMedical size={24} className="me-3" />
                  <h2 className="mb-0 text-center fw-bold fs-4">
                    {hasClinic ? "Update Clinic" : "Add New Clinic"}
                  </h2>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  transition={Bounce}
                />

                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="row g-3">
                    {/* Clinic Name */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          {...register(
                            "clinicName",
                            validationSchema.clinicNameValidator,
                          )}
                          className={`form-control rounded-3 ${errors.clinicName ? "is-invalid" : ""}`}
                          id="clinicName"
                          placeholder="Clinic Name"
                        />
                        <label htmlFor="clinicName" className="text-muted">
                          <FaClinicMedical className="me-2" />
                          Clinic Name
                        </label>
                        {errors.clinicName && (
                          <div className="invalid-feedback d-block">
                            {errors.clinicName.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          {...register(
                            "timing",
                            validationSchema.timingValidator,
                          )}
                          className={`form-control rounded-3 ${errors.timing ? "is-invalid" : ""}`}
                          id="timing"
                          placeholder="e.g. 9:00 AM - 5:00 PM"
                        />
                        <label htmlFor="timing" className="text-muted">
                          <FaClock className="me-2" />
                          Timing
                        </label>
                        {errors.timing && (
                          <div className="invalid-feedback d-block">
                            {errors.timing.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          {...register(
                            "address",
                            validationSchema.addressValidator,
                          )}
                          className={`form-control rounded-3 ${errors.address ? "is-invalid" : ""}`}
                          id="address"
                          placeholder="Full Address"
                        />
                        <label htmlFor="address" className="text-muted">
                          <FaMapMarkerAlt className="me-2" />
                          Address
                        </label>
                        {errors.address && (
                          <div className="invalid-feedback d-block">
                            {errors.address.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          {...register(
                            "contactNum",
                            validationSchema.contactValidator,
                          )}
                          className={`form-control rounded-3 ${errors.contactNum ? "is-invalid" : ""}`}
                          id="contactNum"
                          placeholder="Contact Number"
                        />
                        <label htmlFor="contactNum" className="text-muted">
                          <FaPhone className="me-2" />
                          Contact Number
                        </label>
                        {errors.contactNum && (
                          <div className="invalid-feedback d-block">
                            {errors.contactNum.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pincode */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          {...register(
                            "pincode",
                            validationSchema.pincodeValidator,
                          )}
                          className={`form-control rounded-3 ${errors.pincode ? "is-invalid" : ""}`}
                          id="pincode"
                          placeholder="Pincode"
                        />
                        <label htmlFor="pincode" className="text-muted">
                          <FaMapMarkerAlt className="me-2" />
                          Pincode
                        </label>
                        {errors.pincode && (
                          <div className="invalid-feedback d-block">
                            {errors.pincode.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Latitude */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          step="any"
                          {...register(
                            "latitude",
                            validationSchema.latitudeValidator,
                          )}
                          className={`form-control rounded-3 ${errors.latitude ? "is-invalid" : ""}`}
                          id="latitude"
                          placeholder="Latitude"
                        />
                        <label htmlFor="latitude" className="text-muted">
                          <FaGlobeAmericas className="me-2" />
                          Latitude
                        </label>
                        {errors.latitude && (
                          <div className="invalid-feedback d-block">
                            {errors.latitude.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Longitude */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          step="any"
                          {...register(
                            "longitude",
                            validationSchema.longitudeValidator,
                          )}
                          className={`form-control rounded-3 ${errors.longitude ? "is-invalid" : ""}`}
                          id="longitude"
                          placeholder="Longitude"
                        />
                        <label htmlFor="longitude" className="text-muted">
                          <FaGlobeAmericas className="me-2" />
                          Longitude
                        </label>
                        {errors.longitude && (
                          <div className="invalid-feedback d-block">
                            {errors.longitude.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* About */}
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          {...register("about")}
                          className="form-control rounded-3"
                          id="about"
                          placeholder="About the clinic"
                          style={{ height: "100px" }}
                        />
                        <label htmlFor="about" className="text-muted">
                          <FaInfoCircle className="me-2" />
                          About the Clinic
                        </label>
                      </div>
                    </div>

                    {/* State and City */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          {...register("stateId", {
                            required: "State is required",
                          })}
                          onChange={(e) => getCityByStateId(e.target.value)}
                          className={`form-select rounded-3 ${errors.stateId ? "is-invalid" : ""}`}
                          id="state"
                        >
                          <option value="">Select State</option>
                          {states?.map((state) => (
                            <option key={state._id} value={state._id}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="state" className="text-muted">
                          State
                        </label>
                        {errors.stateId && (
                          <div className="invalid-feedback d-block">
                            {errors.stateId.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          {...register("cityId", {
                            required: "City is required",
                          })}
                          className={`form-select rounded-3 ${errors.cityId ? "is-invalid" : ""}`}
                          id="city"
                          disabled={cities.length === 0}
                        >
                          <option value="">Select City</option>
                          {cities?.map((city) => (
                            <option key={city._id} value={city._id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="city" className="text-muted">
                          City
                        </label>
                        {errors.cityId && (
                          <div className="invalid-feedback d-block">
                            {errors.cityId.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-pill fw-bold py-3 shadow-sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaClinicMedical className="me-2" />
                          {hasClinic ? "Update Clinic" : "Add Clinic"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
