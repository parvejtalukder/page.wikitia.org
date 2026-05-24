import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";

const Payments = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const axios = useAxiosSecure();
  const { user } = useAuth();

  const fetchPayments = async () => {
    const token = await user.getIdToken();

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payments", user?.uid, page],
    queryFn: fetchPayments,
    enabled: !!user?.uid,
    refetchOnWindowFocus: true,
  });

  const payments = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return <div className="p-6">Loading payments...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load payments</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

      <table className="min-w-full divide-y divide-gray-200">

        {/* HEADER */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">Sender</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
            {/* <th className="px-6 py-4 text-left text-sm font-semibold">Method</th> */}
            <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">

          {payments.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">

              {/* TITLE */}
              <td className="px-6 py-4 text-sm font-medium">
                {p.sender?.name || "N/A"}
              </td>

              {/* AMOUNT */}
              <td className="px-6 py-4 text-sm">
                {p.sender?.email || 0}
              </td>

              {/* METHOD */}
              <td className="px-6 py-4 text-sm capitalize">
                ${p.payment?.amount || "N/A"}
              </td>

              {/* TRANSACTION ID */}
              <td className="px-6 py-4 text-sm text-gray-600">
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
          ))}

        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <p className="text-sm">
          Page {page} of {pagination?.totalPages || 1}
        </p>

        <button
          disabled={page === pagination?.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Payments;