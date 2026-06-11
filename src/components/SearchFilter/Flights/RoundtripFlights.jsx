import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RoundtripFlights = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState({
    leavingFrom: '',
    goingTo: ''
  });

  const [dates, setDates] = useState({
    departure: null,
    return: null
  });

  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  const [options, setOptions] = useState({
    addStay: false,
    addCar: false
  });

  const handleLocationChange = (field, value) => {
    setLocations((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field, value) => {
    setDates((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTravelerChange = (field, value) => {
    setTravelers((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleOptionChange = (field) => {
    setOptions((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSearch = () => {
    if (!locations.leavingFrom || !locations.goingTo || !dates.departure || !dates.return) {
      alert('Please fill in all required fields.');
      return;
    }

    if (dates.return < dates.departure) {
      alert('Return date cannot be before departure date.');
      return;
    }

    const searchParams = {
      from: locations.leavingFrom,
      to: locations.goingTo,
      departureDate: dates.departure,
      returnDate: dates.return,
      travelers,
      ...options
    };

    console.log('Search Params:', searchParams);

    navigate('/flight-results', { state: searchParams });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Leaving From */}
      <InputWithIcon
        icon={<FaMapMarkerAlt className="text-gray-500 text-lg mr-3" />}
        label="Leaving from"
        id="leavingFrom"
        value={locations.leavingFrom}
        onChange={(e) => handleLocationChange('leavingFrom', e.target.value)}
        placeholder="City or Airport"
      />

      {/* Going To */}
      <InputWithIcon
        icon={<FaMapMarkerAlt className="text-gray-500 text-lg mr-3" />}
        label="Going to"
        id="goingTo"
        value={locations.goingTo}
        onChange={(e) => handleLocationChange('goingTo', e.target.value)}
        placeholder="City or Airport"
      />

      {/* Departure Date */}
      <DateInput
        label="Departure Date"
        id="departureDate"
        selected={dates.departure}
        onChange={(date) => handleDateChange('departure', date)}
        minDate={new Date()}
      />

      {/* Return Date */}
      <DateInput
        label="Return Date"
        id="returnDate"
        selected={dates.return}
        onChange={(date) => handleDateChange('return', date)}
        minDate={dates.departure || new Date()}
      />

      {/* Travelers Input */}
      <div className="flex flex-col gap-2">
        <TravelerInput
          label="Adults"
          value={travelers.adults}
          onChange={(e) => handleTravelerChange('adults', e.target.value)}
        />
        <TravelerInput
          label="Children"
          value={travelers.children}
          onChange={(e) => handleTravelerChange('children', e.target.value)}
        />
        <TravelerInput
          label="Infants"
          value={travelers.infants}
          onChange={(e) => handleTravelerChange('infants', e.target.value)}
        />
      </div>

      {/* Add-ons */}
      <div className="flex flex-wrap gap-4 mt-2">
        <Checkbox
          label="Add a place to stay"
          checked={options.addStay}
          onChange={() => handleOptionChange('addStay')}
        />
        <Checkbox
          label="Add a car"
          checked={options.addCar}
          onChange={() => handleOptionChange('addCar')}
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Search Flights
      </button>
    </div>
  );
};

// Input with Icon
const InputWithIcon = ({ icon, label, id, value, onChange, placeholder }) => (
  <div className="flex items-center w-full border border-gray-300 rounded-lg p-2 md:p-3 bg-gray-50 hover:bg-gray-100">
    {icon}
    <div className="flex flex-col text-left w-full">
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-sm text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
      />
    </div>
  </div>
);

// Date Input
const DateInput = ({ label, id, selected, onChange, minDate }) => (
  <div className="flex items-center w-full border border-gray-300 rounded-lg p-2 md:p-3 bg-gray-50 hover:bg-gray-100">
    <FaCalendarAlt className="text-gray-500 text-lg mr-3" />
    <div className="flex flex-col text-left w-full">
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">
        {label}
      </label>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        className="w-full text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer"
        dateFormat="MMM d, yyyy"
        placeholderText="Select date"
      />
    </div>
  </div>
);

// Checkbox
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    {label}
  </label>
);

// Traveler Number Input
const TravelerInput = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
    <label className="text-sm text-gray-700">{label}</label>
    <input
      type="number"
      min="0"
      value={value}
      onChange={onChange}
      className="w-16 text-right text-sm bg-transparent focus:outline-none"
    />
  </div>
);

export default RoundtripFlights;
