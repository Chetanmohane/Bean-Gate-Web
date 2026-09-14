import React, { useState,useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Offer = () => {
  const [formData, setFormData] = useState({
  name: "",
  phone: "",
  email: "",
  course: "",
  college: "",
  city: "",
});

const [status, setStatus] = useState("idle");
const navigate = useNavigate();

const [timeLeft, setTimeLeft] = useState({
  hours: 2,
  minutes: 45,
  seconds: 30,
});

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      let { hours, minutes, seconds } = prev;

      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(timer);
        return prev;
      }

      if (seconds > 0) {
        seconds--;
      } else {
        seconds = 59;

        if (minutes > 0) {
          minutes--;
        } else {
          minutes = 59;

          if (hours > 0) {
            hours--;
          }
        }
      }

      return { hours, minutes, seconds };
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (
    !formData.name.trim() ||
    !formData.phone.trim() ||
    !formData.email.trim() ||
    !formData.course ||
    !formData.college ||
    !formData.city
  ) {
    setStatus("error");
    return;
  }

  setStatus("loading");

  try {
    const formBody = new URLSearchParams(formData).toString();

   await fetch("https://script.google.com/macros/s/AKfycbzXSYriLalntsTXoZXKA_zdLDv6rilyh071w3NvLpnkLsF8smoeoRBPaTdHSsiPVvNCfw/exec", {
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams(formData).toString(),
});

    setStatus("success");

    setFormData({
      name: "",
      phone: "",
      email: "",
      course: "",
      college: "",
      city: "",
    });

  } catch (err) {
    console.log(err);
    setStatus("error");
  }
};
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Offer Details */}
          <div className="w-full lg:w-1/2 bg-navy p-10 text-white relative flex flex-col justify-center">
            {/* Confetti decoration top right */}
            <div className="absolute top-4 right-4 text-3xl">🎉</div>
            <div className="absolute top-10 right-10 text-2xl">🎊</div>
            
            <h2 className="text-2xl font-bold uppercase text-center mb-8 tracking-wider">SPECIAL OFFER</h2>
            
            <div className="bg-white rounded-xl p-6 text-center text-gray-900 mb-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                <div className="w-1/2 border-r border-gray-200">
                  <p className="text-gray-500 font-medium mb-1">Actual Price</p>
                  <p className="lg:text-3xl text-2xl font-bold text-gray-400 line-through">₹15,000</p>
                </div>
                <div className="w-1/2">
                  <p className="text-gray-900 font-bold mb-1">Today Only</p>
                  <p className="lg:text-4xl text-2xl font-bold text-primary-orange">₹6,000</p>
                </div>
              </div>
              <div className="bg-yellow-400 text-gray-900 text-xs font-bold py-1 px-4 rounded-full inline-block">
                You Save ₹9,000 (60% OFF)
              </div>
            </div>
            
        <div className="grid grid-cols-3 gap-4 text-center mb-8">

  <div className="bg-white/10 rounded-lg p-3">
    <p className="text-3xl font-bold">
      {String(timeLeft.hours).padStart(2, "0")}
    </p>
    <p className="text-xs text-gray-400 uppercase">Hours</p>
  </div>

  <div className="bg-white/10 rounded-lg p-3">
    <p className="text-3xl font-bold">
      {String(timeLeft.minutes).padStart(2, "0")}
    </p>
    <p className="text-xs text-gray-400 uppercase">Minutes</p>
  </div>

  <div className="bg-white/10 rounded-lg p-3">
    <p className="text-3xl font-bold">
      {String(timeLeft.seconds).padStart(2, "0")}
    </p>
    <p className="text-xs text-gray-400 uppercase">Seconds</p>
  </div>

</div>
            
            <div className="text-center">
              <p className="text-sm font-semibold mb-2">Hurry! Offer ends soon. Limited Seats Available!</p>
              <div className="w-full bg-white/20 rounded-full h-2.5 mb-1">
                <div className="bg-primary-orange h-2.5 rounded-full w-[36%]"></div>
              </div>
              <p className="text-xs text-yellow-400 font-bold text-left"><span className="text-white">18</span> / 50 Seats Left</p>
              <button
  onClick={() => navigate("/payment")}
  className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition duration-300 shadow-lg"
>
  💳 Pay Now
</button>
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="w-full lg:w-1/2 p-10">
            <h2 className="text-2xl font-bold text-blue-700 uppercase tracking-wider mb-2">REGISTER NOW</h2>
            <p className="text-sm text-gray-500 mb-8">Fill the form below to reserve your seat</p>
                  {status === "success" && (
  <div className="bg-green-100 text-green-700 p-3 rounded-lg">
    ✅ Registration Successful
  </div>
)}

{status === "error" && (
  <div className="bg-red-100 text-red-700 p-3 rounded-lg">
    ❌ Something went wrong
  </div>
)}
         <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
  type="text"
  name="name"
  required
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                 <input
  type="text"
  name="phone"
   required
  value={formData.phone}
  onChange={handleChange}
  placeholder="Enter your mobile number"
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
/>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                 <input
  type="email"
  name="email"
   required
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Course</label>
                 <select
  name="course"
  value={formData.course}
  onChange={handleChange}
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
>
  <option value="">Select Course</option>
  <option>Frontend Developer</option>
  <option>Backend Developer</option>
  <option>MERN Stack</option>
</select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">College / University</label>
                 <select
  name="college"
  value={formData.college}
  onChange={handleChange}
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
>
  <option value="">Select College</option>
  <option>PDPS College</option>
  <option>BUIT</option>
  <option>Other</option>
</select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                 <select
  name="city"
  value={formData.city}
  onChange={handleChange}
  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
>
  <option value="">Select City</option>
  <option>Bhopal</option>
  <option>Indore</option>
  <option>Jabalpur</option>
  <option>Other</option>
</select>
                </div>
              </div>
              
             <button
  type="submit"
  disabled={status === "loading"}
  className="w-full bg-primary-orange text-white py-3 rounded-lg font-bold"
>
  {status === "loading"
    ? "Submitting..."
    : "REGISTER NOW →"}
</button>
        
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
                <FaLock className="text-green-500" /> Your information is safe with us. We will never share your data.
              </p>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Offer;
