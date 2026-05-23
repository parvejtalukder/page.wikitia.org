import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";

const PageDetails = () => {
  const { id } = useParams();
  const axios = useAxiosSecure();
  const { user } = useAuth();

  const fetchPage = async () => {
    const res = await axios.get(`/get_page/${id}`);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["page", id],
    queryFn: fetchPage,
    enabled: !!id && !!user,
  });

  if (isLoading) {
    return <div className="p-6">Loading page...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load page</div>;
  }

  const page = data?.data;

  if (!page) {
    return <div className="p-6">Page not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow">
    <div className="w-full flex items-center justify-between px-4 py-3 mb-3 bg-transparent rounded-2xl border-t-3 border-t-green-500 shadow-sm">

      {/* LEFT - Back to Dashboard */}
      <Link
        to="/dashboard"
        className="px-4 py-2 text-sm lg:text-md bg-gray-200 text-gray-800 rounded-md font-medium transition hover:bg-gray-300"
      >Dashboard
      </Link>

      {/* CENTER (optional title) */}
      <h1 className="text-sm lg:text-md font-semibold text-gray-700">
        My Pages
      </h1>

      {/* RIGHT - My Pages */}
      <Link
        to="/dashboard/my-pages"
        className="px-4 py-2 text-sm lg:text-md bg-green-500 text-white rounded-md font-medium transition hover:bg-green-600 active:scale-[0.98]"
      >Back
      </Link>

    </div>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={page.identity?.logo}
          className="w-16 h-16 rounded-xl border"
          alt=""
        />

        <div>
          <h1 className="text-2xl font-bold">
            {page.identity?.name}
          </h1>
          <p className="text-gray-500">
            {page.identity?.category}
          </p>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><b>Type:</b> {page.type}</p>
        <p><b>Status:</b> {page.status}</p>
        <p><b>Payment:</b> {page.paid ? "Paid" : "Unpaid"}</p>
        <p><b>Charge:</b> ${page.charge}</p>
      </div>

      {/* BIOGRAPHY */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Biography</h2>
        <p className="text-gray-700">{page.biography}</p>
      </div>

      {/* WEBSITE */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Website</h2>
        <a
          href={page.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {page.website}
        </a>
      </div>

      {/* SOCIAL */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Social Links</h2>
        <ul className="text-sm space-y-1">
          {Object.entries(page.social || {}).map(([key, value]) =>
            value ? (
              <li key={key}>
                <b>{key}:</b>{" "}
                <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {value}
                </a>
              </li>
            ) : null
          )}
        </ul>
      </div>

      {/* REFERENCES */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">References</h2>
        <ul className="list-disc ml-5 text-sm">
          {page.references?.map((ref, i) => (
            <li key={i}>
              <a href={ref} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {ref}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* DYNAMIC FIELDS */}
      <div>
        <h2 className="font-semibold mb-2">Additional Info</h2>
        <div className="text-sm space-y-1">
          {page.dynamicFields &&
            Object.entries(page.dynamicFields).map(([key, value]) => (
              <p key={key}>
                <b>{key}:</b> {value}
              </p>
            ))}
        </div>
      </div>

    </div>
  );
};

export default PageDetails;