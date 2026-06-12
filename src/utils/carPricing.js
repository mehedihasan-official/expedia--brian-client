export const CAR_DISCOUNT_PERCENT = 60; // 60% off retail
export const CAR_POINTS_RATE = 0.05;    // $0.05 per point

export const calculateCarPricing = (retailPricePerDay, numberOfDays = 1) => {
  const days = numberOfDays > 0 ? numberOfDays : 1;

  // Cash pricing — apply 60% discount
  const discountedPricePerDay = Math.round(retailPricePerDay * (1 - CAR_DISCOUNT_PERCENT / 100) * 100) / 100;
  const retailSubtotal = Math.round(retailPricePerDay * days * 100) / 100;
  const discountedSubtotal = Math.round(discountedPricePerDay * days * 100) / 100;
  const cashTax = Math.round(discountedSubtotal * 0.12 * 100) / 100;
  const cashTotal = Math.round((discountedSubtotal + cashTax) * 100) / 100;
  const savingsAmount = Math.round((retailSubtotal - discountedSubtotal) * 100) / 100;

  // Points pricing — based on RETAIL price, $0.05 per point, no fees
  const pointsPerDay = Math.round(retailPricePerDay / CAR_POINTS_RATE);
  const pointsTotal = pointsPerDay * days;

  return {
    retailPricePerDay,
    discountedPricePerDay,
    retailSubtotal,
    discountedSubtotal,
    cashTax,
    cashTotal,
    savingsAmount,
    savingsPercent: CAR_DISCOUNT_PERCENT,
    pointsPerDay,
    pointsTotal,
    numberOfDays: days
  };
};
