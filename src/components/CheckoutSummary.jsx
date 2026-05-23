const CheckoutSummary = ({
  pageId,
  title,
  charge,
  paid,
}) => {
  return (
    <section className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden h-fit">

      <div className="bg-primary text-primary-content px-6 py-5">

        <h2 className="text-2xl font-bold">
          Checkout Details
        </h2>

        <p className="text-sm opacity-80 mt-1">
          Review your payment summary
        </p>

      </div>

      <div className="p-6 space-y-5">

        <div className="border-b border-base-300 pb-4">

          <div className="flex flex-col items-center mb-3">

            <span className="text-base-content/60">
              Payment For
            </span>

            <span className="font-medium">
              #{pageId}
            </span>

          </div>

          <h3 className="text-lg font-semibold">
            {title}
          </h3>

        </div>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Service Charge</span>

            <span>${charge}</span>
          </div>

          <div className="divider my-1"></div>

          <div className="flex justify-between text-lg font-bold">

            <span>Total</span>

            <span className="text-primary">
              ${charge}
            </span>

          </div>

        </div>

        <div className="bg-base-200 rounded-2xl p-4 flex justify-between items-center">

          <div>

            <p className="font-medium">
              Payment Status
            </p>

            <p className="text-sm text-base-content/60">
              Awaiting confirmation
            </p>

          </div>

          <span
            className={`badge badge-lg ${
              paid
                ? "badge-success"
                : "badge-error"
            }`}
          >
            {paid ? "Paid" : "Unpaid"}
          </span>

        </div>

      </div>
    </section>
  );
};

export default CheckoutSummary;