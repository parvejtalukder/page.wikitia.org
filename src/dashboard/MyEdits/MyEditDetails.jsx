import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  Globe, 
  Link2, 
  FileText,
  RefreshCw,
  AlertCircle,
  FileEdit,
  Image,
  ExternalLink,
  Send,
  MessageSquare,
  Hash,
  User,
  Clock
} from "lucide-react";

const MyEditDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosSecure();
  const { user } = useAuth();

  const fetchEdit = async () => {
    const res = await axios.get(`/get_edit/${id}`);
    return res.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["edit", id],
    queryFn: fetchEdit,
    enabled: !!id && !!user,
  });

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      pending: "bg-amber-50 text-amber-700",
      rejected: "bg-red-50 text-red-700",
      completed: "bg-blue-50 text-blue-700",
    };
    return styles[status] || "bg-gray-50 text-gray-700";
  };

  const getStatusText = (status) => {
    const texts = {
      approved: "Approved",
      pending: "Pending Review",
      rejected: "Rejected",
      completed: "Completed",
    };
    return texts[status] || status;
  };

  const getEditTypeIcon = (type) => {
    return type === "page_edit" ? (
      <FileEdit className="w-6 h-6 text-indigo-600" />
    ) : (
      <Image className="w-6 h-6 text-purple-600" />
    );
  };

  const getEditTypeLabel = (type) => {
    return type === "page_edit" ? "Page Edit Request" : "Media Edit Request";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <span className="text-gray-600">Loading edit details...</span>
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
          <p className="text-red-600">Failed to load edit details</p>
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

  const edit = data?.data;

  if (!edit) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-amber-600">Edit request not found</p>
          <button
            onClick={() => navigate("/dashboard/my-edits")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to My Edits
          </button>
        </div>
      </div>
    );
  }

  const isPageEdit = edit.type === "page_edit";
  const isMediaEdit = edit.type === "media_edit";

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
              Edit Details
            </h1>

            <Link
              to="/dashboard/my-edits"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edits
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                {getEditTypeIcon(edit.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getEditTypeLabel(edit.type)}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(edit.status)}`}>
                    {getStatusText(edit.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">Request ID:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{edit._id}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Page Information */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Page Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Page Name</p>
                <p className="font-medium text-gray-900">{edit.pageName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Page URL</p>
                <a 
                  href={edit.pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1 break-all"
                >
                  {edit.pageUrl}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Edit Details */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Edit Details
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                  <Link2 className="w-3 h-3" />
                  Google Doc Link
                </p>
                <a 
                  href={edit.editDetails?.googleDocLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm break-all flex items-center gap-1"
                >
                  {edit.editDetails?.googleDocLink}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>

              {isPageEdit && edit.editDetails?.specificSection && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Specific Section</p>
                  <p className="text-gray-800">{edit.editDetails.specificSection}</p>
                </div>
              )}

              {edit.editDetails?.comments && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Additional Comments
                  </p>
                  <p className="text-gray-800 whitespace-pre-wrap">{edit.editDetails.comments}</p>
                </div>
              )}
            </div>
          </div>

          {/* Media Details (for media_edit) */}
          {isMediaEdit && edit.mediaDetails && (
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                Media Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Action</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {edit.mediaDetails.action === "add" && "➕ Add New"}
                    {edit.mediaDetails.action === "replace" && "🔄 Replace"}
                    {edit.mediaDetails.action === "remove" && "❌ Remove"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Media Type</p>
                  <p className="font-medium text-gray-900 capitalize">{edit.mediaDetails.mediaType}</p>
                </div>
                {edit.mediaDetails.currentMediaUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Current Media URL</p>
                    <a 
                      href={edit.mediaDetails.currentMediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm break-all flex items-center gap-1"
                    >
                      {edit.mediaDetails.currentMediaUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {(edit.mediaDetails.action === "add" || edit.mediaDetails.action === "replace") && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">New Media URL</p>
                    <a 
                      href={edit.mediaDetails.newMediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm break-all flex items-center gap-1"
                    >
                      {edit.mediaDetails.newMediaUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {edit.mediaDetails.newMediaUrl && (
                      <div className="mt-2">
                        <img 
                          src={edit.mediaDetails.newMediaUrl} 
                          alt="Preview" 
                          className="max-w-full h-32 object-contain rounded-lg border border-gray-200"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                )}
                {edit.mediaDetails.caption && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Caption</p>
                    <p className="text-gray-800">{edit.mediaDetails.caption}</p>
                  </div>
                )}
                {edit.mediaDetails.position && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Position</p>
                    <p className="text-gray-800 capitalize">{edit.mediaDetails.position}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* References */}
          {edit.references && edit.references.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-indigo-600" />
                References
              </h2>
              <ul className="space-y-2">
                {edit.references.map((ref, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-600 text-sm mt-0.5">•</span>
                    <a 
                      href={ref} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 hover:text-indigo-700 underline text-sm break-all"
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
                  <p className="text-xs text-gray-500">Requested By</p>
                  <p className="text-sm text-gray-900">{edit.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm text-gray-900">
                    {new Date(edit.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {edit.completedAt && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Completed At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(edit.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes (if any) */}
          {edit.editorNotes && (
            <div className="p-6 bg-amber-50 border-t border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Editor Notes
              </h3>
              <p className="text-amber-700 text-sm">{edit.editorNotes}</p>
            </div>
          )}

          {/* Rejection Reason (if rejected) */}
          {edit.status === "rejected" && edit.rejectionReason && (
            <div className="p-6 bg-red-50 border-t border-red-100">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Rejection Reason
              </h3>
              <p className="text-red-700 text-sm">{edit.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEditDetails;