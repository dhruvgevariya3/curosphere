import{ useState, useEffect } from "react";

import {
  Home as HomeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  Assignment as ReportIcon,
  ArrowForward as ArrowForwardIcon,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import DoctorsList from "./DoctorList";
import { FaHospital } from "react-icons/fa";
import axios from "axios";

const PatientDashboard = () => {
  const [patientDetails, setPatientDetails] = useState();
  const [showDoctors, setShowDoctors] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPatientData = async () => {
  //     try {
  //       // In a real app, you would get the patient ID from auth context or localStorage
  //       const patientId = localStorage.getItem("id") // Replace with actual patient ID

  //       // Fetch appointments
  //       const appointmentsRes = await axios.get(`/appointment/getall?patientId=${patientId}`);
  //       const formattedAppointments = appointmentsRes.data.data.map(appointment => ({
  //         id: appointment._id,
  //         doctor: `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
  //         time: new Date(appointment.appointmentDate).toLocaleString(),
  //         type: appointment.complain || "General Checkup",
  //         avatar: `${appointment.doctorId.firstName.charAt(0)}${appointment.doctorId.lastName.charAt(0)}`,
  //         status: appointment.statusId || "Scheduled"
  //       }));
  //       setUpcomingAppointments(formattedAppointments);

  //       // Fetch prescriptions (mock data for now)
  //       setRecentPrescriptions([
  //         {
  //           id: 1,
  //           medication: "Amoxicillin",
  //           dosage: "500mg",
  //           frequency: "3 times daily",
  //           status: "Active",
  //         },
  //         {
  //           id: 2,
  //           medication: "Ibuprofen",
  //           dosage: "200mg",
  //           frequency: "As needed",
  //           status: "Completed",
  //         },
  //       ]);
  //     } catch (err) {
  //       console.error("Error fetching patient data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPatientData();
  // }, []);
  // useEffect(() => {
  //   const fetchPatientData = async () => {
  //     try {
  //       const patientId = localStorage.getItem("id");
  //       const token = localStorage.getItem("token");

  //       // First fetch patient details
  //       const patientRes = await axios.get(`/user/get/${patientId}`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       const patientData = patientRes.data;
  //       console.log(patientData.data.firstName)

  //       // Set patient details
  //       const patientName = `${patientData.data.firstName} ${patientData.data.lastName}`;
  //       // const patientInitials = `${patientData.data.firstName}${patientData.data.lastName}`;

  //       // Rest of your existing code for appointments and prescriptions
  //       const appointmentsRes = await axios.get(`/appointment/getall?patientId=${patientId}`);
  //       const formattedAppointments = appointmentsRes.data.data.map(appointment => ({

  //         id: appointment._id,
  //         doctor: `Dr. `,
  //         // ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}
  //         time: new Date(appointment.appointmentDate).toLocaleString(),
  //         type: appointment.complain || "General Checkup",
  //         // avatar: `${appointment.doctorId.firstName.charAt(0)}${appointment.doctorId.lastName.charAt(0)}`,
  //         status: appointment.statusId || "Scheduled"
  //       }));
  //       setUpcomingAppointments(formattedAppointments);

  //       setRecentPrescriptions([
  //         {
  //           id: 1,
  //           medication: "Amoxicillin",
  //           dosage: "500mg",
  //           frequency: "3 times daily",
  //           status: "Active",
  //         },
  //         {
  //           id: 2,
  //           medication: "Ibuprofen",
  //           dosage: "200mg",
  //           frequency: "As needed",
  //           status: "Completed",
  //         },
  //       ]);

  //       // Update the patient details in the UI
  //       setPatientDetails({
  //         name: patientName,
  //         // initials: patientInitials,
  //         role: "Patient"
  //       });

  //     } catch (err) {
  //       console.error("Error fetching patient data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPatientData();
  // }, []);
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientId = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        // Fetch patient details
        const patientRes = await axios.get(`/user/get/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const patientData = patientRes.data.data;
        const patientName = `${patientData.firstName} ${patientData.lastName}`;
        setPatientDetails({
          name: patientName,
          role: "Patient",
          initails: `${patientData.firstName.charAt(0)}${patientData.lastName.charAt(0)}`,
        });

        // Fetch appointments
        const appointmentsRes = await axios.get(
          `/appointment/getall?patientId=${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(appointmentsRes);

        const appointmentsWithDoctors = await Promise.all(
          appointmentsRes.data.data
            .filter((appointment) => appointment.statusId === "scheduled")
            .map(async (appointment) => {
              try {
                const doctorId = appointment.clinicId?.doctorId;
                const doctorRes = await axios.get(`/user/get/${doctorId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                const doctor = doctorRes.data.data;
                return {
                  id: appointment._id,
                  doctor: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                  time: `${appointment.appointmentDate.slice(0, 10)} at ${appointment.appointmentTime}`,

                  type: appointment.complain || "General Checkup",
                  avatar: `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`,
                  status: appointment.statusId || "Scheduled",
                };
              } catch (err) {
                console.error("Error fetching doctor details:", err);
                return {
                  id: appointment._id,
                  doctor: "Dr. Unknown",
                  date: new Date(appointment.appointmentDate).toLocaleString(),
                  time: appointment.appointmentTime,
                  type: appointment.complain || "General Checkup",
                  avatar: "UD",
                  status: appointment.statusId || "Scheduled",
                };
              }
            }),
        );

        setUpcomingAppointments(appointmentsWithDoctors);

        // Prescriptions (mock)
        setRecentPrescriptions([
          {
            id: 1,
            medication: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            status: "Active",
          },
          {
            id: 2,
            medication: "Ibuprofen",
            dosage: "200mg",
            frequency: "As needed",
            status: "Completed",
          },
        ]);
      } catch (err) {
        console.error("Error fetching patient data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const handleShowDoctors = () => {
    setShowDoctors(true);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

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
          zIndex: 100,
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
              {patientDetails.initails}
            </div>
          </div>
          <div className="ml-3">
            <h6 className="font-weight-bold mb-1">{patientDetails.name}</h6>
            <small className="text-secondary">{patientDetails.role}</small>
          </div>
        </div>

        <nav className="p-2">
          <small className="text-secondary d-block mb-2">MAIN NAVIGATION</small>
          <ul className="list-group list-group-flush">
            <li
              className="list-group-item list-group-item-action rounded mb-1"
              style={{
                backgroundColor: !showDoctors ? "#e0f2fe" : "",
                cursor: "pointer",
              }}
              onClick={() => setShowDoctors(false)}
            >
              <HomeIcon
                className={!showDoctors ? "text-primary mr-2" : "mr-2"}
              />
              <span className={!showDoctors ? "text-primary" : ""}>
                Dashboard
              </span>
            </li>
            <Link
              to="/patientprofile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li className="list-group-item list-group-item-action rounded mb-1">
                <PersonIcon className="mr-2" />
                My Profile
              </li>
            </Link>
          </ul>

          <small className="text-secondary d-block mt-3 mb-2">SERVICES</small>
          <ul className="list-group list-group-flush">
            <Link
              to="/appointments"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li className="list-group-item list-group-item-action rounded mb-1">
                <CalendarIcon className="mr-2" />
                Appointments
                {upcomingAppointments.length > 0 && (
                  <span className="badge badge-danger ml-auto">
                    {upcomingAppointments.length}
                  </span>
                )}
              </li>
            </Link>
            <li
              className="list-group-item list-group-item-action rounded mb-1"
              onClick={handleShowDoctors}
              style={{
                backgroundColor: showDoctors ? "#e0f2fe" : "",
                cursor: "pointer",
              }}
            >
              <HospitalIcon
                className={showDoctors ? "text-primary mr-2" : "mr-2"}
              />
              <span className={showDoctors ? "text-primary" : ""}>Doctors</span>
            </li>
            <li className="list-group-item list-group-item-action rounded mb-1">
              <MedicationIcon className="mr-2" />
              Prescriptions
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className="flex-grow-1 animate__animated animate__fadeIn"
        style={{ marginLeft: "280px" }}
      >
        {showDoctors ? (
          <DoctorsList />
        ) : (
          <div className="p-3">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="font-weight-bold">
                Welcome Back,{" "}
                <span className="text-primary font-weight-bold">
                  {patientDetails.name.split(" ")[0]}
                </span>
              </h4>
              <div className="d-flex align-items-center">
                {/* <button
                  className="btn btn-primary mr-2"
                  style={{ marginRight: "10px" }}
                >
                  <NotificationsIcon />{" "}
                  <span className="badge badge-danger ml-1">1</span>
                </button> */}
                {/* <div
  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
  style={{ width: "40px", height: "40px", marginRight: "10px" }}
>
  {patientDetails.initials}
</div> */}
                <button
                  onClick={handleLogout}
                  type="submit"
                  className="btn btn-primary mr-2"
                >
                  <Logout />{" "}
                  <span className="badge badge-danger ml-1">Logout</span>
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
                      <small className="text-secondary">
                        Upcoming Appointments
                      </small>
                      <Link
                        to="/appointments"
                        className="btn btn-sm btn-light mt-1"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3 mb-md-0">
                <div
                  className="card animate__animated animate__fadeInUp border-top border-warning border-4"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="card-body d-flex align-items-center">
                    <div className="rounded-circle bg-warning-light p-2 mr-2">
                      <MedicationIcon className="text-warning" />
                    </div>
                    <div>
                      <h5 className="font-weight-bold mb-0">
                        {
                          recentPrescriptions.filter(
                            (p) => p.status === "Active",
                          ).length
                        }
                      </h5>
                      <small className="text-secondary">
                        Active Prescriptions
                      </small>
                      <button className="btn btn-sm btn-light mt-1">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card animate__animated animate__fadeInUp border-top border-info border-4"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="card-body d-flex align-items-center">
                    <div className="rounded-circle bg-info-light p-2 mr-2">
                      <ReportIcon className="text-info" />
                    </div>
                    <div>
                      <h5 className="font-weight-bold mb-0">5</h5>
                      <small className="text-secondary">Medical Records</small>
                      <button className="btn btn-sm btn-light mt-1">
                        View All
                      </button>
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
                      <h6 className="font-weight-bold mb-0">
                        Upcoming Appointments
                      </h6>
                      <Link
                        to="/doctor"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Schedule New
                      </Link>
                    </div>
                    {upcomingAppointments.length > 0 ? (
                      <ul className="list-group">
                        {upcomingAppointments.map((appointment) => (
                          <li
                            key={appointment.id}
                            className="list-group-item d-flex align-items-center border-bottom"
                          >
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-2"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {appointment.avatar}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="font-weight-bold mb-0">
                                {appointment.doctor}
                              </h6>
                              <small className="text-secondary d-block">
                                {appointment.time}
                              </small>
                              <small className="text-secondary">
                                {appointment.type}
                              </small>
                            </div>
                            <Link
                              to={`/appointments/${appointment.id}`}
                              className="btn btn-sm btn-light"
                            >
                              Details <ArrowForwardIcon />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4">
                        <p>No upcoming appointments</p>
                        <Link to="/doctor" className="btn btn-primary">
                          Book an Appointment
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Prescriptions */}
              <div className="col-md-6 mb-3">
                <div className="card animate__animated animate__fadeInUp">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="font-weight-bold mb-0">
                        Recent Prescriptions
                      </h6>
                      <button className="btn btn-outline-primary btn-sm">
                        View All
                      </button>
                    </div>
                    <ul className="list-group">
                      {recentPrescriptions.map((prescription) => (
                        <li
                          key={prescription.id}
                          className="list-group-item d-flex align-items-center border-bottom"
                        >
                          <div className="flex-grow-1">
                            <h6 className="font-weight-bold mb-0">
                              {prescription.medication}
                            </h6>
                            <div className="d-flex">
                              <small className="text-secondary mr-2">
                                {prescription.dosage}
                              </small>
                              <small className="text-secondary">
                                {prescription.frequency}
                              </small>
                            </div>
                          </div>
                          <span
                            className={`badge ${
                              prescription.status === "Active"
                                ? "badge-success"
                                : "badge-secondary"
                            }`}
                          >
                            {prescription.status}
                          </span>
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
                        <Link
                          to="/doctor"
                          className="btn btn-primary btn-block"
                        >
                          <CalendarIcon /> Book Appointment
                        </Link>
                      </div>
                      <div className="col-6 mb-2">
                        <button
                          className="btn btn-secondary btn-block"
                          onClick={handleShowDoctors}
                        >
                          <HospitalIcon /> Find a Doctor
                        </button>
                      </div>
                      <div className="col-6 mb-2">
                        <button className="btn btn-warning btn-block">
                          <MedicationIcon /> Request Refill
                        </button>
                      </div>
                      <div className="col-6">
                        <button className="btn btn-info btn-block">
                          <ReportIcon /> Download Records
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Summary */}
              <div className="col-md-6">
                <div className="card animate__animated animate__fadeInUp">
                  <div className="card-body">
                    <h6 className="font-weight-bold mb-3">Health Summary</h6>
                    <div className="row">
                      <div className="col-4 mb-2">
                        <div className="card border p-2 text-center">
                          <small className="text-secondary">
                            Blood Pressure
                          </small>
                          <h6 className="font-weight-bold mb-0">120/80</h6>
                          <span className="badge badge-success mt-1">
                            Normal
                          </span>
                        </div>
                      </div>
                      <div className="col-4 mb-2">
                        <div className="card border p-2 text-center">
                          <small className="text-secondary">Heart Rate</small>
                          <h6 className="font-weight-bold mb-0">72 bpm</h6>
                          <span className="badge badge-success mt-1">
                            Normal
                          </span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card border p-2 text-center">
                          <small className="text-secondary">Last Checkup</small>
                          <h6 className="font-weight-bold mb-0">15 days</h6>
                          <Link
                            to="/appointmentbooking"
                            className="btn btn-sm btn-light mt-1"
                          >
                            Schedule
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
