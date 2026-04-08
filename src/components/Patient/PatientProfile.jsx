import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { DashboardSharp } from "@mui/icons-material";

const PatientProfile = () => {
  const userId = localStorage.getItem("id");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    contactNum: "",
    bornyear: "",
    about: "",
    stateId: "",
    cityId: "",
  });

  // Fetch all states
  const getAllStates = async () => {
    try {
      const res = await axios.get("/state/all");
      setStates(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Fetch cities by state
  const getCityByStateId = async (id) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${id}`);
      setCities(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Fetch patient profile
  const fetchPatientProfile = async () => {
    try {
      const response = await axios.get(`/user/profile/${userId}`);
      if (response.data.data) {
        setPatient(response.data.data);
        setFormData({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          gender: response.data.data.gender,
          contactNum: response.data.data.contactNum,
          bornyear: response.data.data.bornyear,
          about: response.data.data.about || "",
          stateId: response.data.data.stateId?._id || "",
          cityId: response.data.data.cityId?._id || "",
        });

        if (response.data.data.stateId?._id) {
          await getCityByStateId(response.data.data.stateId._id);
        }

        if (response.data.data.profilePic) {
          setImagePreview(response.data.data.profilePic);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStates();
    fetchPatientProfile();
  }, [userId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImagePreview(patient?.profilePic || null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "stateId" && value) {
      getCityByStateId(value);
      setFormData((prev) => ({ ...prev, cityId: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all fields except email
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("contactNum", formData.contactNum);
      formDataToSend.append("bornyear", formData.bornyear);
      formDataToSend.append("about", formData.about);

      // Only append stateId and cityId if they exist
      if (formData.stateId) {
        formDataToSend.append("stateId", formData.stateId);
      }
      if (formData.cityId) {
        formDataToSend.append("cityId", formData.cityId);
      }

      // Append the file if a new one was selected
      if (fileInputRef.current.files[0]) {
        formDataToSend.append("profilePic", fileInputRef.current.files[0]);
      }

      // Add authorization header if using JWT
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.put(
        `/user/update/${userId}`,
        formDataToSend,
        config,
      );

      if (response.data && response.data.data) {
        setPatient(response.data.data);
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        handleClose();
        fetchPatientProfile();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to update profile";
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Typography variant="h4" fontWeight="bold">
            Welcome Back,{" "}
            <span className="text-primary">{patient?.firstName}</span>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Patient Profile
          </Typography>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/patientdashboard">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
            >
              <DashboardSharp />
              Dashboard
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleOpen}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-4 mb-4 mb-md-0">
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <img
              src={
                imagePreview ||
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              }
              alt={`${patient?.firstName} ${patient?.lastName}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </div>

        <div className="col-md-8">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {patient?.firstName} {patient?.lastName}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {patient?.email}
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography>
                  {patient?.cityId?.name || "City not specified"},{" "}
                  {patient?.stateId?.name || "State not specified"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography>{patient?.gender}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography>Born in {patient?.bornyear}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography>{patient?.contactNum}</Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* About Section */}
      <Card sx={{ p: 4, mb: 5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          About {patient?.firstName}
        </Typography>
        <Typography variant="body1">
          {patient?.about || "No information available about this patient."}
        </Typography>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            padding: "16px 24px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "12px",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginBottom: "16px",
                    border: "3px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <img
                    src={
                      imagePreview ||
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    }
                    alt="Profile Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CloudUploadIcon />}
                  onClick={triggerFileInput}
                  disabled={isSubmitting}
                >
                  Upload Photo
                </Button>
                <Typography
                  variant="caption"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  JPG, PNG, GIF or WEBP. Max size of 5MB
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {[
                  {
                    label: "First Name",
                    name: "firstName",
                    xs: 6,
                    required: true,
                  },
                  {
                    label: "Last Name",
                    name: "lastName",
                    xs: 6,
                    required: true,
                  },
                  {
                    label: "Email",
                    name: "email",
                    xs: 6,
                    type: "email",
                    disabled: true,
                  },
                  {
                    label: "Contact Number",
                    name: "contactNum",
                    xs: 6,
                    required: true,
                  },
                  {
                    label: "Birth Year",
                    name: "bornyear",
                    xs: 6,
                    type: "number",
                    required: true,
                  },
                ].map((field, index) => (
                  <Grid item xs={field.xs} key={index}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || "text"}
                      value={formData[field.name]}
                      onChange={handleChange}
                      margin="normal"
                      variant="outlined"
                      required={field.required}
                      disabled={isSubmitting || field.disabled}
                      InputProps={{
                        readOnly: field.disabled,
                      }}
                    />
                  </Grid>
                ))}

                {/* Gender Dropdown */}
                <Grid item xs={12} md={8} container spacing={2}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    style={{ width: "204px" }}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Gender"
                      required
                      disabled={isSubmitting}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* State Dropdown */}
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    style={{ width: "204px" }}
                  >
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      id="stateId"
                      name="stateId"
                      value={formData.stateId}
                      onChange={handleChange}
                      label="State"
                      disabled={isSubmitting}
                    >
                      {states.map((state) => (
                        <MenuItem key={state._id} value={state._id}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* City Dropdown */}
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    style={{ width: "204px" }}
                  >
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      id="cityId"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      label="City"
                      disabled={isSubmitting || !formData.stateId}
                    >
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <MenuItem key={city._id} value={city._id}>
                            {city.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          {formData.stateId
                            ? "No cities available"
                            : "Select state first"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={1}
                    disabled={isSubmitting}
                    style={{ width: "204px" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PatientProfile;
