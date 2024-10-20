import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Navbar from "../components/landing/Navbar";
import ShowResult from "../components/landing/services/ShowResult";
import TeamSection from "../components/landing/TeamSection";

const ContractResult = () => {
  return (
    <div className="bg-background">
      <Navbar></Navbar>
      <ShowResult></ShowResult>
      <TeamSection></TeamSection>
      <Contact></Contact>
      <Footer></Footer>
    </div>
  );
};

export default ContractResult;
