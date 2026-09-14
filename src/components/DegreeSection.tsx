import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const DegreeSection = () => {
  return (
    <section className="py-14 bg-white border-b border-gray-100" id="why-beangate">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Questions */}
          <div className="md:col-span-7 text-left space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Is Just a Degree Enough?
            </h2>

            <div className="space-y-3 pt-1">
              {[
                "Can you build a Dynamic Website if given the task?",
                "Can you create a Complete Admin Panel if given the task?",
                "Can you build an Online Management System from Frontend to Backend and Database if given the task?",
              ].map((q, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
                  <FaQuestionCircle className="text-red-500 text-lg shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {q}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
              If the answer is <span className="text-blue-600 font-extrabold">"No"</span> right now...
              <br />
              then you don't just need a Degree, you need <span className="text-gray-900 font-black">Practical Industry-Level Skills</span>.
            </div>
          </div>

          {/* Right Column: Pricing Box */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
              <p className="text-xs sm:text-sm font-extrabold text-gray-800 leading-snug mb-4 max-w-xs mx-auto">
                And this Skill will give your Career a Practical Direction for just
              </p>
              
              <h3 className="text-4xl sm:text-5xl font-black text-[#ff5500] tracking-tight mb-1">
                ₹6,499
              </h3>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                One-Time Fee
              </p>

              <div className="w-20 h-1 bg-[#ff5500] mx-auto rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DegreeSection;
