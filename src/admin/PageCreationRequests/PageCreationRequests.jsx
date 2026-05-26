import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  FileText, 
  Eye, 
  CreditCard, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";

const PageCreationRequests = () => {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const limit = 10;

  const axios = useAxiosSecure();  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const fetchRequests = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/admin/page-creation-requests?page=${page}&limit=${limit}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ["page-creation-requests", page],
    queryFn: fetchRequests,
    enabled: !!user?.uid && !loading,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  const requests = data?.data || [];
  const pagination = data?.pagination;

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      "payment review": "bg-amber-50 text-amber-700 border-amber-200",
      pending: "bg-blue-50 text-blue-700 border-blue-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      published: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'payment review': return <DollarSign className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'published': return <Globe className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleApprove = async (request) => {
    const result = await Swal.fire({
      title: 'Approve Page Creation?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to approve <strong>${request.identity?.name}</strong>.</p>
          <p class="text-sm text-gray-600">This will:</p>
          <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
            <li>Create the wiki page</li>
            <li>Mark payment as verified</li>
            <li>Notify the user</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const response = await axios.put(`/admin/page-creation-requests/${request._id}/approve`, {
          adminId: user.uid,
          adminEmail: user.email
        });
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'Page has been approved and will be published shortly.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["page-creation-requests"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to approve request',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (request) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Page Creation',
      html: `
        <div class="text-left">
          <p class="mb-3">You are about to reject <strong>${request.identity?.name}</strong>.</p>
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason for rejection:</label>
          <textarea id="rejection-reason" class="swal2-textarea" rows="3" placeholder="Please provide a reason..."></textarea>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const reason = document.getElementById('rejection-reason').value;
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason for rejection');
        }
        return reason;
      }
    });

    if (reason) {
      setActionLoading(true);
      try {
        const response = await axios.put(`/admin/page-creation-requests/${request._id}/reject`, {
          reason: reason,
          adminId: user.uid,
          adminEmail: user.email
        });
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'Request has been rejected.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["page-creation-requests"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to reject request',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleVerifyPayment = async (request) => {
    const result = await Swal.fire({
      title: 'Verify Payment',
      html: `
        <div class="text-left">
          <p>Verify payment for <strong>${request.identity?.name}</strong></p>
          <p class="text-sm text-gray-600 mt-2">Amount: $${request.charge}</p>
          <p class="text-sm text-gray-600">Status: ${request.paid ? 'Paid' : 'Not Paid'}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Verify Payment',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const response = await axios.put(`/admin/page-creation-requests/${request._id}/verify-payment`, {
          adminId: user.uid,
          adminEmail: user.email
        });
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Payment Verified!',
            text: 'Payment has been verified. You can now approve the page.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["page-creation-requests"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to verify payment',
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading page creation requests...</span>
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
          <p className="text-red-600">Failed to load requests. Please try again.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Page Creation Requests</h1>
            <p className="text-gray-500 mt-1">Review and manage wiki page creation requests</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payment Review</p>
              <p className="text-2xl font-bold text-amber-600">
                {requests.filter(r => r.status === 'payment review').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${requests.reduce((sum, r) => r.paid ? sum + (r.charge || 0) : sum, 0)}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isFetching && (
          <div className="bg-indigo-50 p-2 text-center text-sm text-indigo-600 border-b border-indigo-100">
            <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
            Refreshing data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Page Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 transition">
                    {/* PAGE INFO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {request.identity?.logo ? (
                          <img
                            src={request.identity.logo}
                            alt={request.identity.name}
                            className="w-10 h-10 rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {request.identity?.name || request.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.identity?.category || 'Company'}
                          </p>
                          {request.website && (
                            <a 
                              href={request.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* USER */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-800 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {request.user}
                        </p>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>

                    {/* PAYMENT */}
                    <td className="px-6 py-4">
                      <div>
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${request.paid ? 'text-green-600' : 'text-red-600'}`}>
                          <DollarSign className="w-3.5 h-3.5" />
                          ${request.charge || 59}
                        </span>
                        <p className={`text-xs ${request.paid ? 'text-green-500' : 'text-red-500'}`}>
                          {request.paid ? 'Paid' : 'Not Paid'}
                        </p>
                      </div>
                    </td>

                    {/* CREATED */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => viewDetails(request)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        
                        {request.status === 'payment review' && request.paid && (
                          <button 
                            onClick={() => handleVerifyPayment(request)}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Verify
                          </button>
                        )}
                        
                        {(request.status === 'pending' || (request.status === 'payment review' && request.paid)) && (
                          <>
                            <button 
                              onClick={() => handleApprove(request)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(request)}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No page creation requests found
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

      {/* Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Basic Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Page Name</p>
                    <p className="font-medium">{selectedRequest.identity?.name || selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p>{selectedRequest.identity?.category || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p>{selectedRequest.identity?.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{selectedRequest.identity?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Fields */}
              {selectedRequest.dynamicFields && Object.keys(selectedRequest.dynamicFields).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedRequest.dynamicFields).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="font-medium">{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Biography */}
              {selectedRequest.biography && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRequest.biography}</p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {selectedRequest.social && Object.values(selectedRequest.social).some(v => v) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Links</h3>
                  <div className="space-y-2">
                    {selectedRequest.social.facebook && (
                      <a href={selectedRequest.social.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Facebook
                      </a>
                    )}
                    {selectedRequest.social.linkedin && (
                      <a href={selectedRequest.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* References */}
              {selectedRequest.references && selectedRequest.references.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">References</h3>
                  <div className="space-y-1">
                    {selectedRequest.references.map((ref, idx) => (
                      <a key={idx} href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm block truncate">
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                {(selectedRequest.status === 'pending' || (selectedRequest.status === 'payment review' && selectedRequest.paid)) && (
                  <>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleApprove(selectedRequest);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleReject(selectedRequest);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay for Actions */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageCreationRequests;