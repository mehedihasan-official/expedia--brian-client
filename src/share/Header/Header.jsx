import { useContext, useEffect, useRef, useState } from "react";
import {
  FaBed,
  FaCar,
  FaGift,
  FaPlane,
  FaShip,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { MdClose, MdKeyboardArrowDown, MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";
// logo image removed; using text-based site title with Cormorant Garamond

import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isShopTravelOpen, setShopTravelOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useContext(AuthContext);

  const shopTravelRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shopTravelRef.current &&
        !shopTravelRef.current.contains(event.target)
      ) {
        setShopTravelOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleShopTravel = () => {
    setShopTravelOpen((prev) => !prev);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    setShopTravelOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const shopTravelItems = [
    { to: "/stays", icon: FaBed, label: "Stays", color: "text-blue-600" },
    { to: "/flights", icon: FaPlane, label: "Flights", color: "text-sky-600" },
    { to: "/cars", icon: FaCar, label: "Cars", color: "text-green-600" },
    {
      to: "/packages",
      icon: FaGift,
      label: "Packages",
      color: "text-purple-600",
    },
    {
      to: "/things-to-do",
      icon: FaUmbrellaBeach,
      label: "Things to Do",
      color: "text-orange-600",
    },
    { to: "/cruises", icon: FaShip, label: "Cruises", color: "text-teal-600" },
  ];

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section: Logo and Shop Travel */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Logo */}
              <Link
                to="/"
                className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
              >
                <img
                  src="/PlatinumClub%20-%20Copy.jpeg"
                  alt="Platinum Club"
                  className="h-auto w-14 md:w-40"
                />
              </Link>

              {/* Shop Travel Dropdown (Desktop Only) */}
              <div className="hidden lg:block relative" ref={shopTravelRef}>
                <button
                  onClick={toggleShopTravel}
                  className="flex items-center gap-1 px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors duration-200 rounded-lg hover:bg-blue-50"
                >
                  Shop Travel
                  <MdKeyboardArrowDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      isShopTravelOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Shop Travel Dropdown Menu */}
                {isShopTravelOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-3 w-72 border border-slate-100 opacity-0 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2">
                      {shopTravelItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 p-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                          onClick={() => setShopTravelOpen(false)}
                        >
                          <item.icon
                            className={`${item.color} text-xl group-hover:scale-110 transition-transform duration-200`}
                          />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link
                to="/get-the-app"
                className="flex items-center gap-2 px-3 xl:px-4 py-2 text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 rounded-lg hover:bg-blue-50 whitespace-nowrap"
              >
                <IoMdDownload size={18} />
                <span>Get the App</span>
              </Link>

              <Link
                to="/hotels"
                className="px-3 xl:px-4 py-2 text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 rounded-lg hover:bg-blue-50 whitespace-nowrap"
              >
                Hotels
              </Link>

              <Link
                to="/list-your-property"
                className="px-3 xl:px-4 py-2 text-slate-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 rounded-lg hover:bg-blue-50 whitespace-nowrap"
              >
                List your property
              </Link>

              {/* User Menu Button (Desktop) */}
              <UserMenu
                user={user}
                isUserMenuOpen={isUserMenuOpen}
                setUserMenuOpen={setUserMenuOpen}
                userMenuRef={userMenuRef}
                toggleUserMenu={toggleUserMenu}
              />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Slide-in Panel */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        toggleUserMenu={toggleUserMenu}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        shopTravelItems={shopTravelItems}
      />

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
