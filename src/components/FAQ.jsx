import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: "Is this course suitable for beginners?", a: "Yes, this course starts from the absolute basics and goes up to advanced level." },
    { q: "Will I get placement assistance?", a: "Yes, we provide 100% placement assistance including resume building and mock interviews." },
   
    { q: "Which language will be used in the course?", a: "The course will be taught in a mix of Hindi and English for better understanding." },
    { q: "What is the duration of the course?", a: "The course duration is 3 months with daily practical sessions." },
    { q: "Will I get a certificate?", a: "Yes, a certificate of completion will be provided after you finish the projects." },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-blue-600 uppercase tracking-wider mb-10">Frequently Asked Questions</h2>
        
       <div className="grid md:grid-cols-2 gap-6">
  {faqs.map((faq, index) => (
    <div
      key={index}
      className="border border-gray-200 rounded-lg overflow-hidden h-fit"
    >
      <button
        className="w-full text-left px-6 py-4 bg-gray-50 flex justify-between items-center"
        onClick={() => toggleFAQ(index)}
      >
        <span className="font-semibold text-gray-800 pr-4">
          {faq.q}
        </span>

        <span className="text-blue-600 text-2xl font-bold">
          {activeIndex === index ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence>
        {activeIndex === index && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 bg-white border-t border-gray-200 text-gray-600 text-sm">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};

export default FAQ;
