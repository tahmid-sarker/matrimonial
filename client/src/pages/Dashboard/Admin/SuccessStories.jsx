import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaStar, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// SweetAlert2 Toast config
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

const SuccessStory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all success stories
  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["successStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories", {
        withCredentials: true
      });
      return res.data;
    },
  });

  // Mutation for deleting a story
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/stories/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["successStories"], (old) =>
        old.filter((story) => story._id !== id)
      );
      Toast.fire({
        icon: "success",
        title: "Story deleted successfully",
      });
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to delete the story",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This story will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide">
          Success Stories
        </h2>
        <div className="overflow-x-auto rounded-md border border-red-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-red-100 border-b border-red-300">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">#</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Couple</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Image</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Marriage Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Message</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Rating</th>
                <th className="px-6 py-4 text-sm font-semibold text-red-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {!stories ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">No success stories found.</td>
                </tr>
              ) : (
                stories.map((story, index) => (
                  <tr key={story._id} className="border-b border-red-100 hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-red-700 font-semibold">
                      {story.yourBiodataId} & {story.partnerBiodataId}
                    </td>
                    <td className="px-6 py-4">
                      <img src={story.coupleImage} alt="Couple" className="w-16 h-16 object-cover rounded-md border border-red-300" />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(story.dateOfMarriage).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{story.review}</td>
                    <td className="px-6 py-4 text-yellow-500 flex items-center gap-1">
                      {Array.from({ length: Math.round(story.rating) }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(story._id)}
                        className="text-red-600 hover:text-white cursor-pointer hover:bg-red-600 border border-red-600 px-3 py-1 rounded flex items-center gap-2 transition">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

};

export default SuccessStory;