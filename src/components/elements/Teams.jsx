import team1 from "../../assets/designs/img/team-1.jpg";
import team2 from "../../assets/designs/img/team-2.jpg";
import team3 from "../../assets/designs/img/team-3.jpg";
import team4 from "../../assets/designs/img/team-4.jpg";

export const Teams = () => (
  <div className="container-xxl py-5">
    <div className="container">
      <div
        className="text-center mx-auto mb-5 wow fadeInUp"
        data-wow-delay="0.1s"
        style={{ maxWidth: 600 }}
      >
        <p className="d-inline-block border rounded-pill py-1 px-4">Doctors</p>
        <h1>Our Experience Doctors</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
          <div className="team-item position-relative rounded overflow-hidden">
            <div className="overflow-hidden">
              <img className="img-fluid" src={team1} alt="Dr. Emily Thompson" />
            </div>
            <div className="team-text bg-light text-center p-4">
              <h5>Dr. Emily Thompson</h5>
              <p className="text-primary">Neurologist</p>
              <div className="team-social text-center">
                <a className="btn btn-square" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
          <div className="team-item position-relative rounded overflow-hidden">
            <div className="overflow-hidden">
              <img className="img-fluid" src={team2} alt="Dr. James Carter" />
            </div>
            <div className="team-text bg-light text-center p-4">
              <h5>Dr. James Carter</h5>
              <p className="text-primary">Cardiologist</p>
              <div className="team-social text-center">
                <a className="btn btn-square" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
          <div className="team-item position-relative rounded overflow-hidden">
            <div className="overflow-hidden">
              <img className="img-fluid" src={team3} alt="Dr. Olivia Bennett" />
            </div>
            <div className="team-text bg-light text-center p-4">
              <h5>Dr. Olivia Bennett</h5>
              <p className="text-primary">Pulmonologist</p>
              <div className="team-social text-center">
                <a className="btn btn-square" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
          <div className="team-item position-relative rounded overflow-hidden">
            <div className="overflow-hidden">
              <img className="img-fluid" src={team4} alt="Dr. Daniel Reed" />
            </div>
            <div className="team-text bg-light text-center p-4">
              <h5>Dr. Daniel Reed</h5>
              <p className="text-primary">Orthopedic Surgeon</p>
              <div className="team-social text-center">
                <a className="btn btn-square" href="">
                  <i className="fab fa-facebook-f" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-twitter" />
                </a>
                <a className="btn btn-square" href="">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
