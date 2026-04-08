import { NavBar } from "./elements/NavBar";
import { Aboutus } from "./elements/Aboutus";
import { Features } from "./elements/Features";
import { Teams } from "./elements/Teams";
import { Footer } from "./common/Footer";
import { BackToTop } from "./elements/BackToTop";

export const About = () => (
  <>
    <NavBar />
    <div
      className="container-fluid page-header py-5 mb-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="container py-5">
        <h1 className="display-3 text-white mb-3 animated slideInDown">
          About Us
        </h1>
        <nav aria-label="breadcrumb animated slideInDown">
          <ol className="breadcrumb text-uppercase mb-0">
            <li className="breadcrumb-item">
              <a className="text-white" href="#">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a className="text-white" href="#">
                Pages
              </a>
            </li>
            <li
              className="breadcrumb-item text-primary active"
              aria-current="page"
            >
              About
            </li>
          </ol>
        </nav>
      </div>
    </div>
    {/* Page Header End */}
    {/* About Start */}
    <Aboutus></Aboutus>
    {/* About End */}
    {/* Feature Start */}
    <Features></Features>
    {/* Feature End */}
    {/* Team Start */}
    <Teams></Teams>
    {/* Team End */}
    {/* Footer Start */}
    <Footer></Footer>
    {/* Footer End */}
    {/* Back to Top */}
    <BackToTop></BackToTop>
    {/* JavaScript Libraries */}
    {/* Template Javascript */}
  </>
);
