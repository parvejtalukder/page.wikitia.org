import { useQuery, useQueryClient } from "@tanstack/react-query"; // ✅ Added useQueryClient
import { useState, useEffect } from "react"; // ✅ Added useEffect
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";

const Payments = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const axios = useAxiosSecure();
  const { user, loading } = useAuth(); // ✅ Added loading state
  const queryClient = useQueryClient(); // ✅ Get global queryClient

  const fetchPayments = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    
    const token = await user.getIdToken(true); // ✅ Force token refresh
    const res = await axios.get(
      `/get_payments?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  const { 
    data, 
    isLoading, 
    isError, 
    isFetching // ✅ Added to show refresh state
  } = useQuery({
    queryKey: ["payments", user?.uid, page], // ✅ Includes user ID
    queryFn: fetchPayments,
    enabled: !!user?.uid && !loading, // ✅ Wait for loading to complete
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    keepPreviousData: false,
  });

  // ✅ Clear cache when user changes (logout or switch accounts)
  useEffect(() => {
    if (loading) return;
    
    if (!user?.uid) {
      // User logged out - clear all payment queries
      queryClient.removeQueries({ queryKey: ["payments"] });
      setPage(1);
    } else {
      // User switched accounts - invalidate old data and refetch
      queryClient.invalidateQueries({ 
        queryKey: ["payments", user.uid],
        exact: false 
      });
      setPage(1);
    }
  }, [user?.uid, loading, queryClient]);

  // ✅ Reset page when user changes
  useEffect(() => {
    if (user?.uid) {
      setPage(1);
    }
  }, [user?.uid]);

  const payments = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">
        Loading payments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load payments. Please try again.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ✅ Show refresh indicator when fetching new user data */}
      {isFetching && (
        <div className="bg-blue-50 p-2 text-center text-sm text-blue-600 border-b">
          Refreshing payment data...
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        {/* HEADER */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sender</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">
          {payments.length > 0 ? (
            payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                {/* SENDER NAME */}
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {p.sender?.name || "N/A"}
                </td>

                {/* SENDER EMAIL */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.sender?.email || "N/A"}
                </td>

                {/* AMOUNT */}
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  ${p.payment?.amount || "0"}
                </td>

                {/* TRANSACTION ID */}
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  {p.payment?.transaction_id || "N/A"}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      p.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No payment records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION - Only show if there are payments */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-b-2xl">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>

          <p className="text-sm text-gray-600">
            Page {page} of {pagination.totalPages}
          </p>

          <button
            disabled={page === pagination.totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Payments;