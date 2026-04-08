import { AddDoctor } from "./AddDoctor";
import { DocNavBar } from "../common/DocNavBar";
import { Header } from "../elements/Header";
import { Aboutus } from "../elements/Aboutus";
import { Services } from "../elements/Services";
import { Features } from "../elements/Features";
import { Teams } from "../elements/Teams";
import { Appointments } from "../elements/Appointments";
import { Footer } from "../common/Footer";
import { Testimonials } from "../elements/Testimonials";
import { BackToTop } from "../elements/BackToTop";

export const DoctorHomePage = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>Curosphere</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta content="" name="keywords" />
      <meta content="" name="description" />

      {/* Topbar End */}
      {/* Navbar Start */}
      <DocNavBar />
      {/* Navbar End */}
      {/* Header Start */}

      <Header />
      {/* Header End */}
      {/* About Start */}

      <Aboutus />
      {/* About End */}
      {/* Service Start */}

      <Services />
      {/* Service End */}
      {/* Feature Start */}

      <Features />
      {/* Feature End */}
      {/* Add Doctor Start */}
      <AddDoctor />
      {/* Add Doctor End */}

      <Teams />
      {/* Team End */}

      <Appointments />
      {/* Appointment End */}

      <Testimonials />
      {/* Testimonial End */}
      {/* Footer Start */}
      <Footer />
      {/* Footer End */}

      <BackToTop />
    </>
  );
};
