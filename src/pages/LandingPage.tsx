import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DegreeSection from "../components/DegreeSection";
import ITCompanySection from "../components/ITCompanySection";
import TechStackSection from "../components/TechStackSection";
import CurriculumSection from "../components/CurriculumSection";
import Projects from "../components/Projects";
import Offer from "../components/Offer";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

const LandingPage = () => {
  const [selectedPlanId, setSelectedPlanId] = useState("one-time");
  const [appliedDiscount, setAppliedDiscount] = useState(false);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen overflow-x-hidden">
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="why-beangate">
        <DegreeSection />
      </section>

      <section id="company">
        <ITCompanySection />
      </section>

      <section id="course">
        <TechStackSection />
      </section>

      <section id="curriculum">
        <CurriculumSection />
      </section>

      <section id="projects" className="scroll-mt-24">
        <Projects />
      </section>

      <section id="register">
        <Offer 
          selectedPlanId={selectedPlanId}
          setSelectedPlanId={setSelectedPlanId}
          appliedDiscount={appliedDiscount}
          setAppliedDiscount={setAppliedDiscount}
        />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;