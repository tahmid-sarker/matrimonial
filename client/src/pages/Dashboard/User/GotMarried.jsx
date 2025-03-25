import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

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

const GotMarried = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch user's biodata
  const { data: biodata = null } = useQuery({
    queryKey: ["biodata", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/biodata?email=${user.email}`, {
        withCredentials: true
      });
      return res.data;
    },
    enabled: !!user.email,
  });

  const userBiodata = biodata?.[0] || null;
  const isEditMode = !!userBiodata;

  // Mutation for submitting success story
  const { mutate: submitStory, isLoading } = useMutation({
    mutationFn: async (storyData) => {
      const response = await axiosSecure.post("/stories", storyData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        Toast.fire({ icon: "success", text: "Success story submitted!" });
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      Toast.fire({
        icon: "error",
        text: err?.response?.data?.message || "Failed to submit story!",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const successStory = Object.fromEntries(formData.entries());
    successStory.rating = parseFloat(successStory.rating);
    submitStory(successStory);
    e.target.reset();
  };

  return (
    <section className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Share Your Success Story
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Your Biodata ID */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Your Biodata ID</span>
          <input type="text" name="yourBiodataId" placeholder="Enter your biodata ID" value={isEditMode ? userBiodata.biodataId : "Create biodata first"} required readOnly
            className="border p-3 rounded-lg w-full shadow-sm bg-gray-100 cursor-not-allowed focus:outline-hidden" />
        </label>

        {/* Partner Biodata ID */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Partner Biodata ID</span>
          <input type="text" name="partnerBiodataId"  placeholder="Enter partner's biodata ID" required
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </label>

        {/* Couple Image */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Couple Image Link</span>
          <input type="url" name="coupleImage" placeholder="Paste image link"
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </label>

        {/* Date of Marriage */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Date of Marriage</span>
          <input type="date" name="dateOfMarriage" required
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </label>

        {/* Review */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Your Review</span>
          <textarea name="review" rows="5" placeholder="Write your success story here..." required
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary resize-none" />
        </label>

        {/* Rating */}
        <label className="flex flex-col gap-1">
          <span className="text-gray-700 font-medium">Rating out of 5</span>
          <input type="number" name="rating" min="0" max="5" step="0.1" placeholder="Enter your rating out of 5" required
            className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
        </label>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}
          className={`w-full bg-linear-to-r cursor-pointer from-primary to-secondary text-white font-bold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 
            ${isLoading ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}`}>
          {isLoading ? "Submitting..." : "Submit Story"}
        </button>
      </form>
    </section>
  );
};

export default GotMarried;