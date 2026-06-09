import { Link } from "react-router";

const RCWP = () => {
    return (
        <div className="max-w-6xl mx-auto py-7 flex flex-col gap-3">
            <div className="flex flex-col justify-start items-start text-gray-700 text-justify">
            <div tabindex="0" class="collapse rounded-2xl collapse-arrow bg-base-100 border-base-300 border">
                <div class="collapse-title font-semibold">Wikitia Page Creation Notice</div>
                <div class="collapse-content text-sm">
                  As only verified editors can create pages on Wikitia, we manage the entire submission process on your behalf. After your payment is successfully completed, you will be redirected to a secure information form where you can provide all the details required for your page creation request, including the subject's biography, achievements, media coverage, reference links, official website, and any supporting materials. Once you submit the form, our editorial team will carefully review the information, conduct additional research if necessary, and begin preparing your Wikitia page in accordance with Wikitia's editorial standards and notability guidelines.
                </div>
            </div> </div>
            <div className="w-full mx-auto">
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                <table className="table w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left text-gray-700 font-semibold">Service</th>
                      <th className="text-left text-gray-700 font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Wikitia Page Creation</td>
                      <td className="font-bold text-green-600">$59 USD</td>
                    </tr>
                    <tr>
                      <td>Multiple Media Upload </td>
                      <td className="text-gray-500">Included</td>
                    </tr>
                    <tr>
                      <td>Article Drafting & Formatting</td>
                      <td className="text-gray-500">Included</td>
                    </tr>
                    <tr>
                      <td>Submission by Verified Editors</td>
                      <td className="text-gray-500">Included</td>
                    </tr>
                    <tr>
                      <td>Post-Submission Support</td>
                      <td className="text-gray-500">Included</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td className="font-semibold text-gray-800">Total</td>
                      <td className="font-extrabold text-green-700 text-lg">$59 USD</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-6 text-center">
                <Link to={"/dashboard/create-page"} className="btn bg-green-600 hover:bg-green-700 text-white border-none px-8 rounded-full shadow-md">
                  Request to Create Page
                </Link>
              </div>
              <p className="text-sm text-gray-500 text-center mt-3">
                Secure payment. After successful payment, you will be redirected to the
                information form to provide details for your Wikitia page creation request.
              </p>
            </div>
        </div>
    );
};

export default RCWP;