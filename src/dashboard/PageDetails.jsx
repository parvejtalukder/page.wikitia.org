import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  Globe, 
  Link2, 
  Info, 
  BookOpen,
  Share2,
  FileText,
  RefreshCw,
  AlertCircle,
  User,
  Clock,
  Hash
} from "lucide-react";

const PageDetails = () => {
  const { id } = useParams();
  const axios = useAxiosSecure();
  const { user } = useAuth();

  const fetchPage = async () => {
    const res = await axios.get(`/get_page/${id}`);
    return res.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["page", id],
    queryFn: fetchPage,
    enabled: !!id && !!user,
  });

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      rejected: "bg-red-50 text-red-700",
      "payment review": "bg-blue-50 text-blue-700",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  const getStatusText = (status) => {
    const texts = {
      approved: "Approved",
      pending: "Pending Review",
      rejected: "Rejected",
      "payment review": "Payment Review",
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading page details...</span>
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
          <p className="text-red-600">Failed to load page details</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const page = data?.data;

  if (!page) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-amber-600">Page not found</p>
          <button
            onClick={() => window.location.href = "/dashboard/my-pages"}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to My Pages
          </button>
        </div>
      </div>
    );
  }

  const infoItems = [
    { label: "Type", value: page.type, icon: FileText },
    { label: "Status", value: getStatusText(page.status), icon: Calendar, badge: true },
    { label: "Payment", value: page.paid ? "Paid" : "Unpaid", icon: CreditCard },
    { label: "Charge", value: `$${page.charge}`, icon: CreditCard },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <h1 className="text-sm font-medium text-gray-500">
              Page Details
            </h1>

            <Link
              to="/dashboard/my-pages"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pages
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-5">
              <img
                src={page.identity?.logo || "/placeholder.png"}
                className="w-20 h-20 rounded-xl border border-gray-200 object-cover"
                alt={page.identity?.name}
                onError={(e) => e.target.src = "/placeholder.png"}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {page.identity?.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(page.status)}`}>
                    {getStatusText(page.status)}
                  </span>
                </div>
                <p className="text-gray-500">
                  {page.identity?.category}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Page ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{page._id}</code>
                </p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100 bg-gray-50">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <item.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  {item.badge ? (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusBadge(page.status)}`}>
                      {item.value}
                    </span>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Biography Section */}
          {page.biography && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Biography</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {page.biography}
              </p>
            </div>
          )}

          {/* Basic Information Section */}
          {(page.identity?.country || page.identity?.location) && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.identity?.country && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-gray-800">{page.identity.country}</p>
                  </div>
                )}
                {page.identity?.location && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-gray-800">{page.identity.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Website Section */}
          {page.website && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Website</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <a
                  href={page.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 underline break-all flex items-center gap-1"
                >
                  {page.website}
                </a>
              </div>
            </div>
          )}

          {/* Social Links Section */}
          {page.social && Object.values(page.social).some(v => v) && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(page.social || {}).map(([key, value]) =>
                  value ? (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 capitalize mb-1">{key}</p>
                      <a 
                        href={value} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-indigo-600 hover:text-indigo-700 underline text-sm break-all flex items-center gap-1"
                      >
                        {value}
                      </a>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Dynamic Fields Section */}
          {page.dynamicFields && Object.keys(page.dynamicFields).length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(page.dynamicFields).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References Section */}
          {page.references && page.references.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">References</h2>
              </div>
              <ul className="space-y-2">
                {page.references.map((ref, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg p-3">
                    <a 
                      href={ref} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-indigo-600 hover:text-indigo-700 underline text-sm break-all flex items-center gap-1"
                    >
                      {ref}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* Metadata */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm text-gray-900">{page.user || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm text-gray-900">
                    {page.createdAt ? new Date(page.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
              {page.updatedAt && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {new Date(page.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetails;