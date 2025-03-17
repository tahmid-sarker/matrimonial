import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { motion } from "motion/react";

const ITEMS_PER_PAGE = 6;

const BioDatas = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState("");
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [biodataType, setBiodataType] = useState("All");
  const [division, setDivision] = useState("All");

  const navigate = useNavigate();

  // Fetch biodatas from API
  const { data: biodatas = [] } = useQuery({
    queryKey: ["biodatas"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/biodatas`);
      return res.data;
    },
  });

  // Filter biodatas
  const filteredBiodatas = biodatas.filter((bio) => {
    if (searchId && !bio.biodataId.toString().includes(searchId.trim())) return false;
    if (bio.age < ageRange[0] || bio.age > ageRange[1]) return false;
    if (biodataType !== "All" && bio.biodataType !== biodataType) return false;
    if (division !== "All" && bio.permanentDivision !== division) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredBiodatas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBiodatas = filteredBiodatas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Age range handlers
  const handleMinAgeChange = (e) => {
    const value = Number(e.target.value);
    if (value <= ageRange[1]) setAgeRange([value, ageRange[1]]);
  };

  const handleMaxAgeChange = (e) => {
    const value = Number(e.target.value);
    if (value >= ageRange[0]) setAgeRange([ageRange[0], value]);
  };

  // pagination numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.section className="bg-base-100 py-12 px-4 md:px-10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}>
      
      <motion.h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-neutral"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        Available <span className="text-primary">Biodata</span> Profiles
      </motion.h2>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
        {/* Search by Biodata ID */}
        <div>
          <label className="block mb-1 font-semibold text-neutral">Search Biodata ID</label>
          <input type="text" placeholder="Enter Biodata ID" value={searchId} onChange={(e) => { setSearchId(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 text-neutral border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"/>
        </div>

        {/* Age range */}
        <div>
          <label className="block mb-1 font-semibold text-neutral">Min Age</label>
          <input type="number" min={18} max={ageRange[1]} value={ageRange[0]} onChange={handleMinAgeChange} className="w-full px-4 py-2 text-neutral border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-neutral">Max Age</label>
          <input type="number" min={ageRange[0]} max={60} value={ageRange[1]} onChange={handleMaxAgeChange} className="w-full px-4 py-2 text-neutral border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </div>

        {/* Biodata Type */}
        <div>
          <label className="block mb-1 font-semibold text-neutral">Biodata Type</label>
          <select value={biodataType} onChange={(e) => { setBiodataType(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 text-neutral border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary">
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Division */}
        <div>
          <label className="block mb-1 font-semibold text-neutral">Division</label>
          <select value={division} onChange={(e) => { setDivision(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 text-neutral border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary">
            <option value="All">All</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattagram">Chattagram</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Barisal">Barisal</option>
            <option value="Khulna">Khulna</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Sylhet">Sylhet</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <motion.div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
        {!currentBiodatas ? (
          <p className="text-center col-span-full text-gray-500">No biodata profiles found.</p>
        ) : (
          currentBiodatas.map((bio) => (
            <motion.div key={bio.biodataId} className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col items-center p-5" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Biodata ID badge */}
              <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full select-none">ID: {bio.biodataId}</span>
              {/* Biodata type badge */}
              <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full select-none ${bio.biodataType === "Male" ? "bg-primary text-white" : "bg-secondary text-white"}`}>{bio.biodataType}</span>
              <img src={bio.profileImage} alt={`${bio.biodataType} profile`} className="w-32 h-32 object-cover rounded-full mb-4" />
              <p className="mb-1 text-lg font-semibold text-gray-700">{bio.name}</p>
              <p className="mb-1 text-gray-700">Permanent Division: <span className="font-medium">{bio.permanentDivision}</span></p>
              <p className="mb-1 text-gray-700">Age: <span className="font-medium">{bio.age}</span></p>
              <p className="mb-4 text-gray-700">Occupation: <span className="font-medium">{bio.occupation}</span></p>
              {user ? (
                <button onClick={() => navigate(`/biodata/${bio.biodataId}`)} className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-2 rounded-md font-semibold cursor-pointer transition">View Profile</button>
              ) : (
                <button onClick={() => navigate("/")} className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-2 rounded-md font-semibold cursor-pointer transition">Login View Profile</button>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-3">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className={`px-4 py-2 rounded-md font-semibold ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary cursor-pointer text-white hover:bg-secondary"}`}>Prev</button>
        
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => goToPage(page)} className={`px-4 py-2 rounded-md font-semibold ${currentPage === page ? "bg-secondary cursor-pointer text-white" : "bg-primary cursor-pointer text-white hover:bg-secondary"}`}>{page}</button>
        ))}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-md font-semibold ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary cursor-pointer text-white hover:bg-secondary"}`}>Next</button>
      </div>
    </motion.section>
  );
};

export default BioDatas;