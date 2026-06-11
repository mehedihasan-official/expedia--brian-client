import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
// using text-based Platinum Club title instead of image logo

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          {/* Logo Section */}
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <img
                src="/PlatinumClub%20-%20Copy.jpeg"
                alt="Platinum Club"
                className="w-10 w-auto md:w-40"
              />
            </div>
            <p className="text-slate-600 text-sm max-w-md text-center lg:text-left mx-auto lg:mx-0">
              Your trusted partner for unforgettable travel experiences around
              the world. Discover, explore, and create memories that last a
              lifetime.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
            {/* About Section */}
            <div>
              <h3 className="text-slate-900 font-semibold text-base mb-4 relative inline-block">
                About Us
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-600"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/about"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Our Story
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Careers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Press
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Blog
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Explore Section */}
            <div>
              <h3 className="text-slate-900 font-semibold text-base mb-4 relative inline-block">
                Explore
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-600"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/flights"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Flights
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/hotels"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Hotels
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/car-rentals"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Car Rentals
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/activities"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Activities
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-slate-900 font-semibold text-base mb-4 relative inline-block">
                Support
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-600"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/help"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Help Center
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Contact Us
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      FAQs
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Terms of Service
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-slate-900 font-semibold text-base mb-4 relative inline-block">
                Follow Us
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-blue-600"></span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600 hover:text-white hover:bg-sky-500 transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-slate-600 hover:text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
              </div>

              {/* Newsletter Section */}
              <div className="mt-6">
                <p className="text-slate-600 text-xs mb-3">
                  Subscribe to our newsletter
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-slate-600 text-xs text-center lg:text-left">
              <p className="mb-2 lg:mb-1">
                © {new Date().getFullYear()} Platinum Club. All rights reserved.
              </p>
              <p className="text-slate-500">
                Platinum Club and the Platinum Club Logo are trademarks or
                registered trademarks of Platinum Club. CST# 2029030-50.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 text-xs">
              <a
                href="/privacy"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
              >
                Privacy Policy
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/terms"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
              >
                Terms of Use
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/cookies"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
