import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoSwapVertical } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { airportsList } from '../../data/flightsData';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [cabinClass, setCabinClass] = useState('Economy');
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  // Handle FROM field input
  const handleFromChange = (value) => {
    setFrom(value);
    if (value.length > 0) {
      const filtered = airportsList.filter(airport =>
        airport.code.toUpperCase().includes(value.toUpperCase()) ||
        airport.city.toUpperCase().includes(value.toUpperCase())
      );
      setFromSuggestions(filtered);
      setShowFromDropdown(true);
    } else {
      setFromSuggestions([]);
      setShowFromDropdown(false);
    }
  };

  // Handle TO field input
  const handleToChange = (value) => {
    setTo(value);
    if (value.length > 0) {
      const filtered = airportsList.filter(airport =>
        airport.code.toUpperCase().includes(value.toUpperCase()) ||
        airport.city.toUpperCase().includes(value.toUpperCase())
      );
      setToSuggestions(filtered);
      setShowToDropdown(true);
    } else {
      setToSuggestions([]);
      setShowToDropdown(false);
    }
  };

  // Select FROM airport
  const selectFromAirport = (airport) => {
    setFrom(airport.code);
    setShowFromDropdown(false);
    setFromSuggestions([]);
  };

  // Select TO airport
  const selectToAirport = (airport) => {
    setTo(airport.code);
    setShowToDropdown(false);
    setToSuggestions([]);
  };

  // Swap FROM and TO
  const swapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const totalTravelers = adults + children + infants;

  // Handle search
  const handleSearch = () => {
    if (!from || !to || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Filter flights based on origin and destination
    let filteredFlights = flightsData.filter(
      flight => flight.origin === from && flight.destination === to
    );

    // If no exact match, show all flights as demo results
    if (filteredFlights.length === 0) {
      filteredFlights = flightsData;
    }

    navigate('/flight-results', {
      state: {
        from,
        to,
        departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : null,
        tripType,
        adults,
        children,
        infants,
        cabinClass,
        flights: filteredFlights
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Your Flight</h1>
          <p className="text-blue-100">Search and book flights with Platinum Club savings</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Trip Type Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Trip Type</label>
            <div className="flex gap-4">
              {['oneway', 'roundtrip', 'multicity'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    tripType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'oneway' && 'One Way'}
                  {type === 'roundtrip' && 'Round Trip'}
                  {type === 'multicity' && 'Multi-City'}
                </button>
              ))}
            </div>
          </div>

          {/* Locations and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* FROM */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
              <input
                type="text"
                placeholder="Airport code or city"
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
                onFocus={() => from.length > 0 && setShowFromDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {showFromDropdown && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-y-auto">
                  {fromSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      onClick={() => selectFromAirport(airport)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-semibold text-gray-800">{airport.code} - {airport.city}</div>
                      <div className="text-xs text-gray-600">{airport.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex items-end pb-3">
              <button
                onClick={swapAirports}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Swap airports"
              >
                <IoSwapVertical className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* TO */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <input
                type="text"
                placeholder="Airport code or city"
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
                onFocus={() => to.length > 0 && setShowToDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {showToDropdown && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-y-auto">
                  {toSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      onClick={() => selectToAirport(airport)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-semibold text-gray-800">{airport.code} - {airport.city}</div>
                      <div className="text-xs text-gray-600">{airport.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departure</label>
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                placeholderText="Select date"
                minDate={new Date()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Return Date (only for Round Trip) */}
          {tripType === 'roundtrip' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Return</label>
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  placeholderText="Select date"
                  minDate={departureDate || new Date()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Travelers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Travelers Dropdown */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Travelers</label>
              <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:border-blue-500 transition-all">
                {totalTravelers} Traveler{totalTravelers !== 1 ? 's' : ''}
              </button>
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-4 z-10 hidden group-hover:block">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Adults (18+)</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-2 py-1 border rounded">-</button>
                      <span className="w-8 text-center">{adults}</span>
                      <button onClick={() => setAdults(Math.min(9, adults + 1))} className="px-2 py-1 border rounded">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Children (2-17)</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-2 py-1 border rounded">-</button>
                      <span className="w-8 text-center">{children}</span>
                      <button onClick={() => setChildren(Math.min(9, children + 1))} className="px-2 py-1 border rounded">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Infants (&lt;2)</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setInfants(Math.max(0, infants - 1))} className="px-2 py-1 border rounded">-</button>
                      <span className="w-8 text-center">{infants}</span>
                      <button onClick={() => setInfants(Math.min(4, infants + 1))} className="px-2 py-1 border rounded">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cabin Class */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cabin Class</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 text-lg"
          >
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;