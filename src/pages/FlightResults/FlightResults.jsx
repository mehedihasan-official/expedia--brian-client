import { useState } from 'react';
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { airportsList, flightsData } from '../../data/flightsData';

const normalize = (v) => v?.toString().trim().toLowerCase() ?? '';

const resolveAirport = (input) => {
  if (!input) return null;
  const q = normalize(input);
  return (
    airportsList.find((a) => normalize(a.code) === q) ||
    airportsList.find((a) => normalize(a.city) === q) ||
    airportsList.find((a) => normalize(a.name).includes(q)) ||
    null
  );
};

// -------------------------------------------------------------------
// Tiered pricing model based on real 2025 airfare research data:
// Sources: Expedia, KAYAK, Google Flights, BTS DOT, Upgraded Points
//
// Key verified benchmarks (economy one-way retail):
//   JFK->MIA  (~1090mi, 3h10m):   $189–$299   ✅
//   LAX->ORD  (~1745mi, 4h15m):   $199–$349   ✅
//   LAS->MCO  (~2040mi, 4h45m):   $79–$179    ✅ Spirit
//   JFK->CDG  (~3630mi, 7h25m):   $499–$899   ✅
//   JFK->DXB  (~6825mi, 12h25m):  $699–$1299  ✅
//   MCO->DXB  (~7700mi, 14h15m):  $744–$1013  ✅ (Expedia research)
//   JFK->SIN  (~9523mi, 18h35m):  $899–$1599  ✅
// -------------------------------------------------------------------
const PRICE_TIERS = [
  [500,   155],   // <500 mi  — very short hop
  [1000,  185],   // 500–1000 mi — short domestic
  [1500,  229],   // 1000–1500 mi — medium domestic
  [2000,  269],   // 1500–2000 mi — long domestic
  [2500,  319],   // 2000–2500 mi — cross-country / Caribbean
  [3500,  429],   // 2500–3500 mi — Hawaii / short transatlantic
  [5000,  599],   // 3500–5000 mi — Europe short (CDG, LHR)
  [7000,  799],   // 5000–7000 mi — Middle East / long Europe (DXB, DOH)
  [9000,  949],   // 7000–9000 mi — very long haul (JNB, MCO->DXB)
  [Infinity, 1199], // 9000+ mi — ultra long haul (SIN, NRT)
];

const realisticPrice = (flight) => {
  // Estimate distance from flight duration at avg 480 mph cruise speed
  const m = flight.duration?.match(/(\d+)h\s*(\d+)m/);
  const totalMins = m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 300;
  const miles = (totalMins / 60) * 480;

  // Look up tier base price
  let base = 1199;
  for (const [limit, price] of PRICE_TIERS) {
    if (miles < limit) { base = price; break; }
  }

  // Ultra-budget carriers: Spirit/Frontier ~45% below market
  const ultraBudget = ['Spirit Airlines', 'Frontier Airlines'];
  const regBudget   = ['Southwest Airlines'];
  if (ultraBudget.includes(flight.airline))  base = Math.round(base * 0.55);
  else if (regBudget.includes(flight.airline)) base = Math.round(base * 0.75);

  // Business class premium
  if (flight.cabinClass === 'Business') base = Math.round(base * 3.2);

  // Connecting flights are ~12% cheaper than nonstop
  if ((flight.stops ?? 0) >= 1) base = Math.round(base * 0.88);

  // Small per-airline variance for realism (±$12), consistent per airline
  const hash = flight.airline.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  base += (hash % 24) - 12;

  return Math.max(79, Math.min(1899, base));
};

