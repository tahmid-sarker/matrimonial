import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

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

const ApprovePremium = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const tableHeaders = ["#", "Email", "Status", "Actions"];

  // Fetch all premium requests
  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["premiumRequests"],
    queryFn: async () => {
      const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/premium-requests`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  // Mutation for toggling approval
  const toggleApprovalMutation = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axiosSecure.patch(
        `${import.meta.env.VITE_API_URL}/premium-requests/${id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      ),
    onSuccess: ({ id, newStatus }) => {
      queryClient.setQueryData(["premiumRequests"], (oldData) =>
        oldData.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );
      Toast.fire({
        icon: "success",
        title: newStatus === "approved" ? "Request approved!" : "Approval removed!",
      });
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to toggle approval",
      });
    },
  });

  // Mutation for updating user premium status by email
  const updateUserPremiumMutation = useMutation({
    mutationFn: ({ email, premium }) =>
      axiosSecure.patch(
        `${import.meta.env.VITE_API_URL}/users/email/${email}`,
        { premium },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      ),
    onSuccess: () => {
      Toast.fire({
        icon: "success",
        title: "User premium status updated",
      });
      queryClient.invalidateQueries(["premiumRequests"]);
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to update user premium status",
      });
    },
  });

  // Mutation for deleting request
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.delete(`${import.meta.env.VITE_API_URL}/premium-requests/${id}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["premiumRequests"], (oldData) =>
        oldData.filter((req) => req._id !== id)
      );
      Toast.fire({
        icon: "success",
        title: "Request deleted successfully",
      });
    },
    onError: () => {
      Toast.fire({
        icon: "error",
        title: "Failed to delete request",
      });
    },
  });

  const handleToggleApprove = (id, currentStatus, userEmail) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    const isPremium = newStatus === "approved";

    // update user premium status
    updateUserPremiumMutation.mutate({ email: encodeURIComponent(userEmail), premium: isPremium });

    // update premium request status
    toggleApprovalMutation.mutate({ id, newStatus });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide drop-shadow-sm">
          Premium Requests
        </h2>
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
              {!requests ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">No premium requests found.</td>
                </tr>
              ) : (
                requests.map((req, i) => (
                  <tr key={req._id} className="border-b border-red-100 hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 font-medium text-gray-700">{i + 1}</td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{req.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded font-semibold text-sm 
                        ${req.status === "approved" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                          {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => handleToggleApprove(req._id, req.status, req.email)}
                        className={`px-3 py-1 rounded cursor-pointer font-semibold text-white 
                        ${req.status === "approved" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} transition`}>
                          {req.status === "approved" ? "Remove Approve" : "Approve"}
                      </button>
                      <button onClick={() => handleDelete(req._id)} className="px-3 py-1 rounded cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition">
                        Delete
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

export default ApprovePremium;