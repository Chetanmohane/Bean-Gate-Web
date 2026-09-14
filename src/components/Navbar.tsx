import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo-beangate.png"
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const navLinks = [
  { name: "Home", id: "home" },
  { name: "Course", id: "course" },
  { name: "Projects", id: "projects" },
  { name: "Trainer", id: "trainer" },
  { name: "Cartificates", id: "cartificate" },
  { name: "Pricing", id: "pricing" },
  { name: "Reviews", id: "reviews" },
  { name: "FAQ", id: "faq" },
 
];
const navigate = useNavigate();
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#071428]/95 backdrop-blur-md shadow-lg py-3"
          : "bg-[#071428] py-4"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
           <img src={logo} alt="" className="w-15"/>

            <div>
              <h1 className="text-white font-bold text-lg sm:text-xl leading-none">
                BeanGate
              </h1>

              <p className="text-[8px] sm:text-[10px] text-gray-400 tracking-wider">
                IT SOLUTIONS PVT. LTD.
              </p>
            </div>
          </div>

{/* Desktop Menu */}
<div className="hidden lg:flex items-center gap-8">
  {navLinks.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      className="relative text-white/80 hover:text-orange-400 transition-colors duration-300 font-medium text-sm tracking-wide group"
    >
      {item.name}
      {/* Animated Underline */}
      <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
    </a>
  ))}
</div>

{/* Mobile Menu Button */}
<div className="flex items-center gap-3 lg:hidden">
  {/* Enroll Button */}
  {/* Hamburger Icon */}
</div>

          {/* Desktop Button */}
<div className="hidden lg:block">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      const section = document.getElementById("reviews");

      if (section) {
        const y =
          section.getBoundingClientRect().top +
          window.pageYOffset -
          90;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }}
    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
  >
    ENROLL NOW →
  </motion.button>
</div>
          {/* Mobile Right Side */}
       <div className="flex items-center gap-3 lg:hidden">
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      const section = document.getElementById("reviews");

      if (section) {
        const y =
          section.getBoundingClientRect().top +
          window.pageYOffset -
          90;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }}
    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
  >
    Enroll
  </motion.button>

  <button
    className="text-white text-3xl"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? <HiX /> : <HiMenuAlt3 />}
  </button>
</div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#071428] border-t border-white/10"
          >
          <div className="flex flex-col px-6 py-5 space-y-4">
  {navLinks.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      onClick={() => setMenuOpen(false)}
      className="block text-white/80 hover:text-orange-400 hover:translate-x-2 transition-all duration-300 text-lg font-medium border-b border-white/5 pb-3 last:border-0"
    >
      {item.name}
    </a>
  ))}
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;