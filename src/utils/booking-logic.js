/**
 * Calculates moving charges based on items, distance, service type, and helper count.
 * Ported from react-native-bulky/src/screens/App/FeatureBooking/screens/Bill/index.js
 */
export const calculateMovingCharges = (
  items,
  distanceMiles,
  serviceType,
  helpers = 0
) => {
  // 1. Professional Base Fee for shifting
  const baseFee = 100;

  // 2. Mileage Charges ($1.25 per mile)
  const mileageFee = (distanceMiles || 0) * 1.25;

  // 3. Fuel Surcharge (12% of mileage)
  const fuelSurcharge = mileageFee * 0.12;

  // 4. Labor / Helpers ($25 fixed per helper)
  const helperFee = (helpers || 0) * 25;

  // 5. Service Tier Multiplier
  let serviceMultiplier = 1.0;
  if (serviceType === 'Ground Floor Delivery with Unboxing') serviceMultiplier = 1.2;
  if (serviceType === 'White Glove Service') serviceMultiplier = 1.5;

  const subtotal = (baseFee + mileageFee + fuelSurcharge) * serviceMultiplier;
  const laborSubtotal = helperFee;

  const salesTax = (subtotal + laborSubtotal) * 0.0825; // 8.25% Tax Rate
  const total = subtotal + laborSubtotal + salesTax;

  return {
    baseFee: parseFloat(baseFee.toFixed(2)),
    mileageFee: parseFloat(mileageFee.toFixed(2)),
    fuelSurcharge: parseFloat(fuelSurcharge.toFixed(2)),
    laborFee: parseFloat(laborSubtotal.toFixed(2)),
    salesTax: parseFloat(salesTax.toFixed(2)),
    grandTotal: parseFloat(total.toFixed(2)),
    serviceMarkup: (serviceMultiplier - 1) * (baseFee + mileageFee),
  };
};

/**
 * Calculates estimated job time based on driving duration and item count.
 * Ported from react-native-bulky/src/utilities/helpers/index.js
 */
export const calculateTotalJobTime = (roadDurationMin, itemCount) => {
  // 1. Road duration (from Google); treat NaN/undefined as 0
  const driveMin = Number(roadDurationMin);
  const roadMin = Number.isFinite(driveMin) ? driveMin : 0;
  // 2. Handling time: ~10 mins per unique item type
  const handlingMinutes = (itemCount || 1) * 10;
  // 3. Fixed setup/buffer: 20 mins
  const total = Math.round(roadMin + handlingMinutes + 20);
  return Math.max(1, total);
};

/**
 * Generates a mock UUID-like string.
 * Ported from react-native-bulky/src/backend/utility.js
 */
export function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return (
    chr4() +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    chr4() +
    chr4()
  );
}
