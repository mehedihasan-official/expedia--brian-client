import { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { airportsList } from '../../data/flightsData';

const FlightDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    flight,
    from,
    to,
    departureDate,
    adults,
    children,
    infants,
    flightPricing: passedPricing
  } = location.state || {};

  // -------------------------------------------------------------
  // FALLBACK FOR MISSING flightPricing (prevents blank prices)
  // -------------------------------------------------------------
  const flightPricing = passedPricing || (flight && flight.price
    ? {
        retailPrice: flight.price,
        discountedPrice: flight.price,
        pointsRequired: 0,
        processingFee: 0,
        totalPoints: 0
      }
    : {
        retailPrice: 0,
        discountedPrice: 0,
        pointsRequired: 0,
        processingFee: 0,
        totalPoints: 0
      });

  const [paymentMethod, setPaymentMethod] = useState('cash');

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Flight not found. Please search again.</p>
      </div>
    );
  }

  const fromAirport = airportsList.find(a => a.code === from);
  const toAirport = airportsList.find(a => a.code === to);

  const handleContinue = () => {
    navigate('/flight-passengers', {
      state: {
        flight,
        from,
        to,
        departureDate,
        adults,
        children,
        infants,
        flightPricing,
        paymentMethod
      }
    });
  };

  // Format numbers safely
  const format = (num) => (num ?? 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Flight Details</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Review and select your preferred payment method</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Left Column - Flight Details & Payment */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">

            {/* Flight Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Flight Summary</h2>

              {/* Route and Date */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">From</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">{from}</p>
                    <p className="text-gray-600 text-sm">{fromAirport?.name}</p>
                  </div>
                  <FaArrowRight className="text-blue-600 text-xl md:text-2xl shrink-0 mx-2" />
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">To</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">{to}</p>
                    <p className="text-gray-600 text-sm">{toAirport?.name}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  {departureDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Airline and Flight Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Airline</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airline}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline-flex';
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                    <div style={{ display: 'none' }} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {flight.airline.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{flight.airline}</p>
                      <p className="text-gray-600 text-sm">{flight.flightNumber}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Aircraft</p>
                  <p className="font-semibold text-gray-800">{flight.aircraft}</p>
                  <p className="text-gray-600 text-sm">Cabin: {flight.cabinClass}</p>
                </div>
              </div>

              {/* Flight Times */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Departure</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">{flight.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Duration</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">{flight.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Arrival</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">{flight.arrivalTime}</p>
                </div>
              </div>

              {/* Stops and Baggage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Stops</p>
                  <p className="font-semibold text-gray-800">{flight.stopLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Baggage</p>
                  <p className="font-semibold text-gray-800">{flight.baggage}</p>
                </div>
              </div>

              {/* Refund Policy */}
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Refund Policy</p>
                <div className="flex items-center gap-2">
                  {flight.refundable ? (
                    <>
                      <FaCheckCircle className="text-green-600 text-lg" />
                      <p className="font-semibold text-green-600">Refundable</p>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-600 text-lg" />
                      <p className="font-semibold text-red-600">Non-Refundable</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Fare Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Base Fare</span>
                  <span className="font-semibold text-gray-800">${format(flightPricing.retailPrice)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Taxes & Fees</span>
                  <span className="font-semibold text-gray-800">$0 (incl.)</span>
                </div>
                {flightPricing.retailPrice !== flightPricing.discountedPrice && (
                  <div className="flex justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-700">Platinum Club Discount (47%)</span>
                    <span className="font-semibold text-green-600">
                      -${format(flightPricing.retailPrice - flightPricing.discountedPrice)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <span className="text-lg font-bold text-gray-800">Total Price</span>
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    ${format(flightPricing.discountedPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Select Payment Method</h3>
              <div className="space-y-4">
                {/* Cash Payment */}
                <label
                  className={`border-2 rounded-lg p-4 md:p-6 cursor-pointer transition-all block ${
                    paymentMethod === 'cash'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-blue-600 min-w-[16px]"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm md:text-base">Pay with Cash</p>
                      <p className="text-gray-600 text-xs md:text-sm">Credit or Debit Card</p>
                      <p className="text-lg md:text-2xl font-bold text-blue-600 mt-2">
                        ${format(flightPricing.discountedPrice)} + tax
                      </p>
                    </div>
                  </div>
                </label>

                {/* Points Payment */}
                <label
                  className={`border-2 rounded-lg p-4 md:p-6 cursor-pointer transition-all block ${
                    paymentMethod === 'points'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="points"
                      checked={paymentMethod === 'points'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-blue-600 min-w-[16px]"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm md:text-base">Pay with Sky Miles Points</p>
                      <p className="text-gray-600 text-xs md:text-sm mb-3">Platinum Club Rewards</p>
                      <div className="space-y-2 text-sm">
                        <p>Points needed: <span className="font-bold">{flightPricing.pointsRequired?.toLocaleString() ?? 0}</span></p>
                        <p className="text-gray-600">⚠️ 10% processing fee applies</p>
                        <p>Fee: <span className="font-bold text-gray-800">+{flightPricing.processingFee?.toLocaleString() ?? 0} points</span></p>
                        <p className="text-lg font-bold text-blue-600 pt-2">
                          Total: {(flightPricing.totalPoints ?? 0).toLocaleString()} points
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary (mobile friendly) */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Summary</h3>

              {/* Flight Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Flight</p>
                <p className="font-semibold text-gray-800">{flight.airline}</p>
                <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                <p className="text-sm text-gray-600 mt-2">{from} → {to}</p>
                <p className="text-sm text-gray-600">
                  {departureDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Passengers</p>
                <div className="space-y-1 text-sm">
                  {adults > 0 && <p className="text-gray-800">{adults} Adult{adults !== 1 ? 's' : ''}</p>}
                  {children > 0 && <p className="text-gray-800">{children} Child{children !== 1 ? 'ren' : ''}</p>}
                  {infants > 0 && <p className="text-gray-800">{infants} Infant{infants !== 1 ? 's' : ''}</p>}
                </div>
              </div>

              {/* Pricing Summary – now mirrors Fare Breakdown */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold text-gray-800">${format(flightPricing.retailPrice)}</span>
                  </div>
                  {flightPricing.retailPrice !== flightPricing.discountedPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platinum Discount</span>
                      <span className="font-semibold text-green-600">
                        -${format(flightPricing.retailPrice - flightPricing.discountedPrice)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold text-gray-800">Included</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span className="text-gray-800">Total</span>
                    <span className="text-blue-600">${format(flightPricing.discountedPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                <p className="font-semibold text-gray-800">
                  {paymentMethod === 'cash' ? 'Credit/Debit Card' : 'Sky Miles Points'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {paymentMethod === 'cash'
                    ? `$${format(flightPricing.discountedPrice)}`
                    : `${(flightPricing.totalPoints ?? 0).toLocaleString()} points`}
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                Continue to Passenger Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;