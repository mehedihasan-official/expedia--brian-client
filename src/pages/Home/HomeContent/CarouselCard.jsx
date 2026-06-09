import { useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import airImg from "../../../assets/images/airImg.avif";
import keyImg from "../../../assets/images/keyImg.avif";
import londonBridgeImg from "../../../assets/images/londonBridgeImg.avif";

const CarouselCard = () => {
  // Card data
  const cards = [
    {
      id: 1,
      header: "Cleared for takeoff: Southwest Airlines now on Platinum Club",
      description: "Book flights and save on bundled travel packages",
      image: airImg,
      link: "#",
      bgColor: "from-yellow-400 to-yellow-500",
    },
    {
      id: 2,
      header: "The Annual Vacation Sale has landed",
      description: "Save 25% or more on select hotels worldwide",
      image: londonBridgeImg,
      link: "#",
      bgColor: "from-blue-400 to-blue-500",
    },
    {
      id: 3,
      header: "Earn up to $600 in OneKeyCash™",
      description: "Terms apply. Not redeemable for cash",
      image: keyImg,
      link: "#",
      bgColor: "from-purple-400 to-purple-500",
    },
  ];

  const [currentCard, setCurrentCard] = useState(0);

  // Handle next card
  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  // Handle previous card
  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section className="w-full my-10 lg:my-16">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Discover Amazing Deals
        </h2>
        <p className="text-gray-600 mt-2">
          Exclusive offers and promotions just for you
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons - Desktop Only */}
        {cards.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
              aria-label="Previous card"
            >
              <FaChevronLeft className="text-gray-800 text-lg" />
            </button>

            <button
              onClick={handleNext}
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl hover:bg-gray-50 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
              aria-label="Next card"
            >
              <FaChevronRight className="text-gray-800 text-lg" />
            </button>
          </>
        )}

        {/* Cards Container */}
        <div className="overflow-hidden rounded-2xl">
          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentCard * 100}%)` }}
            >
              {cards.map((card) => (
                <div key={card.id} className="w-full flex-shrink-0 px-2">
                  <a
                    href={card.link}
                    className="block bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className="flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-20`}
                        ></div>
                        <img
                          src={card.image}
                          alt={card.header}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="p-5 bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {card.header}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {card.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold text-sm group">
                          <span>Learn more</span>
                          <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Mobile Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentCard
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Tablet & Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {cards.map((card) => (
              <a
                key={card.id}
                href={card.link}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative h-48 lg:h-56 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                    ></div>
                    <img
                      src={card.image}
                      alt={card.header}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-5 lg:p-6 flex flex-col flex-grow bg-white">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {card.header}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {card.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                      <span>Learn more</span>
                      <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselCard;
