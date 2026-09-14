import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaShoppingCart, FaLock, FaTachometerAlt, FaDatabase } from 'react-icons/fa';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaServer, FaRocket, FaRss } from 'react-icons/fa';

const Projects = () => {
  const steps = [
    { num: 1, title: "HTML5", icon: <FaHtml5 className="text-3xl text-[#E34F26]" /> },
    { num: 2, title: "CSS3", icon: <FaCss3Alt className="text-3xl text-[#1572B6]" /> },
    {
      num: 3,
      title: "JavaScript (ES6+)",
      icon: <FaJs className="text-3xl text-[#F7DF1E]" />
    },
    { num: 4, title: "React.js", icon: <FaReact className="text-3xl text-[#61DAFB]" /> },
    { num: 5, title: "Node.js", icon: <FaNodeJs className="text-3xl text-[#339933]" /> },
    {
      num: 6,
      title: "Express.js",
      icon: <div className="text-2xl font-bold text-gray-500 font-sans tracking-tight">ex</div>
    },
    {
      num: 7,
      title: "MongoDB",
      icon: <div className="text-3xl text-[#47A248] font-bold"><span className="text-emerald-500">🍃</span></div>
    },
    { num: 8, title: "Authentication (JWT)", icon: <FaLock className="text-2xl text-purple-600" /> },
    { num: 9, title: "REST API", icon: <FaServer className="text-2xl text-pink-500" /> },
    { num: 10, title: "Deploy Live Project", icon: <FaRocket className="text-2xl text-blue-500" /> },
  ];

  const projects = [
    { title: "Student Management System", icon: <FaUsers className="text-[#1a66ff] text-3xl mb-3" /> },
    { title: "E-Commerce Website", icon: <FaShoppingCart className="text-[#eab308] text-3xl mb-3" /> },
    { title: "Authentication System", icon: <FaLock className="text-[#1a66ff] text-3xl mb-3" /> },
    { title: "Admin Dashboard", icon: <FaTachometerAlt className="text-[#64748b] text-3xl mb-3" /> },
    { title: "Blog Website", icon: <FaRss className="text-[#1a66ff] text-3xl mb-3" /> },
    { title: "Full Stack MERN Project", icon: <FaDatabase className="text-[#22c55e] text-3xl mb-3" /> },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ================= Left: Course Roadmap ================= */}
          <div className="w-full lg:w-[48%] text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a66ff] uppercase tracking-wide mb-8">
              Course Roadmap
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  
                  {/* Step Card Circle */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg border border-gray-150 flex items-center justify-center relative hover:scale-105 transition-transform duration-300">
                    {step.icon}

                    {/* Step Number Badge */}
                    <div className="absolute -bottom-1.5 w-6 h-6 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                      {step.num}
                    </div>
                  </div>

                  {/* Step Label */}
                  <h3 className="font-extrabold text-gray-700 text-center text-xs mt-3.5 leading-snug">
                    {step.title}
                  </h3>

                </div>
              ))}
            </div>
          </div>

          {/* ================= Right: Projects You Will Build ================= */}
          <div className="w-full lg:w-[52%] text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a66ff] uppercase tracking-wide mb-8">
              Projects You Will Build
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/90 p-5 flex flex-col items-center justify-center text-center hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 min-h-[140px]"
                >
                  {project.icon}

                  <h3 className="font-extrabold text-gray-800 text-xs sm:text-sm leading-snug">
                    {project.title}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Projects;
