import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const mockPointsBalance = 200000;

const CruisePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    cruise,
    selectedCabin,
    selectedCabinType,
    departureDate,
    pricing,
    paymentMode = "cash",
    guestCount = 2,
    selectedExcursionDetails = [],
    cashTotal = 0,
    totalPoints = 0,
    taxesEstimate = 0
  } = state;
  const [activeTab, setActiveTab] = useState(paymentMode);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
    billingZip: ""
  });

  useEffect(() => {
    if (!cruise || !selectedCabin || !departureDate || !pricing) {
      navigate("/cruise-search", { replace: true });
    }
  }, [cruise, selectedCabin, departureDate, pricing, navigate]);

  const paymentSummary = useMemo(() => {
    const baseCashSubtotal = pricing ? cashTotal : 0;
    const basePointsSubtotal = pricing ? totalPoints : 0;
    const excursionCashSubtotal = selectedExcursionDetails.reduce(
      (sum, excursion) => sum + excursion.cash * guestCount,
      0
    );
    const excursionPointsSubtotal = selectedExcursionDetails.reduce(
      (sum, excursion) => sum + excursion.points * guestCount,
      0
    );
    const taxesAndPortFees = pricing ? taxesEstimate : 0;
    const cashGrandTotal = baseCashSubtotal + excursionCashSubtotal;
    const pointsGrandTotal = basePointsSubtotal + excursionPointsSubtotal;

    return {
      baseCashSubtotal,
      basePointsSubtotal,
      excursionCashSubtotal,
      excursionPointsSubtotal,
      taxesAndPortFees,
      cashGrandTotal,
      pointsGrandTotal
    };
  }, [cashTotal, guestCount, pricing, selectedExcursionDetails, taxesEstimate, totalPoints]);

  if (!cruise || !selectedCabin || !departureDate || !pricing) {
    return null;
  }

  const pointsSufficient = paymentSummary.pointsGrandTotal <= mockPointsBalance;
  const formattedDate = new Date(departureDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const updatePaymentForm = (field, value) => {
    setPaymentForm((current) => ({ ...current, [field]: value }));
  };

  const completeBooking = () => {
    if (!acceptedTerms || (activeTab === "points" && !pointsSufficient)) return;

    navigate("/cruise-confirmation", {
      state: {
        ...state,
        selectedCabinType,
        paymentMode: activeTab,
        paymentSummary,
        paymentForm: activeTab === "cash" ? paymentForm : null
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1fr_380px]">
        <main className="bg-white border border-slate-200 rounded-lg p-6 h-fit">
          <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
          <div className="mt-5 inline-flex w-full rounded-full border border-slate-300 bg-slate-100 p-1 sm:w-auto">
            {["cash", "points"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold capitalize sm:flex-none ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "cash" ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Card Number
                <input
                  value={paymentForm.cardNumber}
                  onChange={(event) => updatePaymentForm("cardNumber", event.target.value)}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Cardholder Name
                <input
                  value={paymentForm.cardholderName}
                  onChange={(event) => updatePaymentForm("cardholderName", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Expiry MM/YY
                <input
                  value={paymentForm.expiry}
                  onChange={(event) => updatePaymentForm("expiry", event.target.value)}
                  placeholder="MM/YY"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                CVV
                <input
                  value={paymentForm.cvv}
                  onChange={(event) => updatePaymentForm("cvv", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Billing ZIP
                <input
                  value={paymentForm.billingZip}
                  onChange={(event) => updatePaymentForm("billingZip", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                />
              </label>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-blue-50 p-5">
                <p className="text-sm text-blue-800">Your Points Balance</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">{mockPointsBalance.toLocaleString()} Points</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Base redemption</span>
                  <span>{paymentSummary.basePointsSubtotal.toLocaleString()} Points</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Add-ons</span>
                  <span>{paymentSummary.excursionPointsSubtotal.toLocaleString()} Points</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900">
                  <span>Total points</span>
                  <span>{paymentSummary.pointsGrandTotal.toLocaleString()} Points</span>
                </div>
              </div>
              {pointsSufficient ? (
                <button type="button" className="w-full rounded-full bg-green-600 px-5 py-3 font-semibold text-white">
                  Confirm Points Redemption
                </button>
              ) : (
                <div className="rounded-lg bg-red-50 px-4 py-3 font-semibold text-red-700">Insufficient Points</div>
              )}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaLock className="text-green-600" />
              Secure Booking
            </div>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              I agree to the cruise fare rules, guest policies, and cancellation terms.
            </label>
            <button
              type="button"
              disabled={!acceptedTerms || (activeTab === "points" && !pointsSufficient)}
              onClick={completeBooking}
              className="w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Complete Booking
            </button>
          </div>
        </main>

        <aside className="bg-white border border-slate-200 rounded-lg p-6 h-fit lg:sticky lg:top-6">
          <h2 className="text-xl font-bold text-slate-900">Trip Summary</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">{cruise.name}</p>
              <p>{cruise.route}</p>
              <p>{formattedDate}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-slate-500">Cabin</p>
                <p className="font-semibold text-slate-900">{selectedCabin.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Guests</p>
                <p className="font-semibold text-slate-900">{guestCount}</p>
              </div>
            </div>
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span>Per person price x guests</span>
                <span>
                  {activeTab === "cash"
                    ? `$${paymentSummary.baseCashSubtotal.toLocaleString()}`
                    : `${paymentSummary.basePointsSubtotal.toLocaleString()} pts`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shore excursions subtotal</span>
                <span>
                  {activeTab === "cash"
                    ? `$${paymentSummary.excursionCashSubtotal.toLocaleString()}`
                    : `${paymentSummary.excursionPointsSubtotal.toLocaleString()} pts`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & port fees</span>
                <span>{activeTab === "cash" ? `$${paymentSummary.taxesAndPortFees.toLocaleString()}` : "Included"}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
                <span>Grand total</span>
                <span>
                  {activeTab === "cash"
                    ? `$${paymentSummary.cashGrandTotal.toLocaleString()}`
                    : `${paymentSummary.pointsGrandTotal.toLocaleString()} pts`}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CruisePayment;
