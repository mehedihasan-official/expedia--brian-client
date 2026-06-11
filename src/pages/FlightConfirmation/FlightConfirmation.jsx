import { FaCheckCircle, FaDownload, FaPlane } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    bookingReference,
    flight,
    from,
    to,
    departureDate,
    adults,
    children,
    infants,
    paymentMethod,
    totalAmount,
    passengers,
    contactInfo
  } = location.state || {};

  const handleDownloadItinerary = () => {
    // Placeholder for download functionality
    alert('Itinerary download started. Check your downloads folder.');
  };

  const handleBookAnother = () => {
    navigate('/flight-search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Success Banner */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaCheckCircle className="text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-green-100 text-lg">Your flight has been successfully booked</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Booking Reference */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2 font-semibold">Booking Reference Number</p>
            <p className="text-4xl font-bold text-blue-600">{bookingReference}</p>
            <p className="text-sm text-gray-600 mt-2">Save this reference for your records</p>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(bookingReference);
              alert('Booking reference copied to clipboard');
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all"
          >
            Copy Reference Number
          </button>
        </div>

        {/* Flight Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaPlane className="text-blue-600" />
            Flight Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Departure */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Departure</p>
              <p className="text-2xl font-bold text-gray-800">{from}</p>
              <p className="text-gray-600 mt-1">
                {departureDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-gray-600">{flight?.departureTime}</p>
            </div>

            {/* Arrival */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Arrival</p>
              <p className="text-2xl font-bold text-gray-800">{to}</p>
              <p className="text-gray-600 mt-1">Estimated arrival</p>
              <p className="text-gray-600">{flight?.arrivalTime}</p>
            </div>
          </div>

          {/* Flight Details */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Flight Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Airline</p>
                <p className="font-semibold text-gray-800">{flight?.airline}</p>
                <p className="text-sm text-gray-600">{flight?.flightNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="font-semibold text-gray-800">{flight?.duration}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Aircraft</p>
                <p className="font-semibold text-gray-800">{flight?.aircraft}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stops</p>
                <p className="font-semibold text-gray-800">{flight?.stopLabel}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Baggage</p>
                <p className="font-semibold text-gray-800">{flight?.baggage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Information</h2>

          <div className="space-y-4">
            {passengers?.map((passenger, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{passenger.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Meal: {passenger.mealPreference}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-800">{contactInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold text-gray-800">{contactInfo?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Payment Method</p>
              <p className="text-lg font-semibold text-gray-800">
                {paymentMethod === 'cash' ? 'Credit/Debit Card' : 'Sky Miles Points'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Amount Paid</p>
              <p className="text-2xl font-bold text-blue-600">
                {paymentMethod === 'cash'
                  ? `$${totalAmount?.toFixed(2)}`
                  : `${totalAmount?.toLocaleString()} Points`}
              </p>
            </div>
          </div>

          {/* Booking Date */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">Booking Date</p>
            <p className="font-semibold text-gray-800">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Confirmation Email */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <p className="text-blue-900 font-semibold mb-2">✓ Confirmation Sent</p>
          <p className="text-blue-800">
            A detailed confirmation email has been sent to <span className="font-semibold">{contactInfo?.email}</span>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Please check your inbox and spam folder. You'll need this booking reference for check-in and any changes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleDownloadItinerary}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all"
          >
            <FaDownload />
            Download Itinerary
          </button>

          <button
            onClick={handleBookAnother}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all"
          >
            Book Another Flight
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Next Steps</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">Check In</p>
                <p className="text-gray-600">Online check-in opens 24 hours before departure</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">Arrive at Airport</p>
                <p className="text-gray-600">Please arrive at least 2 hours before departure</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">Board Your Flight</p>
                <p className="text-gray-600">Have your booking reference and ID ready</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-800">Enjoy Your Trip</p>
                <p className="text-gray-600">Thank you for flying with us!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightConfirmation;
