import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CarDrivers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const {
    car,
    searchData,
    paymentMode = "cash",
    numberOfDays = 1,
    pricing = {},
    pickupLocation,
    dropoffLocation,
    pickupDate,
    dropoffDate,
    pickupTime,
    dropoffTime
  } = state;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [age, setAge] = useState(18);
  const [hasAdditionalDriver, setHasAdditionalDriver] = useState(false);
  const [secondFirstName, setSecondFirstName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [secondLicenseNumber, setSecondLicenseNumber] = useState("");
  const [gps, setGps] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [insurance, setInsurance] = useState(false);

  useEffect(() => {
    if (!car || !searchData) {
      navigate("/car-search", { replace: true });
    }
  }, [car, searchData, navigate]);

  if (!car || !searchData) {
    return null;
  }

  const carImageFallback = (event) => {
    event.target.onerror = null;
    event.target.src = "https://via.placeholder.com/600x360?text=Car+Image";
  };

  const cashAddOnTotal = (gps ? 8 : 0) + (childSeat ? 10 : 0) + (insurance ? 15 : 0);
  const pointsAddOnTotal = (gps ? 160 : 0) + (childSeat ? 200 : 0) + (insurance ? 300 : 0);
  const cashAddOnDays = Math.max(1, numberOfDays);
  const cashAddOnAmount = Math.round(cashAddOnTotal * cashAddOnDays * 100) / 100;
  const pointsAddOnAmount = pointsAddOnTotal * cashAddOnDays;

  const handleNext = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !licenseNumber) {
      alert("Please fill in all required driver fields.");
      return;
    }

    if (age < 18) {
      alert("Driver must be at least 18 years old.");
      return;
    }

    if (hasAdditionalDriver && (!secondFirstName || !secondLastName || !secondLicenseNumber)) {
      alert("Please fill in the additional driver details.");
      return;
    }

    navigate("/car-payment", {
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
        driverInfo: {
          firstName,
          lastName,
          email,
          phoneNumber,
          licenseNumber,
          age,
          additionalDriver: hasAdditionalDriver
            ? {
                firstName: secondFirstName,
                lastName: secondLastName,
                licenseNumber: secondLicenseNumber
              }
            : null
        },
        addOns: {
          gps,
          childSeat,
          insurance,
          cashAddOnAmount,
          pointsAddOnAmount
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-md p-6 md:p-8 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Driver Details</h1>
              <p className="text-slate-600 mt-1">Enter driver information to continue your booking.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">{car.type} • {car.brand}</p>
              <p className="text-sm text-slate-500">{pickupLocation} → {dropoffLocation}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">First Name *</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number *</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Driver's License Number *</label>
                <input
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="License number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Age *</label>
                <input
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  type="number"
                  min="18"
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50">
                <div className="flex items-start gap-4">
                  <img
                    src={car.image}
                    alt={car.brand}
                    onError={carImageFallback}
                    className="h-32 w-32 rounded-3xl object-cover"
                  />
                  <div className="grow">
                    <p className="text-sm text-slate-500">Car selected</p>
                    <h2 className="text-xl font-semibold text-slate-900">{car.brand}</h2>
                    <p className="text-sm text-slate-600 mt-2">{car.type} · {car.vendor}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">{car.passengers} passengers</span>
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">{car.bags} bags</span>
                      <span className="rounded-full bg-white px-3 py-2 shadow-sm">{car.transmission}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Add-ons</h3>
                {[
                  { key: "gps", label: "GPS Navigation", cash: 8, points: 160 },
                  { key: "childSeat", label: "Child Seat", cash: 10, points: 200 },
                  { key: "insurance", label: "Full Insurance Coverage", cash: 15, points: 300 }
                ].map((option) => (
                  <label key={option.key} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{option.label}</p>
                      <p className="text-sm text-slate-600">+${option.cash}/day or +{option.points} Points/day</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={option.key === "gps" ? gps : option.key === "childSeat" ? childSeat : insurance}
                      onChange={() => {
                        if (option.key === "gps") setGps(!gps);
                        if (option.key === "childSeat") setChildSeat(!childSeat);
                        if (option.key === "insurance") setInsurance(!insurance);
                      }}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300"
                    />
                  </label>
                ))}
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <p className="text-sm text-slate-600">Running total for add-ons:</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">${cashAddOnAmount.toFixed(2)} / {numberOfDays} days</p>
                <p className="text-sm text-slate-600">or {pointsAddOnAmount.toLocaleString()} points total</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Back to Car Details
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDrivers;
