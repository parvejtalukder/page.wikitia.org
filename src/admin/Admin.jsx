import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit3,
  TrendingUp,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Shield,
  UserCheck,
  FileEdit,
  Activity,
  PieChart,
  BarChart3,
  PlusCircle,
  Settings
} from "lucide-react";
import { Link } from "react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";

const Admin = () => {
  const axios = useAxiosSecure();
  const { user } = useAuth();

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    const res = await axios.get("/admin/dashboard-stats");
    return res.data;
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboardStats,
    enabled: !!user?.uid,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  const stats = data?.stats || {
    totalUsers: 0,
    totalPages: 0,
    totalEdits: 0,
    totalPayments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    failedPayments: 0,
    paymentReviewEdits: 0,
    approvedEdits: 0,
    rejectedEdits: 0,
    paymentReviewPages: 0,
    approvedPages: 0,
    rejectedPages: 0,
    recentUsers: [],
    recentPayments: [],
    recentEdits: [],
    monthlyRevenue: [],
    editTypeDistribution: []
  };

  // Colors for charts
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  // Stats cards data
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/admin/all-users"
    },
    {
      title: "Page Requests",
      value: stats.totalPages,
      icon: <FileText className="w-6 h-6" />,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      link: "/admin/create-page-requests"
    },
    {
      title: "Edit Requests",
      value: stats.totalEdits,
      icon: <Edit3 className="w-6 h-6" />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/admin/edit-page-requests"
    },
    {
      title: "Total Payments",
      value: stats.totalPayments,
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      link: "/admin/all-payments"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      link: "/admin/all-payments"
    },
    {
      title: "Pending Review",
      value: stats.paymentReviewEdits + stats.paymentReviewPages,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      link: "/admin/edit-page-requests"
    }
  ];

  // Quick action buttons
  const quickActions = [
    {
      title: "Create Page Request",
      description: "Review new page creation requests",
      icon: <PlusCircle className="w-5 h-5" />,
      link: "/admin/create-page-requests",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Review Edits",
      description: "Check pending edit submissions",
      icon: <FileEdit className="w-5 h-5" />,
      link: "/admin/edit-page-requests",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "View Payments",
      description: "Monitor payment transactions",
      icon: <CreditCard className="w-5 h-5" />,
      link: "/admin/all-payments",
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "Manage Users",
      description: "Update user roles and permissions",
      icon: <Users className="w-5 h-5" />,
      link: "/admin/all-users",
      color: "bg-blue-50 text-blue-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading dashboard...</span>
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
          <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.displayName || 'Admin'}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all hover:border-gray-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-indigo-600 transition">
              <span>View details</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-500">Revenue trend over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Edit Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Type Distribution</h3>
              <p className="text-sm text-gray-500">Breakdown by edit type</p>
            </div>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={stats.editTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.editTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
              <p className="text-sm text-gray-500">Latest payment transactions</p>
            </div>
            <Link to="/admin/all-payments" className="text-sm text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentPayments.length > 0 ? (
              stats.recentPayments.slice(0, 5).map((payment, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.work?.title}</p>
                      <p className="text-sm text-gray-500">{payment.sender?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${payment.payment?.amount}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent payments
              </div>
            )}
          </div>
        </div>

        {/* Recent Edit Requests */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Edit Requests</h3>
              <p className="text-sm text-gray-500">Latest page edit submissions</p>
            </div>
            <Link to="/admin/edit-page-requests" className="text-sm text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentEdits.length > 0 ? (
              stats.recentEdits.slice(0, 5).map((edit, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{edit.pageName}</p>
                      <p className="text-sm text-gray-500">{edit.type} • {edit.user}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      edit.status === 'approved' ? 'bg-green-100 text-green-700' :
                      edit.status === 'payment review' ? 'bg-blue-100 text-blue-700' :
                      edit.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {edit.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent edit requests
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <p className="text-sm text-gray-500">Latest registered users</p>
            </div>
            <Link to="/admin/all-users" className="text-sm text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.slice(0, 5).map((user, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {(user.displayName || user.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.displayName || 'No Name'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No recent users
              </div>
            )}
          </div>
        </div>

        {/* Page Creation Requests Summary */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Page Requests Summary</h3>
              <p className="text-sm text-gray-500">Status breakdown</p>
            </div>
            <Link to="/admin/create-page-requests" className="text-sm text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-600">Payment Review</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.paymentReviewPages || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.approvedPages || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.rejectedPages || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <p className="text-sm text-gray-500">Platform health and metrics</p>
          </div>
          <Activity className="w-5 h-5 text-green-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">API Status</span>
            <span className="inline-flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Database</span>
            <span className="inline-flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;