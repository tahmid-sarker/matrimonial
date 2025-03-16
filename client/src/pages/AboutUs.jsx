import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "motion/react";
import { asset } from "../utils/asset";

const accordionData = [
  {
    title: "Authentic Biodata Matching",
    content:
      "We ensure genuine profiles and privacy-first connections tailored for Bengali traditions and values.",
  },
  {
    title: "Dashboard for Every Member",
    content:
      "Users get a personal dashboard to manage their biodata, edit information, and track interactions with ease.",
  },
  {
    title: "Premium Membership Features",
    content:
      "Our premium plans offer direct contact options, highlighted profiles, and faster visibility among matches.",
  },
  {
    title: "Secure and Respectful",
    content:
      "Every interaction on Bengal Matrimony is protected, respectful, and built around mutual trust.",
  },
];

const AboutUs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <motion.section className="bg-base-100 py-15"
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div className="w-11/12 mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Left Section - Accordion */}
        <motion.div className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-4xl font-bold text-neutral">
            About <span className="text-primary">Bengal </span>
            <span className="text-secondary">Matrimony</span>
          </h2>
          <div className="space-y-3">
            {accordionData.map((item, index) => (
              <motion.div key={index} className="border border-primary rounded-xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <button onClick={() => toggleAccordion(index)}
                  className="w-full text-left flex justify-between items-center p-5 text-xl font-medium bg-white text-gray-800 cursor-pointer transition">
                  {item.title}
                  <FaChevronDown className={`transition-transform ${activeIndex === index ? "rotate-180" : ""}`} />
                </button>
                {activeIndex === index && (<div className="px-5 pb-5 text-neutral text-lg">{item.content}</div>)}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Section - Illustration */}
        <motion.div className="flex-1"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <img src={asset("images/AboutUs.svg")} alt="About Bengal Matrimony" className="w-full max-h-[70vh] object-contain" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutUs;