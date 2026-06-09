import { Transition } from "@headlessui/react";
import { useState } from "react";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { FaHome, FaWpforms } from "react-icons/fa";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link, Outlet, useNavigate } from "react-router-dom";
// using text-based Platinum Club title instead of image logo

const UserDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="lg:flex h-screen">
      {/* Sidebar for LG screens */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0 bg-slate-200 h-screen">
        <ul className="menu p-4 text-gray-700 font-bold text-lg">
          <li>
            <Link to="/user-dashboard/user-overview">
              <HiOutlineHomeModern /> Overview
            </Link>
          </li>
          <li>
            <button
              onClick={() => handleMenuItemClick('/user-dashboard/my-bookings')}
            >
              <FaWpforms /> My Bookings
            </button>
          </li>

          <div className="divider"></div>

          <li>
            <button onClick={() => handleMenuItemClick('/')}>
              <FaHome /> Home
            </button>
          </li>
          <li>
            <Link to="resort-input-form">Resort Input Form</Link>
          </li>
        </ul>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden fixed top-0 w-full bg-gray-800 text-white p-4 z-50">
        {/* Dashboard header Section */}
        <div className="flex items-center justify-between ">
          <Link to="/" className="z-20">
            <h1 className="text-2xl font-cormorant font-bold">Platinum Club</h1>
          </Link>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button onClick={toggleMobileMenu} className=" text-xl">
            <BsFillMenuButtonWideFill />
          </button>
        </div>

        <Transition
          show={mobileMenuOpen}
          enter="transition-transform duration-300"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-300"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="bg-gray-200 p-4 absolute top-0 left-0 right-0 mt-12 z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold"></h2>
              <button
                onClick={toggleMobileMenu}
                className="text-2xl text-gray-700"
              >
                <IoMdClose />
              </button>
            </div>
            <ul className="menu text-gray-700 font-bold text-xl">
              <li>
                <button
                  onClick={() =>
                    handleMenuItemClick('/user-dashboard/user-overview')
                  }
                >
                  <HiOutlineHomeModern /> Overview
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    handleMenuItemClick('/user-dashboard/my-bookings')
                  }
                >
                  <FaWpforms /> My Bookings
                </button>
              </li>

              <div className="divider"></div>

              <li>
                <button onClick={() => handleMenuItemClick('/')}>
                  <FaHome /> Home
                </button>
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      {/* Content area */}
      <div className="lg:flex-grow mt-16 lg:mt-0">
        {/* Page content here */}
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;