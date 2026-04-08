import { Link } from "react-router-dom";
import ImageDropDown from "./ImageDropDown";

export const DocNavBar = () => {
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg  navbar-light sticky-top p-0 wow fadeIn"
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
            <Link to="/doctorhomepage" className="nav-item nav-link active">
              Home
            </Link>
            <Link to="/doctordashboard" className="nav-item nav-link">
              Dashboard
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

                <Link to="/viewdoctor" className="dropdown-item">
                  View Doctor
                </Link>
              </div>
            </div>
            <Link to="/contact" className="nav-item nav-link">
              Contact
            </Link>
          </div>

          <ImageDropDown></ImageDropDown>
          {/* <i className="fa fa-arrow-right ms-3" /> */}
        </div>
      </nav>
    </div>
  );
};
