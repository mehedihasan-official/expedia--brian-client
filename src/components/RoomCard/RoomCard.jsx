import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

const RoomCard = ({ resort, startDate, endDate, nights, travelers }) => {
  const { _id, img2, img3, room_details } = resort;
  const {
    sleeps_room,
    bath,
    kitchen,
  } = room_details;

  // State for selected extra
  const [selectedExtra, setSelectedExtra] = useState("no-extras");
  const { user } = useContext(AuthContext);

  // Pricing
  const basePricePerNight = 59;
  const breakfastPricePerNight = 15;
  const pointsLabel = "5,000 Points";
  
  const basePrice = basePricePerNight * nights;
  const breakfastPrice = selectedExtra === "Breakfast" ? breakfastPricePerNight * nights : 0;
  const totalPrice = basePrice + breakfastPrice;

  // Format dates for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate cancellation date (7 days before start date)
  const cancellationDate = startDate ? new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000) : null;

  const navigate = useNavigate();

  const handleReserveClick = () => {
    const reservationData = {
      resort,
      dates: {
        start: startDate,
        end: endDate,
        nights: nights
      },
      guests: travelers,
      room: {
        type: "King Room",
        sleeps: sleeps_room,
        size: "151 sq ft",
        bed: "1 King Bed",
        amenities: {
          wifi: true,
          kitchen: kitchen,
          bath: bath
        }
      },
      pricing: {
        basePrice: basePrice,
        extras: breakfastPrice,
        totalPrice: totalPrice
      },
      selectedExtra: selectedExtra
    };

    if (!user) {
      navigate('/signin', { 
        state: { 
          from: `/singleResortPage/${_id}`, 
          reservationData,
          returnPath: '/payment'
        } 
      });
    } else {
      navigate('/payment', { state: { reservationData } });
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <img
        src={img2 || img3}
        alt="Room"
        className="w-full h-48 object-cover"
      />

      {/* Card Content */}
      <div className="p-4">
        {/* Selected Dates */}
        {startDate && endDate && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800">
              {formatDate(startDate)} - {formatDate(endDate)} ({nights} {nights === 1 ? 'night' : 'nights'})
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {travelers.travelers} {travelers.travelers === 1 ? 'traveler' : 'travelers'} • {travelers.rooms} {travelers.rooms === 1 ? 'room' : 'rooms'}
            </p>
          </div>
        )}

        {/* Title and Rating */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Standard Room</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Rating:</span>
            <span className="text-sm font-semibold text-blue-600">
              9.0 Wonderful
            </span>
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📌</span>
            <span>151 sq ft</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📍</span>
            <span>Sleeps {sleeps_room}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📎</span>
            <span>1 Bed</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">✓</span>
            <span>Free cancellation</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">☞</span>
            <span>Free WiFi</span>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="mt-4">
          <p className="text-sm text-green-600 font-medium">Fully refundable</p>
          {cancellationDate && (
            <p className="text-sm text-gray-600">Before {formatDate(cancellationDate)}</p>
          )}
        </div>

        <div className='divider w-full'></div>

        {/* Extras Section */}
        {/* <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Extras</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="extras"
                  value="no-extras"
                  checked={selectedExtra === "no-extras"}
                  onChange={() => setSelectedExtra("no-extras")}
                  className="mr-2"
                />
                <span>No extras</span>
              </label>
              <span className="text-green-600">+$0</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="extras"
                  value="Breakfast"
                  checked={selectedExtra === "Breakfast"}
                  onChange={() => setSelectedExtra("Breakfast")}
                  className="mr-2"
                />
                <span>Breakfast (daily)</span>
              </label>
              <span className="text-green-600">+${breakfastPricePerNight}/night</span>
            </div>
          </div>
        </div> */}

        {/* Price Breakdown */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>${basePricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
            <span>${basePrice}</span>
          </div>
          {/* {selectedExtra === "Breakfast" && (
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Breakfast × {nights} {nights === 1 ? 'day' : 'days'}</span>
              <span>${breakfastPrice}</span>
            </div>
          )} */}
          <div className="flex justify-between font-semibold text-gray-800 mt-3 pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Standard Room: <span className="font-semibold">$59.00 + tax</span> • {pointsLabel}
          </p>
        </div>

        {/* Reserve Button */}
        <button 
          onClick={handleReserveClick}
          className="w-full bg-[#1668e3] text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all duration-300 mt-6"
        >
          Select Room
        </button>

        {/* Note */}
        {cancellationDate && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            You won't be charged yet. Free cancellation until {formatDate(cancellationDate)}.
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomCard;