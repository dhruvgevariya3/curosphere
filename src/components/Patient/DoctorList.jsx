import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Grid,
  Box,
  Avatar,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  SchoolTwoTone,
  AccessTime,
  LocationCity,
  DashboardSharp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctor/all");
        if (response.data) {
          setDoctors(response.data.data);
        } else {
          setError("Failed to fetch doctors");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId) => {
    navigate(`/appointmentbooking/${doctorId}`);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Our Doctors
        </Typography>
        <Link to="/patientdashboard">
          <Button
            variant="contained"
            color="primary"
            style={{ height: "42px", marginRight: "56px" }}
            startIcon={<DashboardSharp />}
          >
            Dashboard
          </Button>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <Card
              sx={{
                width: "350px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box sx={{ p: 3, flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={doctor.profilePic}
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 2,
                      bgcolor: "primary.main",
                      color: "white",
                    }}
                  >
                    {doctor.profilePic
                      ? ""
                      : `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(
                          0,
                        )}`}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {doctor.specialization}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <SchoolTwoTone
                      sx={{ mr: 1, color: "text.secondary" }}
                      fontSize="small"
                    />
                    {doctor.qualification}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <AccessTime
                      sx={{ mr: 1, color: "text.secondary" }}
                      fontSize="small"
                    />
                    {doctor.experience} years experience
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LocationCity
                      sx={{ mr: 1, color: "text.secondary" }}
                      fontSize="small"
                    />
                    {doctor.cityId?.name || "City not specified"},{" "}
                    {doctor.stateId?.name || "State not specified"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.12)" }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CalendarIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleBookAppointment(doctor._id)}
                >
                  Book Appointment
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DoctorsList;
