import React, { useContext, useState } from 'react';
import {
    FaCalendarAlt,
    FaCheck,
    FaChevronLeft,
    FaChevronRight,
    FaCreditCard,
    FaInfoCircle,
    FaLock,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaUser
} from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import GuestInfoCard from './CheckoutContent/GuestInfoCard';
import ImportantInfo from './CheckoutContent/ImportantInfo';
import PaymentMethod from './CheckoutContent/PaymentMethod';
import ResortCardInfo from './CheckoutContent/ResortCardInfo';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state?.paymentData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    textAlerts: false,
    cardName: '',
    cardNumber: '',
    expiryMonth: '1',
    expiryYear: new Date().getFullYear().toString(),
    securityCode: '',
    zipCode: '',
    specialRequests: '',
  });

  const { user } = useContext(AuthContext);

  // Auto-fill user data if logged in
  React.useEffect(() => {
    if (user?.displayName || user?.email || user?.phoneNumber) {
      const nameParts = user.displayName?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
      }));
    }
  }, [user]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoMdArrowRoundBack className="text-red-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Booking Session Expired
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment session has expired. Please start your reservation
            again.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <IoMdArrowRoundBack className="mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { resort, room, paymentDetails } = paymentData;
  const paymentMode = paymentDetails?.paymentMode || 'cash';
  const isDeposit = paymentDetails?.isDeposit || false;
  const isPointsPayment = paymentMode === 'points';
  const cashEquivalent = parseFloat(paymentData?.pricing?.totalPrice) || 0;
  const pointsUsed = paymentDetails?.pointsUsed || 0;
  const baseAmount = parseFloat(paymentDetails?.baseAmount) || 0;
  const totalStayAmount = parseFloat(paymentDetails?.totalAmount) || cashEquivalent;
  const dueToday = isDeposit ? baseAmount : isPointsPayment ? 0 : totalStayAmount;
  const remainingBalance = isDeposit ? totalStayAmount - baseAmount : 0;
  const numberOfNights = paymentData?.dates?.nights || 1;
  const refundableDate = paymentDetails?.refundableDate || 'the check-in date';

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please enter your full name',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
      });
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
      });
      return false;
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      Swal.fire({
        title: 'Invalid Phone',
        text: 'Please enter a valid phone number',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
      });
      return false;
    }
    if (!isPointsPayment) {
      if (
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, '').length < 16
      ) {
        Swal.fire({
          title: 'Invalid Card',
          text: 'Please enter a valid 16-digit card number',
          icon: 'warning',
          confirmButtonColor: '#3b82f6',
        });
        return false;
      }
      if (!formData.securityCode || formData.securityCode.length < 3) {
        Swal.fire({
          title: 'Invalid Security Code',
          text: 'Please enter a valid security code',
          icon: 'warning',
          confirmButtonColor: '#3b82f6',
        });
        return false;
      }
    }
    return true;
  };

  const formatCardNumber = value => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = e => {
    const formatted = formatCardNumber(e.target.value);
    handleChange({ target: { name: 'cardNumber', value: formatted } });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        resortId: resort._id,
        email: user?.email || formData.email,
        roomId: room._id || resort._id,
        startDate: paymentData?.dates?.start
          ? new Date(paymentData.dates.start).toISOString()
          : new Date().toISOString(),
        endDate: paymentData?.dates?.end
          ? new Date(paymentData.dates.end).toISOString()
          : new Date(Date.now() + 86400000).toISOString(),
        resort,
        room,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        },
        paymentInfo: isPointsPayment
          ? {
              method: 'points',
              pointsUsed,
              cashEquivalent,
            }
          : {
              cardName: formData.cardName,
              cardNumber: formData.cardNumber.replace(/\s/g, ''),
              expiry: `${formData.expiryMonth}/${formData.expiryYear}`,
              securityCode: formData.securityCode,
              zipCode: formData.zipCode,
            },
        paymentDetails: {
          baseAmount,
          totalAmount: totalStayAmount,
          isDeposit,
          isPointsPayment,
          paymentMode,
          refundableDate,
        },
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Show processing animation
      Swal.fire({
        title: 'Processing Booking',
        html: 'Please wait while we confirm your reservation...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_Link}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Booking failed');
      }

      Swal.close();

      await Swal.fire({
        title: '🎉 Success!',
        text: 'Your booking has been confirmed!',
        icon: 'success',
        confirmButtonText: 'View Booking Details',
        confirmButtonColor: '#10b981',
        showCancelButton: true,
        cancelButtonText: 'Back to Home',
        cancelButtonColor: '#6b7280',
      }).then(result => {
        if (result.isConfirmed) {
          navigate('/confirm-booking', {
            state: {
              bookingData: responseData.data,
              bookingId: responseData.bookingId,
            },
            replace: true,
          });
        } else {
          navigate('/');
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      Swal.close();
      await Swal.fire({
        title: '❌ Booking Failed',
        text:
          error.message ||
          'There was an error processing your booking. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, name: 'Guest Info', icon: FaUser },
    { id: 2, name: 'Payment', icon: FaCreditCard },
    { id: 3, name: 'Confirmation', icon: FaCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Complete Your Booking
                </h1>
                <p className="text-gray-600 mt-1">Secure checkout process</p>
              </div>
              <Link
                to="/"
                className="hidden md:flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <FaChevronLeft className="mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Steps */}
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        currentStep >= step.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      } transition-all duration-300`}
                    >
                      <step.icon />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? 'text-blue-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resort Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <ResortCardInfo resort={resort} room={room} dates={paymentData.dates} />
              </div>

              {/* Success Message */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FaCheck className="text-emerald-600 text-lg" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900">
                      Great Choice! ✨
                    </h3>
                    <p className="text-gray-700 mt-1">
                      This property is in high demand. Complete your booking now
                      to secure your dates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Information Card */}
              <GuestInfoCard
                formData={formData}
                handleChange={handleChange}
                setCurrentStep={setCurrentStep}
              />

              {/* Payment Information Card */}
              <PaymentMethod
                formData={formData}
                handleChange={handleChange}
                handleCardNumberChange={handleCardNumberChange}
                formatCardNumber={formatCardNumber}
                setCurrentStep={setCurrentStep}
                paymentMode={paymentMode}
                pointsUsed={pointsUsed}
                cashEquivalent={cashEquivalent}
              />

              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaInfoCircle className="text-blue-500 mr-2" />
                  Price Breakdown
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">
                        {isPointsPayment ? 'Stay Value' : 'Base Rate'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isPointsPayment
                          ? 'Credit value for your points redemption'
                          : `Per ${numberOfNights} night(s)`}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${cashEquivalent?.toFixed(2)}
                    </p>
                  </div>

                  {isPointsPayment && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">Points redeemed</p>
                        <p className="text-sm text-gray-500">Platinum Club points</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {pointsUsed.toLocaleString()} pts
                      </p>
                    </div>
                  )}

                  {isDeposit && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">
                            Deposit Amount
                          </p>
                          <p className="text-sm text-gray-500">Paid today</p>
                        </div>
                        <p className="font-semibold text-green-600">
                          ${baseAmount?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">
                            Remaining balance
                          </p>
                          <p className="text-sm text-gray-500">
                            Due before arrival
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${remainingBalance?.toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center pt-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {isPointsPayment ? 'Points to Redeem' : 'Amount Due'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isDeposit
                          ? 'Amount charged today'
                          : isPointsPayment
                          ? 'Redeem at checkout'
                          : 'Payable today'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">
                        {isPointsPayment
                          ? `${pointsUsed.toLocaleString()} pts`
                          : `$${dueToday?.toFixed(2)}`}
                      </p>
                      {isDeposit && (
                        <p className="text-sm text-gray-500">
                          Total stay value ${totalStayAmount?.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        🎉 Fully refundable until {refundableDate}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Free cancellation before this date. No questions asked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <ImportantInfo />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <h2 className="text-xl font-bold text-white mb-2">
                      Booking Summary
                    </h2>
                    <div className="flex items-center text-blue-100">
                      <FaLock className="mr-2" />
                      <span className="text-sm">Secure Payment</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Resort Info */}
                    <div className="mb-6">
                      <div className="flex items-start mb-4">
                        <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {resort.place_name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {resort.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room Type:</span>
                          <span className="font-medium text-gray-900">
                            {room.room_type || room.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-medium text-gray-900">
                            After 3:00 PM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-medium text-gray-900">
                            Before 11:00 AM
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      {/* Total */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${dueToday?.toFixed(2)}
                          </span>
                        </div>
                        {isDeposit && (
                          <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                            ✅ Only ${dueToday?.toFixed(2)} due today
                          </p>
                        )}
                        {isPointsPayment && (
                          <p className="text-sm text-purple-600 bg-purple-50 p-2 rounded-lg">
                            ✅ {pointsUsed.toLocaleString()} points will be redeemed.
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <FaShieldAlt className="mr-3" />
                            {isPointsPayment ? 'Redeem Points' : 'Complete Secure Booking'}
                            <FaChevronRight className="ml-2" />
                          </div>
                        )}
                      </button>

                      {/* Security Info */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center text-gray-700 mb-2">
                          <FaShieldAlt className="text-blue-500 mr-2" />
                          <span className="font-medium">
                            Your payment is secure
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          We use 256-bit SSL encryption and never store your
                          full card details. Your personal information is
                          protected.
                        </p>
                      </div>

                      {/* Need Help */}
                      <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                          Need help?{' '}
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                            onClick={() => setCurrentStep(3)}
                          >
                            Contact Support
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3">
                    🎁 Have a promo code?
                  </h3>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 rounded-r-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
