import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useState, useEffect } from "react";
import {
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
  Mail,
  User,
  Shield,
  UserX,
  Crown,
  Calendar,
  Loader2,
  Trash2,
  Eye
} from "lucide-react";
import Swal from "sweetalert2";
import { BiXCircle } from "react-icons/bi";

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const limit = 10;

  const axios = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Debounce search - only update searchTerm after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText !== searchTerm) {
        setSearchTerm(searchText);
        setPage(1); // Reset to first page when searching
        setIsSearching(false);
      }
    }, 500);

    setIsSearching(true);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  // Fetch all users with search
  const fetchUsers = async () => {
    if (!currentUser?.uid) throw new Error("No user logged in");
    const res = await axios.get(`/admin/all-users?page=${page}&limit=${limit}&search=${searchTerm}`);
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ["all-users", page, searchTerm],
    queryFn: fetchUsers,
    enabled: !!currentUser?.uid,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  const allUsers = data?.data || [];
  const pagination = data?.pagination;
  const stats = data?.stats || { total: 0, admins: 0, users: 0 };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Change user role
  const handleRoleChange = async (user, newRole) => {
    // Prevent self role change
    if (user.email === currentUser.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Action Not Allowed',
        text: 'You cannot change your own role!',
      });
      return;
    }

    const actionText = newRole === 'admin' ? 'make admin' : 'remove admin rights';
    
    const result = await Swal.fire({
      title: `Confirm Role Change`,
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to ${actionText} for <strong>${user.displayName || user.email}</strong>.</p>
          <p class="text-sm text-gray-600">Current role: <strong>${user.role}</strong></p>
          <p class="text-sm text-gray-600">New role: <strong>${newRole}</strong></p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newRole === 'admin' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${newRole === 'admin' ? 'make admin' : 'remove admin'}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/admin/users/${user._id}/role`, { role: newRole });
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Role Updated!',
            text: `${user.displayName || user.email} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}.`,
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["all-users"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to update user role',
        });
      }
    }
  };

  // Delete user
  const handleDeleteUser = async (user) => {
    // Prevent self deletion
    if (user.email === currentUser.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Action Not Allowed',
        text: 'You cannot delete your own account!',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete User?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to delete user <strong>${user.displayName || user.email}</strong>.</p>
          <p class="text-sm text-red-600">This action cannot be undone!</p>
          <p class="text-sm text-gray-600 mt-2">This will:</p>
          <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
            <li>Remove the user from the system</li>
            <li>Delete all user data</li>
            <li>Cannot be recovered</li>
          </ul>
        </div>
      `,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete user',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/admin/users/${user._id}`);
        
        if (response.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          queryClient.invalidateQueries({ queryKey: ["all-users"] });
          refetch();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete user',
        });
      }
    }
  };

  // View user details
  const viewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show loading only on initial load, not while searching
  if (isLoading && searchTerm === "" && !isSearching) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading users...</span>
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
          <p className="text-red-600">Failed to load users. Please try again.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all registered users</p>
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
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Regular Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.users}</p>
            </div>
            <User className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Search Bar with Typing Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {isSearching && searchText !== searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs text-gray-500">
            Showing results for: <span className="font-medium">"{searchTerm}"</span>
            <button
              onClick={() => {
                setSearchText("");
                setSearchTerm("");
                setPage(1);
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isFetching && !isSearching && (
          <div className="bg-indigo-50 p-2 text-center text-sm text-indigo-600 border-b border-indigo-100">
            <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
            Refreshing data...
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {(user.displayName || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.displayName || 'No Name'}
                          </p>
                          {user.uid && (
                            <p className="text-xs text-gray-400 font-mono">
                              ID: {user.uid.slice(0, 12)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(user.createdAt) || formatDate(user._id?.getTimestamp?.()) || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => viewDetails(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => handleRoleChange(user, 'user')}
                            disabled={user.email === currentUser.email}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Remove Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user, 'admin')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            Make Admin
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.email === currentUser.email}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
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

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <BiXCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {(selectedUser.displayName || selectedUser.email)[0].toUpperCase()}
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Display Name</label>
                  <p className="font-medium text-gray-900">{selectedUser.displayName || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">User ID (UID)</label>
                  <p className="font-mono text-sm text-gray-600 break-all">{selectedUser.uid}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      selectedUser.role === 'admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {selectedUser.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {selectedUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Account Created</label>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.createdAt) || formatDate(selectedUser._id?.getTimestamp?.()) || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
                {selectedUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleRoleChange(selectedUser, 'user');
                    }}
                    disabled={selectedUser.email === currentUser.email}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                    Remove Admin Rights
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleRoleChange(selectedUser, 'admin');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <Crown className="w-4 h-4" />
                    Make Administrator
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDeleteUser(selectedUser);
                  }}
                  disabled={selectedUser.email === currentUser.email}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;