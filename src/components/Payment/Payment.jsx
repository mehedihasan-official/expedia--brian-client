import {
  FaCheck,
  FaCreditCard,
  FaPaypal,
  FaRegCreditCard,
  FaTimes,
} from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationData = location.state?.reservationData;
  const basePrice = reservationData?.pricing?.totalPrice || 0;

  const depositAmount = 221; // Fixed deposit amount
  const depositTax = depositAmount * 0.2;
  const depositFees = depositAmount * 0.3;
  const depositTotal = depositAmount + depositTax + depositFees;

  // Generate a random near future date (3-7 days from now)
  const randomDays = Math.floor(Math.random() * 5) + 3;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + randomDays);
  const refundableDate = futureDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handlePaymentClick = (paymentType) => {
    const paymentData = {
      ...reservationData,
      paymentDetails: {
        type: paymentType,
        baseAmount: paymentType === "full" ? basePrice : depositAmount,
        isDeposit: paymentType === "deposit",
        refundableDate,
      },
    };

    navigate("/checkout", { state: { paymentData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Go back"
            >
              <FaTimes className="text-gray-600 text-xl" />
            </button>
            <div className="ml-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Choose Payment Method
              </h1>
              <p className="text-gray-600 mt-1">
                Select how you'd like to pay for your reservation
              </p>
            </div>
          </div>

          {/* Refundable Notice */}
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-8">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm md:text-base font-medium text-gray-900">
                Fully refundable until {refundableDate}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Cancel for free before this date
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pay Now Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
            <div className="p-6 md:p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Pay in Full
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Pay the entire amount now
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-blue-600">
                  <FaCreditCard className="text-xl" />
                  <FaPaypal className="text-xl" />
                  <RiSecurePaymentLine className="text-2xl" />
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    More ways to pay: Debit/Credit card or Paypal
                  </span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Use valid Platinum Club coupons
                  </span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    No future payments required
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total amount</p>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                      ${basePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Payment due</p>
                    <p className="text-lg font-semibold text-gray-900">Today</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePaymentClick("full")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Pay Full Amount Now
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                <RiSecurePaymentLine className="inline mr-1 text-blue-500" />
                Secure 256-bit SSL encryption
              </p>
            </div>
          </div>

          {/* Reserve with Deposit Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
            <div className="p-6 md:p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Pay Deposit
                  </h2>
                  <p className="text-gray-600 mt-1">Secure your booking now</p>
                </div>
                <div className="hidden sm:block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Most Flexible
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Book with only{" "}
                    <span className="font-semibold">${depositAmount}</span>{" "}
                    initial payment
                  </span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Remaining amount charged later
                  </span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Same cancellation policy applies
                  </span>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <FaRegCreditCard className="text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Payment Schedule
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Today</p>
                      <p className="text-sm text-gray-600">Initial deposit</p>
                    </div>
                    <p className="font-bold text-lg text-blue-700">
                      ${depositAmount}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        Before Arrival
                      </p>
                      <p className="text-sm text-gray-600">Remaining balance</p>
                    </div>
                    <p className="font-bold text-lg text-gray-900">
                      ${(basePrice - depositAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePaymentClick("deposit")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Pay ${depositAmount} Deposit
              </button>

              <div className="text-center text-gray-500 text-sm mt-4">
                <p className="flex items-center justify-center">
                  <RiSecurePaymentLine className="inline mr-1 text-emerald-500" />
                  Balance due 7 days before arrival
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-3">
                <RiSecurePaymentLine className="text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600">256-bit SSL encryption</p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                No Hidden Fees
              </h3>
              <p className="text-sm text-gray-600">All taxes included</p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-3">
                <FaRegCreditCard className="text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Flexible Options
              </h3>
              <p className="text-sm text-gray-600">Multiple payment methods</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help?{" "}
            <button className="text-blue-600 hover:text-blue-800 font-medium underline">
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
