import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Sweet Alert
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const FavouriteList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch favourites
  const { data: favourites = [], isLoading, isError } = useQuery({
    queryKey: ["favourites", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/favourites?email=${user?.email}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Mutation: Remove favourite
  const { mutate: removeFavourite } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/favourite/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return id; // return deleted ID for onSuccess
    },
    onMutate: async (id) => {
      // Optimistic update: remove item immediately from cache
      await queryClient.cancelQueries(["favourites", user?.email]);
      const previousFavourites = queryClient.getQueryData(["favourites", user?.email]);
      queryClient.setQueryData(["favourites", user?.email], (old) =>
        old.filter((fav) => fav._id !== id)
      );
      return { previousFavourites };
    },
    onError: (err, id, context) => {
      // Rollback on error
      queryClient.setQueryData(["favourites", user?.email], context.previousFavourites);
      Toast.fire({ icon: "error", title: "Failed to remove favourite" });
    },
    onSuccess: () => {
      Toast.fire({ icon: "success", title: "Removed from favourites" });
    },
  });

  const handleRemove = (id) => {
    Swal.fire({
      title: "Remove this profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFavourite(id);
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading favourites...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load favourites.</p>;

  return (
    <div className="p-4 md:p-8 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Favourite Biodata List</h2>

      {/* Mobile View */}
      <div className="space-y-4 sm:hidden">
        {favourites.map((fav) => (
          <div
            key={fav._id}
            className="border p-4 rounded-lg shadow-sm flex gap-4 items-center"
          >
            <img
              src={fav.profileImage}
              alt={fav.name}
              className="w-16 h-16 object-cover rounded-full border"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{fav.name}</p>
              <p className="text-sm text-gray-500">
                {fav.biodataType}, Age: {fav.age}
              </p>
              <p className="text-sm text-gray-500">{fav.permanentDivision}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => navigate(`/biodata/${fav.biodataId}`)}
                  className="px-3 py-1 bg-primary hover:bg-secondary text-white rounded text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleRemove(fav._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Division</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {favourites.map((fav, index) => (
              <tr key={fav._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={fav.profileImage}
                    alt={fav.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                </td>
                <td className="px-4 py-2 text-gray-800">{fav.name}</td>
                <td className="px-4 py-2 text-secondary font-semibold">{fav.biodataType}</td>
                <td className="px-4 py-2">{fav.age}</td>
                <td className="px-4 py-2">{fav.permanentDivision}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/biodata/${fav.biodataId}`)}
                    className="px-3 py-1 bg-primary cursor-pointer hover:bg-secondary text-white rounded text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRemove(fav._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FavouriteList;
