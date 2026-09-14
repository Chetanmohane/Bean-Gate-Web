import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaCode, FaBullseye, FaStar } from 'react-icons/fa';

const Stats = () => {
  const stats = [
    { icon: <FaGraduationCap className="text-3xl text-blue-500" />, number: "527+", label: "Students Enrolled" },
    { icon: <FaBriefcase className="text-3xl text-blue-500" />, number: "15+", label: "Years Experience" },
    { icon: <FaCode className="text-3xl text-blue-500" />, number: "20+", label: "Live Projects" },
    { icon: <FaBullseye className="text-3xl text-blue-500" />, number: "100%", label: "Placement Assistance" },
    { icon: <FaStar className="text-3xl text-blue-500" />, number: "4.9/5", label: "Student Rating" },
  ];

  return (
  <section className="relative z-20 -mt-10 sm:-mt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

  {/* Mobile & Tablet */}
  <div className="grid grid-cols-2 gap-4 md:hidden">
    {stats.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center text-center border border-gray-100"
      >
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
          {stat.icon}
        </div>

        <h3 className="text-2xl font-bold text-blue-600">
          {stat.number}
        </h3>

        <p className="text-gray-600 text-sm mt-1">
          {stat.label}
        </p>
      </motion.div>
    ))}
  </div>

  {/* Desktop */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="hidden md:flex bg-white rounded-2xl shadow-2xl p-8 justify-between items-center"
  >
    {stats.map((stat, index) => (
      <div
        key={index}
        className="flex items-center gap-4 flex-1"
      >
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          {stat.icon}
        </div>

        <div>
          <h3 className="text-3xl lg:text-4xl font-bold text-blue-600 leading-none">
            {stat.number}
          </h3>

          <p className="text-gray-500 mt-2">
            {stat.label}
          </p>
        </div>

        {index !== stats.length - 1 && (
          <div className="ml-auto h-14 w-px bg-gray-200"></div>
        )}
      </div>
    ))}
  </motion.div>

</section>
  );
};

export default Stats; 