export const Footer = () => (
  <div
    className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn"
    data-wow-delay="0.1s"
  >
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-4 col-md-6">
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
        <div className="col-lg-4 col-md-6">
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
        <div className="col-lg-4 col-md-6">
          <h5 className="text-light mb-4">Newsletter</h5>
          <p>Signup for our monthly newsletter.</p>
          <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
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
              Curosphere
            </a>
            , All Right Reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            Designed By{" "}
            <a className="border-bottom" href="#">
              Dhruv Gevariya
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
