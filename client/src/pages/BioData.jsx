import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { FiEdit2 } from "react-icons/fi";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const BioData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch user biodata
  const { data: biodata = [] } = useQuery({
    queryKey: ["biodata", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/biodata?email=${user?.email}`, {
        withCredentials: true
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  const userBiodata = biodata[0] || {};

  // Prepare biodata fields
  const fields = [
    ["Biodata ID", userBiodata.biodataId],
    ["Type", userBiodata.biodataType],
    ["Date of Birth", userBiodata.dateOfBirth],
    ["Age", userBiodata.age],
    ["Height", userBiodata.height],
    ["Weight", userBiodata.weight],
    ["Occupation", userBiodata.occupation],
    ["Race", userBiodata.race],
    ["Father's Name", userBiodata.fathersName],
    ["Mother's Name", userBiodata.mothersName],
    ["Permanent Division", userBiodata.permanentDivision],
    ["Present Division", userBiodata.presentDivision],
    ["Expected Partner Age", userBiodata.expectedPartnerAge],
    ["Expected Partner Height", userBiodata.expectedPartnerHeight],
    ["Expected Partner Weight", userBiodata.expectedPartnerWeight],
    ["Contact Email", userBiodata.contactEmail],
    ["Mobile Number", userBiodata.mobileNumber],
  ];

  return (
    <section className="relative max-w-5xl mx-auto my-12 bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-wide">
        {user?.displayName || "Your Biodata"}
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-10">
        <div className="shrink-0 mx-auto md:mx-0">
          <img src={user?.photoURL} alt={user?.displayName} className="w-52 h-52 object-cover rounded-2xl shadow-md border border-gray-300" />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          {fields.map(([label, value], index) => (
            <div key={index} className="bg-white shadow-sm rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
              <strong className="block text-gray-900">{label}:</strong>
              <span className="block mt-1 text-gray-600">{value || "Edit to create biodata"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button onClick={() => navigate("/dashboard/edit")}
          className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105">
          <FiEdit2 /> Edit Biodata
        </button>
      </div>
    </section>
  );
};

export default BioData;