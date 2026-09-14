
import { motion } from "framer-motion";
import cartificate1 from "../assets/caritifcate-1.png"
import cartificate2 from "../assets/caritificate-2.png"
import { FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import {
  FaShieldAlt,
  FaDownload,
  FaShareAlt,
  FaCheckCircle,
} from "react-icons/fa";

const certificates = [
  {
    id: 1,
    title: "Mern Stack Certificate",
    desc: "Awarded upon successful completion of the MERN Stack Development Course including projects and assessments.",
    image:cartificate1,
  },
  {
    id: 2,
    title: "Internship Certificate",
    desc: "Recognizing your dedication and contribution during the internship program as a MERN Stack Developer.",
    image: cartificate2,
  },
];

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Industry Recognized",
    desc: "Certificates trusted by top companies",
  },
  {
    icon: <FaCheckCircle />,
    title: "Verified & Authentic",
    desc: "100% authentic and verifiable certificates",
  },
  {
    icon: <FaDownload />,
    title: "Download Anytime",
    desc: "Access and download anytime",
  },
  {
    icon: <FaShareAlt />,
    title: "Share Your Achievement",
    desc: "Share on LinkedIn and other platforms",
  },
];

const Certificate = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  return (
   <section className="">
 <div className="relative overflow-hidden bg-[#061321] py-4 lg:py-2">
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#071827] via-[#071827] to-[#0b2d28]" />

  {/* Glow */}
  <div className="absolute left-1/2 top-1/2 h-50 w-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />

  <div className="relative max-w-7xl mx-auto px-6">

    {/* Left Floating Icons */}

    <div className="hidden lg:block absolute left-10 top-6">
      <div className="w-15 h-15 border border-gray-700 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur">
        <span className="text-2xl text-green-400">&lt;/&gt;</span>
      </div>
    </div>

    <div className="hidden lg:block absolute left-32 top-28">
      <div className="w-15 h-15 border border-gray-700 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur">
        <img
          src="https://1000logos.net/wp-content/uploads/2023/10/React-Logo.png"
          className="w-10"
          alt=""
        />
      </div>
    </div>

    {/* Right Floating Icons */}

    <div className="hidden lg:block absolute right-28 top-2">
      <div className="w-15 h-15 border border-gray-700 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
          className="w-10"
          alt=""
        />
      </div>
    </div>

    <div className="hidden lg:block absolute right-6 top-28">
      <div className="w-15 h-15 border border-gray-700 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-node-js-icon-svg-download-png-1174935.png?f=webp"
          className="w-10"
          alt=""
        />
      </div>
    </div>

    {/* Content */}

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center"
    >

      <p className="text-white text-xl lg:text-2xl font-bold">
        Your Journey. Your Achievement.
      </p>

      <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">

        <span className="text-green-500">
          Certificates
        </span>{" "}

        <span className="text-white">
          That Prove It.
        </span>

      </h1>

      <p className="text-gray-300 text-[13px] lg:text-[15px] mt-3 leading-10 max-w-4xl mx-auto">

        Showcase your skills and experience with industry-recognized certificates.

        <br />

        Because your hard work{" "}

        <span className="text-green-500 font-semibold">
          deserves recognition.
        </span>

      </p>

    </motion.div>

  </div>
  </div>
 <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="lg:text-4xl text-2xl mt-1 font-bold text-gray-900">
            Our Certificate Categories
          </h2>

          <div className="w-10 h-1 bg-green-500 mx-auto rounded-full mt-4"></div>
        </motion.div>

        {/* Cards */}

        <div className="grid lg:grid-cols-2 gap-10">

          {certificates.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: .5,
                delay: index * .2,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
              }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl duration-300"
            >

              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[220px] object-cover hover:scale-105 duration-500"
                />
              </div>

              <div className="p-5 text-center">

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-[13px] mb-3">
                  {item.desc}
                </p>
<button
  onClick={() => setSelectedCertificate(item.image)}
  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
>
  View Certificate
</button>

              </div>

            </motion.div>

          ))}

        </div>

        {/* Bottom Features */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-lg"
        >

          <div className="grid md:grid-cols-2 lg:grid-cols-4">

            {features.map((item, index) => (

              <div
                key={index}
                className={`flex items-start gap-1 p-6  ${
                  index !== features.length - 1
                    ? "lg:border-r border-gray-200"
                    : ""
                }`}
              >

                <div className="w-24 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl text-green-600">
                  {item.icon}
                </div>

                <div>

                  <h4 className="font-bold text-[13px] text-gray-800 mb-2">
                    {item.title}
                  </h4>

                  <p className="text-gray-600 text-[10px]">
                    {item.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </motion.div>
{selectedCertificate && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
    onClick={() => setSelectedCertificate(null)}
  >
    <div
      className="relative max-w-5xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedCertificate(null)}
        className="absolute -top-5 -right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition"
      >
        <FaTimes size={22} />
      </button>

      {/* Certificate */}
      <img
        src={selectedCertificate}
        alt="Certificate"
        className="w-full max-h-[90vh] object-contain rounded-xl bg-white shadow-2xl"
      />
    </div>
  </div>
)}
      </div>
</section>
  );
};

export default Certificate;