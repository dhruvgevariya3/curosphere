import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ViewDoctor = () => {
  const [profile, setprofile] = useState([]);

  const getDoctorProfile = async () => {
    try {
      const res = await axios.get("/doctor/all");
      console.log(res.data);
      setprofile(res.data.data);
    } catch (error) {
      console.error("Error fetching doctor profiles:", error);
    }
  };

  useEffect(() => {
    getDoctorProfile();
  }, []);

  return (
    <>
      {/* Navbar Start */}
      <nav
        className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <a
          href="index.html"
          className="navbar-brand d-flex align-items-center px-4 px-lg-5"
        >
          <h1 className="m-0 text-primary">
            <i className="far fa-hospital me-3" />
            Curosphere
          </h1>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <Link to="/" className="nav-item nav-link active">
              Home
            </Link>
            <Link to="/about" className="nav-item nav-link">
              About
            </Link>
            <Link to="/service" className="nav-item nav-link">
              Services
            </Link>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Pages
              </a>
              <div className="dropdown-menu rounded-0 rounded-bottom m-0">
                <Link to="/feature" className="dropdown-item">
                  Features
                </Link>
                <Link to="/team" className="dropdown-item">
                  Our Doctor
                </Link>

                <Link to="/appointment" className="dropdown-item">
                  Appointment
                </Link>
                <Link to="/testimonial" className="dropdown-item">
                  Testimonial
                </Link>
                <Link to="/error" className="dropdown-item">
                  Error Page
                </Link>
              </div>
            </div>
            <Link to="/contact" className="nav-item nav-link">
              Contact
            </Link>
          </div>
          <Link
            to="/login"
            className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          >
            Logout
            <i className="fa fa-arrow-right ms-3" />
          </Link>
        </div>
      </nav>
      {/* Navbar End */}
      <div
        className="container  "
        style={{ maxWidth: "1600px", backgroundColor: "lightblue" }}
      >
        <h1 className="text-center mb-4">DOCTOR PROFILES</h1>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Specialization</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>About</th>
                <th>Contact</th>
                <th>Profile Picture</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {profile.map((pr) => (
                <tr key={pr._id}>
                  <td>{pr.specialization}</td>
                  <td>{pr.qualification}</td>
                  <td>{pr.experience}</td>
                  <td>{pr.about}</td>
                  <td>{pr.contactNum}</td>
                  <td>
                    <img
                      src={pr?.profilePic}
                      alt="Doctor Profile"
                      className="img-thumbnail"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/updatedoctor/${pr._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer Start */}
      <div
        className="container-fluid bg-dark text-light footer pt-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Address</h5>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                123 Street, New York, USA
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                +012 345 67890
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                info@example.com
              </p>
              <div className="d-flex pt-2">
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-twitter" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-youtube" />
                </a>
                <a
                  className="btn btn-outline-light btn-social rounded-circle"
                  href=""
                >
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Services</h5>
              <a className="btn btn-link" href="">
                Cardiology
              </a>
              <a className="btn btn-link" href="">
                Pulmonary
              </a>
              <a className="btn btn-link" href="">
                Neurology
              </a>
              <a className="btn btn-link" href="">
                Orthopedics
              </a>
              <a className="btn btn-link" href="">
                Laboratory
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Quick Links</h5>
              <a className="btn btn-link" href="">
                About Us
              </a>
              <a className="btn btn-link" href="">
                Contact Us
              </a>
              <a className="btn btn-link" href="">
                Our Services
              </a>
              <a className="btn btn-link" href="">
                Terms &amp; Condition
              </a>
              <a className="btn btn-link" href="">
                Support
              </a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="text-light mb-4">Newsletter</h5>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: 400 }}
              >
                <input
                  className="form-control border-0 w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Your email"
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                ©{" "}
                <a className="border-bottom" href="#">
                  Your Site Name
                </a>
                , All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                {/*/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. *** /*/}
                Designed By{" "}
                <a className="border-bottom" href="https://htmlcodex.com">
                  HTML Codex
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
      {/* Back to Top */}
      <a
        href="#"
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
      >
        <i
          className="bi bi-arrow-up"
          style={{ position: "absolute", right: "13px" }}
        />
      </a>
    </>
  );
};
