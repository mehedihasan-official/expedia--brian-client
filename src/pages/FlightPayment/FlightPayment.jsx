import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightPayment = () => {
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
    flightPricing,
    paymentMethod,
    passengers,
    contactInfo,
    addOns
  } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add-on pricing
  const SEAT_PRICE = 15;
  const BAGGAGE_PRICE = 35;
  const SEAT_POINTS = 375;
  const BAGGAGE_POINTS = 875;

  // Calculate total amounts
  const seatsCost = SEAT_PRICE * addOns.seatSelections.filter(s => s).length;
  const baggageCost = addOns.extraBaggage ? BAGGAGE_PRICE : 0;
  const addOnsCostTotal = seatsCost + baggageCost;

  const seatsPointsCost = SEAT_POINTS * addOns.seatSelections.filter(s => s).length;
  const baggagePointsCost = addOns.extraBaggage ? BAGGAGE_POINTS : 0;
  const addOnsPointsTotal = seatsPointsCost + baggagePointsCost;

  const flightCashTotal = flightPricing?.discountedPrice + addOnsCostTotal;
  const flightPointsTotal = flightPricing?.totalPoints + addOnsPointsTotal;

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length > 0 ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const validatePayment = () => {
    if (paymentMethod === 'cash') {
      if (!cardNumber || !cardholderName || !expiryDate || !cvv || !billingZip) {
        alert('Please fill in all card details');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return false;
      }
      if (cvv.length !== 3) {
        alert('Please enter a valid 3-digit CVV');
        return false;
      }
    }

    if (!agreeTerms) {
      alert('Please agree to the fare rules and cancellation policy');
      return false;
    }

    return true;
  };

  const handleCompleteBooking = () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const bookingReference = `PC-${new Date().getFullYear()}-${flight.id}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      navigate('/flight-confirmation', {
        state: {
          bookingReference,
          flight,
          from,
          to,
          departureDate,
          adults,
          children,
          infants,
          paymentMethod,
          totalAmount: paymentMethod === 'cash' ? flightCashTotal : flightPointsTotal,
          passengers,
          contactInfo
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Payment</h1>
          <p className="text-gray-600 mt-1">Complete your booking securely</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Form - Main */}
          <div className="lg:col-span-2">
            {paymentMethod === 'cash' ? (
              // Cash Payment Form
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Credit/Debit Card</h2>

                <div className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Billing ZIP */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Billing ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      placeholder="12345"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <FaLock className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Secure Booking</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Your payment information is encrypted and secured. We never share your card details with third parties.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Points Payment Form
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sky Miles Points Payment</h2>

                <div className="space-y-6">
                  {/* Points Balance */}
                  <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <p className="text-gray-600 mb-2">Your Points Balance</p>
                    <p className="text-4xl font-bold text-blue-600">50,000 Points</p>
                    <p className="text-sm text-gray-600 mt-2">Platinum Club Member</p>
                  </div>

                  {/* Points Breakdown */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Points Required for Booking</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">Flight Base Points</span>
                        <span className="font-semibold text-gray-800">{flightPricing?.pointsRequired?.toLocaleString()}</span>
                      </div>

                      {addOnsPointsTotal > 0 && (
                        <>
                          {addOns.seatSelections.filter(s => s).length > 0 && (
                            <div className="flex justify-between pb-3 border-b border-gray-200">
                              <span className="text-gray-700">
                                Seats ({addOns.seatSelections.filter(s => s).length})
                              </span>
                              <span className="font-semibold text-gray-800">{seatsPointsCost.toLocaleString()}</span>
                            </div>
                          )}
                          {addOns.extraBaggage && (
                            <div className="flex justify-between pb-3 border-b border-gray-200">
                              <span className="text-gray-700">Extra Baggage</span>
                              <span className="font-semibold text-gray-800">{baggagePointsCost.toLocaleString()}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex justify-between pb-3 border-b border-gray-200">
                        <span className="text-gray-700">10% Processing Fee</span>
                        <span className="font-semibold text-gray-800">{flightPricing?.processingFee?.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-lg font-bold pt-3">
                        <span className="text-gray-800">Total Points to Deduct</span>
                        <span className="text-blue-600">{flightPointsTotal?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sufficient Balance Check */}
                  {50000 >= flightPointsTotal ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-semibold">✅ You have sufficient points for this booking</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 font-semibold">⚠️ Insufficient Points</p>
                      <p className="text-red-600 text-sm mt-1">
                        You need {(flightPointsTotal - 50000).toLocaleString()} more points
                      </p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <FaLock className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Secure Booking</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Your points will be securely deducted from your Platinum Club account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-5 h-5"
                />
                <span className="text-gray-700">
                  I agree to the <span className="font-semibold">fare rules</span> and <span className="font-semibold">cancellation policy</span>
                </span>
              </label>
            </div>

            {/* Complete Booking Button */}
            <button
              onClick={handleCompleteBooking}
              disabled={isProcessing || (paymentMethod === 'points' && 50000 < flightPointsTotal) || !agreeTerms}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all mt-8 ${
                isProcessing || (paymentMethod === 'points' && 50000 < flightPointsTotal) || !agreeTerms
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Complete Booking'}
            </button>
          </div>

          {/* Sidebar - Booking Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Summary</h3>

              {/* Flight Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Flight</p>
                <p className="font-semibold text-gray-800">{flight?.airline}</p>
                <p className="text-sm text-gray-600">{flight?.flightNumber}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {from} → {to}
                </p>
                <p className="text-sm text-gray-600">
                  {departureDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Passengers</p>
                <div className="space-y-1 text-sm">
                  {passengers?.map((p, i) => (
                    <p key={i} className="text-gray-800">
                      {p.firstName} {p.lastName} ({p.type})
                    </p>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Flight</span>
                  <span className="font-semibold text-gray-800">
                    {paymentMethod === 'cash'
                      ? `$${flightPricing?.discountedPrice}`
                      : `${flightPricing?.totalPoints?.toLocaleString()} pts`}
                  </span>
                </div>

                {addOnsCostTotal > 0 && paymentMethod === 'cash' && (
                  <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold text-gray-800">${addOnsCostTotal.toFixed(2)}</span>
                  </div>
                )}

                {addOnsPointsTotal > 0 && paymentMethod === 'points' && (
                  <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold text-gray-800">{addOnsPointsTotal?.toLocaleString()} pts</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-3">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">
                    {paymentMethod === 'cash'
                      ? `$${flightCashTotal.toFixed(2)}`
                      : `${flightPointsTotal?.toLocaleString()} pts`}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  {paymentMethod === 'cash' ? '✓ Taxes included' : '✓ Processing fee included'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPayment;
