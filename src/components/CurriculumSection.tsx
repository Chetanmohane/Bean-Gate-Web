import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CurriculumSection = () => {
  const modules = [
    { num: "01", title: "HTML & CSS Fundamentals" },
    { num: "02", title: "JavaScript Essentials" },
    { num: "03", title: "React.js Development" },
    { num: "04", title: "Node.js Backend" },
    { num: "05", title: "Express.js Framework" },
    { num: "06", title: "MongoDB Database" },
    { num: "07", title: "Full Stack Integration" },
    { num: "08", title: "Real-World Projects" },
  ];

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-14 bg-gray-50 border-b border-gray-100" id="curriculum">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 text-center">
        
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
          What You Will Learn (Curriculum)
        </h2>

        {/* 8 Module Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:border-blue-400 transition min-h-[110px]"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black mb-2">
                {mod.num}
              </span>
              <p className="text-[11px] font-extrabold text-gray-800 leading-snug">
                {mod.title}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={scrollToRegister}
          className="inline-flex items-center gap-2 border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white px-6 py-2.5 rounded-md text-xs font-black tracking-wider uppercase transition cursor-pointer"
        >
          VIEW DETAILED CURRICULUM <FaArrowRight className="text-xs" />
        </button>

      </div>
    </section>
  );
};

export default CurriculumSection;
