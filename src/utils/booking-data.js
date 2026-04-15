// ============================================================
// SOURCE OF TRUTH: react-native-bulky/tempData.js
// All item data, sub-options, and moreInfo fields mirror the
// mobile app exactly. Lucide icons are mapped per item type.
// ============================================================

export const ItemData = [
  { id: '1', title: 'Bed',          type: 'Bed',          icon: 'BedDouble' },
  { id: '2', title: 'Bike',         type: 'Bike',         icon: 'Bike' },
  { id: '3', title: 'Boxes',        type: 'Boxes',        icon: 'Package' },
  { id: '4', title: 'Boats',        type: 'Boats',        icon: 'Anchor' },
  { id: '5', title: 'Motorcycle',   type: 'Motorcycle',   icon: 'Bike' },
  { id: '6', title: 'TV',           type: 'TV',           icon: 'Tv' },
  { id: '7', title: 'Construction', type: 'Construction', icon: 'HardHat' },
  { id: '8', title: 'Appliances',   type: 'Appliances',   icon: 'WashingMachine' },
];

// ------- Bed (SpecificItem/index.js) -------
export const BedSubTypes = [
  { id: '1', title: 'Single Bed',           weight: 50 },
  { id: '2', title: 'Twin Size',            weight: 100 },
  { id: '3', title: 'Full Size',            weight: 100 },
  { id: '4', title: 'Queen Size',           weight: 120 },
  { id: '5', title: 'King Size',            weight: 150 },
  { id: '6', title: 'California King Size', weight: 150 },
];
export const BedMoreInfo = [
  'Include Mattress',
  'Has An Adjustable Base',
  'Split Delivery (Multiple Items)',
  'Include Box Spring',
  'Head Board',
  'Foot Board',
];

// ------- Appliances (items/Appliances.js) -------
export const AppliancesSubTypes = [
  { id: '1', title: 'Refrigerator',    weight: 250 },
  { id: '2', title: 'Stove/Oven',      weight: 150 },
  { id: '3', title: 'Microwave',       weight: 40  },
  { id: '4', title: 'Dishwasher',      weight: 100 },
  { id: '5', title: 'Hot water heater',weight: 180 },
];
export const AppliancesSizeOptions = ['Small', 'Medium', 'Large', 'ExtraLarge'];

// ------- TV (items/TV.js) -------
export const TVSubTypes = [
  { id: '1', label: 'Up to 60"',                         weight: 40 },
  { id: '2', label: '60"-100" (value less than $10000)', weight: 80 },
];

// ------- Boats (items/Boats.js) -------
export const BoatsSubTypes = [
  { id: '1', label: 'Up to 20 feet', weight: 500  },
  { id: '2', label: '20-40 feet',    weight: 1500 },
  { id: '3', label: '40-60 feet',    weight: 3000 },
];
export const BoatsHitchBallSizes = ['1 7/8"', '2"', '2 5/16"', '3"'];

// ------- Motorcycle (items/Motorcycle.js → tempData m_options) -------
export const MotorcycleSubTypes = [
  { id: '1', label: 'Traditional 2 wheel', weight: 400  },
  { id: '2', label: 'Tricycle',            weight: 600  },
  { id: '3', label: 'Golf Cart',           weight: 900  },
  { id: '4', label: '4 wheeler',           weight: 800  },
  { id: '5', label: 'Side by side',        weight: 1200 },
];

// ------- Construction (items/Construction.js → tempData options) -------
export const ConstructionSubTypes = [
  { id: '1', label: 'Items < 1 ft x 1 ft x 1ft up to 25lbs', weight: 25  },
  { id: '2', label: 'Items < 1 ft x 1 ft x 1ft up to 60lbs', weight: 60  },
  { id: '3', label: 'Items up to 8ft & under 60 lbs',         weight: 60  },
  { id: '4', label: 'Items 8–16 ft & over 60 lbs',           weight: 120 },
  { id: '5', label: 'Sheets (plywood, drywall) up to 12ft',  weight: 80  },
  { id: '6', label: 'Door',                                   weight: 100 },
  { id: '7', label: 'Windows (standard size)',                weight: 70  },
  { id: '8', label: 'Landscaping material (dirt, mulch, gravel)', weight: 200 },
];

// ------- Bike (items/Bike.js) — no sub-options needed -------
// Bike goes directly to selected items with count = 1

// ------- Boxes (items/Boxes.js) -------
// Uses a free-text # of boxes + oversized checkbox

// ------- Shared -------
export const ServiceTiers = [
  { label: 'Door-to-Door Delivery',               value: 'Door-to-Door Delivery',               description: 'Standard curbside pickup and delivery.' },
  { label: 'Ground Floor Delivery with Unboxing', value: 'Ground Floor Delivery with Unboxing', description: 'Item brought inside and unboxed for you.' },
  { label: 'White Glove Service',                 value: 'White Glove Service',                 description: 'Full room-of-choice setup and debris removal.' },
];

export const TipOptions = [0, 5, 10, 15, 20];
