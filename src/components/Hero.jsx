import React from "react";
import bgImage from "../assets/bg.png"; // apne path ke hisaab se change karo
import { FaCheckCircle, FaWhatsapp, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaReact, FaNodeJs } from "react-icons/fa";

import { SiExpress, SiMongodb } from "react-icons/si";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative min-h-screen sm:min-h-[calc(100vh-100px)] pt-20 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 bg-[#07152d]/70"></div>

      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          {/* LEFT */}

          <div>
            <span className="inline-block mt-6 text-yellow-200 border border-yellow-200 px-4 py-2 rounded-full text-[10px] lg:text-sm font-semibold shadow-lg">
              LIVE + PRACTICAL MERN STACK TRAINING
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold  leading-tight text-white">
              Become a
              <br />
              Job-Ready
              <br />
              <span className="text-green-400">MERN</span> Stack Developer
            </h1>

            <p className="text-gray-300 mt-2 lg:text-md text-[12px] leading-8 max-w-xl font-bold">
              Learn HTML, CSS, JavaScript, React.js, Node.js, Express.js &
              MongoDB with Real Projects & Practical Training.
            </p>

            {/* PRICE + FEATURES */}

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-12 mt-5">
              <div>
                <p className="text-yellow-400 font-semibold">Course Fee</p>

                <h2 className="lg:text-6xl text-4xl font-bold text-orange-500">₹6,000</h2>

                <p className="text-white">Limited Time Offer!</p>
              </div>

              <div className="space-y-1 lg:text-[20px] text-[12px]">
                {[
                  "Live Practical Training",
                  "Industry Projects",
                  "Interview Preparation",
                  "Certificate",
                  "Placement Assistance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row flex-wrap items-start gap-4 mt-8 w-full">
<button
  onClick={() => {
    document.getElementById("reviews")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="h-14 w-full sm:w-auto px-8 bg-orange-500 rounded-lg font-bold text-white hover:bg-orange-600 transition"
>
  ENROLL NOW
</button>

          
<button
  onClick={() => window.open("https://wa.me/919993376705", "_blank")}
  className="h-14 w-full sm:w-auto px-8 bg-green-500 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:bg-green-600 transition"
>
  <FaWhatsapp className="text-xl" />
  CHAT ON WHATSAPP
</button>

              <button className="h-14 w-full sm:w-auto px-8 border border-gray-400 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:bg-white hover:text-black transition">
                <FaDownload />
                DOWNLOAD SYLLABUS
              </button>
            </div>
          </div>

          {/* RIGHT */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
