import about1 from "../../assets/designs/img/about-1.jpg";
import about2 from "../../assets/designs/img/about-2.jpg";

export const Aboutus = () => (
  <div className="container-xxl py-5">
    <div className="container">
      <div className="row g-5">
        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
          <div className="d-flex flex-column">
            <img
              className="img-fluid rounded w-75 align-self-end"
              src={about1}
              alt="About Curosphere 1"
            />
            <img
              className="img-fluid rounded w-50 bg-white pt-3 pe-3"
              src={about2}
              alt="About Curosphere 2"
              style={{ marginTop: "-25%" }}
            />
          </div>
        </div>
        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
          <p className="d-inline-block border rounded-pill py-1 px-4">
            About Us
          </p>
          <h1 className="mb-4">Why You Should Trust Us? Get Know About Us!</h1>
          <p>
            Welcome to Curosphere, your trusted partner in seamless healthcare
            access. We understand that booking a doctor’s appointment should be
            quick, easy, and stress-free. That’s why we’ve created a platform
            that connects patients with top-rated doctors, specialists, and
            healthcare providers in just a few clicks.
          </p>
          <p className="mb-4">
            At Curosphere, we’re dedicated to revolutionizing healthcare
            accessibility. By leveraging technology, we bridge the gap between
            patients and medical professionals, ensuring timely care, reduced
            wait times, and a hassle-free booking experience.
          </p>
          <p>
            <i className="far fa-check-circle text-primary me-3" />
            Quality health care
          </p>
          <p>
            <i className="far fa-check-circle text-primary me-3" />
            Only Qualified Doctors
          </p>
          <p>
            <i className="far fa-check-circle text-primary me-3" />
            Medical Research Professionals
          </p>
          <a className="btn btn-primary rounded-pill py-3 px-5 mt-3" href="">
            Read More
          </a>
        </div>
      </div>
    </div>
  </div>
);
