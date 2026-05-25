import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { useState, useEffect } from "react"; 
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import { CreditCard, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const Payments = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const axios = useAxiosSecure();
  const { user, loading } = useAuth(); 
  const queryClient = useQueryClient(); 

  const fetchPayments = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/get_payments?page=${page}&limit=${limit}`);
    return res.data;
  };

  const { 
    data, 
    isLoading, 
    isError, 
    isFetching 
  } = useQuery({
    queryKey: ["payments", user?.uid, page], 
    queryFn: fetchPayments,
    enabled: !!user?.uid && !loading, 
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (loading) return;
    if (!user?.uid) {
      queryClient.removeQueries({ queryKey: ["payments"] });
      setPage(1);
    } else {
      queryClient.invalidateQueries({ 
        queryKey: ["payments", user.uid],
        exact: false 
      });
      setPage(1);
    }
  }, [user?.uid, loading, queryClient]);

  useEffect(() => {
    if (user?.uid) {
      setPage(1);
    }
  }, [user?.uid]);

  const payments = data?.data || [];
  const pagination = data?.pagination;

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      failed: "bg-red-50 text-red-700",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading payments...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Failed to load payments. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">View all your payment transactions</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isFetching && (
          <div className="bg-indigo-50 p-2 text-center text-sm text-indigo-600 border-b border-indigo-100">
            Refreshing payment data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sender</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {p.sender?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.sender?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${p.payment?.amount || "0"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {p.payment?.transaction_id || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <p className="text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </p>
            <button
              disabled={page === pagination.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;