import carousal1 from "../../assets/designs/img/carousel-1.jpg";
import carousal2 from "../../assets/designs/img/carousel-2.jpg";
import carousal3 from "../../assets/designs/img/carousel-3.jpg";

export const Header = () => {
  return (
    <div>
      <div className="container-fluid header bg-primary p-0 mb-5">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 p-5 wow fadeIn" data-wow-delay="0.1s">
            <h1 className="display-4 text-white mb-5">
              Good Health Is The Root Of All Happiness
            </h1>
            <div className="row g-4">
              <div className="col-sm-4">
                <div className="border-start border-light ps-4">
                  <h2 className="text-white mb-1" data-toggle="counter-up">
                    123
                  </h2>
                  <p className="text-light mb-0">Expert Doctors</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="border-start border-light ps-4">
                  <h2 className="text-white mb-1" data-toggle="counter-up">
                    1234
                  </h2>
                  <p className="text-light mb-0">Medical Staff</p>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="border-start border-light ps-4">
                  <h2 className="text-white mb-1" data-toggle="counter-up">
                    12345
                  </h2>
                  <p className="text-light mb-0">Total Patients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div
              id="carouselExampleCaptions"
              className="carousel carousel-dark slide"
            >
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={0}
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                />
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={1}
                  aria-label="Slide 2"
                />
                <button
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to={2}
                  aria-label="Slide 3"
                />
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={carousal1} className="d-block w-100" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <h1>Cardiology</h1>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src={carousal2} className="d-block w-100" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <h1>Neurology</h1>
                  </div>
                </div>
                <div className="carousel-item">
                  <img src={carousal3} className="d-block w-100" alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <h1>Pulmonary</h1>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
