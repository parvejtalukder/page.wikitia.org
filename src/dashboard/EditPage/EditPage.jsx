import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { FileText, Link2, MessageSquare, Send, Image, Type, AlertCircle } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const EditPage = () => {
    const { user } = useAuth();
    const axios = useAxiosSecure();
    const navigate = useNavigate();
    const [editType, setEditType] = useState("page_edit");
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm();

    const onSubmit = async (data) => {
        const result = await Swal.fire({
            title: "Confirm Edit Request",
            text: editType === "page_edit" ? "Charge is $29. Continue?" : "Charge is $19. Continue?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#4f46e5",
        });

        if (!result.isConfirmed) return;

        const payload = {
            type: editType,
            user: user.email,
            pageUrl: data.pageUrl,
            pageName: data.pageName,
            editDetails: {
                googleDocLink: data.googleDocLink,
                specificSection: data.specificSection || "",
                comments: data.comments || "",
            },
            references: (data.references || "").split("\n").filter(Boolean),
            status: "pending",
            charge: editType === "page_edit" ? 29 : 19,
            paid: false,
            createdAt: new Date().toISOString(),
        };

        // Add media details if media edit
        if (editType === "media_edit") {
            payload.mediaDetails = {
                mediaType: data.mediaType,
                currentMediaUrl: data.currentMediaUrl || "",
                newMediaUrl: data.newMediaUrl,
                caption: data.caption || "",
                position: data.position || "",
                action: data.action,
            };
        }

        try {
            const res = await axios.post("/create-edit-request", payload);
            
            if (res.data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Edit Request Submitted',
                    text: 'Your edit request has been submitted for review.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate("/dashboard/my-edits");
                reset();
                setEditType("page_edit");
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.message || 'Something went wrong',
            });
        }
    };

    const watchAction = watch("action");
    const watchEditType = watch("editType");

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Wiki Page Request</h1>
                    <p className="text-gray-500 mt-1">Submit edit requests for existing Wikitia pages</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Logged in as</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Edit Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Edit Type *
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditType("page_edit")}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                        editType === "page_edit"
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    <Type className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-medium">Page Edit</div>
                                        <div className="text-xs">$29</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditType("media_edit")}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                        editType === "media_edit"
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    <Image className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-medium">Media Edit</div>
                                        <div className="text-xs">$19</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Page Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Name *
                                </label>
                                <input
                                    type="text"
                                    {...register("pageName", { required: "Page name is required" })}
                                    placeholder="e.g., VextraWeb"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                        errors.pageName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.pageName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.pageName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Page URL *
                                </label>
                                <input
                                    type="url"
                                    {...register("pageUrl", { 
                                        required: "Page URL is required",
                                        pattern: {
                                            value: /^https?:\/\/wikitia\.org\/wiki\/.+/,
                                            message: "Must be a valid Wikitia URL"
                                        }
                                    })}
                                    placeholder="https://wikitia.org/wiki/..."
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                        errors.pageUrl ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.pageUrl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.pageUrl.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Google Doc Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Doc Link *
                            </label>
                            <input
                                type="url"
                                {...register("googleDocLink", { 
                                    required: "Google Doc link is required",
                                    pattern: {
                                        value: /^https?:\/\/docs\.google\.com\/.+/,
                                        message: "Must be a valid Google Docs URL"
                                    }
                                })}
                                placeholder="https://docs.google.com/document/d/..."
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
                                    errors.googleDocLink ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.googleDocLink && (
                                <p className="text-red-500 text-sm mt-1">{errors.googleDocLink.message}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                                Make sure the doc has "Anyone with the link can view" permission
                            </p>
                        </div>

                        {/* Media Edit Specific Fields */}
                        {editType === "media_edit" && (
                            <div className="space-y-6 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Image className="w-5 h-5 text-indigo-600" />
                                    Media Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Action *
                                        </label>
                                        <select
                                            {...register("action", { required: "Action is required" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        >
                                            <option value="">Select action</option>
                                            <option value="add">➕ Add New Media</option>
                                            <option value="replace">🔄 Replace Existing Media</option>
                                            <option value="remove">❌ Remove Media</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Media Type *
                                        </label>
                                        <select
                                            {...register("mediaType", { required: "Media type is required" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        >
                                            <option value="image">🖼️ Image</option>
                                            <option value="video">🎥 Video</option>
                                            <option value="audio">🎵 Audio</option>
                                            <option value="document">📄 Document</option>
                                        </select>
                                    </div>
                                </div>

                                {watchAction === "replace" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Media URL
                                        </label>
                                        <input
                                            type="url"
                                            {...register("currentMediaUrl")}
                                            placeholder="https://example.com/current-image.jpg"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                )}

                                {(watchAction === "add" || watchAction === "replace") && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Media URL *
                                        </label>
                                        <input
                                            type="url"
                                            {...register("newMediaUrl", { 
                                                required: watchAction === "add" || watchAction === "replace" ? "New media URL is required" : false
                                            })}
                                            placeholder="https://example.com/new-image.jpg"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Caption/Description
                                    </label>
                                    <input
                                        type="text"
                                        {...register("caption")}
                                        placeholder="e.g., Company Logo, Team Photo, Screenshot"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Position on Page
                                    </label>
                                    <select
                                        {...register("position")}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    >
                                        <option value="">Select position</option>
                                        <option value="infobox">📦 Infobox</option>
                                        <option value="gallery">🖼️ Gallery</option>
                                        <option value="content">📝 Content Section</option>
                                        <option value="top">⬆️ Top of Page</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Specific Section (for Page Edit) */}
                        {editType === "page_edit" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specific Section (Optional)
                                </label>
                                <input
                                    type="text"
                                    {...register("specificSection")}
                                    placeholder="e.g., Biography, Career, Awards, Company History"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave empty if changes apply to multiple sections
                                </p>
                            </div>
                        )}

                        {/* References */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reference URLs (One per line)
                            </label>
                            <textarea
                                {...register("references")}
                                rows="3"
                                placeholder="https://example.com/source-1&#10;https://example.com/source-2&#10;https://example.com/source-3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Add supporting links for your edit request
                            </p>
                        </div>

                        {/* Additional Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Comments
                            </label>
                            <textarea
                                {...register("comments")}
                                rows="4"
                                placeholder="Describe what changes you want to make, why they're needed, or any other information for our editors..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                            />
                        </div>

                        {/* Pricing Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Total Charge:</span>
                            </div>
                            <span className="text-xl font-bold text-indigo-600">
                                ${editType === "page_edit" ? "29" : "19"}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? 'Submitting...' : `Submit ${editType === "page_edit" ? "Page Edit" : "Media Edit"} Request`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPage;