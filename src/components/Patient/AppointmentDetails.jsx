import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
  LocalHospital as DoctorIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import axios from "axios";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/appointment/get/${id}`);
        const appointmentData = response.data.data;
        setAppointment(appointmentData);

        // Now fetch doctor details
        const doctorId = appointmentData.clinicId?.doctorId;
        if (doctorId) {
          const doctorRes = await axios.get(`/user/get/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctorDetails(doctorRes.data.data);
        }
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to fetch appointment details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  console.log(appointment);
  console.log(doctorDetails);

  const handleCancel = async () => {
    try {
      await axios.patch(`/appointment/cancel/${id}`, {
        cancelReason: "Patient requested cancellation",
      });
      navigate("/appointments", { state: { cancellationSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel appointment");
    }
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

  if (!appointment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4">Appointment not found</Typography>
      </Container>
    );
  }

  const appointmentDate = new Date(appointment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString();
  const formattedTime = appointment.appointmentTime;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate("/appointments")}
        sx={{ mb: 3 }}
      >
        Back to Appointments
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Appointment Details</Typography>
          <Chip
            label={appointment.statusId}
            color={
              appointment.statusId === "scheduled"
                ? "primary"
                : appointment.statusId === "completed"
                  ? "success"
                  : appointment.statusId === "cancelled"
                    ? "error"
                    : "default"
            }
          />
        </Box>

        <List>
          <ListItem>
            <ListItemText
              primary="Date"
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  {formattedDate}
                </Box>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Time"
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TimeIcon sx={{ mr: 1 }} />
                  {formattedTime}
                </Box>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Doctor"
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DoctorIcon sx={{ mr: 1 }} />
                  {doctorDetails
                    ? `Dr. ${doctorDetails.firstName} ${doctorDetails.lastName}`
                    : "Loading..."}
                </Box>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Patient"
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  {`${appointment.patientId.firstName} ${appointment.patientId.lastName}`}
                </Box>
              }
            />
          </ListItem>
          <Divider />

          <ListItem>
            <ListItemText
              primary="Reason for Visit"
              secondary={appointment.complain}
            />
          </ListItem>
          <Divider />

          {appointment.cancelReason && (
            <ListItem>
              <ListItemText
                primary="Cancellation Reason"
                secondary={appointment.cancelReason}
              />
            </ListItem>
          )}
        </List>

        {appointment.statusId === "scheduled" && (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel Appointment
            </Button>
            <Button variant="contained" onClick={() => navigate(`/doctor`)}>
              Reschedule
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AppointmentDetails;
