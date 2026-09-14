import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import logo from "../assets/logo-beangate.png";
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Footer Bottom Fixed Upgrade Banner Bar matching user screenshot */}
      <div className="sticky bottom-0 z-40 bg-[#040b19] border-t border-white/10 text-white py-3.5 px-4 shadow-2xl">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Text */}
          <div className="text-center md:text-left">
            <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
              Upgrade Your Degree with Industry-Level Skills.
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
              Learn. Build. Grow. Get a Practical Direction for Your Career.
            </p>
          </div>

          {/* Center Button */}
          <div className="text-center">
            <button
              onClick={scrollToRegister}
              className="bg-[#ff5500] hover:bg-[#e64d00] text-white px-6 py-2 rounded-md font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer border-none"
            >
              JOIN NOW – ₹6,499
            </button>
            <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
              Limited Seats – Enroll Now!
            </p>
          </div>

          {/* Right Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] sm:text-xs text-gray-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <FaPhoneAlt className="text-[#ff5500] text-xs" />
              <span>+91 9301970707</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaEnvelope className="text-[#ff5500] text-xs" />
              <span>enquiry@beangates.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaGlobe className="text-[#ff5500] text-xs" />
              <span>www.beangates.com</span>
            </div>
          </div>

        </div>
      </div>

      {/* Standard Footer */}
      <footer className="bg-[#071428] text-gray-400 pt-12 pb-6 border-t border-white/5" id="contact">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Company Info */}
            <div>
              <div className="text-white font-bold text-lg flex items-center gap-3 mb-4">
                <img src={logo} alt="BeanGate Logo" className="h-8 w-auto" />
                <div>
                  <span className="block leading-none font-black text-white">BeanGate</span>
                  <span className="block text-[8px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">IT SOLUTIONS PVT. LTD.</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                We are dedicated to providing quality training and placement assistance to students and helping them build a successful career in the IT industry.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#course" className="hover:text-white transition">Course</a></li>
                <li><a href="#curriculum" className="hover:text-white transition">Curriculum</a></li>
                <li><a href="#projects" className="hover:text-white transition">Projects</a></li>
                <li><a href="#why-beangate" className="hover:text-white transition">Why BeanGate</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><Link to="/admin" className="text-orange-400 hover:text-orange-300 font-bold transition">Admin Login →</Link></li>
              </ul>
            </div>
            
            {/* Contact Details */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Contact Us</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <FaPhoneAlt className="text-orange-400 text-xs shrink-0" />
                  <span>+91 9301970707</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-orange-400 text-xs shrink-0" />
                  <span>enquiry@beangates.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaGlobe className="text-orange-400 text-xs shrink-0 mt-0.5" />
                  <span>BeanGate IT Solutions Pvt. Ltd.<br/>Bhopal (M.P.) – 462022</span>
                </li>
              </ul>
            </div>
            
            {/* Disclaimer */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Industry Training</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Practical industry training designed to equip you with real project skills and job readiness.
              </p>
            </div>
            
          </div>
          
          <div className="border-t border-white/5 pt-6 text-center text-[11px] text-gray-500 font-semibold">
            <p>&copy; {new Date().getFullYear()} BeanGate IT Solutions Pvt. Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
