import { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { popularCarLocations } from "../../../../data/carsData";

const RentalCars = () => {
  const navigate = useNavigate();
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("Discount Code");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [sameLocation, setSameLocation] = useState(false);
  const [showAARPRates, setShowAARPRates] = useState(false);

  const discountMenuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (sameLocation) {
      setDropoffLocation(pickupLocation);
    }
  }, [pickupLocation, sameLocation]);

  const handleClickOutside = (event) => {
    if (discountMenuRef.current && !discountMenuRef.current.contains(event.target)) {
      setShowDiscountMenu(false);
    }
  };

  const handleDiscountSelect = (discount) => {
    setSelectedDiscount(discount);
    setShowDiscountMenu(false);
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    return hourNum >= 12
      ? `${hourNum === 12 ? 12 : hourNum - 12}:${minutes} PM`
      : `${hourNum}:${minutes} AM`;
  };

  const filteredPickupLocations = useMemo(() => {
    if (!pickupLocation.trim()) return [];
    const query = pickupLocation.toLowerCase();
    return popularCarLocations.filter((location) =>
      location.city.toLowerCase().includes(query) || location.code.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [pickupLocation]);

  const filteredDropoffLocations = useMemo(() => {
    if (!dropoffLocation.trim() || sameLocation) return [];
    const query = dropoffLocation.toLowerCase();
    return popularCarLocations.filter((location) =>
      location.city.toLowerCase().includes(query) || location.code.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [dropoffLocation, sameLocation]);

  const handleSelectPickupSuggestion = (city) => {
    setPickupLocation(city);
    if (sameLocation) setDropoffLocation(city);
  };

  const handleSelectDropoffSuggestion = (city) => {
    setDropoffLocation(city);
  };

  const calculateDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const handleSearch = () => {
    if (!pickupLocation.trim()) {
      alert("Please enter a pickup location.");
      return;
    }
    if (!dropoffLocation.trim()) {
      alert("Please enter a drop-off location.");
      return;
    }
    if (dropoffDate <= pickupDate) {
      alert("Drop-off date must be after the pick-up date.");
      return;
    }

    const numberOfDays = calculateDays();
    const searchData = {
      pickupLocation,
      dropoffLocation,
      pickupDate: pickupDate.toISOString(),
      dropoffDate: dropoffDate.toISOString(),
      pickupTime,
      dropoffTime,
      discountCode: selectedDiscount !== "Discount Code" ? selectedDiscount : null,
      showAARPRates,
      sameLocation,
      numberOfDays
    };

    navigate('/car-search', { state: searchData });
  };

  return (
    <div className="bg-white p-4 md:p-6 max-w-5xl mx-auto rounded-3xl shadow-sm">
      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Rental car search</h2>
          <p className="mt-2 text-sm text-slate-600">Book rental cars with flexible pickup and drop-off options.</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Pick-up Location</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3">
                <FaMapMarkerAlt className="text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Enter pick-up location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              {filteredPickupLocations.length > 0 && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  {filteredPickupLocations.map((location) => (
                    <button
                      key={location.code}
                      type="button"
                      onClick={() => handleSelectPickupSuggestion(location.city)}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      {location.city}, {location.state} ({location.code})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Drop-off Location</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-300 bg-white px-4 py-3">
                <FaMapMarkerAlt className="text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Enter drop-off location"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  disabled={sameLocation}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
                />
              </div>
              {filteredDropoffLocations.length > 0 && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  {filteredDropoffLocations.map((location) => (
                    <button
                      key={location.code}
                      type="button"
                      onClick={() => handleSelectDropoffSuggestion(location.city)}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      {location.city}, {location.state} ({location.code})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 rounded-3xl border border-slate-300 bg-white p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Pick-up Date</label>
              <DatePicker
                selected={pickupDate}
                onChange={(date) => setPickupDate(date)}
                minDate={new Date()}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </div>
            <div className="flex-1 rounded-3xl border border-slate-300 bg-white p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Drop-off Date</label>
              <DatePicker
                selected={dropoffDate}
                onChange={(date) => setDropoffDate(date)}
                minDate={pickupDate}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-300 bg-white p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Pick-up Time</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <FaClock className="text-gray-500 text-lg" />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{formatTimeDisplay(pickupTime)}</p>
            </div>

            <div className="rounded-3xl border border-slate-300 bg-white p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Drop-off Time</label>
              <div className="mt-2 flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <FaClock className="text-gray-500 text-lg" />
                <input
                  type="time"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{formatTimeDisplay(dropoffTime)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => setSameLocation(!sameLocation)}
              className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${sameLocation ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {sameLocation ? "Same drop-off as pickup" : "Return to same location"}
            </button>
            <button
              type="button"
              onClick={() => setShowAARPRates((prev) => !prev)}
              className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${showAARPRates ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {showAARPRates ? "AARP Rates On" : "Show AARP Rates"}
            </button>
          </div>

          <div className="relative mt-2" ref={discountMenuRef}>
            <button
              type="button"
              onClick={() => setShowDiscountMenu((prev) => !prev)}
              className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm hover:border-slate-400"
            >
              {selectedDiscount}
              <FaChevronDown className="ml-3 inline-block text-slate-500" />
            </button>
            {showDiscountMenu && (
              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                {[
                  "Discount Code",
                  "AAA Member",
                  "Corporate Code",
                  "Military Discount"
                ].map((discount) => (
                  <button
                    key={discount}
                    type="button"
                    onClick={() => handleDiscountSelect(discount)}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    {discount}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Search Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCars;
