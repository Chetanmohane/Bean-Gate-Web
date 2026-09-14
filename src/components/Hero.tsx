import React from "react";
import bgImage from "../assets/bg.png";
import { FaCheckCircle } from "react-icons/fa";
import { FaReact, FaNodeJs } from "react-icons/fa";
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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#071428]/85"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 text-left space-y-5">
            
            {/* Industry Level Training Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              INDUSTRY-LEVEL TRAINING
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight">
              <span className="text-[#ff5500]">MERN</span> Stack{" "}
              <br className="hidden sm:inline" />
              Practical Training with Real-World Projects
            </h1>

            {/* Subtitle arrows */}
            <p className="text-white text-base sm:text-xl font-bold tracking-wide flex items-center gap-2">
              Learn <span className="text-[#ff5500]">→</span> Code <span className="text-[#ff5500]">→</span> Build <span className="text-[#ff5500]">→</span> Lead
            </p>

            {/* Paragraph */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-medium">
              Master Frontend, Backend and Database by building real-world applications from scratch. Gain practical skills and become industry-ready.
            </p>

            {/* Special Offer Card + Checklist */}
            <div className="grid sm:grid-cols-12 gap-5 bg-[#091833]/90 border border-white/10 rounded-2xl p-5 max-w-2xl shadow-2xl">
              
              {/* Fee Block */}
              <div className="sm:col-span-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4 text-left">
                <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-widest mb-1">
                  SPECIAL OFFER
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-[#ff5500] tracking-tight">
                  ₹6,499
                </h2>
                <p className="text-gray-300 text-xs font-semibold mt-1">
                  One-Time Course Fee
                </p>
              </div>

              {/* Checklist Block */}
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
            <div className="pt-2">
              <button
                onClick={scrollToRegister}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#ff5500] hover:bg-[#e64d00] text-white rounded-lg font-black text-sm tracking-wider shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer border-none"
              >
                JOIN NOW – ₹6,499
              </button>
              <p className="text-gray-400 text-[11px] font-semibold mt-2.5">
                Limited Seats - Enroll Now &amp; Start Your Journey
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Tech Graphics */}
          <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center relative">
            
            {/* Tech Hexagon Glow Box */}
            <div className="relative w-full max-w-[420px] bg-gradient-to-b from-[#0e2246]/60 to-[#071428]/90 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
              
              {/* Graphic Title */}
              <div className="relative mb-6 text-center">
                <span className="text-2xl font-black text-cyan-400 tracking-widest uppercase">
                  MERN STACK
                </span>
              </div>

              {/* Tech Icon Grid */}
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                
                <div className="bg-[#071428] border border-cyan-500/30 p-4 rounded-xl flex flex-col items-center justify-center">
                  <SiMongodb className="text-3xl text-emerald-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-300">MongoDB</span>
                </div>

                <div className="bg-[#071428] border border-cyan-500/30 p-4 rounded-xl flex flex-col items-center justify-center">
                  <SiExpress className="text-3xl text-gray-200 mb-1" />
                  <span className="text-[10px] font-bold text-gray-300">Express.js</span>
                </div>

                <div className="bg-[#071428] border border-cyan-500/30 p-4 rounded-xl flex flex-col items-center justify-center">
                  <FaReact className="text-3xl text-sky-400 mb-1 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="text-[10px] font-bold text-gray-300">React.js</span>
                </div>

                <div className="bg-[#071428] border border-cyan-500/30 p-4 rounded-xl flex flex-col items-center justify-center">
                  <FaNodeJs className="text-3xl text-green-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-300">Node.js</span>
                </div>

              </div>

              {/* 3 Pill Tabs at Bottom */}
              <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-white/10 text-center">
                
                <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
                  <FaReact className="text-sky-400 mx-auto text-sm mb-1" />
                  <p className="text-[9px] font-bold text-white leading-tight">Frontend</p>
                  <p className="text-[8px] text-gray-400">React.js</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
                  <SiExpress className="text-gray-200 mx-auto text-sm mb-1" />
                  <p className="text-[9px] font-bold text-white leading-tight">Backend</p>
                  <p className="text-[8px] text-gray-400">Node, Express</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg py-2 px-1">
                  <SiMongodb className="text-emerald-400 mx-auto text-sm mb-1" />
                  <p className="text-[9px] font-bold text-white leading-tight">Database</p>
                  <p className="text-[8px] text-gray-400">MongoDB</p>
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
