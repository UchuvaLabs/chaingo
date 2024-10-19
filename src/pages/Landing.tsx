import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Functions from "../components/landing/Functions";
import HeroSection from "../components/landing/HeroSection";
import Navbar from "../components/landing/Navbar";
import TeamSection from "../components/landing/TeamSection";

const Landing = () => {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <Functions></Functions>
      <TeamSection></TeamSection>
      <Contact></Contact>
      <Footer></Footer>
    </div>
  );
};

export default Landing;
