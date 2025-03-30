import { motion } from "motion/react";
import { TbUser } from "react-icons/tb";
import { MdOutlineFavorite } from "react-icons/md";
import { MdOutlineEventAvailable } from "react-icons/md";

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const cardDetails = [
  {
    icon: <TbUser size={36} className="text-primary mx-auto mb-3" />,
    title: "Create Your Profile",
    descriptions:
      "Sign up, add your details, and set up your preferences to find your perfect match.",
  },
  {
    icon: <MdOutlineFavorite size={36} className="text-primary mx-auto mb-3" />,
    title: "Browse Matches",
    descriptions:
      "Discover verified profiles that match your criteria and interests on Bengal Matrimony.",
  },
  {
    icon: <MdOutlineEventAvailable size={36} className="text-primary mx-auto mb-3" />,
    title: "Connect & Celebrate",
    descriptions:
      "Start conversations, plan meetings, and build meaningful relationships leading to marriage.",
  },
];

const HowItWorks = () => {
  return (
    <motion.section className="w-11/12 mx-auto mt-12" 
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}>
      
      {/* Title */}
      <motion.h1 className="text-2xl md:text-4xl font-bold text-center text-neutral mb-12"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        How <span className="text-primary">Bengal</span> <span className="text-secondary">Matrimony</span> Works
      </motion.h1>

      {/* Cards */}
      <motion.div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
        {cardDetails.map((card, index) => (
          <motion.div key={index} variants={cardVariant} className="bg-white shadow-lg p-8 rounded-2xl hover:shadow-2xl transition duration-300 text-center">
            {card.icon}
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">{card.title}</h3>
            <p className="text-gray-600">{card.descriptions}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HowItWorks;