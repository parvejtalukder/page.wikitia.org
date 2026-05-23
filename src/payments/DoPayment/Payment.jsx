// import React from 'react';

const Payment = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">

  <h1 className="text-2xl font-bold text-center">
    Choose a Payment Method
  </h1>

  {/* Wise */}
  <div className="border rounded-xl p-4 hover:shadow-md transition">
    <h2 className="font-semibold">1. Wise</h2>
    <p className="text-sm text-gray-600 mt-1">
      Pay directly via Wise account-to-account transfer
    </p>
    <a
      href="https://wise.com/pay/me/mdmehedihasanr9"
      target="_blank"
      className="text-blue-600 underline mt-2 inline-block"
    >
      Pay via Wise
    </a>
  </div>

  {/* Bank 1 */}
  <div className="border rounded-xl p-4">
    <h2 className="font-semibold">2. USA Bank Account (Option 1)</h2>
    <div className="text-sm text-gray-700 mt-2 space-y-1">
      <p>Account Type: Checking</p>
      <p>Routing (ACH/Wire): 026073150</p>
      <p>Account Number: 8311989759</p>
      <p>Bank: Community Federal Savings Bank</p>
      <p>SWIFT: CMFGUS33</p>
    </div>
  </div>

  {/* Bank 2 */}
  <div className="border rounded-xl p-4">
    <h2 className="font-semibold">3. USA Bank Account (Option 2)</h2>
    <div className="text-sm text-gray-700 mt-2 space-y-1">
      <p>Bank: First Century Bank</p>
      <p>Routing (ABA): 061120084</p>
      <p>Account Number: 4022190263135</p>
      <p>SWIFT: FCNSUS32</p>
    </div>
  </div>

  {/* Payoneer */}
  <div className="border rounded-xl p-4">
    <h2 className="font-semibold">4. Payoneer</h2>
    <p className="text-sm mt-2">
      Send payment to: <span className="font-medium">mhrifad01@gmail.com</span>
    </p>
  </div>

  {/* Binance */}
  <div className="border rounded-xl p-4">
    <h2 className="font-semibold">5. Binance</h2>
    <p className="text-sm mt-2">
      Payment ID: <span className="font-medium">505704514</span>
    </p>
  </div>

</div>
    );
};

export default Payment;