import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Tost
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

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        withCredentials: true
      });
      return res.data;
    },
  });

  // Toggle Admin role
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isAdmin }) => {
      const newRole = isAdmin ? "user" : "admin";
      return axiosSecure.patch(`/users/admin/${id}`, { role: newRole }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
    },
    onSuccess: (data, { isAdmin }) => {
      Toast.fire({
        icon: "success",
        title: isAdmin ? "Admin removed" : "User promoted to Admin",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to update user role",
      });
    },
  });

  // Toggle Premium
  const togglePremiumMutation = useMutation({
    mutationFn: async ({ id, current }) => {
      return axiosSecure.patch(`/users/premium/${id}`, { premium: !current }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
    },
    onSuccess: (data, { current }) => {
      Toast.fire({
        icon: "success",
        title: !current ? "Premium granted" : "Premium removed",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to update premium status",
      });
    },
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/users/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
    },
    onSuccess: (res) => {
      if (res.data.deletedCount) {
        Toast.fire({
          icon: "success",
          title: "User deleted successfully",
        });
        queryClient.invalidateQueries(["users"]);
      }
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to delete user",
      });
    },
  });

  const tableHeaders = ["#", "Photo", "Name", "Email", "Role", "Premium", "Actions"];

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide">Manage Users</h2>
        <div className="overflow-x-auto rounded-md border border-red-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-red-100 border-b border-red-300">
              <tr>
                {tableHeaders.map(
                  (header) => (
                    <th key={header} className="text-left px-6 py-4 text-sm font-semibold text-red-800 select-none">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {!users ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}
                    className="border-b border-red-100 hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-300" loading="lazy" />
                    </td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() =>
                          toggleAdminMutation.mutate({
                            id: user._id,
                            isAdmin: user.role === "admin",
                          })
                        }
                        className={`rounded px-3 py-1 cursor-pointer font-semibold text-sm 
                          ${user.role === "admin" ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"} transition duration-200`}
                          title={user.role === "admin" ? "Remove Admin" : "Make Admin"}>
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() =>
                          togglePremiumMutation.mutate({
                            id: user._id,
                            current: user.premium,
                          })
                        }
                        className={`rounded px-3 cursor-pointer py-1 font-semibold text-sm 
                          ${user.premium ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500" : "bg-gray-300 text-gray-700 hover:bg-gray-400"} transition duration-200`}
                          title={user.premium ? "Remove Premium" : "Make Premium"}>
                        {user.premium ? "Remove Premium" : "Make Premium"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() =>
                          Swal.fire({
                            title: "Are you sure?",
                            text: "This user will be deleted permanently.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Delete",
                            confirmButtonColor: "#d33",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteUserMutation.mutate(user._id);
                            }
                          })
                        }
                        className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200" aria-label="Delete User" title="Delete User">
                        <FaTrash size={20} />
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

export default ManageUsers;