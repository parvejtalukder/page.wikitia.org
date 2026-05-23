import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const MyPages = () => {

  const [page, setPage] = useState(1);
  const limit = 5;
  const axios = useAxiosSecure();  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fetchPages = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await axios.get(
      `http://localhost:3000/get_pages?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      return res.data;
    };

    const {
      data,
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["pages", user?.uid, page],
      queryFn: fetchPages,
      enabled: !!user?.uid,
      refetchOnWindowFocus: true,
    });

  const pages = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">
        Loading pages...
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load pages
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

      <table className="min-w-full divide-y divide-gray-200">

        {/* HEADER */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th> */}
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-gray-100">

          {pages.map((page) => (
            <tr key={page._id} className="hover:bg-gray-50 transition">

              {/* TITLE */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">

                  <img
                    src={page.identity?.logo || "/placeholder.png"}
                    alt={page.identity?.name}
                    className="w-10 h-10 rounded-lg border object-cover"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {page.identity?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {page.identity?.category}
                    </p>
                  </div>

                </div>
              </td>

              {/* TYPE */}
              <td className="px-6 py-4 text-sm capitalize">
                {page.type}
              </td>

              {/* STATUS */}
              <td className="px-6 py-4">
                <button
                  className={`px-3 btn py-1 rounded-full text-xs font-medium
                  ${
                    page.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : page.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {page.status}
                </button>
              </td>

              {/* CREATED */}
              <td className="px-6 py-4 text-sm text-gray-500">
                {page.createdAt
                  ? new Date(page.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>

              {/* PAYMENT */}
              <td className="px-6 py-4">
                {
                    !page.paid && <Link 
                    state={{
                          pageId: page._id,
                          charge: page?.charge || 59,
                          title: page.identity?.name || "Blank",
                          paid: page.paid,
                          type: "page",
                        }}
                    to={"/dashboard/payment/submit"} 
                  className={`px-3 py-2 btn rounded-full text-xs font-medium
                  ${
                    page.paid
                      ? "px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                      : "px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {page.paid ? "Paid" : "Pay"} (${page.charge})
                </Link> 
                }
                {
                    page.paid && <span 
                  className={`px-3 py-2 btn rounded-full text-xs font-medium
                  ${
                    page.paid
                      ? "px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                      : "px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {page.paid ? "Paid" : "Pay"} (${page.charge})
                </span>
                }
              </td>

              {/* AUTHOR
              <td className="px-6 py-4 text-sm text-gray-700">
                {page.user}
              </td> */}

              {/* ACTIONS */}
               <td className="px-6 py-4">
                <div className="flex gap-2 justify-center">

                  <button onClick={() => navigate(`/dashboard/my-pages/${page._id}`)} className="px-3 py-2 btn text-sm rounded-lg bg-green-600 text-white hover:bg-green-700">View
                  </button>

                  {/* <button className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">
                    Delete
                  </button> */}

                </div>
              </td> 

            </tr>
          ))}

        </tbody>
      </table>
      <div className="flex bg-blue-100 items-center justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-0.5 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <p className="text-sm text-gray-600">
            Page {page} of {pagination?.totalPages || 1}
          </p>
          
          <button
            disabled={page === pagination?.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-0.5 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default MyPages;