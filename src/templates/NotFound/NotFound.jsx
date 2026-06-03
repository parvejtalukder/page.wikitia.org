import { Link, useLocation } from "react-router";
import { Home, AlertCircle, ArrowLeft, Search, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold leading-none">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              4
            </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse delay-100">
              0
            </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse delay-200">
              4
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <FileQuestion className="w-40 h-40 text-gray-900" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <div className="bg-gray-100 rounded-lg p-3 inline-block">
            <code className="text-sm text-gray-600">
              {pathname}
            </code>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            You might have:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Typed the wrong URL into the address bar
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Followed an outdated or broken link
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Tried to access a page that has been moved or deleted
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Site
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Need help? Try these links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-700">
              Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/request-for-creation-of-a-wikitia-page" className="text-sm text-indigo-600 hover:text-indigo-700">
              Create Page
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-700">
              Login
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;