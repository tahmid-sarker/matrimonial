import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 2200,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const EditBioData = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch logged user
  const { data: loggeUser = {} } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?email=${user?.email}`, {
        withCredentials: true
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isPremium = loggeUser?.premium === "true";

  // Fetch all biodatas to determine next biodataId
  const { data: biodatas = [] } = useQuery({
    queryKey: ["biodatas"],
    queryFn: async () => {
      const res = await axiosSecure.get("/biodatas");
      return res.data;
    },
  });

  // Fetch user's biodata
  const { data: biodata = null, isLoading: biodataLoading } = useQuery({
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

  // Fetch existing premium request
  const { data: request = {} } = useQuery({
    queryKey: ["premiumRequest", user.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/premium-requests?email=${user.email}`, {
        withCredentials: true
      });
      return response.data;
    },
    enabled: !!user.email,
  });

  const hasRequested = !!request && (request.status === "pending" || request.status === "approved");

  // Mutation for creating/updating biodata
  const { mutate: updatedData } = useMutation({
    mutationFn: async (updatedData) => {
      if (userBiodata) {
        return axiosSecure.patch(`/biodata/${userBiodata.biodataId}`, updatedData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      } else {
        return axiosSecure.post('/biodata', updatedData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userBiodata", user.email]);
      Toast.fire({
        icon: "success",
        title: userBiodata ? "Biodata updated successfully!" : "Biodata created successfully!",
      });
    },
    onError: () => {
      Toast.fire({ icon: "error", title: "Something went wrong!" });
    },
  });

  // Mutation for requesting premium
  const { mutate: requestPremium, isLoading, isSuccess } = useMutation({
    mutationFn: (email) => axiosSecure.post("/request-premium", { email }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    }),
    onSuccess: () => {
      Toast.fire({ icon: "success", title: "Premium request sent!" });
      queryClient.invalidateQueries(["premiumRequest", user.email]);
    },
    onError: (err) => {
      Toast.fire({ icon: "error", title: err?.response?.data?.message || "Something went wrong!" });
    },
  });

  const handleRequestPremium = () => {
    if (!isLoading && !isSuccess)
      requestPremium(user.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.age = Number(data.age);
    data.expectedPartnerAge = Number(data.expectedPartnerAge);
    data.biodataId = userBiodata ? userBiodata.biodataId : biodatas.length + 1;
    updatedData(data);
  };

  if (!biodataLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 mb-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">
          {isEditMode ? "Edit Biodata" : "Create Biodata"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Personal Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
          </div>

          {/* Biodata ID */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Biodata ID</span>
            <div>
              <input type="number" name="biodataId" value={isEditMode ? userBiodata.biodataId : biodatas.length + 1} readOnly
                className="border p-3 rounded-lg w-full shadow-sm bg-gray-100 cursor-not-allowed focus:outline-hidden" />
            </div>
          </label>

          {/* Full Name */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Full Name</span>
            <div>
              <input type="text" name="name" defaultValue={userBiodata?.name} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Biodata Type */}
          {/* Biodata Type */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Biodata Type</span>
            <div>
              <select name="biodataType" defaultValue={userBiodata?.biodataType} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary">
                <option value="">Select Type</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </label>

          {/* Date of Birth */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Date of Birth</span>
            <div>
              <input type="date" name="dateOfBirth" defaultValue={userBiodata?.dateOfBirth} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Age */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Age</span>
            <div>
              <input type="number" name="age" defaultValue={userBiodata?.age} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Height */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Height</span>
            <div>
              <input type="text" name="height" defaultValue={userBiodata?.height} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </label>

          {/* Weight */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Weight</span>
            <div>
              <input type="text" name="weight" defaultValue={userBiodata?.weight} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Race */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Race</span>
            <div>
              <select name="race" defaultValue={userBiodata?.race} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary">
                <option value="">Select Race</option>
                <option value="Fair">Fair</option>
                <option value="Medium Fair">Medium Fair</option>
                <option value="Brown">Brown</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
          </label>

          {/* Occupation */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Occupation</span>
            <div>
              <input type="text" name="occupation" defaultValue={userBiodata?.occupation} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Permanent Division */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Permanent Division</span>
            <div>
              <select name="permanentDivision" defaultValue={userBiodata?.permanentDivision} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary">
                <option value="">Permanent Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Mymensingh">Mymensingh</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Rangpur">Rangpur</option>
              </select>
            </div>
          </label>

          {/* Present Division */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Present Division</span>
            <div>
              <select name="presentDivision" defaultValue={userBiodata?.presentDivision} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary">
                <option value="">Present Division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Mymensingh">Mymensingh</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Rangpur">Rangpur</option>
              </select>
            </div>
          </label>

          {/* Father's Name */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Father's Name</span>
            <div>
              <input type="text" name="fathersName" defaultValue={userBiodata?.fathersName} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Mother's Name */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Mother's Name</span>
            <div>
              <input type="text" name="mothersName" defaultValue={userBiodata?.mothersName} required
                className="border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary" />
            </div>
          </label>

          {/* Mobile Number */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Mobile Number</span>
            <div>
              <input type="text" name="mobileNumber" defaultValue={userBiodata?.mobileNumber} required readOnly={!isPremium}
                className={`border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${!isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            </div>
          </label>

          {/* Contact Email */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Contact Email</span>
            <div>
              <input type="email" name="contactEmail" defaultValue={user.email} required readOnly
                className="border p-3 rounded-lg w-full shadow-sm bg-gray-100 cursor-not-allowed" />
              <p className="text-red-500 italic text-sm mt-1">*Contact email cannot be changed.</p>
            </div>
          </label>

          {/* Photo URL */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Profile Image URL</span>
            <div>
              <input type="url" name="profileImage" defaultValue={userBiodata?.profileImage} required readOnly={!isPremium}
                className={`border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${!isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            </div>
          </label>

          {/* Partner Preferences Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Partner Preferences</h3>
          </div>

          {/* Expected Partner Age */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Expected Partner Age</span>
            <div>
              <input type="number" name="expectedPartnerAge" defaultValue={userBiodata?.expectedPartnerAge} required readOnly={!isPremium}
                className={`border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${!isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            </div>
          </label>

          {/* Expected Partner Height */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Expected Partner Height</span>
            <div>
              <input type="text" name="expectedPartnerHeight" defaultValue={userBiodata?.expectedPartnerHeight} required readOnly={!isPremium}
                className={`border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${!isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            </div>
          </label>

          {/* Expected Partner Weight */}
          <label className="flex flex-col gap-1">
            <span className="text-gray-600 font-medium">Expected Partner Weight</span>
            <div>
              <input type="text" name="expectedPartnerWeight" defaultValue={userBiodata?.expectedPartnerWeight} required readOnly={!isPremium}
                className={`border p-3 rounded-lg w-full shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary ${!isPremium ? "bg-gray-100 cursor-not-allowed" : ""}`} />
            </div>
          </label>

          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4">
            {/* Request Premium Button (only if not premium) */}
            {!isPremium && (
              <button type="button" onClick={handleRequestPremium} disabled={isLoading || isSuccess || hasRequested}
                className={`bg-linear-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105 
                ${isLoading || isSuccess || hasRequested ? "opacity-70 cursor-not-allowed hover:scale-100" : "cursor-pointer hover:from-secondary hover:to-primary"}`}>
                {hasRequested ? "Requested" : "Request Premium Access"}
              </button>
            )}

            {/* Submit Button (always visible) */}
            <button type="submit"
              className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary cursor-pointer text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105 w-full md:w-auto">
              {isEditMode ? "Update Biodata" : "Submit Biodata"}
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default EditBioData;