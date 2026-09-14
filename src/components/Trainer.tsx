import React from 'react';
import { FaCheckCircle, FaStar, FaBookOpen, FaCode, FaCertificate, FaUserTie, FaLaptopCode } from 'react-icons/fa';
import pic from "../assets/mam.jpeg"

const Trainer = () => {
  const benefits = [
    { title: "Live Classes", desc: "Interactive lectures with real-time doubt clearing.", icon: <FaLaptopCode className="text-pink-500 text-2xl" />, bg: "bg-pink-50" },
    { title: "Study Notes", desc: "Comprehensive PDF guides and cheatsheets.", icon: <FaBookOpen className="text-green-500 text-2xl" />, bg: "bg-green-50" },
    { title: "Source Code", desc: "Full production-ready GitHub repositories.", icon: <FaCode className="text-orange-500 text-2xl" />, bg: "bg-orange-50" },
    { title: "Live Projects", desc: "Develop commercial projects for your portfolio.", icon: <FaCheckCircle className="text-blue-500 text-2xl" />, bg: "bg-blue-50" },
    { title: "Certificate", desc: "Verified ISO-certified LinkedIn-ready certificate.", icon: <FaCertificate className="text-purple-500 text-2xl" />, bg: "bg-purple-50" },
    { title: "Placement Help", desc: "Mock interviews & partner job referrals.", icon: <FaUserTie className="text-teal-500 text-2xl" />, bg: "bg-teal-50" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-14 items-start">

          {/* Trainer Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

            <div className="flex flex-col sm:flex-row gap-6">

              {/* Image */}
              <div className="w-full sm:w-56 md:w-64 flex justify-center shrink-0">
                <img
                  src={pic}
                  className="w-52 h-64 sm:w-56 sm:h-72 object-cover rounded-xl shadow-md"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">

                <h3 className="text-xl md:text-2xl font-bold text-blue-800 uppercase">
                  Pratiksha Bora
                </h3>

                <p className="text-blue-600 font-semibold text-sm mb-6">
                  BeanGate IT Solutions Pvt. Ltd.
                </p>

                <ul className="space-y-4">

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 text-sm">
                      15+ Years Corporate Experience
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Professional Corporate Trainer
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Trained Hundreds of Students
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Worked on Multiple Industry Projects
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 text-sm font-semibold">
                      Expert in Full Stack Development
                    </span>
                  </li>

                </ul>

              </div>

            </div>

          </div>

          {/* Success Stories */}
          <div>

            <h3 className="text-2xl md:text-3xl font-bold text-blue-800 uppercase mb-8 text-center xl:text-left">
              Student Success Stories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {[
                {
                  name: "Ankit Sharma",
                  role: "Software Developer",
                  review:
                    "Best MERN Stack Training I've ever attended. Very practical and easy to understand.",
                },
                {
                  name: "Priya Verma",
                  role: "Frontend Developer",
                  review:
                    "Got internship after completing the course. Thank you so much BeanGate!",
                },
                {
                  name: "Rohit Singh",
                  role: "Full Stack Developer",
                  review:
                    "Excellent training, amazing projects and great support from Pankaj Sir.",
                },
              ].map((review, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left"
                >

                  <div className="flex text-yellow-400 mb-4 gap-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <p className="text-gray-600 italic text-sm flex-grow mb-6">
                    "{review.review}"
                  </p>

                  <div>
                    <h4 className="font-bold text-blue-800">
                      {review.name}
                    </h4>

                    <p className="text-gray-500 text-sm">
                      {review.role}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ================= What You Will Get (Redesigned Section) ================= */}
        <div className="mx-auto text-center mt-10 pt-10 border-t border-gray-200/60">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a66ff] uppercase tracking-wide mb-2">
            What You Will Get
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed font-semibold">
            We provide a complete success pack to support your journey from beginner to hired professional developer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100/90 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
              >
                {/* Icon circle box */}
                <div className={`w-12 h-12 rounded-2xl ${benefit.bg} flex items-center justify-center shrink-0`}>
                  {benefit.icon}
                </div>
                {/* Details */}
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Trainer;
