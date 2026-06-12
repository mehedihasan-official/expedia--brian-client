import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateCarPricing } from "../../utils/carPricing";

const CarDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    car,
    searchData,
    paymentMode = "cash",
    numberOfDays = 1,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime
  } = state;

  useEffect(() => {
    if (!car || !searchData) {
      navigate("/car-search", { replace: true });
    }
  }, [car, searchData, navigate]);

  if (!car || !searchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-4">No car selected</h2>
          <p className="text-gray-600 mb-6">Please search for a car first to view details.</p>
          <button
            onClick={() => navigate("/car-search")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full"
          >
            Search Cars
          </button>
        </div>
      </div>
    );
  }

  const carImageFallback = (event) => {
    event.target.onerror = null;
    event.target.src = "https://via.placeholder.com/600x360?text=Car+Image";
  };

  const vendorLogoFallback = (event) => {
    event.target.onerror = null;
    event.target.style.display = "none";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    return hour >= 12
      ? `${hour === 12 ? 12 : hour - 12}:${minutes} PM`
      : `${hour}:${minutes} AM`;
  };

  const pricing = calculateCarPricing(car.retailPricePerDay, numberOfDays);
  const { discountedPricePerDay, retailSubtotal, discountedSubtotal: cashSubtotal,
          cashTax, cashTotal, pointsPerDay, pointsTotal, savingsAmount, savingsPercent } = pricing;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="relative">
            <img
              src={car.image}
              alt={car.brand}
              onError={carImageFallback}
              className="w-full h-72 object-cover sm:h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-200">{car.type}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{car.brand}</h1>
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="bg-slate-800/70 text-slate-100 px-3 py-1 rounded-full text-xs uppercase tracking-[0.15em]">
                  {car.vendor}
                </span>
                <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {paymentMode === "cash" ? "Cash" : "Points"} mode
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-slate-50 rounded-3xl p-5">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Pickup</h2>
                  <p className="font-semibold text-lg text-slate-900">{pickupLocation || searchData.pickupLocation}</p>
                  <p className="text-sm text-slate-600">{formatDate(pickupDate)}</p>
                  <p className="text-sm text-slate-600">{formatTime(pickupTime)}</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-5">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Dropoff</h2>
                  <p className="font-semibold text-lg text-slate-900">{dropoffLocation || searchData.dropoffLocation}</p>
                  <p className="text-sm text-slate-600">{formatDate(dropoffDate)}</p>
                  <p className="text-sm text-slate-600">{formatTime(dropoffTime)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-slate-50 rounded-3xl p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Days</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{numberOfDays}</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Passengers</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{car.passengers}</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bags</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{car.bags}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-slate-700 shadow-sm">{car.transmission}</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-slate-700 shadow-sm">{car.fuelType}</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-slate-700 shadow-sm">{car.mileage}</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm text-slate-700 shadow-sm">A/C {car.airConditioning ? 'Included' : 'No'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={car.vendorLogo}
                    alt={car.vendor}
                    onError={vendorLogoFallback}
                    className="h-10 w-auto object-contain rounded-md bg-white p-2"
                  />
                  <div>
                    <p className="text-slate-700 text-sm">Vendor</p>
                    <p className="font-semibold text-slate-900">{car.vendor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={`text-sm ${index < Math.round(car.rating) ? 'text-yellow-400' : 'text-slate-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">{car.rating.toFixed(1)} · {car.reviewCount} reviews</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">What&apos;s included</h3>
                <ul className="grid gap-3">
                  {car.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-700">
                      <span className="text-blue-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Payment details</h2>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-600">{paymentMode}</div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Daily rate</span>
                      <span>
                        <span className="line-through text-slate-400">${pricing.retailPricePerDay.toFixed(2)}</span>
                        <span className="font-semibold text-slate-900 ml-2">${discountedPricePerDay.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Member Savings ({savingsPercent}% off)</span>
                      <span>-${savingsAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Days</span>
                      <span>{numberOfDays}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>${cashSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-100 p-4">
                    <div className="text-sm text-slate-600">Taxes (12%)</div>
                    <div className="text-xl font-semibold text-slate-900">${cashTax.toFixed(2)}</div>
                  </div>

                  <div className="rounded-3xl bg-blue-600 text-white p-5">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] font-semibold">
                      <span>Total</span>
                      <span>${cashTotal.toFixed(2)}</span>
                    </div>
                    <p className="mt-2 text-sm text-blue-100">Points option: {pointsTotal.toLocaleString()} points total</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-sm text-slate-700">No exchange fee on point redemptions.</p>
                    <p className="text-sm text-slate-700">Points per day: {pointsPerDay.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() =>
                      navigate('/car-drivers', {
                        state: {
                          car,
                          searchData,
                          paymentMode,
                          numberOfDays,
                          pickupLocation,
                          dropoffLocation,
                          pickupDate,
                          dropoffDate,
                          pickupTime,
                          dropoffTime,
                          pricing
                        }
                      })
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl py-4 transition"
                  >
                    Continue to Driver Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
