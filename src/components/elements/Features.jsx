import feature from "../../assets/designs/img/feature.jpg";

export const Features = () => (
  <div className="container-fluid bg-primary overflow-hidden my-5 px-lg-0">
    <div className="container feature px-lg-0">
      <div className="row g-0 mx-lg-0">
        <div
          className="col-lg-6 feature-text py-5 wow fadeIn"
          data-wow-delay="0.1s"
        >
          <div className="p-lg-5 ps-lg-0">
            <p className="d-inline-block border rounded-pill text-light py-1 px-4">
              Features
            </p>
            <h1 className="text-white mb-4">Why Choose Us</h1>
            <p className="text-white mb-4 pb-2">
              At Curosphere, we prioritize your health with top-tier medical
              services, expert professionals, and a patient-first approach.
              Here is why patients trust us:
            </p>
            <div className="row g-4">
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex flex-shrink-0 align-items-center justify-content-center rounded-circle bg-light"
                    style={{ width: 55, height: 55 }}
                  >
                    <i className="fa fa-user-md text-primary" />
                  </div>
                  <div className="ms-4">
                    <p className="text-white mb-2">Experience</p>
                    <h5 className="text-white mb-0">Doctors</h5>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex flex-shrink-0 align-items-center justify-content-center rounded-circle bg-light"
                    style={{ width: 55, height: 55 }}
                  >
                    <i className="fa fa-check text-primary" />
                  </div>
                  <div className="ms-4">
                    <p className="text-white mb-2">Quality</p>
                    <h5 className="text-white mb-0">Services</h5>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex flex-shrink-0 align-items-center justify-content-center rounded-circle bg-light"
                    style={{ width: 55, height: 55 }}
                  >
                    <i className="fa fa-comment-medical text-primary" />
                  </div>
                  <div className="ms-4">
                    <p className="text-white mb-2">Positive</p>
                    <h5 className="text-white mb-0">Consultation</h5>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex flex-shrink-0 align-items-center justify-content-center rounded-circle bg-light"
                    style={{ width: 55, height: 55 }}
                  >
                    <i className="fa fa-headphones text-primary" />
                  </div>
                  <div className="ms-4">
                    <p className="text-white mb-2">24 Hours</p>
                    <h5 className="text-white mb-0">Support</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-lg-6 pe-lg-0 wow fadeIn"
          data-wow-delay="0.5s"
          style={{ minHeight: 400 }}
        >
          <div className="position-relative h-100">
            <img
              className="position-absolute img-fluid w-100 h-100"
              src={feature}
              style={{ objectFit: "cover" }}
              alt="Feature"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
