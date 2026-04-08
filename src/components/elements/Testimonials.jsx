import testimonial1 from "../../assets/designs/img/testimonial-1.jpg";
import testimonial2 from "../../assets/designs/img/testimonial-2.jpg";
import testimonial3 from "../../assets/designs/img/testimonial-3.jpg";

export const Testimonials = () => (
  <div className="container-xxl py-5 bg-light">
    <div className="container">
      <div
        className="text-center mx-auto mb-5 wow fadeInUp"
        data-wow-delay="0.1s"
        style={{ maxWidth: 600 }}
      >
        <p className="d-inline-block border rounded-pill py-1 px-4">
          Testimonial
        </p>
        <h1>What Say Our Patients!</h1>
      </div>
      <div
        id="testimonialCarousel"
        className="carousel slide carousel-dark"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="testimonial-item text-center">
              <img
                className="img-fluid bg-light rounded-circle p-2 mx-auto mb-4"
                src={testimonial1}
                style={{ width: 100, height: 100 }}
                alt="Testimonial 1"
              />
              <div className="testimonial-text rounded text-center p-4">
                <p>
                  Exceptional care from start to finish. The doctors were
                  attentive, the staff was friendly, and I felt truly cared for
                  throughout my treatment. I would highly recommend Curosphere
                  to anyone seeking reliable and professional medical support.
                </p>
                <h5 className="mb-1">Riya Sharma</h5>
                <span className="fst-italic">Marketing Executive</span>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-item text-center">
              <img
                className="img-fluid bg-light rounded-circle p-2 mx-auto mb-4"
                src={testimonial2}
                style={{ width: 100, height: 100 }}
                alt="Testimonial 2"
              />
              <div className="testimonial-text rounded text-center p-4">
                <p>
                  I visited for a dental procedure and was blown away by the
                  cleanliness and professionalism. The consultation was detailed
                  and the doctor explained everything clearly. I felt safe and
                  informed every step of the way.
                </p>
                <h5 className="mb-1">Amit Verma</h5>
                <span className="fst-italic">Research Scientist</span>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="testimonial-item text-center">
              <img
                className="img-fluid bg-light rounded-circle p-2 mx-auto mb-4"
                src={testimonial3}
                style={{ width: 100, height: 100 }}
                alt="Testimonial 3"
              />
              <div className="testimonial-text rounded text-center p-4">
                <p>
                  Their 24/7 support is a game changer. I had questions late at
                  night and received immediate assistance. The level of
                  commitment and care is unmatched. Curosphere really sets the
                  standard for patient service.
                </p>
                <h5 className="mb-1">Sneh Kapoor</h5>
                <span className="fst-italic">University Student</span>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="prev"
          style={{ position: "absolute", bottom: "50px" }}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="next"
          style={{ position: "absolute", bottom: "50px" }}
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
);
