import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightPassengers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, from, to, departureDate, adults, children, infants, flightPricing, paymentMethod } = location.state || {};

  const [passengers, setPassengers] = useState(
    Array(adults + children + infants).fill(null).map((_, i) => ({
      type: i < adults ? 'Adult' : i < adults + children ? 'Child' : 'Infant',
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      passportNumber: '',
      knownTravelerNumber: '',
      mealPreference: 'Standard'
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });

  const [addOns, setAddOns] = useState({
    seatSelections: [],
    extraBaggage: false
  });

  // Pricing for add-ons
  const SEAT_PRICE = 15;
  const SEAT_POINTS = 375;
  const BAGGAGE_PRICE = 35;
  const BAGGAGE_POINTS = 875;

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleContactChange = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const handleSeatSelection = (index, seatType) => {
    const newSeats = [...addOns.seatSelections];
    if (!newSeats[index]) {
      newSeats[index] = seatType;
    } else if (newSeats[index] === seatType) {
      newSeats[index] = null;
    } else {
      newSeats[index] = seatType;
    }
    setAddOns({ ...addOns, seatSelections: newSeats });
  };

  const validateForm = () => {
    // Check all passengers have required info
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.dob || !p.gender) {
        alert(`Please fill in all required fields for passenger ${i + 1}`);
        return false;
      }
    }

    // Check contact info
    if (!contactInfo.email || !contactInfo.phone) {
      alert('Please provide contact information');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    navigate('/flight-payment', {
      state: {
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
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Passenger Details</h1>
          <p className="text-gray-600 mt-1">Enter information for each traveler</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form - Main */}
          <div className="lg:col-span-2">
            {/* Passenger Information */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Information</h2>

              <div className="space-y-8">
                {passengers.map((passenger, index) => (
                  <div key={index} className="pb-8 border-b border-gray-200 last:border-0">
                    <p className="text-lg font-bold text-gray-800 mb-6">
                      Passenger {index + 1} - {passenger.type}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                          placeholder="First name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                          placeholder="Last name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date of Birth (MM/DD/YYYY) *
                        </label>
                        <input
                          type="text"
                          value={passenger.dob}
                          onChange={(e) => handlePassengerChange(index, 'dob', e.target.value)}
                          placeholder="MM/DD/YYYY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Passport Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Passport/ID Number
                        </label>
                        <input
                          type="text"
                          value={passenger.passportNumber}
                          onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                          placeholder="Optional"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Known Traveler Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Known Traveler Number (KTN)
                        </label>
                        <input
                          type="text"
                          value={passenger.knownTravelerNumber}
                          onChange={(e) => handlePassengerChange(index, 'knownTravelerNumber', e.target.value)}
                          placeholder="Optional"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Meal Preference */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Meal Preference
                        </label>
                        <select
                          value={passenger.mealPreference}
                          onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                          <option>Standard</option>
                          <option>Vegetarian</option>
                          <option>Vegan</option>
                          <option>Halal</option>
                          <option>Kosher</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add-ons</h2>

              {/* Seat Selection */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Seat Selection</h3>
                <p className="text-gray-600 text-sm mb-4">Add ${SEAT_PRICE} per seat (or {SEAT_POINTS} points)</p>

                <div className="space-y-4">
                  {passengers.map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-3">Passenger {index + 1}</p>
                      <div className="flex gap-3">
                        {['Window', 'Middle', 'Aisle'].map((type) => (
                          <button
                            key={type}
                            onClick={() => handleSeatSelection(index, type)}
                            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                              addOns.seatSelections[index] === type
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Baggage */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Extra Baggage</h3>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all">
                  <input
                    type="checkbox"
                    checked={addOns.extraBaggage}
                    onChange={(e) => setAddOns({ ...addOns, extraBaggage: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Add one extra checked bag</p>
                    <p className="text-gray-600 text-sm">
                      ${BAGGAGE_PRICE} ({BAGGAGE_POINTS} points)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg"
            >
              Continue to Payment
            </button>
          </div>

          {/* Sidebar - Booking Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Summary</h3>

              {/* Flight Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Flight</p>
                <p className="font-semibold text-gray-800">{flight?.airline}</p>
                <p className="text-sm text-gray-600">{flight?.flightNumber}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {from} → {to}
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

              {/* Add-ons Cost */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Add-ons</p>
                <div className="space-y-2 text-sm">
                  {addOns.seatSelections.filter(s => s).length > 0 && (
                    <p className="text-gray-700">
                      {addOns.seatSelections.filter(s => s).length} Seat{addOns.seatSelections.filter(s => s).length !== 1 ? 's' : ''}: +${(SEAT_PRICE * addOns.seatSelections.filter(s => s).length).toFixed(2)}
                    </p>
                  )}
                  {addOns.extraBaggage && (
                    <p className="text-gray-700">Extra Baggage: +${BAGGAGE_PRICE}</p>
                  )}
                  {addOns.seatSelections.filter(s => s).length === 0 && !addOns.extraBaggage && (
                    <p className="text-gray-600">No add-ons selected</p>
                  )}
                </div>
              </div>

              {/* Total Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Flight</span>
                  <span className="font-semibold text-gray-800">${flightPricing?.discountedPrice}</span>
                </div>
                {(addOns.seatSelections.filter(s => s).length > 0 || addOns.extraBaggage) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-semibold text-gray-800">
                      ${(
                        SEAT_PRICE * addOns.seatSelections.filter(s => s).length +
                        (addOns.extraBaggage ? BAGGAGE_PRICE : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">
                    ${(
                      flightPricing?.discountedPrice +
                      SEAT_PRICE * addOns.seatSelections.filter(s => s).length +
                      (addOns.extraBaggage ? BAGGAGE_PRICE : 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPassengers;
