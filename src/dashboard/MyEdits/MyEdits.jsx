import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Eye, CreditCard, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, FileEdit, Image, ExternalLink } from "lucide-react";

const MyEdits = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const axios = useAxiosSecure();  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const fetchEdits = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/get_edits?page=${page}&limit=${limit}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["edits", user?.uid, page],
    queryFn: fetchEdits,
    enabled: !!user?.uid && !loading,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    keepPreviousData: false,
  });

  useEffect(() => {
    if (loading) return;

    if (!user?.uid) {
      queryClient.refetchQueries({ queryKey: ["edits"] });
      setPage(1);
    } else {
      queryClient.invalidateQueries({ queryKey: ["edits", user.uid], exact: false });
      setPage(1);
    }
  }, [user?.uid, loading, queryClient]);

  useEffect(() => {
    if (user?.uid) {
      setPage(1);
    }
  }, [user?.uid]);

  const edits = user?.uid && data?.data ? data.data : [];
  const pagination = data?.pagination;

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      rejected: "bg-red-50 text-red-700",
      completed: "bg-blue-50 text-blue-700",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  const getEditTypeIcon = (type) => {
    return type === "page_edit" ? (
      <FileEdit className="w-4 h-4 text-indigo-600" />
    ) : (
      <Image className="w-4 h-4 text-purple-600" />
    );
  };

  const getEditTypeLabel = (type) => {
    return type === "page_edit" ? "Page Edit" : "Media Edit";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading edit requests...</span>
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
          <p className="text-red-600">Failed to load edit requests. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Edit Requests</h1>
        <p className="text-gray-500 mt-1">Track and manage your page edit requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isFetching && (
          <div className="bg-indigo-50 p-2 text-center text-sm text-indigo-600 border-b border-indigo-100">
            <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
            Refreshing edit data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Page Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Edit Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Section</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {edits.length > 0 ? (
                edits.map((edit) => (
                  <tr key={edit._id} className="hover:bg-gray-50 transition">
                    {/* PAGE NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 border border-gray-200">
                          {getEditTypeIcon(edit.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {edit.pageName || "N/A"}
                          </p>
                          <a 
                            href={edit.pageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                          >
                            View Page
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* EDIT TYPE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getEditTypeIcon(edit.type)}
                        <span className="text-sm capitalize text-gray-600">
                          {getEditTypeLabel(edit.type)}
                        </span>
                      </div>
                    </td>

                    {/* SECTION */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {edit.editDetails?.specificSection || (
                          edit.type === "media_edit" ? (
                            <span className="flex items-center gap-1">
                              <Image className="w-3 h-3" />
                              {edit.mediaDetails?.position || "General"}
                            </span>
                          ) : "General"
                        )}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(edit.status)}`}>
                        {edit.status}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {edit.createdAt
                        ? new Date(edit.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* PAYMENT */}
                    <td className="px-6 py-4">
                      {!edit.paid && (
                        <Link 
                          state={{
                            pageId: edit._id,
                            charge: edit.charge,
                            title: `${edit.pageName} - ${getEditTypeLabel(edit.type)}`,
                            paid: edit.paid,
                            type: "edit",
                          }}
                          to={"/dashboard/payment/submit"} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Pay (${edit.charge})
                        </Link> 
                      )}
                      {edit.paid && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white">
                          <CreditCard className="w-3.5 h-3.5" />
                          Paid (${edit.charge})
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/dashboard/my-edits/${edit._id}`)} 
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
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <FileEdit className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No edit requests found
                    <div className="mt-2">
                      <Link 
                        to="/dashboard/edit-page" 
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Create your first edit request →
                      </Link>
                    </div>
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

export default MyEdits;