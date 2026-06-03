import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useState } from "react";
import {
  CreditCard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Calendar,
  Search,
//   Filter,
  Clock,
  Eye,
  FileText,
  Building2,
  Mail,
  Trash2,
  Wallet,
  Receipt
} from "lucide-react";
import Swal from "sweetalert2";

const AllPayments = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const axios = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  // Fetch all payments
  const fetchPayments = async () => {
    if (!user?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/admin/all-payments?page=${page}&limit=${limit}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ["all-payments", page],
    queryFn: fetchPayments,
    enabled: !!user?.uid && !loading,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  const allPayments = data?.data || [];
  const pagination = data?.pagination;
  const stats = data?.stats || { total: 0, totalAmount: 0, approved: 0, pending: 0, failed: 0 };

  // Filter payments based on search and filters
  const getFilteredPayments = () => {
    let filtered = [...allPayments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.work?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payment?.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(payment => payment.work?.type === typeFilter);
    }

    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      "payment review": "bg-blue-50 text-blue-700 border-blue-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'payment review': return <CreditCard className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'bank1':
      case 'bank2':
        return <Building2 className="w-4 h-4" />;
      case 'payoneer':
        return <Wallet className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // View payment details
  const viewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Delete payment
  const handleDelete = async (payment) => {
    const result = await Swal.fire({
      title: 'Delete Payment Record?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to delete payment record for <strong>${payment.work?.title}</strong>.</p>
          <p class="text-sm text-red-600">This action cannot be undone!</p>
          <p class="text-sm text-gray-600 mt-2">This will:</p>
          <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
            <li>Remove the payment record from database</li>
            <li>Not affect the associated page/edit request status</li>
          </ul>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/admin/payments/${payment._id}`);
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Payment record has been deleted.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["all-payments"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete payment',
        });
      }
    }
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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">Failed to load payments. Please try again.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
            <p className="text-gray-500 mt-1">View and manage all payment transactions</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalAmount}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, email, transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="payment review">Payment Review</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="page">Page Creation</option>
            <option value="edit">Page Edit</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Work</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition">
                    {/* Payment Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          {getPaymentMethodIcon(payment.payment?.method)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">
                            {payment.payment?.method || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">
                            TXN: {payment.payment?.transaction_id?.slice(0, 12)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Payer */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{payment.sender?.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">{payment.sender?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Work */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{payment.work?.title}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 mt-1 capitalize">
                          {payment.work?.type === 'page' ? 'Page Creation' : 'Page Edit'}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">
                          {payment.payment?.amount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(payment.created_at)}
                        </span>
                      </div>
                    </td>

                    {/* Actions - Only View and Delete */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => viewDetails(payment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(payment)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No payments found
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

      {/* Payment Details Modal - View Only */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Work Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Work Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium">{selectedPayment.work?.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">{selectedPayment.work?.type === 'page' ? 'Page Creation' : 'Page Edit'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Reference ID</p>
                      <p className="font-mono text-sm break-all">{selectedPayment.work?.reference_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-2xl font-bold text-green-600">${selectedPayment.payment?.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Method</p>
                      <p className="font-medium capitalize">{selectedPayment.payment?.method}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm break-all">{selectedPayment.payment?.transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedPayment.status)}`}>
                        {getStatusIcon(selectedPayment.status)}
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sender Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sender Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedPayment.sender?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedPayment.sender?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Information / Notes */}
              {selectedPayment.meta?.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700">{selectedPayment.meta.notes}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="text-sm font-medium">{formatDate(selectedPayment.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Updated:</span>
                    <span className="text-sm font-medium">{formatDate(selectedPayment.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button in Modal */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDelete(selectedPayment);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPayments;