import { BsCreditCard, BsPaypal } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const PaymentMethod = ({
  formData,
  handleChange,
  handleCardNumberChange,
  paymentMode,
  pointsUsed,
  cashEquivalent,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Payment method</h2>

      <div className="space-y-2 mb-6">
        <div className="flex items-start">
          <FaCheck className="text-green-500 mt-1 mr-2" />
          <p className="text-gray-700">We use secure transmission</p>
        </div>
        <div className="flex items-start">
          <FaCheck className="text-green-500 mt-1 mr-2" />
          <p className="text-gray-700">We protect your personal information</p>
        </div>
      </div>

      {paymentMode === 'points' ? (
        <div className="rounded-3xl border border-purple-200 bg-purple-50 p-6 text-purple-900 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-700 mb-2">
            Platinum Club Points
          </p>
          <p className="text-3xl font-bold mb-3">{pointsUsed.toLocaleString()} pts</p>
          <p className="text-sm text-purple-800 mb-4">
            Redeeming points worth ${cashEquivalent?.toFixed(2)} for this stay.
          </p>
          <p className="text-sm text-purple-700">
            No credit card required. Your points will be deducted at confirmation.
          </p>
        </div>
      ) : (
        <>
          <div className="flex text-[8px] sm:flex-row gap-3 mb-6">
            <button className="btn btn-outline flex-1">
              <BsCreditCard />
              <span className="text-[10px]">Debit/Credit Card</span>
            </button>
            <button className="btn btn-outline flex-1">
              <BsPaypal />
              <span className="text-[10px]">PayPal</span>
            </button>
            <button className="btn btn-outline flex-1">
              <span className="text-[10px]">Monthly Payments</span>
            </button>
          </div>

          <Link
            to="#"
            className="text-blue-600 hover:underline text-sm mb-6 inline-block"
          >
            Click-to-Pay
          </Link>

          <div className="divider my-3" />

          {/* Credit Card Logos */}
          <div className="flex space-x-4 mb-6">
            {["visa", "mastercard", "amex", "discover"].map((card) => (
              <img
                key={card}
                src={`https://logo.clearbit.com/${card}.com`}
                alt={card}
                className="w-12 h-8"
              />
            ))}
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card*
              </label>
              <input
                type="text"
                id="card-name"
                name="cardName"
                className="input input-bordered w-full"
                placeholder="Name on card"
                required
                value={formData.cardName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Debit/Credit card number*
              </label>
              <input
                type="text"
                id="card-number"
                name="cardNumber"
                className="input input-bordered w-full"
                placeholder="Card number"
                required
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry (MM / YY)*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="expiry-month"
                    name="expiryMonth"
                    className="input input-bordered w-full"
                    placeholder="MM"
                    required
                    value={formData.expiryMonth}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="expiry-year"
                    name="expiryYear"
                    className="input input-bordered w-full"
                    placeholder="YY"
                    required
                    value={formData.expiryYear}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security code*
                </label>
                <input
                  type="text"
                  id="security-code"
                  name="securityCode"
                  className="input input-bordered w-full"
                  placeholder="CVV"
                  required
                  value={formData.securityCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing ZIP code*
              </label>
              <input
                type="text"
                id="zip-code"
                name="zipCode"
                className="input input-bordered w-full"
                placeholder="ZIP/Postal code"
                required
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
