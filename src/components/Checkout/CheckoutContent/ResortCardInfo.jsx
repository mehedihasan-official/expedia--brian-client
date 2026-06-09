import React from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ResortCardInfo = ({ resort, room, dates }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showSpecialRequests, setShowSpecialRequests] = React.useState(false);
  const [specialRequests, setSpecialRequests] = React.useState("");

  // Prepare images array
  const images = [resort.img, resort.img2, resort.img3].filter(Boolean);

  // Date functions
  const checkIn = dates?.start ? new Date(dates.start) : new Date();
  const checkOut = dates?.end
    ? new Date(dates.end)
    : new Date(new Date().getTime() + 86400000);
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Generate random rating (7-10)
  const rating = Math.floor(Math.random() * 4) + 7;
  const ratingText =
    rating >= 9 ? "Wonderful" : rating >= 8 ? "Excellent" : "Very Good";

  // Image slider functions
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Slider */}
      {images.length > 0 && (
        <div className="relative h-48 md:h-64 bg-gray-200">
          <img
            src={images[currentImageIndex]}
            alt={resort.place_name}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronRight />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white bg-opacity-50"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800">{resort.place_name}</h2>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-bold mr-2">
            {rating.toFixed(1)}
          </div>
          <span className="font-medium">{ratingText}</span>
          <span className="text-gray-500 text-sm ml-2">
            ({resort.reviews_amount} reviews)
          </span>
        </div>

        <div className="divider my-3" />

        {/* Room Info */}
        <div className="space-y-2">
          <p className="font-medium">
            ${resort.room_details.privacy_room_amount} • {room.type}
          </p>
          <p className="text-gray-600">
            {room.bed} • Sleeps {room.sleeps}
          </p>
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                {formatDate(checkIn)}
              </p>
              <p className="text-sm text-gray-500 mt-1">After 3:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                {formatDate(checkOut)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Before 11:00 AM</p>
            </div>
          </div>
        </div>

        <div className="divider my-3" />

        {/* VIP Access */}
        <div className="flex items-start">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-bold mr-3">
            VIP
          </span>
          <p className="text-gray-700 flex-1">
            Expect outstanding service at this top-rated VIP Access stay.
          </p>
        </div>

        <div className="divider my-3" />

        {/* Special Requests */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowSpecialRequests(!showSpecialRequests)}
        >
          <p className="font-medium">
            Special/Accessibility requests (optional)
          </p>
          <FaChevronRight
            className={`transition-transform ${
              showSpecialRequests ? "rotate-90" : ""
            }`}
          />
        </div>

        {showSpecialRequests && (
          <div className="mt-3">
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Enter any special requests..."
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResortCardInfo;