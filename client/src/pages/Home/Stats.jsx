import CountUpImport from "react-countup";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// Vite/CJS interop: react-countup nests default twice
const CountUp =
  typeof CountUpImport === "function"
    ? CountUpImport
    : typeof CountUpImport?.default === "function"
      ? CountUpImport.default
      : CountUpImport?.default?.default;

const Stats = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch active biodatas
  const { data: biodatas = [] } = useQuery({
    queryKey: ["biodatas"],
    queryFn: async () => {
      const res = await axiosSecure.get("/biodatas");
      return res.data;
    },
  });

  // Fetch success stories
  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  // Fetch premium biodatas
  const { data: premiumBiodatas = [] } = useQuery({
    queryKey: ["premiumBiodatas"],
    queryFn: async () => {
      const res = await axiosSecure.get("/premium-biodata");
      return res.data;
    },
  });

  const stats = [
    { id: 1, label: "Active Biodatas", value: biodatas.length },
    { id: 2, label: "Successful Matches", value: stories.length },
    { id: 3, label: "Premium Profiles", value: premiumBiodatas.length },
  ];

  return (
    <motion.section className="py-16 bg-base-200" 
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: "easeOut" }}>
      <div className="w-11/12 mx-auto px-4">
        <motion.h2 className="text-2xl md:text-4xl font-bold text-neutral text-center mb-12" 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}>
          <span className="text-primary">Bengal</span> <span className="text-secondary">Matrimony</span> in Numbers
        </motion.h2>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" initial="hidden" whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }}>
          {stats.map((stat) => (
            <motion.div key={stat.id} className="bg-white shadow-lg rounded-2xl p-10 hover:shadow-xl transition" 
              variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <CountUp end={stat.value} duration={10} className="text-4xl md:text-5xl font-extrabold text-primary" />
              <p className="mt-3 text-lg md:text-xl text-gray-700 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Stats;