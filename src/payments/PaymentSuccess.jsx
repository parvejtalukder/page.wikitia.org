import { useLocation, useNavigate } from "react-router";

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

  if (!paymentId) {
    navigate("/payments");
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">


      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-3xl overflow-hidden">

          {/* SUCCESS HEADER */}
          <div className="text-center p-10 border-b">

            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl text-green-600 animate-pulse">
              ✓
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Payment Submitted Successfully
            </h2>

            <p className="text-base-content/60 mt-2">
              Your payment is now under review.
            </p>

          </div>

          {/* SUMMARY */}
          <div className="p-8 bg-base-200 space-y-5">
            <h3 className="font-semibold text-lg">
              Payment Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/60">Payment ID</span>
                <span className="font-medium">
                  {paymentId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">Page ID</span>
                <span className="font-medium">
                  {pageId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">Service</span>
                <span className="font-medium">{title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">Amount</span>
                <span className="font-bold text-primary">${charge}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">Method</span>
                <span className="font-medium uppercase">{method}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-base-content/60">Transaction ID</span>
                <span className="font-medium">{transactionId}</span>
              </div>

            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-8 space-y-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary w-full rounded-xl"
            >
              Go to Dashboard
            </button>

          </div>

        </div>

      </main>

    </div>
  );
};

export default PaymentSuccess;