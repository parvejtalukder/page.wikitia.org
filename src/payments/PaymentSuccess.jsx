import { useLocation, useNavigate } from "react-router";
import { CheckCircle, CreditCard, Hash, FileText, DollarSign, Wallet, ArrowRight } from "lucide-react";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    paymentId,   
    pageId,
    title,
    charge,
    method,
    transactionId,
  } = location.state || {};

  useEffect(() => {
    if (!paymentId) {
      navigate("/payments");
    }
  }, [paymentId, navigate]);

  if (!paymentId) {
    return null;
  }

  const summaryItems = [
    { label: "Payment ID", value: paymentId, icon: Hash },
    { label: "Page ID", value: pageId, icon: FileText },
    { label: "Service", value: title, icon: CreditCard },
    { label: "Amount", value: `$${charge}`, icon: DollarSign, highlight: true },
    { label: "Method", value: method?.toUpperCase(), icon: Wallet },
    { label: "Transaction ID", value: transactionId, icon: Hash },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Success Header */}
            <div className="text-center p-8 border-b border-gray-100">
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-5">
                Payment Submitted Successfully!
              </h2>
              <p className="text-gray-500 mt-2">
                Your payment has been received and is now under review.
              </p>
            </div>

            {/* Payment Summary */}
            <div className="p-6 bg-gray-50 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Payment Summary
              </h3>
              
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                {summaryItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-50 rounded-lg">
                        <item.icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${item.highlight ? 'text-indigo-600 text-base font-bold' : 'text-gray-900'}`}>
                      {item.value || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate("/dashboard/my-pages")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                View My Pages
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-gray-400 mt-6">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;