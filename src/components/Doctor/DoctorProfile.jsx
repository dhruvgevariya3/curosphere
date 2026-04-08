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
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { DashboardSharp } from "@mui/icons-material";

const DoctorProfile = () => {
  const userId = localStorage.getItem("id");
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);

  const getAllStates = async () => {
    try {
      const res = await axios.get("/state/all");
      setStates(res.data.data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setSnackbar({
        open: true,
        message: "Failed to load states",
        severity: "error",
      });
    }
  };

  const getCityByStateId = async (id) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${id}`);
      setCities(res.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSnackbar({
        open: true,
        message: "Failed to load cities",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    getAllStates();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    qualification: "",
    experience: "",
    about: "",
    contactNum: "",
    stateId: "",
    cityId: "",
    userId: userId,
  });

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`/doctor/getprofile/${userId}`);
      if (response.data.data) {
        setDoctor(response.data.data);
        setFormData({
          firstName: response.data.data.firstName || "",
          lastName: response.data.data.lastName || "",
          specialization: response.data.data.specialization || "",
          qualification: response.data.data.qualification || "",
          experience: response.data.data.experience || "",
          about: response.data.data.about || "",
          contactNum: response.data.data.contactNum || "",
          stateId: response.data.data.stateId?._id || "",
          cityId: response.data.data.cityId?._id || "",
          userId: userId,
        });

        // If doctor has state, load cities for that state
        if (response.data.data.stateId?._id) {
          getCityByStateId(response.data.data.stateId._id);
        }

        if (response.data.data.profilePic) {
          setImagePreview(response.data.data.profilePic);
        }
      } else {
        setDoctor(null); // No profile exists
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setDoctor(null); // Expected case - no profile exists
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [userId]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setImagePreview(doctor?.profilePic || null);
    setUploadProgress(0);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // When state changes, load cities for that state
    if (name === "stateId" && value) {
      getCityByStateId(value);
      // Reset city when state changes
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
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (fileInputRef.current.files[0]) {
        formDataToSend.append("profilePic", fileInputRef.current.files[0]);
      }

      let response;
      if (doctor) {
        // Update existing profile
        response = await axios.put(
          `/doctor/updatedoctor/${doctor._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            },
          },
        );
      } else {
        // Create new profile
        response = await axios.post(`/doctor/addwithfile`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        });
      }

      setDoctor(response.data.data);
      setSnackbar({
        open: true,
        message: doctor
          ? "Profile updated successfully!"
          : "Profile created successfully!",
        severity: "success",
      });
      handleClose();
      fetchDoctorProfile(); // Refresh profile data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
      setSnackbar({
        open: true,
        message: "Failed to save profile",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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

  if (error && error !== "No profile found") {
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

  // Show create profile UI if no profile exists
  if (doctor === null && loading === false) {
    return (
      <div className="container py-5 animate__animated animate__fadeIn">
        <div className="row mb-5 align-items-center">
          <div className="col-12 text-center">
            <Typography variant="h4" gutterBottom>
              You do not have a doctor profile yet
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: "8px",
                padding: "10px 24px",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",
              }}
            >
              Create Doctor Profile
            </Button>
          </div>
        </div>

        {/* Create Profile Dialog */}
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
            Create Doctor Profile
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
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={uploadProgress}
                          size={60}
                          thickness={4}
                          sx={{ color: "primary.light" }}
                        />
                      </Box>
                    )}
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
                    sx={{
                      borderRadius: "8px",
                      padding: "8px 16px",
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Upload Photo
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{
                      marginTop: "8px",
                      color: "text.secondary",
                    }}
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
                      label: "Specialization",
                      name: "specialization",
                      xs: 6,
                      required: true,
                    },
                    {
                      label: "Qualification",
                      name: "qualification",
                      xs: 6,
                      required: true,
                    },
                    {
                      label: "Years of Experience",
                      name: "experience",
                      xs: 6,
                      type: "number",
                      required: true,
                    },
                    {
                      label: "Contact Number",
                      name: "contactNum",
                      xs: 6,
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
                        disabled={isSubmitting}
                      />
                    </Grid>
                  ))}

                  {/* State Dropdown */}
                  <Grid item xs={6} style={{ width: "204px" }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="state-label">State</InputLabel>
                      <Select
                        labelId="state-label"
                        id="stateId"
                        name="stateId"
                        value={formData.stateId}
                        onChange={handleChange}
                        label="State"
                        required
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
                  <Grid item xs={6} style={{ width: "204px" }}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="city-label">City</InputLabel>
                      <Select
                        labelId="city-label"
                        id="cityId"
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleChange}
                        label="City"
                        required
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
      </div>
    );
  }

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="font-weight-bold">
            Welcome Back,{" "}
            <span className="text-primary font-weight-bold"></span>
          </h4>
          <small className="text-secondary"></small>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/doctordashboard">
            <Button
              variant="contained"
              color="primary"
              startIcon={<DashboardSharp />}
              sx={{
                borderRadius: "8px",
                padding: "8px 16px",
                textTransform: "none",
                fontWeight: "bold",
                marginRight: "20px",
              }}
            >
              Dashboard
            </Button>
          </Link>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="row mb-5 align-items-center">
        <div className="col-md-4 mb-4 mb-md-0">
          <div className="position-relative">
            <img
              src={
                doctor.profilePic ||
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              }
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="img-fluid rounded shadow-lg"
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Typography
                variant="h2"
                className="mb-2"
                sx={{ fontWeight: "bold" }}
              >
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <Typography variant="h5" className="text-muted mb-3">
                {doctor.specialization} Specialist
              </Typography>
            </div>
          </div>

          <div className="d-flex align-items-center mb-4">
            <Box sx={{ color: "warning.main" }} className="me-2">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </Box>
            <Typography variant="body1" className="text-muted">
              4.9 (248 reviews)
            </Typography>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className="d-flex align-items-center">
                <LocationOnIcon color="primary" className="me-2" />
                {doctor.cityId?.name || "City not specified"},{" "}
                {doctor.stateId?.name || "State not specified"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className="d-flex align-items-center">
                <SchoolIcon color="primary" className="me-2" />
                {doctor.qualification}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className="d-flex align-items-center">
                <AccessTimeIcon color="primary" className="me-2" />
                {doctor.experience} years experience
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" className="d-flex align-items-center">
                <AttachMoneyIcon color="primary" className="me-2" />
                $200 consultation
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Content Sections */}
      <Card className="p-4 mb-5 shadow-sm" sx={{ borderRadius: "12px" }}>
        <Typography
          variant="h4"
          className="mb-4 pb-2 border-bottom"
          sx={{ fontWeight: "bold" }}
        >
          About Dr. {doctor.lastName}
        </Typography>
        <Typography variant="body1" paragraph>
          {doctor.about || "No information available about this doctor."}
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
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={uploadProgress}
                        size={60}
                        thickness={4}
                        sx={{ color: "primary.light" }}
                      />
                    </Box>
                  )}
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
                  sx={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Upload Photo
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    marginTop: "8px",
                    color: "text.secondary",
                  }}
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
                    label: "Specialization",
                    name: "specialization",
                    xs: 6,
                    required: true,
                  },
                  {
                    label: "Qualification",
                    name: "qualification",
                    xs: 6,
                    required: true,
                  },
                  {
                    label: "Years of Experience",
                    name: "experience",
                    xs: 6,
                    type: "number",
                    required: true,
                  },
                  {
                    label: "Contact Number",
                    name: "contactNum",
                    xs: 6,
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
                      disabled={isSubmitting}
                    />
                  </Grid>
                ))}
                {/* State Dropdown */}
                <Grid item xs={6} width={"204px"}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      id="stateId"
                      name="stateId"
                      value={formData.stateId}
                      onChange={handleChange}
                      label="State"
                      required
                      disabled={isSubmitting}
                      variant="outlined"
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
                <Grid item xs={6} width={"204px"}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      id="cityId"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      label="City"
                      required
                      disabled={isSubmitting || !formData.stateId}
                      variant="outlined"
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

                <Grid item xs={12} width={"204px"}>
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

export default DoctorProfile;
