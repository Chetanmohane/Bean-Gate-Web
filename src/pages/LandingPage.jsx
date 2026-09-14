import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Projects from "../components/Projects";
import WhyChoose from "../components/WhyChoose";
import Trainer from "../components/Trainer";
import Offer from "../components/Offer";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Cartificate from "../components/Cartificate";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
    <Navbar />

<section id="home">
  <Hero />
</section>

<section id="course">
  <Stats />
</section>

<section id="projects" className="scroll-mt-24">
  <Projects />
</section>

<section id="trainer">
  <Trainer />
</section>
<section id="cartificate">
  <Cartificate/>
</section>
<section id="reviews">
  <Offer />
</section>

<section id="faq">
  <FAQ />
</section>

<section id="contact">
  <Footer />
</section>
    </div>
  );
};

export default LandingPage;