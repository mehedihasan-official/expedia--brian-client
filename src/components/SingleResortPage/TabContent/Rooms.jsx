import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FaBed,
    FaCalendarAlt,
    FaChevronDown,
    FaChevronUp,
    FaCouch,
    FaFilter,
    FaInfoCircle,
    FaMoon,
    FaUser,
} from 'react-icons/fa';
import RoomCard from '../../RoomCard/RoomCard';
import SuiteCard from '../../SuiteCard/SuiteCard';

const Rooms = ({ resort }) => {
  const [dateRange, setDateRange] = useState([
    new Date(),
    new Date(Date.now() + 86400000),
  ]);
  const [travelers, setTravelers] = useState({ rooms: 1, travelers: 2 });
  const [showPricingInfo, setShowPricingInfo] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('1bed');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [startDate, endDate] = dateRange;

  const togglePricingInfo = () => {
    setShowPricingInfo(!showPricingInfo);
  };

  // Format dates for display
  const formatDateForDisplay = date => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate number of nights
  const calculateNights = () => {
    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights === 0 ? 1 : nights;
  };

  const roomTypes = [
    { id: '1bed', label: 'Standard Rooms', icon: FaBed },
    { id: 'suite', label: 'Suites', icon: FaCouch },
  ];

  return (
    <div className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Choose your room
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Select your dates and room type to view availability
          </p>
        </div>

        {/* Search Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
          {/* Date and Traveler Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date Range Picker */}
            <div className="relative md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dates
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-xl p-3 bg-white hover:border-blue-500 focus-within:border-blue-500 transition-colors duration-200 cursor-pointer">
                <FaCalendarAlt className="text-blue-600 text-xl mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    selected={startDate}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    minDate={new Date()}
                    dateFormat="MMM dd, yyyy"
                    className="w-full text-sm font-medium text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                    calendarClassName="custom-calendar"
                  />
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="relative md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guests
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-xl p-3 bg-white hover:border-blue-500 focus-within:border-blue-500 transition-colors duration-200">
                <FaUser className="text-blue-600 text-xl mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={`${travelers.rooms} room, ${travelers.travelers} guests`}
                  readOnly
                  className="w-full text-sm font-medium text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Stay Duration Info */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
            <FaMoon className="text-blue-600" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">
                {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
              </span>
              {' • '}
              <span className="text-gray-600">
                {formatDateForDisplay(startDate)} -{' '}
                {formatDateForDisplay(endDate)}
              </span>
            </p>
          </div>
        </div>

        {/* Price Information Card */}
        <div className="bg-white rounded-2xl shadow-md mb-6 border border-gray-200 overflow-hidden">
          <button
            onClick={togglePricingInfo}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaInfoCircle className="text-green-600 text-lg" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Great value pricing
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Prices are lower than typical for this area
                </p>
              </div>
            </div>
            {showPricingInfo ? (
              <FaChevronUp className="text-gray-400 text-lg flex-shrink-0" />
            ) : (
              <FaChevronDown className="text-gray-400 text-lg flex-shrink-0" />
            )}
          </button>

          {showPricingInfo && (
            <div className="px-4 sm:px-5 pb-5 border-t border-gray-200 bg-gray-50">
              <div className="pt-4 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  We predict nightly prices for properties like this to range
                  between <span className="font-semibold">$173-$260</span>{' '}
                  (before taxes and fees) on our site.
                </p>

                {/* Price Range Visualization */}
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-semibold text-green-600">
                      Best Value
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      Average
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      Higher
                    </span>
                  </div>
                  <div className="relative h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">$139</span>
                    <span className="text-xs text-gray-600">$173</span>
                    <span className="text-xs text-gray-600">$260</span>
                  </div>
                </div>

                <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Learn how we estimate prices
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Room Type Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Room type</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {roomTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedRoomType(type.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    selectedRoomType === type.id
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {selectedRoomType === '1bed' ? 'standard' : 'suite'} rooms
            for your dates
          </p>
        </div>

        {/* Room Cards */}
        <div className="space-y-6">
          {selectedRoomType === '1bed' ? (
            <RoomCard
              resort={resort}
              startDate={startDate}
              endDate={endDate}
              nights={calculateNights()}
              travelers={travelers}
            />
          ) : (
            <>
              <SuiteCard
                resort={resort}
                startDate={startDate}
                endDate={endDate}
                travelers={travelers}
                nights={calculateNights()}
                title="Deluxe Suite"
                amount={59}
                imageUrl={
                  resort?.suiteImages?.deluxe ||
                  'https://via.placeholder.com/300x200?text=Deluxe+Suite'
                }
                description="Luxurious suite with premium amenities and stunning views"
                sleeps={2}
                size="350 sq ft"
              />

              <SuiteCard
                resort={resort}
                startDate={startDate}
                endDate={endDate}
                travelers={travelers}
                nights={calculateNights()}
                title="Family Deluxe Suite"
                amount={79}
                imageUrl={
                  resort?.suiteImages?.family ||
                  'https://via.placeholder.com/300x200?text=Family+Suite'
                }
                description="Spacious suite perfect for families with extra sleeping areas"
                sleeps={4}
                size="500 sq ft"
              />

              <SuiteCard
                resort={resort}
                startDate={startDate}
                endDate={endDate}
                travelers={travelers}
                nights={calculateNights()}
                title="Presidential Suite"
                amount={129}
                imageUrl={
                  resort?.suiteImages?.presidential ||
                  'https://via.placeholder.com/300x200?text=Presidential+Suite'
                }
                description="Ultimate luxury suite with separate living area and panoramic views"
                sleeps={4}
                size="800 sq ft"
              />
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FaInfoCircle className="text-blue-600 text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                Need help choosing?
              </h3>
              <p className="text-sm text-gray-700">
                Our travel specialists are available 24/7 to help you find the
                perfect room for your stay.
              </p>
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
              Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
