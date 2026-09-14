import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from "../assets/logo-beangate.png"
const Footer = () => {
  return (
    <footer className="bg-navy text-gray-400 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="text-white font-bold text-xl flex items-center mb-6">
              <img src={logo} alt="" className="w-15"/>
              <div>
                <span className="block leading-tight">BeanGate</span>
                <span className="block text-[10px] font-normal text-gray-400">IT SOLUTIONS PVT. LTD.</span>
              </div>
            </div>
            <p className="text-sm mb-6">
              We are dedicated to providing quality training and placement assistance to students and helping them build a successful career in IT industry.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><FaFacebookF size={14}/></a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"><FaInstagram size={14}/></a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition"><FaYoutube size={14}/></a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition"><FaLinkedinIn size={14}/></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Course</a></li>
              <li><a href="#" className="hover:text-white transition">Projects</a></li>
              <li><a href="#" className="hover:text-white transition">Trainer</a></li>
              <li><a href="#" className="hover:text-white transition">Reviews</a></li>
            </ul>
          </div>
          
          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-blue-500" />
                <span>+91 9752740090, 7471112020</span>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-blue-500" />
                <span>beangate.official@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-blue-500" />
                <span>BeanGate IT Solutions Pvt. Ltd.<br/> Flat No. A-4/501, Kokta Transport Nagar,<br />
                Bhopal (M.P.) – 462022</span>
              </li>
            </ul>
          </div>
          
          {/* Subscription */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Subscribe</h4>
            <p className="text-sm mb-4">Get updates about new batches and special offers.</p>
            <form className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:border-blue-500" />
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition">SUBSCRIBE</button>
            </form>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          <p>&copy; 2024 BeanGate IT Solutions Pvt. Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
