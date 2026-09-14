import React from "react";
import { FaLaptopCode, FaHandsHelping, FaUserCheck, FaBuilding, FaUserGraduate, FaCertificate } from "react-icons/fa";

const ITCompanySection = () => {
  const cards = [
    {
      title: "Real-World Projects",
      desc: "Learn by building industry-ready projects",
      icon: <FaLaptopCode className="text-purple-600 text-xl" />,
      bg: "bg-purple-100/70",
    },
    {
      title: "Practical & Hands-On",
      desc: "Live coding & implementation",
      icon: <FaHandsHelping className="text-orange-600 text-xl" />,
      bg: "bg-orange-100/70",
    },
    {
      title: "Industry-Ready Skills",
      desc: "Job-oriented skill development",
      icon: <FaUserCheck className="text-gray-800 text-xl" />,
      bg: "bg-gray-100",
    },
    {
      title: "IT Company Environment",
      desc: "Work like a professional developer",
      icon: <FaBuilding className="text-blue-600 text-xl" />,
      bg: "bg-blue-100/70",
    },
    {
      title: "Mentor Guidance",
      desc: "Get support from experienced developers",
      icon: <FaUserGraduate className="text-red-500 text-xl" />,
      bg: "bg-red-100/70",
    },
    {
      title: "Placement Assistance",
      desc: "Resume, Interview & placement support",
      icon: <FaCertificate className="text-green-600 text-xl" />,
      bg: "bg-green-100/70",
    },
  ];

  return (
    <section className="py-14 bg-gray-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Dark Image Box */}
          <div className="lg:col-span-5 relative bg-[#071428] rounded-2xl p-7 text-white flex flex-col justify-between overflow-hidden shadow-xl min-h-[300px]">
            {/* Background image overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071428] via-[#071428]/80 to-transparent z-10"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80')" }}
            ></div>

            <div className="relative z-20">
              <p className="text-xs sm:text-sm font-bold text-gray-300 mb-1">
                We Are Not Just a Training Institute.
              </p>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white mb-4">
                We Are an <span className="text-[#ff5500]">IT Company.</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium max-w-sm">
                Here, you won't just learn theory. You will work on real projects and gain practical experience in a real IT environment.
              </p>
            </div>

            <div className="relative z-20 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-[10px] sm:text-xs font-bold text-orange-400">
              <span>Real Projects</span>
              <span>•</span>
              <span>Real Learning</span>
              <span>•</span>
              <span>Real Growth</span>
            </div>
          </div>

          {/* Right 6 Cards Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            {cards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] font-semibold leading-snug">
                    {item.desc}
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

export default ITCompanySection;
