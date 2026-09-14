import React from "react";
import { FaLaptopCode, FaShoppingCart, FaTasks, FaSchool, FaBriefcase } from "react-icons/fa";

const Projects = () => {
  const projectsList = [
    { title: "Admin Dashboard Management System", icon: <FaLaptopCode className="text-2xl text-[#ff5500] mb-2" /> },
    { title: "E-Commerce Web Application", icon: <FaShoppingCart className="text-2xl text-emerald-500 mb-2" /> },
    { title: "Task Manager Application", icon: <FaTasks className="text-2xl text-purple-500 mb-2" /> },
    { title: "School Management System", icon: <FaSchool className="text-2xl text-blue-500 mb-2" /> },
    { title: "Other Industry Based Projects", icon: <FaBriefcase className="text-2xl text-orange-400 mb-2" /> },
  ];

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-14 bg-white border-b border-gray-100" id="projects">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-4 text-left space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Learn By Building Real-World Projects
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
              Work on real projects and build industry-ready applications.
            </p>

            <div>
              <button
                onClick={scrollToRegister}
                className="border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white px-5 py-2 rounded-md text-xs font-black tracking-wider uppercase transition cursor-pointer"
              >
                SEE PROJECTS
              </button>
            </div>
          </div>

          {/* Right Column: 5 Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {projectsList.map((p, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-400 transition min-h-[130px]"
              >
                {p.icon}
                <p className="text-[11px] font-extrabold text-gray-800 leading-snug">
                  {p.title}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Projects;
