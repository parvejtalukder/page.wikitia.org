// import { useState } from "react";
import { useLocation } from "react-router";
import PaymentConfirmForm from "../../components/PaymentConfirmForm";
import CheckoutSummary from "../../components/CheckoutSummary";
import PaymentMethods from "../../components/PaymentMethods";
import { useState } from "react";

const Payment = () => {

  const [method] = useState("");
  const location = useLocation();
  // const navigateor

  const {
    pageId,
    charge,
    title,
    paid,
    type
  } = location.state || {};

  return (
    <div className="p-6 lg:p-10 min-h-screen">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8 text-center">

          <h2 className="text-3xl font-bold">
            Complete Your Payment
          </h2>

          <p className="text-base-content/60 mt-2">
            Select a payment method and confirm your payment.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* PAYMENT METHOD */}
            {
              // setMethod("bank1")
            }
            {/* FORM */}
            <PaymentMethods />
            <PaymentConfirmForm
              pageId={pageId}
              title={title}
              charge={charge}
              method={method}
              type={type}
            />
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex">
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