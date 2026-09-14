import React from "react";
import bgImage from "../assets/bg.png";
import imageman from "../assets/imageman.png";
import { FaCheckCircle, FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

const Hero = () => {
  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen pt-28 pb-16 bg-cover bg-center bg-no-repeat overflow-hidden flex items-center bg-[#050c18]"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Dark space overlay */}
      <div className="absolute inset-0 bg-[#060e20]/90"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1f3d] border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase shadow-md">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              INDUSTRY-LEVEL TRAINING
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                <span className="text-[#ff5500]">MERN</span> STACK
              </h1>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
                Practical Training with Real-World Projects
              </h2>
            </div>

            {/* Subtitle arrows */}
            <p className="text-white text-base sm:text-lg font-extrabold tracking-wide flex items-center gap-3">
              <span className="text-[#ff5500]">Learn</span>
              <span className="text-gray-300">→</span>
              <span className="text-[#ff5500]">Code</span>
              <span className="text-gray-300">→</span>
              <span className="text-[#ff5500]">Build</span>
              <span className="text-gray-300">→</span>
              <span className="text-[#ff5500]">Lead</span>
            </p>

            {/* Description */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
              Master Frontend, Backend and Database by building real-world applications from scratch. Gain practical skills and become industry-ready.
            </p>

            {/* Special Offer Card + Checklist Box */}
            <div className="grid sm:grid-cols-12 gap-5 bg-[#09152e]/90 border border-[#16274e] rounded-2xl p-5 max-w-xl shadow-2xl backdrop-blur-md">
              
              {/* Left Fee Block */}
              <div className="sm:col-span-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4 text-left">
                <div className="mb-2">
                  <span className="border border-orange-500/40 text-orange-400 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-widest uppercase inline-block">
                    SPECIAL OFFER
                  </span>
                </div>
                <h3 className="text-4xl sm:text-5xl font-black text-[#ff5500] tracking-tight leading-none">
                  ₹6,499
                </h3>
                <p className="text-gray-400 text-xs font-semibold mt-1">
                  One-Time Course Fee
                </p>
              </div>

              {/* Right Checklist Block */}
              <div className="sm:col-span-7 flex flex-col justify-center sm:pl-2 space-y-2 text-left">
                {[
                  "Real-World Projects",
                  "Practical & Hands-On Learning",
                  "Industry-Oriented Skills",
                  "Placement Assistance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white">
                    <FaCheckCircle className="text-[#ff5500] shrink-0 text-sm" />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* CTA BUTTON */}
            <div className="pt-1">
              <button
                onClick={scrollToRegister}
                className="w-full sm:w-auto px-9 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] text-white rounded-xl font-black text-sm tracking-wider shadow-xl shadow-orange-500/20 transition transform hover:-translate-y-0.5 cursor-pointer border-none"
              >
                JOIN NOW – ₹6,499
              </button>
              <p className="text-gray-400 text-[11px] font-semibold mt-2.5">
                Limited Seats - Enroll Now &amp; Start Your Journey
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Developer Card Frame */}
          <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center">
            
            {/* Dark Outer Box Frame */}
            <div className="w-full max-w-[480px] bg-[#081229] border border-blue-900/60 rounded-3xl p-6 shadow-2xl relative flex flex-col">
              
              {/* Outer Card Title */}
              <h3 className="text-cyan-400 font-black text-xl tracking-widest uppercase mb-4 text-center">
                MERN STACK
              </h3>

              {/* Photo Box with Overlaid Badges */}
              <div className="relative rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg group">
                <img
                  src={imageman}
                  alt="Developer Workstation Setup"
                  className="w-full h-[250px] object-cover object-center"
                />

                {/* Badge Top-Left: MongoDB */}
                <div className="absolute top-3 left-3 bg-[#09152b]/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                  <SiMongodb className="text-emerald-400 text-sm" />
                  <span>MongoDB</span>
                </div>

                {/* Badge Top-Right: Express.js */}
                <div className="absolute top-3 right-3 bg-[#09152b]/90 border border-white/30 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                  <SiExpress className="text-gray-200 text-sm" />
                  <span>Express.js</span>
                </div>

                {/* Badge Bottom-Left: React.js */}
                <div className="absolute bottom-3 left-3 bg-[#09152b]/90 border border-sky-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                  <FaReact className="text-sky-400 text-sm animate-spin" style={{ animationDuration: '10s' }} />
                  <span>React.js</span>
                </div>

                {/* Badge Bottom-Right: Node.js */}
                <div className="absolute bottom-3 right-3 bg-[#09152b]/90 border border-green-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                  <FaNodeJs className="text-green-400 text-sm" />
                  <span>Node.js</span>
                </div>
              </div>

              {/* Bottom 3 Technology Cards */}
              <div className="grid grid-cols-3 gap-3 w-full">
                
                <div className="bg-[#050c1b] border border-blue-900/40 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <FaReact className="text-sky-400 text-lg mb-1" />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Frontend</p>
                  <p className="text-xs font-extrabold text-white mt-0.5">React.js</p>
                </div>

                <div className="bg-[#050c1b] border border-blue-900/40 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <FaNodeJs className="text-green-400 text-lg mb-1" />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Backend</p>
                  <p className="text-xs font-extrabold text-white mt-0.5">Node, Express</p>
                </div>

                <div className="bg-[#050c1b] border border-blue-900/40 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                  <SiMongodb className="text-emerald-400 text-lg mb-1" />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Database</p>
                  <p className="text-xs font-extrabold text-white mt-0.5">MongoDB</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
