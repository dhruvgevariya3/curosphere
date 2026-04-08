import { NavBar } from "./elements/NavBar";
import { Header } from "./elements/Header";
import { Aboutus } from "./elements/Aboutus";
import { Services } from "./elements/Services";
import { Features } from "./elements/Features";
import { Teams } from "./elements/Teams";
import { Testimonials } from "./elements/Testimonials";
import { Footer } from "./common/Footer";
import { BackToTop } from "./elements/BackToTop";

export const HomePage = () => (
  <>
    <NavBar />
    <Header />
    <Aboutus />
    <Services />
    <Features />
    <Teams />
    <Testimonials />
    <Footer />
    <BackToTop />
  </>
);
