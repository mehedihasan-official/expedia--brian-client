import { createBrowserRouter } from "react-router-dom";
import CarSearch from "../components/CarSearch/CarSearch";
import Checkout from "../components/Checkout/Checkout";
import ConfirmBooking from "../components/ConfirmBooking/ConfirmBooking";
import CruiseSearch from "../components/CruiseSearch/CruiseSearch";
import FlightSearch from "../components/FlightSearch/FlightSearch";
import FlightType from "../components/FlightType/FlightType";
import HotelSearch from "../components/HotelSearch/HotelSearch";
import NotFound from "../components/NotFound/NotFound";
import Payment from "../components/Payment/Payment";
import SingleResortPage from "../components/SingleResortPage/SingleResortPage";
import AdminPanel from "../layout/AdminPanel/AdminPanel";
import Main from "../layout/Main/Main";
import UserDashboard from "../layout/UserDashboard/UserDashboard";
import Account from "../pages/Account/Account";
import AdminControl from "../pages/AdminControl/AdminControl";
import AdminOverview from "../pages/AdminOverview/AdminOverview";
import Communications from "../pages/Communications/Communications";
import FlightConfirmation from "../pages/FlightConfirmation/FlightConfirmation";
import FlightDetail from "../pages/FlightDetail/FlightDetail";
import FlightPassengers from "../pages/FlightPassengers/FlightPassengers";
import FlightPayment from "../pages/FlightPayment/FlightPayment";
import FlightResults from "../pages/FlightResults/FlightResults";
import Home from "../pages/Home/Home";
import Hotels from "../pages/Hotels/Hotels";
import MyBookings from "../pages/MyBookings/MyBookings";
import Profile from "../pages/Profile/Profile";
import Registration from "../pages/Registration/Registration";
import ResortInputForm from "../pages/ResortInputForm/ResortInputForm";
import SignIn from "../pages/SignIn/SignIn";
import UserControl from "../pages/UserControl/UserControl";
import UserOverview from "../pages/UserOverview/UserOverview";
import UsersBookings from "../pages/UsersBookings/UsersBookings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <Registration />,
      },
      {
        path: "hotels",
        element: <Hotels />,
      },
      {
        path: "singleResortPage/:_id",
        element: <SingleResortPage />,
      },
      {
        path: "hotel-search",
        element: <HotelSearch />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "communications",
        element: <Communications />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "confirm-booking",
        element: <ConfirmBooking />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "flight-search",
        element: <FlightSearch />,
      },
      {
        path: "flight-type",
        element: <FlightType />,
      },
      {
        path: "flight-results",
        element: <FlightResults />,
      },
      {
        path: "flight-detail",
        element: <FlightDetail />,
      },
      {
        path: "flight-passengers",
        element: <FlightPassengers />,
      },
      {
        path: "flight-payment",
        element: <FlightPayment />,
      },
      {
        path: "flight-confirmation",
        element: <FlightConfirmation />,
      },
      {
        path: "car-search",
        element: <CarSearch />,
      },
      {
        path: "cruise-search",
        element: <CruiseSearch />,
      },
    ],
  },

  {
    path: "/user-dashboard",
    element: <UserDashboard />,
    children: [
      {
        path: "user-overview",
        element: <UserOverview />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
    ],
  },

  {
    path: "/admin-panel",
    element: <AdminPanel />,
    children: [
      {
        path: "admin-overview",
        element: <AdminOverview />,
      },
      {
        path: "users-bookings",
        element: <UsersBookings />,
      },
      {
        path: "user-control",
        element: <UserControl />,
      },
      {
        path: "admin-control",
        element: <AdminControl />,
      },
      {
        path: "resort-input-form",
        element: <ResortInputForm />,
      },
    ],
  },
]);
