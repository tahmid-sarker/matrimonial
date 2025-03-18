import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion } from "motion/react";

// Sweet Alert
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const BioDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch single biodata
  const { data: biodata = {}, isLoading: biodataLoading} = useQuery({
    queryKey: ["biodata", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/biodata/${id}`, {
        withCredentials: true
      });
      return response.data;
    },
  });

  // Fetch all biodatas
  const { data: allBiodatas = [], isLoading: allBiodatasLoading } = useQuery({
    queryKey: ["allBiodatas"],
    queryFn: async () => {
      const response = await axiosSecure.get("/biodatas");
      return response.data;
    },
  });

  // Fetch favourites
  const { data: favourites = [], isLoading: favLoading } = useQuery({
    queryKey: ["favourites", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/favourites?email=${user?.email}`, {
        withCredentials: true
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Fetch payments for contact info
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`, {
        withCredentials: true
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // check if payment exists and succeeded
  const hasPaid = payments.some(p => p.status === "succeeded" && p.email === user.email);

  // Favourite logic
  const isFavouriteDisabled = favourites.some(fav => fav.biodataId === biodata.biodataId);

  const { mutate: addToFavourites, isLoading: favAdding } = useMutation({
    mutationFn: async () => {
      const favourite = { ...biodata, userEmail: user.email, isFavourite: true };
      const response = await axiosSecure.post("/favourite", favourite, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: () => {
      Toast.fire({ icon: "success", title: "Added to Favourites" });
      queryClient.invalidateQueries(["favourites", user?.email]);
    },
    onError: (error) => {
      Toast.fire({ icon: "error", title: error.message || "Failed to add favourite" });
    },
  });

  // Similar profiles
  const similarProfiles = allBiodatas
    .filter(
      (bio) => bio.biodataType === biodata.biodataType && bio.biodataId !== biodata.biodataId
    )
    .slice(0, 3);

  if (!biodataLoading || !allBiodatasLoading || !favLoading) {
    return (
      <motion.section className="bg-base-100 py-8 px-4 md:px-10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}>
        
        <motion.h2 className="text-2xl md:text-4xl text-neutral font-bold text-center mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="text-primary">Biodata</span> Details
        </motion.h2>

        <motion.div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Profile Section */}
          <div className="flex flex-col items-center border border-secondary rounded-lg p-6 shadow-sm">
            <img src={biodata.profileImage} alt={biodata.name} className="w-full h-auto object-cover rounded-lg border-4 border-secondary mb-4" />
            <h3 className="text-2xl font-semibold mb-1 text-gray-700">{biodata.name}</h3>
            <span className="text-secondary font-medium text-sm uppercase tracking-wide">{biodata.biodataType}</span>
          </div>

          {/* Details Section */}
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            {/* All biodata fields */}
            <p><span className="font-semibold text-primary">Biodata ID:</span> {biodata.biodataId}</p>
            <p><span className="font-semibold text-primary">Date of Birth:</span> {biodata.dateOfBirth}</p>
            <p><span className="font-semibold text-primary">Age:</span> {biodata.age}</p>
            <p><span className="font-semibold text-primary">Height:</span> {biodata.height}</p>
            <p><span className="font-semibold text-primary">Weight:</span> {biodata.weight}</p>
            <p><span className="font-semibold text-primary">Occupation:</span> {biodata.occupation}</p>
            <p><span className="font-semibold text-primary">Race:</span> {biodata.race}</p>
            <p><span className="font-semibold text-primary">Father's Name:</span> {biodata.fathersName}</p>
            <p><span className="font-semibold text-primary">Mother's Name:</span> {biodata.mothersName}</p>
            <p><span className="font-semibold text-primary">Permanent Division:</span> {biodata.permanentDivision}</p>
            <p><span className="font-semibold text-primary">Present Division:</span> {biodata.presentDivision}</p>
            <p><span className="font-semibold text-primary">Expected Partner Age:</span> {biodata.expectedPartnerAge}</p>
            <p><span className="font-semibold text-primary">Expected Partner Height:</span> {biodata.expectedPartnerHeight}</p>
            <p><span className="font-semibold text-primary">Expected Partner Weight:</span> {biodata.expectedPartnerWeight}</p>

            {/* Contact Info */}
            {hasPaid ? (
              <div className="mt-4 p-4 border border-green-300 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700">Contact Information:</p>
                <p>Email: {biodata.contactEmail}</p>
                <p>Mobile: {biodata.mobileNumber}</p>
              </div>
            ) : (
              <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
                <p className="font-semibold text-yellow-700">Contact Information Locked!!</p>
                <p>Pay to unlock Email & Mobile Number.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="w-11/12 mx-auto flex flex-col sm:flex-row justify-center gap-6 mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <button onClick={() => addToFavourites()} disabled={isFavouriteDisabled || favAdding} className={`px-8 py-3 font-semibold rounded-lg cursor-pointer transition
          ${isFavouriteDisabled || favAdding ? "bg-gray-400 cursor-not-allowed text-white" : "bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white"}`}>
            {isFavouriteDisabled ? "Added to Favourites" : favAdding ? "Adding..." : "Add to Favourites"}
          </button>

          {!hasPaid && (
            <Link to={`/checkout/${biodata.biodataId}`} className="px-8 py-3 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold rounded-lg transition text-center">
              Request Contact Info
            </Link>
          )}
        </motion.div>

        {/* Similar Profiles */}
        {similarProfiles.length > 0 && (
          <motion.div className="mt-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h3 className="text-xl md:text-2xl font-bold text-neutral mb-6 text-center">Similar <span className="text-primary">Profiles</span></h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {similarProfiles.map((profile) => (
                <motion.div key={profile.biodataId} className="cursor-pointer bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col items-center transition hover:shadow-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <img src={profile.profileImage} alt={profile.name} className="w-28 h-28 object-cover rounded-full mb-3 border-2 border-primary" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-1 text-center">{profile.name}</h4>
                  <span className="text-sm text-secondary uppercase tracking-wide font-medium mb-2">{profile.biodataType}</span>
                  <p className="text-gray-600 text-sm mb-1">Age: <span className="font-medium">{profile.age}</span></p>
                  <p className="text-gray-600 text-sm mb-3">Division: <span className="font-medium">{profile.permanentDivision}</span></p>
                  <button onClick={() => navigate(`/biodata/${profile.biodataId}`)} className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-5 py-2 rounded-md font-semibold cursor-pointer transition">
                    View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.section>
    );
  }
};

export default BioDetails;