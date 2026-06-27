import { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { airportsList } from '../../data/flightsData';

const FlightDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, from, to, departureDate, adults, children, infants, flightPricing } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [logoError, setLogoError] = useState(false);

  // Safe fallbacks
  const safeFlight = flight || {};
  const safePricing = flightPricing || {};

  // Airport details
  const fromAirport = airportsList.find(a => a.code === from);
  const toAirport = airportsList.find(a => a.code === to);

  // Pricing calculations
  const basePrice = safePricing.retailPrice || 0;
  const discount = safePricing.discount || 0; // assume discount percentage
  const discountedPrice = safePricing.discountedPrice || basePrice * (1 - discount / 100);
  const pointsRequired = safePricing.pointsRequired || 0;
  const processingFee = safePricing.processingFee || Math.round(pointsRequired * 0.1);
  const totalPoints = safePricing.totalPoints || pointsRequired + processingFee;
  const discountAmount = basePrice - discountedPrice;
  const discountPercent = discount || (basePrice ? ((discountAmount / basePrice) * 100).toFixed(0) : 0);

  // Date formatting
  const formattedDate = departureDate
    ? new Date(departureDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date not specified';

  const handleContinue = () => {
    navigate('/flight-passengers', {
      state: {
        flight: safeFlight,
        from,
        to,
        departureDate,
        adults,
        children,
        infants,
        flightPricing: safePricing,
        paymentMethod,
      },
    });
  };

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-gray-600 text-lg">Flight not found. Please search again.</p>
          <button
            onClick={() => navigate('/flights')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Flight Details</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Review and select your preferred payment method
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Flight Summary</h2>

              {/* Route and Date */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-sm text-gray-600 mb-1">From</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{from || 'N/A'}</p>
                    <p className="text-gray-600 text-sm">{fromAirport?.name || 'Unknown airport'}</p>
                  </div>
                  <FaArrowRight className="text-blue-600 text-xl sm:text-2xl flex-shrink-0" />
                  <div className="flex-1 min-w-[120px] text-right sm:text-left">
                    <p className="text-sm text-gray-600 mb-1">To</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{to || 'N/A'}</p>
                    <p className="text-gray-600 text-sm">{toAirport?.name || 'Unknown airport'}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-3">{formattedDate}</p>
              </div>

              {/* Airline and Flight Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Airline</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {!logoError && safeFlight.airlineLogo ? (
                        <img
                          src={safeFlight.airlineLogo}
                          alt={safeFlight.airline || 'Airline'}
                          className="w-full h-full object-cover"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <span>{safeFlight.airline?.charAt(0) || 'A'}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{safeFlight.airline || 'Unknown'}</p>
                      <p className="text-gray-600 text-sm">{safeFlight.flightNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Aircraft</p>
                  <p className="font-semibold text-gray-800">{safeFlight.aircraft || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Cabin: {safeFlight.cabinClass || 'N/A'}</p>
                </div>
              </div>

              {/* Flight Times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Departure</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {safeFlight.departureTime || '--:--'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Duration</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {safeFlight.duration || '--:--'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Arrival</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">
                    {safeFlight.arrivalTime || '--:--'}
                  </p>
                </div>
              </div>

              {/* Stops and Baggage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Stops</p>
                  <p className="font-semibold text-gray-800">{safeFlight.stopLabel || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-semibold">Baggage</p>
                  <p className="font-semibold text-gray-800">{safeFlight.baggage || 'N/A'}</p>
                </div>
              </div>

              {/* Refund Policy */}
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">Refund Policy</p>
                <div className="flex items-center gap-2">
                  {safeFlight.refundable ? (
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
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Fare Breakdown</h3>

              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Base Fare</span>
                  <span className="font-semibold text-gray-800">
                    ${basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Taxes & Fees</span>
                  <span className="font-semibold text-gray-800">$0 (incl.)</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="text-gray-700">
                      Platinum Club Discount ({discountPercent}%)
                    </span>
                    <span className="font-semibold text-green-600">
                      -${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">Total Price</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
                Select Payment Method
              </h3>

              <div className="space-y-4">
                {/* Cash Payment */}
                <label
                  className={`block border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${
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
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Pay with Cash</p>
                      <p className="text-gray-600 text-sm">Credit or Debit Card</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">
                        ${discountedPrice.toFixed(2)} + tax
                      </p>
                    </div>
                  </div>
                </label>

                {/* Points Payment */}
                <label
                  className={`block border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${
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
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Pay with Sky Miles Points</p>
                      <p className="text-gray-600 text-sm mb-3">Platinum Club Rewards</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          Points needed:{' '}
                          <span className="font-bold">
                            {pointsRequired.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          ⚠️ 10% processing fee applies
                        </p>
                        <p>
                          Fee:{' '}
                          <span className="font-bold text-gray-800">
                            +{processingFee.toLocaleString()} points
                          </span>
                        </p>
                        <p className="text-lg font-bold text-blue-600 pt-2">
                          Total: {totalPoints.toLocaleString()} points
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Summary</h3>

              {/* Flight Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Flight</p>
                <p className="font-semibold text-gray-800">
                  {safeFlight.airline || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">{safeFlight.flightNumber || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {from || '??'} → {to || '??'}
                </p>
                <p className="text-sm text-gray-600">{formattedDate}</p>
              </div>

              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Passengers</p>
                <div className="space-y-1 text-sm">
                  {adults > 0 && (
                    <p className="text-gray-800">
                      {adults} Adult{adults !== 1 ? 's' : ''}
                    </p>
                  )}
                  {children > 0 && (
                    <p className="text-gray-800">
                      {children} Child{children !== 1 ? 'ren' : ''}
                    </p>
                  )}
                  {infants > 0 && (
                    <p className="text-gray-800">
                      {infants} Infant{infants !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold text-gray-800">Included</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span className="text-gray-800">Total</span>
                    <span className="text-blue-600">${discountedPrice.toFixed(2)}</span>
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
                    ? `$${discountedPrice.toFixed(2)}`
                    : `${totalPoints.toLocaleString()} points`}
                </p>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all text-sm sm:text-base"
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