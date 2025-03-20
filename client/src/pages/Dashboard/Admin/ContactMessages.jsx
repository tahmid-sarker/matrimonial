import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

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

const ContactMessages = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contact-messages", {
        withCredentials: true
      });
      return res.data;
    },
  });

  // Delete message
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/contact-messages/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }),
    onSuccess: (_data, id) => {
      Toast.fire({ icon: "success", title: "Message deleted!" });
      queryClient.setQueryData(["contactMessages"], (old) =>
        old ? old.filter((msg) => msg._id !== id) : []
      );
    },
    onError: () => Toast.fire({
      icon: "error", title: "Failed to delete message",
    })
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This message will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const tableHeaders = ["#", "Name", "Email", "Message", "Action"];

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide">
          Contact Messages
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
              {!messages ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">No messages found.</td>
                </tr>
              ) : (
                messages.map((msg, index) => (
                  <tr key={msg._id}
                    className="border-b border-red-100 hover:bg-red-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{msg.name}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{msg.email}</td>
                    <td className="px-6 py-4 max-w-md">
                      <textarea value={msg.message} rows={2} className="w-full border border-red-300 rounded-md text-sm text-gray-700" readOnly />
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(msg._id)}
                        className="text-red-500 hover:text-white cursor-pointer hover:bg-red-600 border border-red-600 px-3 py-1 rounded flex items-center gap-2 transition">
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

export default ContactMessages;