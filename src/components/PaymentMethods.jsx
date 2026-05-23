import { useState } from "react";

const PaymentMethods = ({method, setMethod}) => {
//   const [method, setMethod] = useState("bank1");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const paymentDetails = {
    wise: {
      title: "Wise Transfer",
      link: "https://wise.com/pay/me/mdmehedihasanr9",
    },

    bank1: {
      title: "USA Bank (Option 1)",
      account: "8311989759",
      routing: "026073150",
      bank: "Community Federal Savings Bank",
      swift: "CMFGUS33",
    },

    bank2: {
      title: "USA Bank (Option 2)",
      account: "4022190263135",
      routing: "061120084",
      bank: "First Century Bank",
      swift: "FCNSUS32",
    },

    payoneer: {
      title: "Payoneer",
      email: "mhrifad01@gmail.com",
    },

    binance: {
      title: "Binance",
      id: "505704514",
    },
  };

  const selected = paymentDetails[method] || {};

  return (
    <div className="bg-base-100 rounded-3xl border border-base-300 p-6 space-y-5">

      {/* TITLE */}
      <h3 className="text-xl font-semibold">
        Payment Method
      </h3>

      {/* SELECT */}
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="select select-bordered w-full"
      >
        <option value="bank1">USA Bank (Option 1)</option>
        <option value="bank2">USA Bank (Option 2)</option>
        <option value="wise">Wise</option>
        <option value="payoneer">Payoneer</option>
        <option value="binance">Binance</option>
      </select>

      {/* DETAILS */}
      <div className="border border-base-300 rounded-2xl p-5 space-y-4">

        <h4 className="font-bold">
          {selected.title}
        </h4>

        {/* BANK */}
        {method.startsWith("bank") && (
          <div className="space-y-3 text-sm">

            <div className="flex justify-between border p-2 rounded">
              <span>{selected.account}</span>

              <button
                onClick={() => copyToClipboard(selected.account)}
                className="btn btn-sm btn-outline"
                type="button"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <p>Routing: {selected.routing}</p>
            <p>Bank: {selected.bank}</p>
            <p>SWIFT: {selected.swift}</p>

          </div>
        )}

        {/* WISE */}
        {method === "wise" && (
          <a
            href={selected.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary w-full"
          >
            Pay with Wise
          </a>
        )}

        {/* PAYONEER */}
        {method === "payoneer" && (
          <div className="flex justify-between">
            <span>{selected.email}</span>

            <button
              onClick={() => copyToClipboard(selected.email)}
              className="btn btn-sm btn-outline"
              type="button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

        {/* BINANCE */}
        {method === "binance" && (
          <div className="flex justify-between">
            <span>{selected.id}</span>

            <button
              onClick={() => copyToClipboard(selected.id)}
              className="btn btn-sm btn-outline"
              type="button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentMethods;