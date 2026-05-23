import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

// 1. CONFIG DRIVEN STRUCTURE (IMPORTANT)
const FORM_CONFIG = {
  person: {
    title: "Person Profile",
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
    fields: [
      { name: "foundationYear", label: "Founded Year" },
      { name: "founder", label: "Founder(s)" },
      { name: "headquarters", label: "Headquarters" },
    ],
  },

  website: {
    title: "Website Profile",
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

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { user } = useAuth();

  const onSubmit = async (data) => {

    const result = await Swal.fire({
      title: "Confirm Submission",
      text: "Charge is $59. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

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

      references: (data.referenceUrls || "")
        .split("\n")
        .filter(Boolean),

    //   status: "pending",
      charge: 59,
      paid: false,
      createdAt: new Date().toISOString(),
    };

    FORM_CONFIG[type].fields.forEach((f) => {
      payload.dynamicFields[f.name] = data[f.name];
    });

    console.log(payload);
    // await axios.post("/create-page", payload);
    const res = await axios.post("/create-page", payload);
    if(res) await Swal.fire("Success", "Submitted for review", "success");
    // else await Swal.fire("Success", "Submitted for review", "warning");
  };

  const activeForm = FORM_CONFIG[type];

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Create Wiki Page</h1>
      </div>

      {/* TYPE SELECTOR */}
      <select
        className="select select-bordered w-full"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="person">Person</option>
        <option value="company">Company</option>
        <option value="organization">Organization</option>
        <option value="website">Website</option>
      </select>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* BASIC INFO */}
        <div className="bg-base-200 p-5 rounded-lg space-y-3">
          <input {...register("name")} placeholder="Name" className="input input-bordered w-full" />
          <input {...register("logo")} placeholder="Image URL" className="input input-bordered w-full" />
          <input {...register("category")} placeholder="Category" className="input input-bordered w-full" />
          <input {...register("country")} placeholder="Country" className="input input-bordered w-full" />
          <input {...register("location")} placeholder="Location" className="input input-bordered w-full" />
        </div>

        <div className="bg-base-200 p-5 rounded-lg space-y-3">
          <h2 className="font-semibold">{activeForm.title}</h2>

          {activeForm.fields.map((field) => (
            <input
              key={field.name}
              {...register(field.name)}
              placeholder={field.label}
              className="input input-bordered w-full"
            />
          ))}
        </div>

        <div className="bg-base-200 p-5 rounded-lg">
          <textarea
            {...register("biography")}
            placeholder="Biography/About/Full Desc"
            className="textarea textarea-bordered w-full h-32"
          />
        </div>

        {/* ONLINE */}
        <div className="bg-base-200 p-5 rounded-lg space-y-3">
          <input {...register("website")} placeholder="Website" className="input input-bordered w-full" />

          <input {...register("facebook")} placeholder="Facebook" className="input input-bordered w-full" />
          <input {...register("twitter")} placeholder="Twitter" className="input input-bordered w-full" />
          <input {...register("linkedin")} placeholder="LinkedIn" className="input input-bordered w-full" />
          <input {...register("instagram")} placeholder="Instagram" className="input input-bordered w-full" />
          <input {...register("tiktok")} placeholder="TikTok" className="input input-bordered w-full" />
        </div>

        {/* REFERENCES */}
        <textarea
          {...register("referenceUrls")}
          placeholder="Reference URLs (one per line)"
          className="textarea textarea-bordered w-full h-28"
        />

        {/* SUBMIT */}
        <button className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Wiki Page"}
        </button>

      </form>
    </div>
  );
};

export default CreateWikiPage;