import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
  DashboardSharp,
} from "@mui/icons-material";
import axios from "axios";

const AppointmentList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (location.state?.bookingSuccess) {
      setSnackbarMessage("Appointment booked successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (location.state?.cancellationSuccess) {
      setSnackbarMessage("Appointment cancelled successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }

    // Clear location state to prevent showing the message again
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        // First fetch all appointments for the patient
        const response = await axios.get(
          `/appointment/getall?patientId=${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Then fetch doctor details for each appointment
        const appointmentsWithDoctorDetails = await Promise.all(
          response.data.data.map(async (appointment) => {
            try {
              console.log(appointment);

              const doctorResponse = await axios.get(
                `/user/get/${appointment.clinicId.doctorId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              return {
                ...appointment,
                doctorDetails: doctorResponse.data.data,
              };
            } catch (err) {
              console.error(
                `Failed to fetch doctor details for doctorId: ${appointment.doctorId}`,
                err,
              );
              return {
                ...appointment,
                doctorDetails: {
                  firstName: "Unknown",
                  lastName: "Doctor",
                },
              };
            }
          }),
        );

        setAppointments(appointmentsWithDoctorDetails);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">My Appointments</Typography>
        <Link to="/patientdashboard">
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "220px", height: "42px" }}
          >
            <DashboardSharp /> Dashboard
          </Button>
        </Link>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/doctor")}
        >
          New Appointment
        </Button>
      </Box>

      <Paper elevation={3}>
        {appointments.length > 0 ? (
          <List>
            {appointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const formattedDate = appointmentDate.toLocaleDateString();
              const formattedTime = appointment.appointmentTime;
              const doctorName = `Dr. ${appointment.doctorDetails?.firstName || "Unknown"} ${appointment.doctorDetails?.lastName || "Doctor"}`;
              const initials = `${appointment.doctorDetails?.firstName?.charAt(0) || "U"}${appointment.doctorDetails?.lastName?.charAt(0) || "D"}`;

              return (
                <React.Fragment key={appointment._id}>
                  <ListItem
                    button
                    onClick={() => navigate(`/appointments/${appointment._id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar>{initials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={doctorName}
                      secondary={
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                            {`${formattedDate} at ${formattedTime}`}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Reason: {appointment.complain || "General Checkup"}
                          </Typography>
                        </>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={appointment.statusId}
                        size="small"
                        color={
                          appointment.statusId === "scheduled"
                            ? "primary"
                            : appointment.statusId === "completed"
                              ? "success"
                              : appointment.statusId === "cancelled"
                                ? "error"
                                : "default"
                        }
                        sx={{ mr: 1 }}
                      />
                      <ArrowIcon />
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              You do not have any appointments yet
            </Typography>
            <Button variant="contained" onClick={() => navigate("/doctor")}>
              Book Your First Appointment
            </Button>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppointmentList;
