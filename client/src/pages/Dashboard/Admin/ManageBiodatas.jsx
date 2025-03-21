import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiTrash2, FiEye } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

// Toast
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

const ManageBiodatas = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: biodatas = [], isLoading, isError } = useQuery({
    queryKey: ["biodatas"],
    queryFn: async () => {
      const res = await axiosSecure.get("/biodatas");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/biodata/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biodatas"] });
      Toast.fire({
        icon: "success",
        title: "Biodata deleted successfully!",
      });
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This biodata will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const tableHeaders = ["#", "Photo", "Name", "Age", "Height", "Weight", "Occupation", "Division", "Actions"];

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide">Manage Biodatas</h2>
        <div className="overflow-x-auto rounded-md border border-red-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-red-100 border-b border-red-300">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} className="text-left px-6 py-4 text-sm font-semibold text-red-800 select-none">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!biodatas ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-400">No biodatas found.</td>
                </tr>
              ) : (
                biodatas.map((biodata, index) => (
                  <tr key={biodata._id} className="border-b border-red-100 hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <img src={biodata.profileImage} alt={biodata.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-300" loading="lazy" />
                    </td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{biodata.name}</td>
                    <td className="px-6 py-4 text-gray-600">{biodata.age}</td>
                    <td className="px-6 py-4 text-gray-600">{biodata.height}</td>
                    <td className="px-6 py-4 text-gray-600">{biodata.weight}</td>
                    <td className="px-6 py-4 text-gray-600">{biodata.occupation}</td>
                    <td className="px-6 py-4 text-gray-600">{biodata.presentDivision}</td>
                    <td className="px-6 py-4 flex gap-2">
                      {/* Delete Button */}
                      <button onClick={() => handleDelete(biodata.biodataId)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200">
                        <FiTrash2 size={18} />
                        Delete
                      </button>

                      {/* View Details Button */}
                      <button onClick={() => navigate(`/biodata/${biodata.biodataId}`)}
                        className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
                        <FiEye size={18} />
                        View Details
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

export default ManageBiodatas;