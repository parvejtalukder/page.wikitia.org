import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { FileText, Globe, Link2, Share2, User, Building2, Users, Globe2 } from "lucide-react";

const FORM_CONFIG = {
  person: {
    title: "Person Profile",
    icon: User,
    fields: [
      { name: "foundationYear", label: "Birth Date" },
      { name: "birthPlace", label: "Birth Place" },
      { name: "nationality", label: "Nationality" },
      { name: "occupation", label: "Occupation" },
      { name: "knownFor", label: "Known For" },
    ],
  },
  company: {
    title: "Company Profile",
    icon: Building2,
    fields: [
      { name: "foundationYear", label: "Foundation Year" },
      { name: "founder", label: "Founder" },
      { name: "headquarters", label: "Headquarters" },
      { name: "employees", label: "Employees" },
      { name: "areaServed", label: "Area Served" },
      { name: "products", label: "Products" },
      { name: "services", label: "Services" },
    ],
  },
  organization: {
    title: "Organization Profile",
    icon: Users,
    fields: [
      { name: "foundationYear", label: "Founded Year" },
      { name: "founder", label: "Founder(s)" },
      { name: "headquarters", label: "Headquarters" },
    ],
  },
  website: {
    title: "Website Profile",
    icon: Globe2,
    fields: [
      { name: "foundationYear", label: "Launch Year" },
      { name: "owner", label: "Owner" },
      { name: "platform", label: "Platform Type" },
    ],
  },
};

const CreateWikiPage = () => {
  const axios = useAxiosSecure();
  const [type, setType] = useState("person");
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { user } = useAuth();

  const onSubmit = async (data) => {
    const result = await Swal.fire({
      title: "Confirm Submission",
      text: "Charge is $59. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#4f46e5",
    });

    const token = await user.getIdToken();
    if (!result.isConfirmed) return;

    const payload = {
      type,
      name: user.displayName,
      user: user.email,
      identity: {
        name: data.name,
        logo: data.logo,
        category: data.category,
        country: data.country,
        location: data.location,
      },
      dynamicFields: {},
      biography: data.biography,
      website: data.website,
      social: {
        facebook: data.facebook,
        twitter: data.twitter,
        linkedin: data.linkedin,
        instagram: data.instagram,
        tiktok: data.tiktok,
      },
      references: (data.referenceUrls || "").split("\n").filter(Boolean),
      charge: 59,
      paid: false,
      createdAt: new Date().toISOString(),
    };

    FORM_CONFIG[type].fields.forEach((f) => {
      payload.dynamicFields[f.name] = data[f.name];
    });

    const res = await axios.post("/create-page", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if(res.data.success) {
      await Swal.fire("Success!", "Page submitted for review", "success");
      navigate("/dashboard/my-pages");
    }
  };

  const activeForm = FORM_CONFIG[type];
  const IconComponent = activeForm.icon;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Wiki Page</h1>
        <p className="text-gray-500 mt-1">Fill out the form below to create a new wiki page</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="person">Person</option>
            <option value="company">Company</option>
            <option value="organization">Organization</option>
            <option value="website">Website</option>
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("name")} placeholder="Name *" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("logo")} placeholder="Image URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("category")} placeholder="Category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("country")} placeholder="Country" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("location")} placeholder="Location" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          {/* Dynamic Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <IconComponent className="w-5 h-5 text-indigo-600" />
              {activeForm.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeForm.fields.map((field) => (
                <input
                  key={field.name}
                  {...register(field.name)}
                  placeholder={field.label}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              ))}
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Biography / Description</h3>
            <textarea
              {...register("biography")}
              placeholder="Detailed biography or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32 resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" />
              Social Media & Online Presence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("website")} placeholder="Website URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("facebook")} placeholder="Facebook URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("twitter")} placeholder="Twitter URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("linkedin")} placeholder="LinkedIn URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("instagram")} placeholder="Instagram URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              <input {...register("tiktok")} placeholder="TikTok URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          {/* References */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-600" />
              Reference URLs
            </h3>
            <textarea
              {...register("referenceUrls")}
              placeholder="Reference URLs (one per line)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-28 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Create Wiki Page ($59)"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWikiPage;