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
  { name: "Curriculum", id: "curriculum" },
  { name: "Projects", id: "projects" },
  { name: "Why BeanGate", id: "why-beangate" },
  { name: "FAQ", id: "faq" },
  { name: "Contact", id: "contact" },
];
const navigate = useNavigate();

const scrollToRegister = () => {
  const section = document.getElementById("register");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  } else {
    navigate("/#register");
  }
};

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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="BeanGate Logo" className="h-9 w-auto" />
            <div>
              <h1 className="text-white font-black text-lg leading-none tracking-tight">
                BeanGate
              </h1>
              <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
                IT SOLUTIONS PVT. LTD.
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="relative text-white/90 hover:text-orange-400 transition-colors duration-300 font-semibold text-xs tracking-wide group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden lg:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToRegister}
              className="bg-[#ff5500] hover:bg-[#e64d00] text-white px-5 py-2.5 rounded-md font-extrabold text-xs tracking-wider shadow-md transition cursor-pointer border-none"
            >
              JOIN NOW – ₹6,499
            </motion.button>
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-3 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={scrollToRegister}
              className="bg-[#ff5500] hover:bg-[#e64d00] text-white px-3.5 py-1.5 rounded-md text-xs font-black border-none"
            >
              JOIN NOW
            </motion.button>

            <button
              className="text-white text-2xl"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#071428] border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white/90 hover:text-orange-400 text-sm font-semibold border-b border-white/5 pb-2.5 last:border-0"
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