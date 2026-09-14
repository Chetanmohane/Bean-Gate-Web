import React from "react";
import { SiMongodb, SiExpress, SiHtml5, SiJavascript, SiGit } from "react-icons/si";
import { FaReact, FaNodeJs, FaNetworkWired, FaCss3Alt } from "react-icons/fa";

const TechStackSection = () => {
  const mernTech = [
    { name: "MongoDB", icon: <SiMongodb className="text-3xl text-emerald-500" /> },
    { name: "Express.js", icon: <SiExpress className="text-3xl text-gray-800" /> },
    { name: "React.js", icon: <FaReact className="text-3xl text-sky-400" /> },
    { name: "Node.js", icon: <FaNodeJs className="text-3xl text-green-500" /> },
  ];

  const alsoLearn = [
    { name: "HTML5", icon: <SiHtml5 className="text-2xl text-orange-500" /> },
    { name: "CSS3", icon: <FaCss3Alt className="text-2xl text-blue-500" /> },
    { name: "JavaScript", icon: <SiJavascript className="text-2xl text-yellow-400" /> },
    { name: "Git & GitHub", icon: <SiGit className="text-2xl text-orange-600" /> },
    { name: "REST API", icon: <FaNetworkWired className="text-2xl text-gray-700" /> },
  ];

  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Master the MERN Stack */}
          <div className="lg:col-span-5 text-left">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">
              Master the <span className="text-[#ff5500]">MERN</span> Stack
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {mernTech.map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition"
                >
                  <div className="mb-2">{tech.icon}</div>
                  <span className="text-[11px] font-bold text-gray-800">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Also You Will Learn */}
          <div className="lg:col-span-7 text-left">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">
              Also You Will Learn
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {alsoLearn.map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow transition"
                >
                  <div className="mb-2">{tech.icon}</div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-800">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
