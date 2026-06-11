import React, { useMemo, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaShip } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { cruiseCategories } from "../../data/cruisesData";

const destinationOptions = [
  ...cruiseCategories.filter((category) => category !== "All"),
  "Africa",
  "Antarctic",
  "Canada",
  "England",
  "Central America",
  "Galapagos",
  "Middle East",
  "Pacific Coastal",
  "Panama Canal",
  "South Pacific",
  "Transatlantic",
  "Transpacific",
  "Baltic Sea",
  "Greek Isles",
  "Norwegian Fjords",
  "New Zealand",
  "Iceland",
  "Dubai",
  "Singapore",
  "Japan",
  "Hong Kong",
  "Vietnam",
  "Thailand",
  "Fiji",
  "Tahiti",
  "Canary Islands",
  "Scandinavia",
  "Greenland",
  "Black Sea",
  "Florida",
  "New England",
  "South Korea",
  "Malaysia",
  "Indian Ocean",
  "Red Sea",
  "Seychelles",
  "Maldives",
  "Sri Lanka",
  "Chile",
  "Argentina",
  "Brazil",
  "Costa Rica",
  "Puerto Rico",
  "Barbados",
  "Jamaica",
  "St. Lucia",
  "St. Maarten",
  "Dominican Republic"
];

const durationOptions = ["Any duration", "3-5 nights", "7 nights", "10-14 nights", "15+ nights"];

const Cruises = () => {
  const navigate = useNavigate();
  const [goingTo, setGoingTo] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [duration, setDuration] = useState("7 nights");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [departureDateFrom, departureDateTo] = dateRange;

  const filteredDestinations = useMemo(() => {
    const query = goingTo.trim().toLowerCase();
    if (!query) return destinationOptions;
    return destinationOptions.filter((destination) => destination.toLowerCase().includes(query));
  }, [goingTo]);

  const handleSearch = () => {
    navigate("/cruise-search", {
      state: {
        destination: goingTo.trim() || "All",
        departurePort: departurePort.trim(),
        departureDateFrom: departureDateFrom ? departureDateFrom.toISOString() : "",
        departureDateTo: departureDateTo ? departureDateTo.toISOString() : "",
        duration
      }
    });
  };

  const handleDestinationSelect = (destination) => {
    setGoingTo(destination);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-4 md:p-6 max-w-5xl mx-auto">
      <p className="text-sm md:text-base text-gray-700 mb-4">For expert cruise advice.</p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_0.7fr]">
        <div className="relative">
          <div className="flex items-center w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
            <FaMapMarkerAlt className="text-gray-500 text-lg mr-3 shrink-0" />
            <div className="flex flex-col w-full">
              <label className="text-sm md:text-base text-gray-700 font-medium" htmlFor="cruise-destination">
                Going to
              </label>
              <input
                id="cruise-destination"
                type="text"
                value={goingTo}
                onChange={(event) => {
                  setGoingTo(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Any destination"
                className="text-sm text-gray-700 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {showSuggestions && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination) => (
                  <button
                    key={destination}
                    type="button"
                    onMouseDown={() => handleDestinationSelect(destination)}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    {destination}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">No matching destinations</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
          <FaMapMarkerAlt className="text-gray-500 text-lg mr-3 shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base text-gray-700 font-medium" htmlFor="departure-port">
              Departing from (optional)
            </label>
            <input
              id="departure-port"
              type="text"
              value={departurePort}
              onChange={(event) => setDeparturePort(event.target.value)}
              placeholder="Any port city"
              className="text-sm text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
          <FaCalendarAlt className="text-gray-500 text-lg mr-3 shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base text-gray-700 font-medium">Departing between</label>
            <DatePicker
              selectsRange
              startDate={departureDateFrom}
              endDate={departureDateTo}
              onChange={(update) => setDateRange(update)}
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
              placeholderText="Select date window"
              className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer w-full"
              isClearable
            />
          </div>
        </div>

        <div className="flex items-center w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
          <FaShip className="text-gray-500 text-lg mr-3 shrink-0" />
          <div className="flex flex-col w-full">
            <label className="text-sm md:text-base text-gray-700 font-medium" htmlFor="cruise-duration">
              Duration
            </label>
            <select
              id="cruise-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="text-sm text-gray-700 bg-transparent focus:outline-none"
            >
              {durationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full md:w-auto mt-4 bg-[#1668e3] text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-500 transition-all text-sm md:text-base"
      >
        Search
      </button>
    </div>
  );
};

export default Cruises;
