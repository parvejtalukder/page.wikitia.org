import { useLocation } from "react-router";
import PaymentConfirmForm from "../../components/PaymentConfirmForm";
import CheckoutSummary from "../../components/CheckoutSummary";
import PaymentMethods from "../../components/PaymentMethods";
import { useState } from "react";
import { CreditCard, Shield, AlertCircle } from "lucide-react";

const Payment = () => {
  
  const [method, setMethod] = useState("");
  const location = useLocation();

  if (!location.state) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">Invalid Session</h3>
            <p className="text-red-600">Invalid payment session. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const { pageId, charge, title, paid, type } = location.state;

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Complete Your Payment
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Select a payment method and confirm your payment to continue
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* LEFT COLUMN - Payment Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Notice */}
            {/* <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-900">Secure Payment</p>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div> */}

            {/* Payment Methods Component */}
            <PaymentMethods method={method} setMethod={setMethod} />
            
            {/* Payment Confirmation Form */}
            <PaymentConfirmForm
              pageId={pageId}
              title={title}
              charge={charge}
              method={method}
              type={type}
            />
          </div>

          {/* RIGHT COLUMN - Checkout Summary */}
          <div className="lg:block">
            <CheckoutSummary
              pageId={pageId}
              title={title}
              charge={charge}
              paid={paid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;