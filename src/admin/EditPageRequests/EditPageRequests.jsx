import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useState } from "react";
import { 
  FileText, 
  Eye, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Image as ImageIcon,
  Link2,
  Calendar,
  User,
  FileEdit,
  Globe,
  CreditCard,
//   File,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import Swal from "sweetalert2";
import { FiEdit3 } from "react-icons/fi";

const EditPageRequests = () => {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("payment review");
  const limit = 10;

  const axios = useAxiosSecure();  
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  
  // Transform function for both media_edit and page_edit
  const transformRequest = (request) => {
    if (request.identity) return request;
    
    // Common fields
    const transformed = {
      ...request,
      identity: {
        name: request.pageName || 'Unknown Page',
        logo: null,
        category: request.type === 'media_edit' ? 'Media Edit' : 'Page Edit',
        country: 'N/A',
        location: 'N/A'
      },
      website: null,
      biography: '',
      dynamicFields: {},
      social: {},
      references: request.references || []
    };
    
    // Handle media_edit type
    if (request.type === 'media_edit') {
      transformed.identity.logo = request.mediaDetails?.newMediaUrl || request.editDetails?.comments || null;
      transformed.website = request.editDetails?.googleDocLink || null;
      transformed.biography = request.editDetails?.comments || '';
      transformed.dynamicFields = {
        'Edit Type': 'Media Edit',
        'Media Type': request.mediaDetails?.mediaType || 'N/A',
        'Action': request.mediaDetails?.action || 'N/A',
        'Position': request.mediaDetails?.position || 'N/A',
        'Current Media URL': request.mediaDetails?.currentMediaUrl || 'None',
        'New Media URL': request.mediaDetails?.newMediaUrl || 'N/A',
        'Caption': request.mediaDetails?.caption || 'None'
      };
    }
    
    // Handle page_edit type
    else if (request.type === 'page_edit') {
      transformed.identity.category = 'Page Edit';
      transformed.website = request.pageUrl || null;
      transformed.biography = request.editDetails?.comments || '';
      transformed.dynamicFields = {
        'Edit Type': 'Page Edit',
        'Google Doc Link': request.editDetails?.googleDocLink || 'N/A',
        'Specific Section': request.editDetails?.specificSection || 'Entire Page',
        'Comments': request.editDetails?.comments || 'None'
      };
    }
    
    return transformed;
  };
  
  // Fetch edit requests
  const fetchEditRequests = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/admin/edit-requests?page=${page}&limit=${limit}`);
    
    if (res.data && res.data.data) {
      res.data.data = res.data.data.map(transformRequest);
    }
    
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ["edit-requests", page],
    queryFn: fetchEditRequests,
    enabled: !!user?.uid && !loading,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  const allRequests = data?.data || [];
  const pagination = data?.pagination;
  const stats = data?.stats || { total: 0, paymentReview: 0, approved: 0, rejected: 0, revenue: 0 };

  // Filter requests based on active tab
  const getFilteredRequests = () => {
    switch(activeTab) {
      case "approved":
        return allRequests.filter(r => r.status === "approved");
      case "payment review":
        return allRequests.filter(r => r.status === "payment review");
      case "pending":
        return allRequests.filter(r => r.status === "pending");
      case "rejected":
        return allRequests.filter(r => r.status === "rejected");
      default:
        return allRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  // Status badge styles
  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      "payment review": "bg-amber-50 text-amber-700 border-amber-200",
      pending: "bg-blue-50 text-blue-700 border-blue-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'payment review': return <DollarSign className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Get edit type icon and label
  const getEditTypeInfo = (type) => {
    switch(type) {
      case 'media_edit': 
        return { icon: <ImageIcon className="w-4 h-4" />, label: 'Media Edit', color: 'text-purple-600' };
      case 'page_edit': 
        return { icon: <FileEdit className="w-4 h-4" />, label: 'Page Edit', color: 'text-blue-600' };
      case 'content_edit': 
        return { icon: <BookOpen className="w-4 h-4" />, label: 'Content Edit', color: 'text-green-600' };
      default: 
        return { icon: <FiEdit3 className="w-4 h-4" />, label: 'Edit', color: 'text-gray-600' };
    }
  };

  // Get edit summary text
  const getEditSummary = (request) => {
    if (request.type === 'media_edit') {
      const action = request.mediaDetails?.action || 'update';
      const mediaType = request.mediaDetails?.mediaType || 'media';
      const position = request.mediaDetails?.position || '';
      return `${action} ${mediaType}${position ? ` to ${position}` : ''}`;
    } else if (request.type === 'page_edit') {
      const section = request.editDetails?.specificSection;
      return section ? `Edit "${section}" section` : 'Edit page content';
    }
    return 'Edit request';
  };

  // Handle approve
  const handleApprove = async (request) => {
    const isMediaEdit = request.type === 'media_edit';
    const actionText = isMediaEdit ? 'media' : 'content';
    
    const result = await Swal.fire({
      title: 'Approve Edit Request?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to approve edit request for <strong>${request.pageName}</strong>.</p>
          <p class="text-sm text-gray-600">This will:</p>
          <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
            <li>Apply the ${actionText} changes to the wiki page</li>
            ${!request.paid ? '<li>Process the payment</li>' : '<li>Mark payment as verified</li>'}
            <li>Notify the user that their edit is approved</li>
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
        const response = await axios.put(`/admin/edit-requests/${request._id}/approve`);
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'Edit request has been approved and changes will be applied.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["edit-requests"] });
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

  // Handle reject
  const handleReject = async (request) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Edit Request",
      text: `You are about to reject the edit request for ${request.pageName}`,
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Please provide a reason why this edit is being rejected...",
      inputAttributes: {
        "aria-label": "Reason for rejection"
      },
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please provide a reason for rejection";
        }
      }
    });

    if (reason) {
      setActionLoading(true);
      try {
        const response = await axios.put(`/admin/edit-requests/${request._id}/reject`, {
          reason: reason,
          adminId: user.uid,
          adminEmail: user.email
        });
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'Edit request has been rejected.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["edit-requests"] });
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

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: "payment review", label: "Payment Review", icon: DollarSign, color: "amber", count: stats.paymentReview || 0 },
    // { id: "pending", label: "Pending", icon: Clock, color: "blue", count: stats.pending || 0 },
    { id: "approved", label: "Approved", icon: CheckCircle, color: "emerald", count: stats.approved || 0 },
    { id: "rejected", label: "Rejected", icon: XCircle, color: "red", count: stats.rejected || 0 }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Page Edit Requests</h1>
            <p className="text-gray-500 mt-1">Review and manage wiki page edit submissions</p>
          </div>
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payment Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.paymentReview || 0}</p>
            </div>
            <CreditCard className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        {/* <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div> */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.approved || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        {/* <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.revenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colorClasses = {
              amber: isActive ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700",
              blue: isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700",
              emerald: isActive ? "border-emerald-500 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700",
              red: isActive ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
                  ${colorClasses[tab.color]}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full
                    ${isActive ? `bg-${tab.color}-100 text-${tab.color}-700` : 'bg-gray-100 text-gray-600'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Page & Edit Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Edit Summary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const editType = getEditTypeInfo(request.type);
                  const editSummary = getEditSummary(request);
                  const showActions = (activeTab === "payment review" || activeTab === "pending") && request.paid !== false;
                  
                  return (
                    <tr key={request._id} className="hover:bg-gray-50 transition">
                      {/* Page & Edit Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {request.type === 'media_edit' && request.mediaDetails?.newMediaUrl ? (
                            <img
                              src={request.mediaDetails.newMediaUrl}
                              alt={request.pageName}
                              className="w-10 h-10 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              {editType.icon}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{request.pageName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs flex items-center gap-1 ${editType.color}`}>
                                {editType.icon}
                                {editType.label}
                              </span>
                              {request.pageUrl && (
                                <a 
                                  href={request.pageUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{request.user}</span>
                        </div>
                      </td>

                      {/* Edit Summary */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate">{editSummary}</p>
                          {request.references && request.references.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Link2 className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{request.references.length} reference(s)</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${request.paid ? 'text-green-600' : 'text-red-600'}`}>
                            <DollarSign className="w-3.5 h-3.5" />
                            ${request.charge}
                          </span>
                          <p className={`text-xs ${request.paid ? 'text-green-500' : 'text-red-500'}`}>
                            {request.paid ? 'Paid' : 'Not Paid'}
                          </p>
                        </div>
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {request.createdAt
                              ? new Date(request.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => viewDetails(request)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>
                          
                          {showActions && (
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No {activeTab} edit requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getEditTypeInfo(selectedRequest.type).icon}
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedRequest.type === 'media_edit' ? 'Media Edit Request' : 'Page Edit Request'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Page Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Page Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Page Name</p>
                    <p className="font-medium">{selectedRequest.pageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Page URL</p>
                    <a href={selectedRequest.pageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                      {selectedRequest.pageUrl}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Edit Type</p>
                    <div className="flex items-center gap-2">
                      {getEditTypeInfo(selectedRequest.type).icon}
                      <span>{getEditTypeInfo(selectedRequest.type).label}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted By</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedRequest.user}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Details - Conditional based on type */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiEdit3 className="w-5 h-5" />
                  Edit Details
                </h3>
                
                {/* Media Edit Details */}
                {selectedRequest.type === 'media_edit' && selectedRequest.mediaDetails && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Media Type</p>
                        <p className="font-medium capitalize">{selectedRequest.mediaDetails.mediaType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Action</p>
                        <p className="font-medium capitalize">{selectedRequest.mediaDetails.action}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-medium capitalize">{selectedRequest.mediaDetails.position}</p>
                      </div>
                    </div>
                    
                    {selectedRequest.mediaDetails.currentMediaUrl && (
                      <div>
                        <p className="text-sm text-gray-500">Current Media URL</p>
                        <a href={selectedRequest.mediaDetails.currentMediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                          {selectedRequest.mediaDetails.currentMediaUrl}
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">New Media URL</p>
                      <a href={selectedRequest.mediaDetails.newMediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                        {selectedRequest.mediaDetails.newMediaUrl}
                      </a>
                      {selectedRequest.mediaDetails.newMediaUrl && (
                        <div className="mt-3">
                          <img 
                            src={selectedRequest.mediaDetails.newMediaUrl} 
                            alt="Preview" 
                            className="max-w-full h-auto max-h-96 rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent && !parent.querySelector('.error-message')) {
                                const errorMsg = document.createElement('p');
                                errorMsg.className = 'text-red-500 text-sm mt-2 error-message';
                                errorMsg.textContent = 'Failed to load image';
                                parent.appendChild(errorMsg);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {selectedRequest.mediaDetails.caption && (
                      <div>
                        <p className="text-sm text-gray-500">Caption</p>
                        <p className="text-gray-700">{selectedRequest.mediaDetails.caption}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Page Edit Details */}
                {selectedRequest.type === 'page_edit' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Google Doc Link</p>
                      <a href={selectedRequest.editDetails?.googleDocLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {selectedRequest.editDetails?.googleDocLink || 'N/A'}
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Specific Section</p>
                      <p className="font-medium">
                        {selectedRequest.editDetails?.specificSection || 'Entire Page'}
                      </p>
                    </div>
                    
                    {selectedRequest.editDetails?.comments && (
                      <div>
                        <p className="text-sm text-gray-500">Comments/Notes</p>
                        <div className="bg-gray-50 p-3 rounded-lg mt-1">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.editDetails.comments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* References */}
              {selectedRequest.references && selectedRequest.references.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    References ({selectedRequest.references.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedRequest.references.map((ref, idx) => (
                      <a key={idx} href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm block truncate">
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Charge Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${selectedRequest.charge}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedRequest.paid 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedRequest.paid ? '✓ Paid' : 'Payment Required'}
                    </div>
                  </div>
                  {!selectedRequest.paid && (
                    <div className="flex items-center gap-2 mt-3 text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-xs">Payment not yet processed. User needs to complete payment.</p>
                    </div>
                  )}
                  {selectedRequest.status === "approved" && (
                    <p className="text-xs text-green-600 mt-2">✓ Payment verified - edit approved</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(activeTab === "payment review" || activeTab === "pending") && selectedRequest.paid !== false && (
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleApprove(selectedRequest);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Approve Edit
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleReject(selectedRequest);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Reject Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPageRequests;