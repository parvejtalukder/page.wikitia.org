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
// import axios from "axios";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxios";
// import useAuth from "../../hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const axios = useAxiosSecure();
  const fetchPages = async () => {
    const token = await user.getIdToken();

    const res = await axios.get("/get_pages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

  const { data = [] } = useQuery({
    queryKey: ["dashboard-pages"],
    queryFn: fetchPages,
    enabled: !!user,
  });

  // 📊 Stats
  const totalPages = data.length;
  const paid = data.filter((p) => p.paid).length;
  const unpaid = totalPages - paid;

  const pieData = [
    { name: "Paid", value: paid },
    { name: "Unpaid", value: unpaid },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const barData = [
    { name: "Pages", total: totalPages },
    { name: "Paid", total: paid },
    { name: "Unpaid", total: unpaid },
  ];

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded-xl">
          Pages: {totalPages}
        </div>
        <div className="p-4 bg-green-100 text-green-700 shadow rounded-xl">
          Paid: {paid}
        </div>
        <div className="p-4 bg-red-100 text-red-700 shadow rounded-xl">
          Unpaid: {unpaid}
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Pages Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Payment Status</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Index;