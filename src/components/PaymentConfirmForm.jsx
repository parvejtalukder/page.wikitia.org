import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PaymentConfirmForm = ({
  pageId,
  title,
  charge,
  method,
  type
}) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const axios = useAxiosSecure();
  const navigator = useNavigate();

  const onSubmit = async (data) => {

    const paymentData = {
      work: {
        type: type, 
        reference_id: pageId,
        title: title,
      },

      payment: {
        amount: charge,
        method: method,
        transaction_id: data.transactionId,
      },

      sender: {
        name: data.senderName,
        email: data.senderEmail,
      },

      meta: {
        notes: data.notes,
      },
    };

    try {
        const token = await user.getIdToken();
        // const token = await user.getToken();
      const res = await axios.post("/payment-submit", paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Payment Submitted!",
        text: "Your payment is under review.",
        confirmButtonColor: "#16a34a",
      });

      if (res.data.insertedId) {
        navigator("/dashboard/payment/done", {
              state: {
                pageId,
                title,
                charge,
                method,
                paymentId: res.data.insertedId,
                transactionId: data.transactionId,
              },
            });
      }
    
      console.log("Success:", res.data);
      reset();
    
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#dc2626",
      });
    
      console.error(error.response?.data || error.message);
    }
    console.log(paymentData);
    reset();
  };

//   const { user } = useAuth();

  return (
    <div className="bg-base-100 rounded-3xl border border-base-300 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="border-b border-base-300 px-6 py-5">

        <h2 className="text-2xl font-bold">
          Payment Confirmation
        </h2>

        <p className="text-sm text-base-content/60 mt-1">
          Submit your payment information for verification
        </p>

      </div>

      {/* BODY */}
      <div className="p-6">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* SUMMARY */}
          <div className="bg-base-200 rounded-2xl p-4 space-y-3">

            <div className="flex justify-between">
              <span>Service</span>

              <span className="font-medium">
                {title}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Amount</span>

              <span className="font-bold text-primary">
                ${charge}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Method</span>

              <span className="uppercase font-medium">
                {method}
              </span>
            </div>

          </div>

          {/* TRANSACTION ID */}
          <div>

            <label className="label">
              <span className="label-text font-medium">
                Transaction ID
              </span>
            </label>

            <input
              type="text"
              placeholder="Enter transaction ID"
              className="input input-bordered w-full"
              {...register("transactionId", {
                required: "Transaction ID is required",
              })}
            />

            {errors.transactionId && (
              <p className="text-error text-sm mt-1">
                {errors.transactionId.message}
              </p>
            )}

          </div>

          {/* SENDER NAME */}
          <div>

            <label className="label">
              <span className="label-text font-medium">
                Sender Name
              </span>
            </label>

            <input
                  type="text"
                  disabled
                  defaultValue={user.displayName}
                  className="input input-bordered w-full"
                  {...register("senderName")}
                />

            {errors.senderName && (
              <p className="text-error text-sm mt-1">
                {errors.senderName.message}
              </p>
            )}

          </div>

          {/* EMAIL */}
          <div>

            <label className="label">
              <span className="label-text font-medium">
                Sender Email
              </span>
            </label>

                <input
                  type="email"
                  disabled
                  defaultValue={user.email}
                  className="input input-bordered w-full"
                  {...register("senderEmail")}
                />

            {errors.senderEmail && (
              <p className="text-error text-sm mt-1">
                {errors.senderEmail.message}
              </p>
            )}

          </div>

          {/* NOTES */}
          <div>

            <label className="label">
              <span className="label-text font-medium">
                Notes
              </span>
            </label>

            <textarea
              rows={4}
              placeholder="Additional notes..."
              className="textarea textarea-bordered w-full"
              {...register("notes")}
            ></textarea>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl"
          >
            Submit Payment
          </button>

        </form>

      </div>
    </div>
  );
};

export default PaymentConfirmForm;