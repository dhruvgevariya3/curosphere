import { PatientNavBar } from "../common/PatientNavBar";
import { Footer } from "../common/Footer";
import { Header } from "../elements/Header";
import { Aboutus } from "../elements/Aboutus";
import { Services } from "../elements/Services";
import { Features } from "../elements/Features";
import { Teams } from "../elements/Teams";
import { Appointments } from "../elements/Appointments";
import { Testimonials } from "../elements/Testimonials";
import { BackToTop } from "../elements/BackToTop";

export const PatientHomePage = () => {
  return (
    <div>
      <PatientNavBar></PatientNavBar>
      <Header></Header>
      <Aboutus></Aboutus>
      <Services></Services>
      <Features></Features>
      <Teams></Teams>
      <Appointments></Appointments>
      <Testimonials></Testimonials>
      <Footer></Footer>
      <BackToTop></BackToTop>
    </div>
  );
};
