import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaShoppingCart, FaLock, FaTachometerAlt, FaBlog, FaDatabase } from 'react-icons/fa';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,FaServer, FaRocket } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';

const Projects = () => {
    const steps = [
      { num: 1, title: "HTML5", icon: <FaHtml5 className="text-[#E34F26]" /> },
      { num: 2, title: "CSS3", icon: <FaCss3Alt className="text-[#1572B6]" /> },
      { num: 3, title: "JavaScript (ES6+)", icon: <FaJs className="text-[#F7DF1E]" /> },
      { num: 4, title: "React.js", icon: <FaReact className="text-[#61DAFB]" /> },
      { num: 5, title: "Node.js", icon: <FaNodeJs className="text-[#339933]" /> },
      { num: 6, title: "Express.js", icon: <SiExpress className="text-gray-800" /> },
      { num: 7, title: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
      { num: 8, title: "Authentication (JWT)", icon: <FaLock className="text-purple-600" /> },
      { num: 9, title: "REST API", icon: <FaServer className="text-pink-500" /> },
      { num: 10, title: "Deploy Live Project", icon: <FaRocket className="text-blue-500" /> },
    ];
  const projects = [
    { title: "Student Management System", icon: <FaUsers className="text-[#3b82f6] text-4xl" /> },
    { title: "E-Commerce Website", icon: <FaShoppingCart className="text-[#eab308] text-4xl" /> },
    { title: "Authentication System", icon: <FaLock className="text-[#3b82f6] text-4xl" /> },
    { title: "Admin Dashboard", icon: <FaTachometerAlt className="text-[#64748b] text-4xl" /> },
    { title: "Blog Website", icon: <FaBlog className="text-[#3b82f6] text-4xl" /> },
    { title: "Full Stack MERN Project", icon: <FaDatabase className="text-[#22c55e] text-4xl" /> },
  ];

  return (
  <section className="py-20 bg-gray-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Mobile = Column | Desktop = Row */}
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-10">

      {/* ================= Roadmap ================= */}
      <div className="w-full lg:w-1/2">
        <div className="text-start mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 uppercase tracking-wider">
            Course Roadmap
          </h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-3xl sm:text-4xl mb-4 relative z-10 group hover:scale-110 transition-transform duration-300">
                  {step.icon}

                  <div className="absolute -bottom-2 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {step.num}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 text-center text-sm sm:text-base">
                  {step.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= Projects ================= */}
      <div className="w-full lg:w-1/2">
        <div className="text-start mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 uppercase tracking-wider">
            Projects You Will Build
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 text-4xl">
                {project.icon}
              </div>

              <h3 className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg">
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
