import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentList = () => {
  const axiosSecure = useAxiosSecure();
  const tableHeaders = ["#", "User Name", "User Email", "Amount", "Status", "Date", "Payment ID"];

  // Fetch all payments
  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await axiosSecure.get("/all-payments", {
        withCredentials: true
      });
      return response.data;
    },
  });

  if (!isLoading && !isError) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-full mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-red-700 tracking-wide">Payment History</h2>

        <div className="overflow-x-auto rounded-md border border-pink-200 shadow-sm">
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
              {!payments ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment, i) => (
                  <tr key={payment._id} className="border-b border-pink-100 hover:bg-pink-50 transition duration-150">
                    <td className="px-6 py-4 font-medium text-gray-700">{i + 1}</td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{payment.name}</td>
                    <td className="px-6 py-4 text-red-700 font-semibold">{payment.email}</td>
                    <td className="px-6 py-4 font-medium">${(payment.amount / 100).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded font-semibold text-sm 
                        ${payment.status === "succeeded" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(payment.date).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{payment.paymentId}</td>
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

export default PaymentList;