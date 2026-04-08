import { useState, useEffect } from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  LocalHospital as SurgeryIcon,
  Bed as BedIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  HouseRounded,
  AddToHomeScreen,
  Logout,
} from "@mui/icons-material";
import { Link, Routes, Route } from "react-router-dom";
import { Clinic } from "./Clinic";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHospital } from "react-icons/fa";

const DoctorDashboard = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const doctorId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch doctor details
        const doctorRes = await axios.get(`/user/get/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctorDetails(doctorRes.data.data);

        const res = await axios.get(`/doctor/getprofile/${doctorId}`);
        setDoctorDetail(res.data.data);

        // Fetch appointments
        const appointmentsRes = await axios.get(
          `/appointment/getall?doctorId=${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const formattedAppointments = await Promise.all(
          appointmentsRes.data.data
            .filter((appointment) => appointment.statusId === "scheduled")
            .map(async (appointment) => {
              try {
                // Fetch patient details for each appointment
                const patientRes = await axios.get(
                  `/user/get/${appointment.patientId._id}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                );
                const patient = patientRes.data.data;
                return {
                  id: appointment._id,
                  patientId: appointment.patientId._id,
                  patient: `${patient.firstName} ${patient.lastName}`,
                  time: `${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}`,
                  type: appointment.complain || "General Checkup",
                  avatar: `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`,
                  patientDetails: patient,
                };
              } catch (err) {
                console.error("Error fetching patient details:", err);
                return {
                  id: appointment._id,
                  patientId: appointment.patientId._id,
                  patient: "Unknown Patient",
                  time: `${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}`,
                  type: appointment.complain || "General Checkup",
                  avatar: "UP",
                  patientDetails: null,
                };
              }
            }),
        );

        setUpcomingAppointments(formattedAppointments);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", marginLeft: "280px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", marginLeft: "280px" }}
      >
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!doctorDetails) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", marginLeft: "280px" }}
      >
        <div className="alert alert-danger">Doctor details not found</div>
      </div>
    );
  }

  const doctorInitials = `${doctorDetails.firstName.charAt(0)}${doctorDetails.lastName.charAt(0)}`;
  const doctorFullName = `Dr. ${doctorDetails.firstName} ${doctorDetails.lastName}`;
  const doctorSpecialization = doctorDetail.specialization || "Doctor";
  const doctorQualification = doctorDetail.qualification || "";

  const patientSurveys = [
    { id: 1, name: "New Patients", completed: false },
    { id: 2, name: "Follow-up Patients", completed: true },
  ];

  const appointmentTypes = [
    { id: 1, name: "Face To Face", selected: false },
    { id: 2, name: "E-Consult", selected: true },
    { id: 3, name: "Available", selected: true },
  ];

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* Fixed Sidebar */}
      <aside
        style={{
          width: "280px",
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          height: "100vh",
        }}
        className="animate__animated animate__fadeInLeft"
      >
        <div className="p-3 border-bottom d-flex align-items-center justify-content-center">
          <FaHospital />
          <h5 className="font-weight-bold text-primary mb-0">Curosphere</h5>
        </div>

        <div className="p-3 border-bottom d-flex align-items-center">
          <div className="position-relative">
            <div
              className="rounded-circle position-absolute"
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "green",
                borderRadius: "50%",
                border: "2px solid white",
                bottom: "0",
                right: "0",
              }}
            ></div>
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: "56px", height: "56px" }}
            >
              {doctorInitials}
            </div>
          </div>
          <div className="ml-3">
            <h6 className="font-weight-bold mb-1">{doctorFullName}</h6>
            <small className="text-secondary">{doctorSpecialization}</small>
          </div>
        </div>

        <nav className="p-2">
          <small className="text-secondary d-block mb-2">MAIN NAVIGATION</small>
          <ul className="list-group list-group-flush">
            <Link to="/doctordashboard" className="text-decoration-none">
              <li className="list-group-item list-group-item-action rounded mb-1">
                <DashboardIcon className=" mr-2" />
                <span className="">Dashboard</span>
              </li>
            </Link>
            <Link to="/patientlist" className="text-decoration-none">
              <li className="list-group-item list-group-item-action rounded mb-1">
                <PeopleIcon className="mr-2" />
                Patients
              </li>
            </Link>
            <Link to="/doctordashboard/clinic" className="text-decoration-none">
              <li className="list-group-item list-group-item-action rounded mb-1">
                <HouseRounded className="mr-2" />
                Clinic
              </li>
            </Link>
            <Link to="/doctorprofile" className="text-decoration-none">
              <li className="list-group-item list-group-item-action rounded mb-1">
                <AddToHomeScreen className="mr-2" />
                Profile
              </li>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Content - with margin for fixed sidebar */}
      <div className="flex-grow-1" style={{ marginLeft: "280px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardContentWithClinic
                doctorFullName={doctorFullName}
                doctorSpecialization={doctorSpecialization}
                doctorQualification={doctorQualification}
                doctorInitials={doctorInitials}
                upcomingAppointments={upcomingAppointments}
                patientSurveys={patientSurveys}
                appointmentTypes={appointmentTypes}
                handleLogout={handleLogout}
              />
            }
          />
          <Route path="/clinic" element={<Clinic />} />
          <Route
            path="/patients"
            element={
              <PatientsList
                upcomingAppointments={upcomingAppointments}
                doctorFullName={doctorFullName}
                doctorSpecialization={doctorSpecialization}
                doctorQualification={doctorQualification}
                handleLogout={handleLogout}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const PatientsList = ({
  upcomingAppointments,
  doctorFullName,
  doctorSpecialization,
  doctorQualification,
  handleLogout,
}) => {
  // Extract unique patients from appointments
  const uniquePatients = [];
  const patientIds = new Set();

  upcomingAppointments.forEach((appointment) => {
    if (!patientIds.has(appointment.patientId) && appointment.patientDetails) {
      patientIds.add(appointment.patientId);
      uniquePatients.push({
        id: appointment.patientId,
        name: appointment.patient,
        avatar: appointment.avatar,
        details: appointment.patientDetails,
      });
    }
  });

  return (
    <div className="p-3 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-weight-bold">
            Patients List,{" "}
            <span className="text-primary font-weight-bold">
              {doctorFullName}
            </span>
          </h4>
          <small className="text-secondary">
            {doctorSpecialization}, {doctorQualification}
          </small>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={handleLogout}
            type="submit"
            className="btn btn-primary mr-2"
          >
            <Logout /> <span className="badge badge-danger ml-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Patients Cards */}
      <div className="row">
        {uniquePatients.length > 0 ? (
          uniquePatients.map((patient) => (
            <div key={patient.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-3"
                      style={{ width: "50px", height: "50px" }}
                    >
                      {patient.avatar}
                    </div>
                    <h5 className="mb-0">{patient.name}</h5>
                  </div>

                  <div className="mb-3">
                    <h6 className="font-weight-bold text-primary">
                      <InfoIcon className="mr-2" />
                      Personal Information
                    </h6>
                    <p className="mb-1">
                      <strong>Email:</strong> {patient.details.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {patient.details.phone || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Gender:</strong> {patient.details.gender || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Age:</strong> {patient.details.age || "N/A"}
                    </p>
                  </div>

                  {patient.details.address && (
                    <div className="mb-3">
                      <h6 className="font-weight-bold text-primary">
                        <LocationIcon className="mr-2" />
                        Address
                      </h6>
                      <p className="mb-0">
                        {patient.details.address.street},{" "}
                        {patient.details.address.city},<br />
                        {patient.details.address.state} -{" "}
                        {patient.details.address.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <PeopleIcon style={{ fontSize: "3rem", color: "#6c757d" }} />
                <h4 className="mt-3">No Patients Found</h4>
                <p>
                  You do not have any patients with scheduled appointments yet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardContentWithClinic = ({
  doctorFullName,
  doctorSpecialization,
  doctorQualification,
  upcomingAppointments,
  patientSurveys,
  appointmentTypes,
  handleLogout,
}) => {
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const doctorId = localStorage.getItem("id");

  const fetchClinic = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/clinic/doctor/${doctorId}`);
      if (res.data.data && res.data.data.length > 0) {
        setClinicData(res.data.data[0]);
      } else {
        setError("No clinic found for this doctor");
      }
    } catch (err) {
      setError("Failed to fetch clinic data");
      console.error("Error fetching clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 animate__animated animate__fadeIn">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-weight-bold">
            Welcome Back,{" "}
            <span className="text-primary font-weight-bold">
              {doctorFullName}
            </span>
          </h4>
          <small className="text-secondary">
            {doctorSpecialization}, {doctorQualification}
          </small>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={handleLogout}
            type="submit"
            className="btn btn-primary mr-2"
          >
            <Logout /> <span className="badge badge-danger ml-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card animate__animated animate__fadeInUp border-top border-primary border-4">
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-primary-light p-2 mr-2">
                <CalendarIcon className="text-primary" />
              </div>
              <div>
                <h5 className="font-weight-bold mb-0">
                  {upcomingAppointments.length}
                </h5>
                <small className="text-secondary">Today's Appointments</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3 mb-md-0">
          <div
            className="card animate__animated animate__fadeInUp border-top border-danger border-4"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-danger-light p-2 mr-2">
                <SurgeryIcon className="text-danger" />
              </div>
              <div>
                <h5 className="font-weight-bold mb-0">3+</h5>
                <small className="text-secondary">Scheduled Surgeries</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card animate__animated animate__fadeInUp border-top border-warning border-4"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="card-body d-flex align-items-center">
              <div className="rounded-circle bg-warning-light p-2 mr-2">
                <BedIcon className="text-warning" />
              </div>
              <div>
                <h5 className="font-weight-bold mb-0">12+</h5>
                <small className="text-secondary">Room Visits</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="row">
        {/* Upcoming Appointments */}
        <div className="col-md-6 mb-3">
          <div className="card animate__animated animate__fadeInUp">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="font-weight-bold mb-0">Upcoming Appointments</h6>
                <Link to="/patientlist">
                  <button className="btn btn-outline-primary btn-sm">
                    View All
                  </button>
                </Link>
              </div>
              <ul className="list-group">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="list-group-item d-flex align-items-center border-bottom"
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-2"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                    >
                      {appointment.avatar}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="font-weight-bold mb-0">
                        {appointment.patient}
                      </h6>
                      <small className="text-secondary d-block">
                        {appointment.time}
                      </small>
                      <small className="text-secondary">
                        {appointment.type}
                      </small>
                    </div>
                    <Link to="/patientlist">
                      <button className="btn btn-sm btn-light">
                        Details <ArrowForwardIcon />
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Patient Survey */}
        <div className="col-md-6 mb-3">
          <div className="card animate__animated animate__fadeInUp">
            <div className="card-body">
              <h6 className="font-weight-bold mb-3">Patient Survey</h6>
              <ul className="list-group">
                {patientSurveys.map((survey) => (
                  <li key={survey.id} className="list-group-item">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={survey.completed}
                        readOnly
                      />
                      <label className="form-check-label">{survey.name}</label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Appointment Review */}
        <div className="col-md-6 mb-3">
          <div className="card animate__animated animate__fadeInUp">
            <div className="card-body">
              <h6 className="font-weight-bold mb-3">Appointment Review</h6>
              <ul className="list-group">
                {appointmentTypes.map((type) => (
                  <li key={type.id} className="list-group-item">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={type.selected}
                        readOnly
                      />
                      <label className="form-check-label">{type.name}</label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-6">
          <div className="card animate__animated animate__fadeInUp">
            <div className="card-body">
              <h6 className="font-weight-bold mb-3">Quick Actions</h6>
              <div className="row">
                <div className="col-6 mb-2">
                  <button className="btn btn-primary btn-block">
                    <CalendarIcon /> New Appointment
                  </button>
                </div>
                <div className="col-6 mb-2">
                  <button className="btn btn-secondary btn-block">
                    <MedicalIcon /> Add Prescription
                  </button>
                </div>
                <div className="col-6 mb-2">
                  <button className="btn btn-warning btn-block">
                    <PeopleIcon /> New Patient
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-info btn-block"
                    onClick={fetchClinic}
                  >
                    <LocationIcon /> View Clinic
                  </button>
                </div>
              </div>

              {/* Clinic Information Section */}
              {loading && (
                <div className="card mt-3">
                  <div className="card-body text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2">Loading clinic information...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="card mt-3">
                  <div className="card-body text-center text-danger">
                    <p>{error}</p>
                    <Link
                      to="/doctordashboard/clinic"
                      className="btn btn-primary"
                    >
                      Add Clinic
                    </Link>
                  </div>
                </div>
              )}

              {clinicData && (
                <div className="card mt-3 animate__animated animate__fadeIn">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <LocationIcon className="mr-2" />
                      Clinic Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="font-weight-bold">
                        <LocationIcon className="mr-2 text-primary" />
                        {clinicData.clinicName}
                      </h6>
                      <p className="mb-1">{clinicData.address}</p>
                      <small className="text-muted">
                        {clinicData.cityId?.name || "N/A"},{" "}
                        {clinicData.stateId?.name || "N/A"} -{" "}
                        {clinicData.pincode}
                      </small>
                    </div>

                    <div className="mb-3">
                      <h6 className="font-weight-bold">
                        <ScheduleIcon className="mr-2 text-primary" />
                        Timings
                      </h6>
                      <p className="mb-0">{clinicData.timing}</p>
                    </div>

                    <div className="mb-3">
                      <h6 className="font-weight-bold">
                        <PhoneIcon className="mr-2 text-primary" />
                        Contact
                      </h6>
                      <p className="mb-0">{clinicData.contactNum}</p>
                    </div>

                    {clinicData.about && (
                      <div>
                        <h6 className="font-weight-bold">
                          <InfoIcon className="mr-2 text-primary" />
                          About
                        </h6>
                        <p className="mb-0">{clinicData.about}</p>
                      </div>
                    )}

                    <div className="mt-3">
                      <Link
                        to="/doctordashboard/clinic"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Edit Clinic Information
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
