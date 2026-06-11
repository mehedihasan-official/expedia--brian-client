import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { carRentalData } from "../../data/carsData";

const categoryLabels = {
  All: "All",
  economy: "Economy",
  compact: "Compact",
  midsize: "Midsize",
  fullsize: "Full Size",
  suv: "SUV",
  van: "Minivan",
  luxury: "Luxury"
};

const CarSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [sortOption, setSortOption] = useState("recommended");
  const [paymentMode, setPaymentMode] = useState("cash");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    return hourNum >= 12
      ? `${hourNum === 12 ? 12 : hourNum - 12}:${minutes} PM`
      : `${hourNum}:${minutes} AM`;
  };

  const numberOfDays = useMemo(() => {
    if (!searchData.pickupDate || !searchData.dropoffDate) return 1;
    const start = new Date(searchData.pickupDate);
    const end = new Date(searchData.dropoffDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [searchData.pickupDate, searchData.dropoffDate]);

  const vendorOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(carRentalData.map((car) => car.vendor)))];
  }, []);

  const filteredCars = useMemo(() => {
    return carRentalData
      .filter((car) => {
        const categoryFilter = selectedCategory === "All" || car.category === selectedCategory;
        const vendorFilter = selectedVendor === "All" || car.vendor === selectedVendor;
        return categoryFilter && vendorFilter;
      })
      .sort((a, b) => {
        if (sortOption === "price-low") return a.retailPricePerDay - b.retailPricePerDay;
        if (sortOption === "price-high") return b.retailPricePerDay - a.retailPricePerDay;
        if (sortOption === "rating") return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
  }, [selectedCategory, selectedVendor, sortOption]);

  const summaryTitle = searchData.pickupLocation && searchData.dropoffLocation
    ? `${searchData.pickupLocation} → ${searchData.dropoffLocation}`
    : "Rental car offers";

  const summarySubtitle = searchData.pickupDate && searchData.dropoffDate
    ? `${formatDate(searchData.pickupDate)} ${formatTimeDisplay(searchData.pickupTime)} — ${formatDate(searchData.dropoffDate)} ${formatTimeDisplay(searchData.dropoffTime)}`
    : "Choose dates and locations to compare cars.";

  const handleSelectCar = (car) => {
    navigate("/car-detail", {
      state: {
        car,
        searchData,
        paymentMode,
        numberOfDays,
        pickupLocation: searchData.pickupLocation,
        dropoffLocation: searchData.dropoffLocation,
        pickupDate: searchData.pickupDate,
        dropoffDate: searchData.dropoffDate,
        pickupTime: searchData.pickupTime,
        dropoffTime: searchData.dropoffTime
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 rounded-full bg-slate-200 mb-4" />
            <div className="grid gap-4 md:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-3">
                <div className="h-5 w-2/5 rounded-full bg-slate-200" />
                <div className="h-4 w-1/3 rounded-full bg-slate-200" />
                <div className="h-4 w-3/5 rounded-full bg-slate-200" />
              </div>
              <div className="h-40 rounded-3xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Car rental</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{summaryTitle}</h1>
              <p className="mt-2 text-sm text-slate-600">{summarySubtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPaymentMode("cash")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${paymentMode === "cash" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMode("points")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${paymentMode === "points" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Points
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categoryLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSelectedCategory(value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {vendorOptions.map((vendor) => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-600">
          {filteredCars.length} available cars for {numberOfDays} day{numberOfDays === 1 ? "" : "s"}.
        </div>

        <div className="space-y-6">
          {filteredCars.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-700 shadow-sm">
              No cars match your filters. Adjust category or vendor options to see more results.
            </div>
          ) : (
            filteredCars.map((car) => {
              const pricePerDay = car.retailPricePerDay;
              const totalPrice = pricePerDay * numberOfDays;
              const pointsPerDay = Math.round(pricePerDay / 0.05);
              const pointsTotal = pointsPerDay * numberOfDays;

              return (
                <div key={car.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr] p-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-700">{car.category}</span>
                        <span className="text-sm text-slate-500">{car.vendor}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{car.brand}</h2>
                        <p className="mt-2 text-sm text-slate-600">{car.type}, {car.transmission}, {car.mileage}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                          <div className="font-semibold text-slate-900">{car.passengers}</div>
                          Passengers
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                          <div className="font-semibold text-slate-900">{car.bags}</div>
                          Bags
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                          <div className="font-semibold text-slate-900">{car.fuelType}</div>
                          Fuel
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        {car.features.map((feature) => (
                          <span key={feature} className="rounded-full bg-slate-100 px-3 py-2">{feature}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="h-52 overflow-hidden rounded-3xl bg-slate-100">
                        <img src={car.image} alt={car.brand} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span>Daily rate</span>
                          <span>${pricePerDay.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{numberOfDays} day{numberOfDays === 1 ? "" : "s"}</span>
                          <span>${totalPrice.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(0)}</span>
                        </div>
                        {paymentMode === "points" && (
                          <div className="text-xs text-slate-500">or {pointsTotal.toLocaleString()} points</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectCar(car)}
                        className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CarSearch;
