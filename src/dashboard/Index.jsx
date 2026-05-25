import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxios";
import { Users, FileText, CheckCircle, XCircle, FileEdit, Image, Clock } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();
  
  // Fetch Pages
  const fetchPages = async () => {
    const token = await user.getIdToken();
    const res = await axios.get("/get_pages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  };

  // Fetch Edit Requests
  const fetchEdits = async () => {
    const token = await user.getIdToken();
    const res = await axios.get("/get_edits", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  };

  const { data: pages = [] } = useQuery({
    queryKey: ["dashboard-pages"],
    queryFn: fetchPages,
    enabled: !!user,
  });

  const { data: edits = [] } = useQuery({
    queryKey: ["dashboard-edits"],
    queryFn: fetchEdits,
    enabled: !!user,
  });

  // Pages Statistics
  const totalPages = pages.length;
  const paidPages = pages.filter((p) => p.paid).length;
  const unpaidPages = totalPages - paidPages;

  // Edit Requests Statistics
  const totalEdits = edits.length;
  const paidEdits = edits.filter((e) => e.paid).length;
  const unpaidEdits = totalEdits - paidEdits;
  const pageEdits = edits.filter((e) => e.type === "page_edit").length;
  const mediaEdits = edits.filter((e) => e.type === "media_edit").length;
  const pendingEdits = edits.filter((e) => e.status === "pending" || e.status === "payment review").length;
  const approvedEdits = edits.filter((e) => e.status === "approved").length;

  // Combined Data for Charts
  const combinedBarData = [
    { name: "Pages", total: totalPages, paid: paidPages, unpaid: unpaidPages },
    { name: "Edits", total: totalEdits, paid: paidEdits, unpaid: unpaidEdits },
  ];

  const pagesPieData = [
    { name: "Paid Pages", value: paidPages },
    { name: "Unpaid Pages", value: unpaidPages },
  ];

  const editsPieData = [
    { name: "Paid Edits", value: paidEdits },
    { name: "Unpaid Edits", value: unpaidEdits },
  ];

  const editTypeData = [
    { name: "Page Edits", value: pageEdits },
    { name: "Media Edits", value: mediaEdits },
  ];

  const editStatusData = [
    { name: "Pending", value: pendingEdits },
    { name: "Approved", value: approvedEdits },
  ];

  const COLORS = {
    paid: "#10b981",
    unpaid: "#ef4444",
    pageEdit: "#4f46e5",
    mediaEdit: "#8b5cf6",
    pending: "#f59e0b",
    approved: "#10b981",
  };

  const statsCards = [
    { title: "Total Pages", value: totalPages, icon: FileText, color: "bg-indigo-500", bgLight: "bg-indigo-50" },
    { title: "Total Edit Requests", value: totalEdits, icon: FileEdit, color: "bg-purple-500", bgLight: "bg-purple-50" },
    { title: "Paid (Pages + Edits)", value: paidPages + paidEdits, icon: CheckCircle, color: "bg-emerald-500", bgLight: "bg-emerald-50" },
    { title: "Unpaid (Pages + Edits)", value: unpaidPages + unpaidEdits, icon: XCircle, color: "bg-red-500", bgLight: "bg-red-50" },
  ];

  const editStatsCards = [
    { title: "Page Edits", value: pageEdits, icon: FileEdit, color: "bg-indigo-500", bgLight: "bg-indigo-50" },
    { title: "Media Edits", value: mediaEdits, icon: Image, color: "bg-purple-500", bgLight: "bg-purple-50" },
    { title: "Pending Reviews", value: pendingEdits, icon: Clock, color: "bg-amber-500", bgLight: "bg-amber-50" },
    { title: "Approved", value: approvedEdits, icon: CheckCircle, color: "bg-emerald-500", bgLight: "bg-emerald-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.displayName}</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
          <Users className="w-4 h-4 text-indigo-600" />
          <span className="text-sm text-indigo-600">Total Items: {totalPages + totalEdits}</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Requests Specific Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-indigo-600" />
          Edit Requests Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editStatsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-2.5 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pages vs Edits Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedBarData}>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} name="Paid" />
              <Bar dataKey="unpaid" fill="#ef4444" radius={[4, 4, 0, 0]} name="Unpaid" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pages Payment Status Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pages Payment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pagesPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                <Cell fill={COLORS.paid} />
                <Cell fill={COLORS.unpaid} />
              </Pie>
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Edit Types Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Types Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={editTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                <Cell fill={COLORS.pageEdit} />
                <Cell fill={COLORS.mediaEdit} />
              </Pie>
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Edit Status Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Requests Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={editStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                <Cell fill={COLORS.pending} />
                <Cell fill={COLORS.approved} />
              </Pie>
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Edit Requests Payment Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Edit Requests Payment Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={editsPieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              <Cell fill={COLORS.paid} />
              <Cell fill={COLORS.unpaid} />
            </Pie>
            <Legend />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Index;