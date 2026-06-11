import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CarConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    car,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime,
    driverInfo,
    paymentMode,
    cashTotal,
    pointsTotal,
    addOns = {},
    numberOfDays
  } = state;

  useEffect(() => {
    if (!car || !driverInfo) {
      navigate("/car-search", { replace: true });
    }
  }, [car, driverInfo, navigate]);

  if (!car || !driverInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 text-sm font-semibold">
            Booking Confirmed
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Your car rental is ready</h1>
          <p className="text-slate-600">We have sent booking details to {driverInfo.email}. Review your itinerary and enjoy your trip.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Car</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{car.brand}</p>
              <p className="text-sm text-slate-600">{car.type} · {car.vendor}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rental Period</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{new Date(pickupDate).toLocaleDateString()} — {new Date(dropoffDate).toLocaleDateString()}</p>
              <p className="text-sm text-slate-600">{pickupTime} pickup · {dropoffTime} dropoff</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pickup</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{pickupLocation}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dropoff</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{dropoffLocation}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Traveler</h2>
            <p className="mt-2 text-slate-700">{driverInfo.firstName} {driverInfo.lastName}</p>
            <p className="text-sm text-slate-600">{driverInfo.email}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Booking Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Days</span>
                <span>{numberOfDays}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="capitalize">{paymentMode}</span>
              </div>
              {paymentMode === "cash" ? (
                <div className="flex justify-between">
                  <span>Total Paid</span>
                  <span>${cashTotal.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Points Used</span>
                  <span>{pointsTotal.toLocaleString()} pts</span>
                </div>
              )}
            </div>
          </div>

          {addOns && (addOns.gps || addOns.childSeat || addOns.insurance) && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Add-ons</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {addOns.gps && <div className="flex justify-between"><span>GPS Navigation</span><span>${8 * numberOfDays}</span></div>}
                {addOns.childSeat && <div className="flex justify-between"><span>Child Seat</span><span>${10 * numberOfDays}</span></div>}
                {addOns.insurance && <div className="flex justify-between"><span>Full Insurance Coverage</span><span>${15 * numberOfDays}</span></div>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto rounded-full bg-blue-600 px-6 py-4 text-white font-semibold hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/car-search")}
            className="w-full sm:w-auto rounded-full border border-slate-300 px-6 py-4 text-slate-700 hover:bg-slate-100 transition"
          >
            Search More Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarConfirmation;
