import { useState } from 'react';
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { airportsList } from '../../data/flightsData';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, departureDate, flights, adults, children, infants } = location.state || {};

  const [sortBy, setSortBy] = useState('best');
  const [priceRange, setPriceRange] = useState([100, 800]);
  const [selectedStops, setSelectedStops] = useState('all');
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get airport names
  const fromAirport = airportsList.find(a => a.code === from);
  const toAirport = airportsList.find(a => a.code === to);

  // Pricing calculation rules (EXACTLY as specified)
  const calculatePrices = (retailPrice) => {
    const discountedPrice = retailPrice * 0.53; // 47% off
    const pointsRequired = Math.round(retailPrice / 0.04); // base points
    const processingFee = Math.round(pointsRequired * 0.10); // 10% fee
    const totalPoints = pointsRequired + processingFee;
    
    return {
      retailPrice,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      pointsRequired,
      processingFee,
      totalPoints
    };
  };

  // Filter flights
  let filteredFlights = flights.filter(flight => {
    // Price filter
    if (flight.retailPrice < priceRange[0] || flight.retailPrice > priceRange[1]) {
      return false;
    }

    // Stops filter
    if (selectedStops !== 'all') {
      if (selectedStops === 'nonstop' && flight.stops !== 0) return false;
      if (selectedStops === '1stop' && flight.stops !== 1) return false;
      if (selectedStops === '2plus' && flight.stops < 2) return false;
    }

    // Airlines filter
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
      return false;
    }

    // Refundable filter
    if (refundableOnly && !flight.refundable) {
      return false;
    }

    return true;
  });

  // Sort flights
  if (sortBy === 'cheapest') {
    filteredFlights.sort((a, b) => a.retailPrice - b.retailPrice);
  } else if (sortBy === 'fastest') {
    const timeToMinutes = (timeStr) => {
      const parts = timeStr.match(/(\d+)h\s*(\d+)m/);
      return parts ? parseInt(parts[1]) * 60 + parseInt(parts[2]) : 0;
    };
    filteredFlights.sort((a, b) => timeToMinutes(a.duration) - timeToMinutes(b.duration));
  } else if (sortBy === 'earliest') {
    filteredFlights.sort((a, b) => {
      const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
    });
  }

  // Get unique airlines for filter
  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  const handleFlightSelect = (flight) => {
    navigate('/flight-detail', {
      state: {
        flight,
        from,
        to,
        departureDate,
        adults,
        children,
        infants,
        flightPricing: calculatePrices(flight.retailPrice)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {fromAirport?.code} <FaArrowRight className="inline mx-2 text-blue-600" /> {toAirport?.code}
          </h1>
          <p className="text-gray-600">
            {departureDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {adults + children + infants} traveler{adults + children + infants !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-blue-600 mt-2 font-medium">
            {filteredFlights.length} flights found
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Stops */}
              <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Stops</h3>
                <div className="space-y-2">
                  {['all', 'nonstop', '1stop', '2plus'].map((stop) => (
                    <label key={stop} className="flex items-center">
                      <input
                        type="radio"
                        name="stops"
                        value={stop}
                        checked={selectedStops === stop}
                        onChange={(e) => setSelectedStops(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">
                        {stop === 'all' && 'All Flights'}
                        {stop === 'nonstop' && 'Nonstop'}
                        {stop === '1stop' && '1 Stop'}
                        {stop === '2plus' && '2+ Stops'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Airlines</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uniqueAirlines.map((airline) => (
                    <label key={airline} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAirlines([...selectedAirlines, airline]);
                          } else {
                            setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                          }
                        }}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Refundable */}
              <div className="border-t pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={refundableOnly}
                    onChange={(e) => setRefundableOnly(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">Refundable Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {showFilters && (
              <div className="bg-white rounded-lg shadow p-6 mt-4">
                {/* Mobile filters content same as desktop */}
                <p className="text-gray-600">Filter options shown on desktop view</p>
              </div>
            )}
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {['best', 'cheapest', 'fastest', 'earliest'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {option === 'best' && 'Best'}
                  {option === 'cheapest' && 'Cheapest'}
                  {option === 'fastest' && 'Fastest'}
                  {option === 'earliest' && 'Earliest'}
                </button>
              ))}
            </div>

            {/* Flight Cards */}
            <div className="space-y-4">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight) => {
                  const pricing = calculatePrices(flight.retailPrice);
                  const lowSeats = flight.seatsAvailable <= 5;

                  return (
                    <div
                      key={flight.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        
                        {/* Left: Airline Info */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={flight.airlineLogo}
                              alt={flight.airline}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'inline-block';
                              }}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div style={{ display: 'none' }} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                              {flight.airline.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{flight.airline}</p>
                              <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 ml-13">{flight.aircraft}</p>
                        </div>

                        {/* Center: Flight Times and Duration */}
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="font-bold text-lg text-gray-800">{flight.departureTime}</p>
                            <p className="text-sm text-gray-600">{flight.origin}</p>
                          </div>
                          <div className="mx-4 flex-1">
                            <div className="relative h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
                            <p className="text-xs text-gray-600 text-center mt-2">{flight.duration}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg text-gray-800">{flight.arrivalTime}</p>
                            <p className="text-sm text-gray-600">{flight.destination}</p>
                          </div>
                        </div>

                        {/* Center-Right: Stop Info and Baggage */}
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 mb-2">{flight.stopLabel}</p>
                          <p className="text-sm text-gray-600">{flight.baggage}</p>
                          {lowSeats && (
                            <p className="text-xs text-red-600 font-semibold mt-2">Only {flight.seatsAvailable} seats left!</p>
                          )}
                        </div>

                        {/* Right: Pricing */}
                        <div className="border-l border-gray-200 pl-6">
                          <div className="mb-4">
                            <p className="text-xs text-gray-600 line-through">${pricing.retailPrice}</p>
                            <p className="text-2xl font-bold text-blue-600">${pricing.discountedPrice}</p>
                            <p className="text-xs text-green-600 font-semibold">✅ 47% Member Savings</p>
                          </div>

                          {/* Cash vs Points Tabs */}
                          <div className="space-y-3 mb-4">
                            <div className="border-b border-gray-200">
                              <p className="text-sm font-medium text-gray-700 py-2">Pay with Cash</p>
                              <p className="text-lg font-bold text-gray-800 pb-3">${pricing.discountedPrice} + tax</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 py-2">Pay with Points</p>
                              <p className="text-sm text-gray-800">{pricing.pointsRequired.toLocaleString()} Sky Miles</p>
                              <p className="text-xs text-gray-600 mb-1">⚠️ 10% processing fee</p>
                              <p className="text-xs text-gray-600">+ {pricing.processingFee.toLocaleString()} fee</p>
                              <p className="text-sm font-bold text-gray-800 mt-1">{pricing.totalPoints.toLocaleString()} total</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleFlightSelect(flight)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-600 text-lg">No flights match your filters. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
