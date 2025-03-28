import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { motion } from "motion/react";

const FeaturedMembers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch featured members
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["featuredMembers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/featured-members`);
      return res.data;
    },
  });

  if (!isLoading) {
    return (
      <motion.section className="bg-base-100 py-12 px-4 md:px-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.5, ease: "easeOut" }}>
        {/* Heading */}
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-neutral" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}>
          Featured <span className="text-primary">Premium</span> Members
        </motion.h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <motion.div key={member._id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.03 }}
              className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col items-center p-5"
              transition={{
                duration: 0.8,
                delay: index * 0.3,
                ease: "easeOut",
              }}>
              {/* ID and Type */}
              <div className="absolute top-3 left-4 text-sm text-white font-bold px-2 py-0.5 rounded-full bg-yellow-600">ID: {member.biodataId}</div>
              <div className="absolute top-3 right-4 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold 
                    ${member.biodataType === "Male" ? "bg-primary" : "bg-secondary"}`}>
                  {member.biodataType}
                </span>
              </div>

              {/* Image & Info */}
              <motion.img src={member.profileImage} alt={member.name} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-primary mt-6"
                transition={{
                  duration: 1,
                  delay: index * 0.4,
                  ease: "easeOut",
                }} />
              <p className="mb-1 text-lg text-gray-700">Division: <span className="font-medium">{member.permanentDivision}</span></p>
              <p className="mb-1 text-lg text-gray-700">Age: <span className="font-medium">{member.age}</span></p>
              <p className="mb-4 text-lg text-gray-700">Occupation: <span className="font-medium">{member.occupation}</span></p>

              {/* View Profile Button */}
              {user ? (
                <motion.button onClick={() => navigate(`/biodata/${member.biodataId}`)} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
                  className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-2 rounded-md font-semibold cursor-pointer">
                  View Profile
                </motion.button>
              ) : (
                <motion.button onClick={() => navigate("/")} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
                  className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-2 rounded-md font-semibold cursor-pointer">
                  Login View Profile
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }
};

export default FeaturedMembers;