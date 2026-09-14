import React from "react";
import bgImage from "../assets/bg.png"; 
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen pt-24 pb-16 bg-cover bg-center bg-no-repeat overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Background Gradient & Blur for premium dark space feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1c]/90 via-[#071329]/80 to-[#060c1c]/95"></div>

      {/* Floating Neon Background Halos */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Heading & Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Premium Glowing Live Capsule */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] text-[10px] sm:text-xs font-black tracking-widest text-orange-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              LIVE + PRACTICAL MERN STACK TRAINING
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight font-sans">
              Become a <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 text-transparent bg-clip-text">Job-Ready</span>
              <br />
              MERN Stack Developer
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-medium">
              Master frontend and backend engineering. Learn HTML, CSS, JavaScript, React.js, Node.js, Express.js & MongoDB with commercial production projects and live training.
            </p>

            {/* Premium Feature & Price Card Grid */}
            <div className="grid sm:grid-cols-12 gap-6 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-3xl p-6 max-w-2xl">
              
              {/* Fee block */}
              <div className="sm:col-span-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5 pb-4 sm:pb-0 sm:pr-6 text-left">
                <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-1">Special Discount Fee</p>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 tracking-tight">₹6,000</h2>
              </div>

              {/* Checklist block */}
              <div className="sm:col-span-7 flex flex-col justify-center sm:pl-4 space-y-2.5 text-left">
                {[
                  "Live Practical Core Training Sessions",
                  "Portfolio Projects & Resume Guidance",
                  "Dedicated Career & Placement Support",
                  "Recognized Course Certificate",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-gray-200">
                    <FaCheckCircle className="text-orange-500 shrink-0 text-sm" />
                    <span className="font-semibold leading-snug">{item}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 pt-4 w-full">
              <button
                onClick={() => {
                  document.getElementById("reviews")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="h-14 w-full sm:w-auto px-8 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition transform hover:-translate-y-0.5 duration-300 cursor-pointer border-none"
              >
                ENROLL NOW
              </button>

              <button
                onClick={() => window.open("https://wa.me/919993376705", "_blank")}
                className="h-14 w-full sm:w-auto px-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-xl font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition transform hover:-translate-y-0.5 duration-300 cursor-pointer border-none"
              >
                <FaWhatsapp className="text-base" />
                CHAT ON WHATSAPP
              </button>
            </div>

          </div>

          {/* RIGHT: Floating interactive technology illustration (Desktop only) */}
          <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center relative min-h-[400px]">
            {/* Center Sphere Glow */}
            <div className="absolute w-64 h-64 bg-violet-600/15 rounded-full blur-[70px] pointer-events-none animate-pulse"></div>

            {/* Technology Badge Box Grid */}
            <div className="grid grid-cols-2 gap-5 relative z-10 w-full max-w-[340px]">
              
              {/* React Card */}
              <div className="bg-[#0b1329]/50 backdrop-blur-md border border-sky-500/15 p-5 rounded-2xl flex flex-col items-center justify-center hover:border-sky-500/40 hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] transition duration-500 animate-bounce" style={{ animationDuration: "6s" }}>
                <FaReact className="text-4xl text-sky-400 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="block mt-2.5 text-[10px] font-black tracking-widest text-sky-400 uppercase">React.js</span>
              </div>

              {/* Node Card */}
              <div className="bg-[#0b1329]/50 backdrop-blur-md border border-green-500/15 p-5 rounded-2xl flex flex-col items-center justify-center hover:border-green-500/40 hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition duration-500 animate-bounce" style={{ animationDuration: "7s", animationDelay: "1s" }}>
                <FaNodeJs className="text-4xl text-green-400" />
                <span className="block mt-2.5 text-[10px] font-black tracking-widest text-green-400 uppercase">Node.js</span>
              </div>

              {/* Express Card */}
              <div className="bg-[#0b1329]/50 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] transition duration-500 animate-bounce" style={{ animationDuration: "5s", animationDelay: "2s" }}>
                <SiExpress className="text-4xl text-gray-200" />
                <span className="block mt-2.5 text-[10px] font-black tracking-widest text-gray-200 uppercase">Express.js</span>
              </div>

              {/* MongoDB Card */}
              <div className="bg-[#0b1329]/50 backdrop-blur-md border border-emerald-500/15 p-5 rounded-2xl flex flex-col items-center justify-center hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition duration-500 animate-bounce" style={{ animationDuration: "8s", animationDelay: "0.5s" }}>
                <SiMongodb className="text-4xl text-emerald-400" />
                <span className="block mt-2.5 text-[10px] font-black tracking-widest text-emerald-400 uppercase">MongoDB</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
