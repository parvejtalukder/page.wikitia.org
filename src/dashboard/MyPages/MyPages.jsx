import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Eye, CreditCard, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const MyPages = () => {

  const [page, setPage] = useState(1);
  const limit = 5;

  const axios = useAxiosSecure();  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const fetchPages = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/get_pages?page=${page}&limit=${limit}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["pages", user?.uid, page],
    queryFn: fetchPages,
    enabled: !!user?.uid && !loading,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (loading) return;

    if (!user?.uid) {
      queryClient.refetchQueries({ queryKey: ["pages"] });
      setPage(1);
    } else {
      queryClient.invalidateQueries({ queryKey: ["pages", user.uid], exact: false });
      setPage(1);
    }
  }, [user?.uid, loading, queryClient]);

  useEffect(() => {
    if (user?.uid) {
      setPage(1);
    }
  }, [user?.uid]);

  const pages = user?.uid && data?.data ? data.data : [];
  const pagination = data?.pagination;

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      rejected: "bg-red-50 text-red-700",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading pages...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">Failed to load pages. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Page Requests</h1>
        <p className="text-gray-500 mt-1">Manage and track all your wiki pages</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isFetching && (
          <div className="bg-indigo-50 p-2 text-center text-sm text-indigo-600 border-b border-indigo-100">
            <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
            Refreshing page data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.length > 0 ? (
                pages.map((page) => (
                  <tr key={page._id} className="hover:bg-gray-50 transition">
                    {/* TITLE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={page.identity?.logo || "/placeholder.png"}
                          alt={page.identity?.name}
                          className="w-10 h-10 rounded-lg border border-gray-200 object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {page.identity?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {page.identity?.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize text-gray-600">
                        {page.type}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(page.status)}`}
                        >
                          {page.status}
                        </span>
                        {page.status === "rejected" && page.reason && (
                          <p className="text-xs text-red-600 max-w-xs">
                            (If you are right, mail us <span className="text-blue-500">contact@wikitia.org</span>)
                          </p>
                        )}
                      </div>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {page.createdAt
                        ? new Date(page.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* PAYMENT */}
                    <td className="px-6 py-4">
                      {!page.paid && (
                        <Link 
                          state={{
                            pageId: page._id,
                            charge: page?.charge || 59,
                            title: page.identity?.name || "Blank",
                            paid: page.paid,
                            type:
                                page.type === "edit" || page.type === "media"
                                  ? page.type
                                  : "page",
                          }}
                          to={"/dashboard/payment/submit"} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay (${page.charge})
                        </Link> 
                      )}
                      {page.paid && (
                        <span className={`${page.status === "rejected" ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white" : "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white"}`}>
                          <CreditCard className="w-3.5 h-3.5" />
                          {
                            page.reason ? "Failed" : "Paid"
                          } (${page.charge})
                        </span>
                      )}
                      {page.status === "rejected" && page.reason && (
                          <p className="text-xs text-red-600 max-w-xs">
                            ({page.reason})
                          </p>
                        )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/dashboard/my-pages/${page._id}`)} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No pages found
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

export default MyPages;