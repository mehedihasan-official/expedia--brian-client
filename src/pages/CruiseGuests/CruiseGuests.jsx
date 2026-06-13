import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const excursions = [
  { id: "cityTour", name: "City Tour", cash: 89, points: 2225 },
  { id: "snorkeling", name: "Snorkeling Trip", cash: 65, points: 1625 },
  { id: "privateBeach", name: "Private Beach", cash: 120, points: 3000 }
];

const createGuest = () => ({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  passportNumber: "",
  nationality: "",
  mealPreference: "Standard"
});

const CruiseGuests = () => {
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
    cashTotal = 0,
    totalPoints = 0
  } = state;
  const [guests, setGuests] = useState(() => Array.from({ length: guestCount }, createGuest));
  const [selectedExcursions, setSelectedExcursions] = useState([]);
  const [specialRequests, setSpecialRequests] = useState({
    accessibilityNeeds: false,
    celebration: false,
    celebrationMessage: ""
  });

  useEffect(() => {
    if (!cruise || !selectedCabin || !departureDate || !pricing) {
      navigate("/cruise-search", { replace: true });
    }
  }, [cruise, selectedCabin, departureDate, pricing, navigate]);

  const totals = useMemo(() => {
    const addOnCash = excursions
      .filter((excursion) => selectedExcursions.includes(excursion.id))
      .reduce((sum, excursion) => sum + excursion.cash * guestCount, 0);
    const addOnPoints = excursions
      .filter((excursion) => selectedExcursions.includes(excursion.id))
      .reduce((sum, excursion) => sum + excursion.points * guestCount, 0);

    return {
      cash: pricing ? cashTotal + addOnCash : 0,
      points: pricing ? totalPoints + addOnPoints : 0,
      addOnCash,
      addOnPoints
    };
  }, [cashTotal, guestCount, pricing, selectedExcursions, totalPoints]);

  if (!cruise || !selectedCabin || !departureDate || !pricing) {
    return null;
  }

  const updateGuest = (index, field, value) => {
    setGuests((currentGuests) =>
      currentGuests.map((guest, guestIndex) => (guestIndex === index ? { ...guest, [field]: value } : guest))
    );
  };

  const toggleExcursion = (id) => {
    setSelectedExcursions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const canContinue = guests.every((guest) => guest.firstName && guest.lastName && guest.dateOfBirth);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Guest Details</h1>
            <p className="mt-2 text-slate-600">
              {cruise.name} - {selectedCabin.name} - {guestCount} guest{guestCount > 1 ? "s" : ""}
            </p>
          </div>

          {guests.map((guest, index) => (
            <section key={index} className="bg-white border border-slate-200 rounded-lg p-5">
              <h2 className="text-xl font-bold text-slate-900">Guest {index + 1}</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                  <input
                    value={guest.firstName}
                    onChange={(event) => updateGuest(index, "firstName", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                  <input
                    value={guest.lastName}
                    onChange={(event) => updateGuest(index, "lastName", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Date of Birth
                  <input
                    type="date"
                    value={guest.dateOfBirth}
                    onChange={(event) => updateGuest(index, "dateOfBirth", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                    required
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Gender
                  <select
                    value={guest.gender}
                    onChange={(event) => updateGuest(index, "gender", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                  >
                    <option value="">Select</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Passport Number
                  <input
                    value={guest.passportNumber}
                    onChange={(event) => updateGuest(index, "passportNumber", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                    placeholder="Optional"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Nationality
                  <input
                    value={guest.nationality}
                    onChange={(event) => updateGuest(index, "nationality", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Meal preference
                  <select
                    value={guest.mealPreference}
                    onChange={(event) => updateGuest(index, "mealPreference", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal"
                  >
                    {["Standard", "Vegetarian", "Vegan", "Halal", "Kosher"].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          ))}

          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-xl font-bold text-slate-900">Special Requests</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-3 text-slate-700">
                <input
                  type="checkbox"
                  checked={specialRequests.accessibilityNeeds}
                  onChange={(event) =>
                    setSpecialRequests((current) => ({ ...current, accessibilityNeeds: event.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Accessibility needs
              </label>
              <label className="flex items-center gap-3 text-slate-700">
                <input
                  type="checkbox"
                  checked={specialRequests.celebration}
                  onChange={(event) =>
                    setSpecialRequests((current) => ({ ...current, celebration: event.target.checked }))
                  }
                  className="h-4 w-4"
                />
                Celebration
              </label>
              {specialRequests.celebration && (
                <textarea
                  value={specialRequests.celebrationMessage}
                  onChange={(event) =>
                    setSpecialRequests((current) => ({ ...current, celebrationMessage: event.target.value }))
                  }
                  placeholder="Birthday, anniversary, or message"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  rows={3}
                />
              )}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-xl font-bold text-slate-900">Shore Excursions</h2>
            <div className="mt-4 grid gap-3">
              {excursions.map((excursion) => (
                <label key={excursion.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={selectedExcursions.includes(excursion.id)}
                    onChange={() => toggleExcursion(excursion.id)}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    <span className="block font-semibold text-slate-900">{excursion.name}</span>
                    <span className="text-sm text-slate-600">
                      +${excursion.cash}/person or +{excursion.points.toLocaleString()} Points
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </main>

        <aside className="bg-white border border-slate-200 rounded-lg p-6 h-fit lg:sticky lg:top-6">
          <h2 className="text-xl font-bold text-slate-900">Running Total</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Base fare</span>
              <span>
                {paymentMode === "cash"
                  ? `$${cashTotal.toLocaleString()}`
                  : `${totalPoints.toLocaleString()} pts`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shore excursions</span>
              <span>
                {paymentMode === "cash" ? `$${totals.addOnCash.toLocaleString()}` : `${totals.addOnPoints.toLocaleString()} pts`}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>{paymentMode === "cash" ? `$${totals.cash.toLocaleString()}` : `${totals.points.toLocaleString()} pts`}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() =>
              navigate("/cruise-payment", {
                state: {
                  ...state,
                  paymentMode,
                  guestCount,
                  guests,
                  specialRequests,
                  selectedExcursions,
                  selectedExcursionDetails: excursions.filter((excursion) => selectedExcursions.includes(excursion.id))
                }
              })
            }
            className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Continue to Payment
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CruiseGuests;
