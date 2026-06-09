import { useContext, useState } from "react";
import {
  FaBed,
  FaBox,
  FaCar,
  FaCheck,
  FaGift,
  FaMapMarkerAlt,
  FaPercent,
  FaPlane,
  FaShip,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import bannerImg1 from "../../assets/images/banner-img-1.avif";
import bannerImg2 from "../../assets/images/banner-img-2.avif";
import KeyImg from "../../assets/images/Key.avif";
import icon1 from "../../assets/images/onekey__standard__always_light.svg";
import Cars from "../../components/SearchFilter/Cars/Cars";
import Cruises from "../../components/SearchFilter/Cruises";
import Flights from "../../components/SearchFilter/Flights/Flights";
import Packages from "../../components/SearchFilter/Packages";
import Stays from "../../components/SearchFilter/Stays";
import ThingsToDo from "../../components/SearchFilter/ThingsToDo";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import AnnualVacation from "./HomeContent/AnnualVacation";
import CarouselCard from "./HomeContent/CarouselCard";
import RecommendedStays from "./HomeContent/RecommendedStays";

const Home = () => {
  const [activeFilter, setActiveFilter] = useState("Stays");
  const { resortData } = useContext(AuthContext);

  const filters = [
    { name: "Stays", icon: FaBed },
    { name: "Flights", icon: FaPlane },
    { name: "Cars", icon: FaCar },
    { name: "Packages", icon: FaBox },
    { name: "Things to do", icon: FaMapMarkerAlt },
    { name: "Cruises", icon: FaShip },
  ];

  // Render the corresponding filter content based on the active filter
  const renderFilterContent = () => {
    switch (activeFilter) {
      case "Stays":
        return <Stays />;
      case "Flights":
        return <Flights />;
      case "Cars":
        return <Cars />;
      case "Packages":
        return <Packages />;
      case "Things to do":
        return <ThingsToDo />;
      case "Cruises":
        return <Cruises />;
      default:
        return <Stays />;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section with Search - Platinum Club Style */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "500px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          {/* Hero Text */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Your Next Vacation Starts Here
            </h1>
            <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto">
              Book hotels, flights, cruises, and experiences while maximizing the value of your vacation ownership.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-5xl mx-auto">
            {/* Desktop Navigation */}
            <div className="hidden md:flex bg-white/10 backdrop-blur-sm rounded-t-xl p-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.name}
                    onClick={() => setActiveFilter(filter.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                      activeFilter === filter.name
                        ? "bg-white text-blue-600 font-semibold shadow-lg"
                        : "text-white hover:bg-white/20"
                    }`}
                    aria-label={`Filter by ${filter.name}`}
                  >
                    <Icon className="text-lg" />
                    <span className="text-sm lg:text-base">{filter.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-t-xl p-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.name}
                      onClick={() => setActiveFilter(filter.name)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all duration-200 ${
                        activeFilter === filter.name
                          ? "bg-white text-blue-600 font-semibold shadow-lg"
                          : "text-white hover:bg-white/20"
                      }`}
                      aria-label={`Filter by ${filter.name}`}
                    >
                      <Icon className="text-base" />
                      <span className="text-sm">{filter.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Form Card */}
            <div className="bg-white rounded-b-xl shadow-2xl p-4 sm:p-6 lg:p-8">
              {renderFilterContent()}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* OneKey Membership Banner - Platinum Club Style */}
          <section className="mb-10 lg:mb-16">
            <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  {/* Left Content */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-1">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl shadow-lg">
                      <img
                        src={icon1}
                        className="w-16 h-16 lg:w-20 lg:h-20"
                        alt="OneKey Logo"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                        Members get our best prices
                      </h2>
                      <div className="space-y-2 text-blue-100">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <FaCheck className="text-green-400" />
                          <span className="text-sm lg:text-base">
                            Save 10% or more on 100,000+ hotels
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <FaCheck className="text-green-400" />
                          <span className="text-sm lg:text-base">
                            Earn rewards on every booking
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <FaCheck className="text-green-400" />
                          <span className="text-sm lg:text-base">
                            Free to join
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Link to="/signin" className="w-full sm:w-auto">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base lg:text-lg font-bold text-[#1a1a2e] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Sign in
                      </button>
                    </Link>
                    <Link to="/register" className="w-full sm:w-auto">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full text-base lg:text-lg font-semibold text-white bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-200"
                      >
                        Join free
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Offers Banner */}
          <section className="mb-10 lg:mb-16">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Text Content */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 md:order-1 text-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-3xl" />
                      <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Limited Time
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                      The Annual Vacation Sale: Save 25%+
                    </h2>
                    <p className="text-base lg:text-lg leading-relaxed text-white/95">
                      Members save 25% or more on select hotels until Mar 31.
                      Book now and travel later with flexible cancellation.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaGift className="text-yellow-300" />
                        <span className="text-sm font-semibold">
                          Member Exclusive
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaStar className="text-yellow-300" />
                        <span className="text-sm font-semibold">
                          Free Cancellation
                        </span>
                      </div>
                    </div>
                    <Link to="/" className="inline-block mt-4">
                      <button
                        type="button"
                        className="px-8 py-3.5 rounded-full text-base lg:text-lg font-bold text-red-600 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Unlock vacation deals
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="order-1 md:order-2 h-64 sm:h-80 md:h-auto">
                  <img
                    src={bannerImg1}
                    alt="Vacation destination"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Promotional Cards Carousel */}
          <section className="mb-10 lg:mb-16">
            <CarouselCard />
          </section>

          {/* Annual Vacation resortData Showcase */}
          <section className="mb-10 lg:mb-16">
            <AnnualVacation resortData={resortData} />
          </section>

          {/* Recommended Stays */}
          <section className="mb-10 lg:mb-16">
            <RecommendedStays />
          </section>

          {/* Rewards Program Banner */}
          <section className="mb-10 lg:mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image with Key Overlay */}
                <div className="relative h-64 sm:h-80 md:h-auto bg-gradient-to-br from-blue-600 to-purple-600">
                  <img
                    src={bannerImg2}
                    alt="OneKeyCash promotion"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={KeyImg}
                      alt="OneKey"
                      className="w-32 sm:w-40 lg:w-56 drop-shadow-2xl animate-pulse"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col justify-center">
                  <div className="space-y-5">
                    <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      ✨ New Reward Program
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      Earn up to $600 in OneKeyCash™
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaCheck className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Earn on every booking
                          </p>
                          <p className="text-sm text-gray-600">
                            Get rewards on hotels, flights, and more
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaGift className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Redeem instantly
                          </p>
                          <p className="text-sm text-gray-600">
                            Use your cash on your next trip
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      *Terms apply. OneKeyCash is not redeemable for cash.
                    </p>
                    <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Learn more about rewards
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Section - Platinum Club Style */}
          <section className="mb-10 lg:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Why book with us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join millions of travelers who trust us for their booking needs
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPercent className="text-blue-600 text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">Best Price Guarantee</h3>
                <p className="text-sm text-gray-600">
                  Find it cheaper? We'll refund the difference
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  24/7 Customer Support
                </h3>
                <p className="text-sm text-gray-600">
                  We're here to help, anytime you need us
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-purple-600 text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">Free Cancellation</h3>
                <p className="text-sm text-gray-600">
                  On most hotels, change plans anytime
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGift className="text-orange-600 text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2">Earn Rewards</h3>
                <p className="text-sm text-gray-600">
                  Get cash back on every booking you make
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
