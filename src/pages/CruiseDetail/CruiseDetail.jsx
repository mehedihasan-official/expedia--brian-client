import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShip } from "react-icons/fa";

const imageFallback = "https://placehold.co/1200x520/e5e7eb/334155?text=Cruise+Image";

const CruiseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { cruise, selectedCabin, selectedCabinType = "inside", departureDate, pricing, paymentMode: initialPaymentMode = "cash" } = state;
  const [paymentMode, setPaymentMode] = useState(initialPaymentMode);
  const [guestCount, setGuestCount] = useState(2);

  useEffect(() => {
    if (!cruise || !selectedCabin || !departureDate || !pricing) {
      navigate("/cruise-search", { replace: true });
    }
  }, [cruise, selectedCabin, departureDate, pricing, navigate]);

  if (!cruise || !selectedCabin || !departureDate || !pricing) {
    return null;
  }

  const formattedDate = new Date(departureDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const cashSubtotal = pricing.discountedPrice * guestCount;
  const taxesEstimate = Math.round(cashSubtotal * 0.12);
  const cashTotal = cashSubtotal + taxesEstimate;
  // Points are derived directly from cashTotal so they always match.
  // $0.04 = 1 point, therefore points = cashTotal / 0.04.
  const totalPoints = Math.round(cashTotal / 0.04);
  const pointsPerPerson = Math.round(totalPoints / guestCount);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[360px] md:h-[460px] bg-slate-200">
        <img
          src={cruise.image}
          alt={cruise.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = imageFallback;
          }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-8">
          <div className="max-w-6xl mx-auto text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-100">{cruise.cruiseLine}</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-bold">{cruise.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-blue-50">
              <FaShip />
              {cruise.route}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm text-slate-500">Cabin type</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{selectedCabin.name}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm text-slate-500">Departure</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{formattedDate}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <p className="text-sm text-slate-500">Departure port</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{cruise.departurePort}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900">Itinerary</h2>
              <div className="mt-5 grid gap-4">
                {cruise.itinerary.map((port, index) => (
                  <div key={`${port}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      {index < cruise.itinerary.length - 1 && <span className="h-full min-h-8 w-px bg-blue-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-slate-900">{port}</p>
                      <p className="text-sm text-slate-600">Day {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900">Ship features</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cruise.shipFeatures.map((feature) => (
                  <div key={feature} className="rounded-lg bg-slate-50 px-4 py-3 font-medium text-slate-700">
                    {feature}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900">What's included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {cruise.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <FaCheckCircle className="text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="bg-white border border-slate-200 rounded-lg p-6 h-fit lg:sticky lg:top-6">
            <div className="inline-flex w-full rounded-full border border-slate-300 bg-slate-100 p-1">
              {["cash", "points"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                    paymentMode === mode ? "bg-blue-600 text-white" : "text-slate-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="guest-count">
              Persons
            </label>
            <select
              id="guest-count"
              value={guestCount}
              onChange={(event) => setGuestCount(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              {[1, 2, 3, 4].map((count) => (
                <option key={count} value={count}>
                  {count} guest{count > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <div className="mt-6 space-y-4">
              {paymentMode === "cash" ? (
                <>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Retail per person</span>
                    <span className="line-through">${pricing.retailPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Member price</span>
                    <span>${pricing.discountedPrice.toLocaleString()}/person</span>
                  </div>
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                    50% savings
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>For {guestCount} persons</span>
                    <span>${cashSubtotal.toLocaleString()} total</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Taxes & fees estimate</span>
                    <span>${taxesEstimate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
                    <span>Grand total</span>
                    <span>${cashTotal.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Retail per person</span>
                    <span className="line-through">
                      ${pricing.retailPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Points per person</span>
                    <span>{pointsPerPerson.toLocaleString()} pts</span>
                  </div>
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                    50% savings - $0.04 per point
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      For {guestCount} {guestCount === 1 ? "person" : "persons"} (subtotal)
                    </span>
                    <span>{Math.round(cashSubtotal / 0.04).toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Taxes & fees estimate</span>
                    <span>{Math.round(taxesEstimate / 0.04).toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
                    <span>Grand total</span>
                    <span>{totalPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
                    $0.04 per point - No exchange fee - No processing fee
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/cruise-guests", {
                  state: {
                    cruise,
                    selectedCabin,
                    selectedCabinType,
                    departureDate,
                    pricing,
                    paymentMode,
                    guestCount,
                    cashTotal,
                    totalPoints,
                    taxesEstimate
                  }
                })
              }
              className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Continue to Guest Details
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CruiseDetail;
