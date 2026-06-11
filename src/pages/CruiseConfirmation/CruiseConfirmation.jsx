import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaDownload } from "react-icons/fa";

const CruiseConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    cruise,
    selectedCabin,
    departureDate,
    pricing,
    paymentMode = "cash",
    guestCount = 2,
    guests = [],
    selectedExcursionDetails = [],
    paymentSummary
  } = state;

  useEffect(() => {
    if (!cruise || !selectedCabin || !departureDate || !pricing || !paymentSummary) {
      navigate("/cruise-search", { replace: true });
    }
  }, [cruise, selectedCabin, departureDate, pricing, paymentSummary, navigate]);

  const bookingReference = useMemo(() => {
    return `PC-CRUISE-${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  if (!cruise || !selectedCabin || !departureDate || !pricing || !paymentSummary) {
    return null;
  }

  const formattedDate = new Date(departureDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-lg bg-green-600 px-6 py-5 text-white flex items-center gap-3">
          <FaCheckCircle className="text-2xl shrink-0" />
          <div>
            <h1 className="text-2xl font-bold">Cruise Booking Confirmed!</h1>
            <p className="text-green-50">Booking Reference: {bookingReference}</p>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900">Cruise</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Ship</p>
              <p className="font-semibold text-slate-900">{cruise.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cruise line</p>
              <p className="font-semibold text-slate-900">{cruise.cruiseLine}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">Route</p>
              <p className="font-semibold text-slate-900">{cruise.route}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Departure</p>
              <p className="font-semibold text-slate-900">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Departure port</p>
              <p className="font-semibold text-slate-900">{cruise.departurePort}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cabin type</p>
              <p className="font-semibold text-slate-900">{selectedCabin.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Duration</p>
              <p className="font-semibold text-slate-900">{cruise.duration} nights</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900">Guests</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guests.length > 0
              ? guests.map((guest, index) => (
                  <div key={`${guest.firstName}-${index}`} className="rounded-lg bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="text-sm text-slate-600">{guest.mealPreference} meal</p>
                  </div>
                ))
              : Array.from({ length: guestCount }).map((_, index) => (
                  <div key={index} className="rounded-lg bg-slate-50 p-4 font-semibold text-slate-900">
                    Guest {index + 1}
                  </div>
                ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>
          <div className="mt-4 rounded-lg bg-blue-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-800">{paymentMode}</p>
            <p className="mt-2 text-3xl font-bold text-blue-950">
              {paymentMode === "cash"
                ? `$${paymentSummary.cashGrandTotal.toLocaleString()}`
                : `${paymentSummary.pointsGrandTotal.toLocaleString()} Points`}
            </p>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900">Shore excursions booked</h2>
          {selectedExcursionDetails.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {selectedExcursionDetails.map((excursion) => (
                <li key={excursion.id} className="rounded-lg bg-slate-50 p-4 font-semibold text-slate-900">
                  {excursion.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-slate-600">No shore excursions added.</p>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:border-blue-300"
          >
            <FaDownload />
            Download Itinerary
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Search More Cruises
          </button>
        </div>
      </div>
    </div>
  );
};

export default CruiseConfirmation;
