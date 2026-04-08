import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { HomePage } from "./components/HomePage";
import { Feature } from "./components/Feature";
import { About } from "./components/About";
import { Appointment } from "./components/Appointment";
import { Error } from "./components/Error";
import { Contact } from "./components/Contact";
import { Service } from "./components/Service";
import { Team } from "./components/Team";
import { Testimonial } from "./components/Testimonial";
import { Login } from "./components/common/Login";
import { Signup } from "./components/common/Signup";
import { ForgetPassword } from "./components/common/ForgetPassword";
import { ResetPassword } from "./components/common/ResetPassword";

import { DoctorHomePage } from "./components/Doctor/DoctorHomePage";
import { ViewDoctor } from "./components/Doctor/ViewDoctor";
import { UpdateDoctor } from "./components/Doctor/UpdateDoctor";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { PatientHomePage } from "./components/Patient/PatientHomePage";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import PatientDashboard from "./components/Patient/PatientDashboard";
import { Clinic } from "./components/Doctor/Clinic";
import DoctorProfile from "./components/Doctor/DoctorProfile";
import PatientProfile from "./components/Patient/PatientProfile";
import PrivateRoutes from "./components/hooks/PrivateRoutes";
import UserPrivateRoutes from "./components/hooks/UserPrivateRoutes";
import AppointmentBooking from "./components/Patient/AppointmentBooking";
import DoctorsList from "./components/Patient/DoctorList";
import AppointmentDetails from "./components/Patient/AppointmentDetails";
import AppointmentList from "./components/Patient/AppointmentList";
import PatientsList from "./components/Doctor/PatientList";

function App() {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/about" element={<About />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/*" element={<Error />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/service" element={<Service />} />
      <Route path="/team" element={<Team />} />
      <Route path="/testimonial" element={<Testimonial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />

      <Route path="" element={<PrivateRoutes />}>
        <Route element={<UserPrivateRoutes allowedRole="PATIENT" />}>
          <Route path="/patientdashboard" element={<PatientDashboard />} />
          <Route path="/patientprofile" element={<PatientProfile />} />
          <Route path="/patienthomepage" element={<PatientHomePage />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointmentbooking" element={<AppointmentBooking />} />
          <Route
            path="/appointmentbooking/:doctorId"
            element={<AppointmentBooking />}
          />
          <Route path="/doctor" element={<DoctorsList />} />
        </Route>

        <Route element={<UserPrivateRoutes allowedRole="DOCTOR" />}>
          <Route path="/doctorhomepage" element={<DoctorHomePage />} />
          <Route path="/viewdoctor" element={<ViewDoctor />} />
          <Route path="/updatedoctor" element={<UpdateDoctor />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/doctordashboard" element={<DoctorDashboard />}>
            <Route path="clinic" element={<Clinic />} />
          </Route>
          <Route path="/doctorprofile" element={<DoctorProfile />} />
          <Route path="/patientlist" element={<PatientsList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
