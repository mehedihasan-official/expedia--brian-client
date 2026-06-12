import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateCarPricing } from "../../utils/carPricing";

const CarPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    car,
    searchData,
    paymentMode: initialPaymentMode = "cash",
    numberOfDays = 1,
    pricing = {},
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    driverInfo,
    addOns = {}
  } = state;

  const [paymentMode, setPaymentMode] = useState(initialPaymentMode);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!car || !searchData || !driverInfo) {
      navigate("/car-search", { replace: true });
    }
  }, [car, searchData, driverInfo, navigate]);

  if (!car || !searchData || !driverInfo) {
    return null;
  }

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const basePricing = useMemo(
    () => calculateCarPricing(car.retailPricePerDay, numberOfDays),
    [car.retailPricePerDay, numberOfDays]
  );

  const cashSubtotal = basePricing.discountedSubtotal;
  const cashTax = basePricing.cashTax;
  const cashTotal = useMemo(
    () => Math.round((cashSubtotal + cashTax + (addOns.cashAddOnAmount || 0)) * 100) / 100,
    [cashSubtotal, cashTax, addOns.cashAddOnAmount]
  );

  const pointsPerDay = basePricing.pointsPerDay;
  const pointsTotal = useMemo(
    () => basePricing.pointsTotal + (addOns.pointsAddOnAmount || 0),
    [basePricing.pointsTotal, addOns.pointsAddOnAmount]
  );
  const pointsBalance = 50000;

  const handleSubmit = () => {
    if (!termsAccepted) {
      alert("Please accept the terms to continue.");
      return;
    }

    if (paymentMode === "cash") {
      if (!cardNumber || !cardholderName || !expiryDate || !cvv || !billingZip) {
        alert("Please fill in all card details");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
    } else {
      if (pointsTotal > pointsBalance) {
        alert("Insufficient points balance to complete redemption.");
        return;
      }
    }

    navigate("/car-confirmation", {
      state: {
        car,
        searchData,
        paymentMode,
        numberOfDays,
        pricing,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime,
        driverInfo,
        addOns,
        cashTotal,
        pointsTotal
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid gap-8 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
                <p className="text-slate-600 mt-1">Choose cash or points to complete your booking.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                {car.type} · {car.brand}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 bg-slate-50 rounded-3xl p-3">
              {[
                { value: "cash", label: "Cash" },
                { value: "points", label: "Points" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMode(option.value)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${paymentMode === option.value ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="rounded-3xl bg-slate-100 p-5 border border-slate-200">
              <p className="text-sm text-slate-700">
                {paymentMode === "cash"
                  ? "✅ No exchange fee on car rentals"
                  : "✅ No exchange fee on point redemptions"}
              </p>
            </div>

            <div className="space-y-6">
              {paymentMode === "cash" ? (
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Card Number *</label>
                    <input
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Cardholder Name *</label>
                      <input
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="Jane Doe"
                        className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Expiry (MM/YY) *</label>
                      <input
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">CVV *</label>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        placeholder="123"
                        className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Billing ZIP *</label>
                      <input
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        placeholder="ZIP code"
                        className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-white border border-slate-200 p-6">
                  <p className="text-slate-700 font-medium">Your Points Balance: 50,000 Points</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Points required: {pointsTotal.toLocaleString()} Points</p>
                    <p className="font-semibold text-slate-900">{pointsTotal <= pointsBalance ? 'You have enough points to redeem.' : 'Insufficient points balance.'}</p>
                  </div>
                  {pointsTotal > pointsBalance && (
                    <p className="mt-3 text-sm text-red-600">Insufficient Points Balance</p>
                  )}
                </div>
              )}

              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-700">✅ No exchange fee on car rentals</p>
                <p className="text-sm text-slate-700">🔒 Secure Booking</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700">I agree to the terms and conditions.</span>
              </div>

              <button
                onClick={handleSubmit}
                className={`w-full rounded-3xl py-4 text-white font-semibold transition ${paymentMode === 'cash' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                Complete Booking
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-8 space-y-5">
            <div className="rounded-3xl bg-white shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Car</span>
                  <span>{car.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brand</span>
                  <span>{car.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup</span>
                  <span>{pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dropoff</span>
                  <span>{dropoffLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dates</span>
                  <span>{new Date(pickupDate).toLocaleDateString()} - {new Date(dropoffDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days</span>
                  <span>{numberOfDays}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add-ons</h3>
              <div className="space-y-3 text-sm text-slate-600">
                {addOns.gps && <div className="flex justify-between"><span>GPS Navigation</span><span>${8 * numberOfDays}</span></div>}
                {addOns.childSeat && <div className="flex justify-between"><span>Child Seat</span><span>${10 * numberOfDays}</span></div>}
                {addOns.insurance && <div className="flex justify-between"><span>Full Insurance Coverage</span><span>${15 * numberOfDays}</span></div>}
                {!addOns.gps && !addOns.childSeat && !addOns.insurance && <p>No add-ons selected.</p>}
              </div>
            </div>

            <div className="rounded-3xl bg-white shadow-md p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{paymentMode === 'cash' ? 'Cash Total' : 'Points Total'}</h3>
              {paymentMode === 'cash' ? (
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Per day (retail)</span>
                    <span className="line-through text-slate-400">${car.retailPricePerDay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per day (member, {basePricing.savingsPercent}% off)</span>
                    <span className="font-semibold text-blue-600">${basePricing.discountedPricePerDay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>You save</span>
                    <span>${basePricing.savingsAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between"><span>Days</span><span>{numberOfDays}</span></div>
                  <div className="flex justify-between"><span>Subtotal</span><span>${cashSubtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Taxes (12%)</span><span>${cashTax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>${cashTotal.toFixed(2)}</span></div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between"><span>Points/day</span><span>{pointsPerDay.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Days</span><span>{numberOfDays}</span></div>
                  <div className="flex justify-between"><span>Total points</span><span>{pointsTotal.toLocaleString()}</span></div>
                  <div className="text-green-600">No exchange fee</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPayment;
