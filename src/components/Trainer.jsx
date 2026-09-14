import React from 'react';
import { FaCheckCircle, FaStar, FaVideo, FaBookOpen, FaCode, FaCertificate, FaUserTie, FaLaptopCode } from 'react-icons/fa';
import pic from "../assets/mam.jpeg"
const Trainer = () => {
    const benefits = [
    { title: "Live Classes", icon: <FaLaptopCode className="text-pink-500 text-2xl" /> },
  
    { title: "Study Notes", icon: <FaBookOpen className="text-green-500 text-2xl" /> },
    { title: "Source Code", icon: <FaCode className="text-orange-500 text-2xl" /> },
    { title: "Live Projects", icon: <FaCheckCircle className="text-blue-500 text-2xl" /> },
    { title: "Certificate of Completion", icon: <FaCertificate className="text-purple-400 text-2xl" /> },
    { title: "Placement Assistance", icon: <FaUserTie className="text-green-500 text-2xl" /> },
  ];
  return (
  <section className="py-16 lg:py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
          <div className="flex-1">

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
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
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
  <div className="mx-auto sm:px-6  text-center mt-7">
        <h2 className="text-2xl font-bold text-blue-700 uppercase tracking-wider mb-10">What You Will Get</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 py-2 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                {benefit.icon}
              </div>
              <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{benefit.title}</span>
            </div>
          ))}
        </div>
      </div>
  </div>
</section>
  );
};

export default Trainer;
