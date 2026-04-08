import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  ArrowBack as BackIcon,
  LocalHospital as HospitalIcon,
  Work as SpecialtyIcon,
  Description as ReasonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as TimingIcon,
} from "@mui/icons-material";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const AppointmentBooking = () => {
  let { doctorId } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [complain, setComplain] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const [doctorResponse] = await Promise.all([
          axios.get(`/doctor/getdoctorbyid/${doctorId}`),
        ]);

        localStorage.setItem("userId", doctorResponse.data.data.userId);
        setDoctor(doctorResponse.data.data);
        const userId = localStorage.getItem("userId");

        const clinicresponse = await axios.get(`/clinic/doctor/${userId}`);
        setClinics(clinicresponse.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && date) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await axios.get("/appointment/available-slots", {
            params: {
              doctorId,
              date: new Date(date).toISOString(),
            },
          });
          setAvailableSlots(response.data.data);
          setTimeSlot("");
        } catch (err) {
          console.error("Error fetching available slots:", err);
        }
      };

      fetchAvailableSlots();
    }
  }, [doctorId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const patientId = localStorage.getItem("id");
      doctorId = localStorage.getItem("userId");
      await axios.post("/appointment/add", {
        patientId,
        doctorId,
        appointmentDate: date,
        appointmentTime: timeSlot,
        complain,
      });

      navigate("/appointments", { state: { bookingSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 1; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      options.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

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

  if (!doctor) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          Doctor not found
        </Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          variant="outlined"
          color="primary"
        >
          Back to Doctors
        </Button>

        <Grid container spacing={4}>
          {/* Doctor Profile Section */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "510px",
                  }}
                >
                  <Avatar
                    src={doctor.profilePicture || "/default-avatar.jpg"}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Dr. {doctor.firstName} {doctor.lastName}
                  </Typography>
                  <Chip
                    icon={<SpecialtyIcon fontSize="small" />}
                    label={doctor.specialization || "General Physician"}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {doctor.bio ||
                    "Experienced doctor with a patient-centered approach to healthcare."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Clinic Details Section */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    width: "510px",
                  }}
                >
                  <HospitalIcon sx={{ mr: 1 }} />
                  Clinic Details
                </Typography>
                {clinics.length > 0 ? (
                  <List dense>
                    {clinics.map((clinic) => (
                      <React.Fragment key={clinic._id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <LocationIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={clinic.clinicName}
                            secondary={clinic.address || "Not specified"}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <TimingIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Timings"
                            secondary={clinic.timing || "Not specified"}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <PhoneIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Contact"
                            secondary={clinic.contactNum || "Not specified"}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No clinic information available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Form Section */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                background:
                  "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "#1976d2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CalendarIcon fontSize="large" />
                Book Your Appointment
              </Typography>

              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "#e3f2fd",
                  borderRadius: 2,
                  borderLeft: "4px solid #1976d2",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Available time slots are shown in green
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Date Picker */}
                  <div style={{ width: "250px" }}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          <CalendarIcon
                            color="primary"
                            sx={{ mr: 1, fontSize: "1rem" }}
                          />
                          Select Date
                        </Typography>
                        <FormControl fullWidth required>
                          <Select
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                              "& .MuiSelect-select": {
                                p: 1,
                                pl: 0,
                              },
                            }}
                          >
                            {dateOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                                  {option.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Paper>
                    </Grid>
                  </div>
                  {/* Time Slot Picker */}
                  <div style={{ width: "250px" }}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          <TimeIcon
                            color="primary"
                            sx={{ mr: 1, fontSize: "1rem" }}
                          />
                          Select Time
                        </Typography>
                        <FormControl fullWidth required disabled={!date}>
                          <Select
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                              "& .MuiSelect-select": {
                                p: 1,
                                pl: 0,
                              },
                            }}
                          >
                            {availableSlots.length > 0 ? (
                              availableSlots.map((slot) => (
                                <MenuItem key={slot} value={slot}>
                                  <Chip
                                    label={slot}
                                    color="success"
                                    size="small"
                                    sx={{
                                      backgroundColor: "#e8f5e9",
                                      color: "#2e7d32",
                                      fontWeight: 500,
                                    }}
                                  />
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                {date
                                  ? "No available slots"
                                  : "Please select a date first"}
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Paper>
                    </Grid>
                  </div>
                  {/* Reason for Visit */}
                  <div style={{ width: "530px" }}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          "&:hover": {
                            borderColor: "#1976d2",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, fontWeight: 600 }}
                        >
                          <ReasonIcon
                            color="primary"
                            sx={{ mr: 1, fontSize: "1rem" }}
                          />
                          Reason for Visit
                        </Typography>
                        <TextField
                          rows={1}
                          fullWidth
                          required
                          value={complain}
                          onChange={(e) => setComplain(e.target.value)}
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              p: 1,
                              "& textarea": {
                                minHeight: "80px",
                              },
                            },
                          }}
                        />
                      </Paper>
                    </Grid>
                  </div>
                  {error && (
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: "#ffebee",
                          borderRadius: 2,
                        }}
                      >
                        <Typography color="error" variant="body2">
                          {error}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        pt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        disabled={submitting}
                        startIcon={<BackIcon />}
                        size="large"
                        sx={{
                          px: 4,
                          borderRadius: 2,
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting || !timeSlot}
                        size="large"
                        sx={{
                          px: 4,
                          borderRadius: 2,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        {submitting ? (
                          <>
                            <CircularProgress
                              size={24}
                              color="inherit"
                              sx={{ mr: 1 }}
                            />
                            Booking...
                          </>
                        ) : (
                          "Confirm Appointment"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default AppointmentBooking;