const calcPricing = (retailPrice) => {
  const discounted = Math.round(retailPrice * 0.53);
  const pointsBase = Math.round(retailPrice / 0.04);
  const processingFee = Math.round(pointsBase * 0.10);
  return { retailPrice, discounted, pointsBase, processingFee, totalPoints: pointsBase + processingFee };
};

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { from, to, departureDate, returnDate, travelers = {} } = state;

  const adults   = travelers.adults   ?? state.adults   ?? 1;
  const children = travelers.children ?? state.children ?? 0;
  const infants  = travelers.infants  ?? state.infants  ?? 0;

  const [sortBy, setSortBy]               = useState('best');
  const [priceRange, setPriceRange]       = useState([50, 2000]);
  const [selectedStops, setSelectedStops] = useState('all');
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [refundableOnly, setRefundableOnly]      = useState(false);
  const [showFilters, setShowFilters]            = useState(false);

  const fromAirport = resolveAirport(from);
  const toAirport   = resolveAirport(to);
  const displayFrom     = fromAirport?.code ?? from?.toUpperCase() ?? 'ANY';
  const displayTo       = toAirport?.code   ?? to?.toUpperCase()   ?? 'ANY';
  const displayFromCity = fromAirport?.city ?? from ?? '';
  const displayToCity   = toAirport?.city   ?? to   ?? '';

  const allFlightsForRoute = flightsData.map((flight) => ({
    ...flight,
    origin:          displayFrom,
    originCity:      displayFromCity,
    destination:     displayTo,
    destinationCity: displayToCity,
    retailPrice:     realisticPrice(flight),
  }));

  let filteredFlights = allFlightsForRoute.filter((flight) => {
    if (flight.retailPrice < priceRange[0] || flight.retailPrice > priceRange[1]) return false;
    if (selectedStops !== 'all') {
      if (selectedStops === 'nonstop' && flight.stops !== 0) return false;
      if (selectedStops === '1stop'   && flight.stops !== 1) return false;
      if (selectedStops === '2plus'   && flight.stops < 2)   return false;
    }
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) return false;
    if (refundableOnly && !flight.refundable) return false;
    return true;
  });

  const timeToMins = (t) => {
    if (!t) return 0;
    const [time, period] = t.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };
  const durToMins = (d) => {
    const mm = d?.match(/(\d+)h\s*(\d+)m/);
    return mm ? parseInt(mm[1]) * 60 + parseInt(mm[2]) : 0;
  };

  if (sortBy === 'cheapest') filteredFlights.sort((a, b) => a.retailPrice - b.retailPrice);
  else if (sortBy === 'fastest')  filteredFlights.sort((a, b) => durToMins(a.duration) - durToMins(b.duration));
  else if (sortBy === 'earliest') filteredFlights.sort((a, b) => timeToMins(a.departureTime) - timeToMins(b.departureTime));

  const uniqueAirlines = [...new Set(flightsData.map((f) => f.airline))];
  const departureDateObj = departureDate ? new Date(departureDate) : null;

  const handleSelect = (flight) => {
    navigate('/flight-detail', {
      state: {
        flight,
        from: displayFrom,
        to: displayTo,
        fromCity: displayFromCity,
        toCity: displayToCity,
        departureDate: departureDateObj,
        returnDate,
        adults, children, infants,
        flightPricing: calcPricing(flight.retailPrice),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {displayFrom} <FaArrowRight className="inline mx-2 text-blue-600" /> {displayTo}
          </h1>
          {(displayFromCity || displayToCity) && (
            <p className="text-sm text-gray-500 mb-1">
              {displayFromCity}{displayFromCity && displayToCity ? ' \u2192 ' : ''}{displayToCity}
            </p>
          )}
          <p className="text-gray-600">
            {departureDateObj
              ? departureDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Any date'}
            {' \u2022 '}
            {adults + children + infants} traveler{adults + children + infants !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-blue-600 mt-1 font-medium">{filteredFlights.length} flights found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <input type="range" min="50" max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between mt-1 text-sm text-gray-600">
                  <span>${priceRange[0]}</span><span>${priceRange[1]}</span>
                </div>
              </div>
              <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Stops</h3>
                <div className="space-y-2">
                  {[{v:'all',l:'All Flights'},{v:'nonstop',l:'Nonstop'},{v:'1stop',l:'1 Stop'},{v:'2plus',l:'2+ Stops'}].map(({v,l}) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="stops" value={v} checked={selectedStops===v}
                        onChange={(e) => setSelectedStops(e.target.value)} className="accent-blue-600" />
                      <span className="text-gray-700">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-8 border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Airlines</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {uniqueAirlines.map((airline) => (
                    <label key={airline} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={selectedAirlines.includes(airline)}
                        onChange={(e) => setSelectedAirlines(e.target.checked
                          ? [...selectedAirlines, airline]
                          : selectedAirlines.filter(a => a !== airline))}
                        className="accent-blue-600" />
                      <span className="text-gray-700 text-sm">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={refundableOnly}
                    onChange={(e) => setRefundableOnly(e.target.checked)} className="accent-blue-600" />
                  <span className="text-gray-700">Refundable Only</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <button onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
              Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex gap-2 flex-wrap">
              {['best','cheapest','fastest','earliest'].map((opt) => (
                <button key={opt} onClick={() => setSortBy(opt)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    sortBy===opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}>
                  {opt.charAt(0).toUpperCase()+opt.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFlights.length > 0 ? filteredFlights.map((flight) => {
                const p = calcPricing(flight.retailPrice);
                const lowSeats = flight.seatsAvailable <= 5;
                return (
                  <div key={flight.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <img src={flight.airlineLogo} alt={flight.airline}
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                            className="w-10 h-10 rounded-full object-contain border border-gray-100 p-0.5"
                          />
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white hidden items-center justify-center font-bold text-sm shrink-0">
                            {flight.airline.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{flight.airline}</p>
                            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{flight.aircraft}</p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <div className="text-center">
                          <p className="font-bold text-lg text-gray-800">{flight.departureTime}</p>
                          <p className="text-sm font-bold text-blue-700">{displayFrom}</p>
                          {displayFromCity && <p className="text-xs text-gray-400">{displayFromCity}</p>}
                        </div>
                        <div className="mx-2 flex-1 min-w-0">
                          <div className="h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                          <p className="text-xs text-gray-500 text-center mt-1">{flight.duration}</p>
                          {flight.stops > 0 && <p className="text-xs text-orange-500 text-center">{flight.stopLabel}</p>}
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg text-gray-800">{flight.arrivalTime}</p>
                          <p className="text-sm font-bold text-blue-700">{displayTo}</p>
                          {displayToCity && <p className="text-xs text-gray-400">{displayToCity}</p>}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-semibold text-gray-800 mb-1">{flight.stopLabel}</p>
                        <p className="text-sm text-gray-500">{flight.baggage}</p>
                        {lowSeats && <p className="text-xs text-red-600 font-semibold mt-1">Only {flight.seatsAvailable} seats left!</p>}
                      </div>

                      <div className="border-l border-gray-200 pl-6">
                        <p className="text-xs text-gray-400 line-through mb-0.5">${p.retailPrice}</p>
                        <p className="text-2xl font-bold text-blue-600">${p.discounted}</p>
                        <p className="text-xs text-green-600 font-semibold mb-3">&#x2705; 47% Member Savings</p>
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="border-b border-gray-100 pb-2">
                            <p className="font-medium text-gray-700">Pay with Cash</p>
                            <p className="font-bold text-gray-900">${p.discounted} + tax</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Pay with Points</p>
                            <p className="text-gray-800">{p.pointsBase.toLocaleString()} Sky Miles</p>
                            <p className="text-xs text-amber-600">&#9888;&#65039; 10% processing fee</p>
                            <p className="text-xs text-gray-500">+ {p.processingFee.toLocaleString()} pts fee</p>
                            <p className="font-bold text-gray-900">{p.totalPoints.toLocaleString()} total</p>
                          </div>
                        </div>
                        <button onClick={() => handleSelect(flight)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500 text-lg">No flights match your filters.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting price range or stop preferences.</p>
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
