import { Category, Product, DeliveryArea, BusinessSettings } from '../types';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  storeName: 'Richard Home Logistics',
  tagline: '...Your Home, Our Priority',
  whatsAppNumber: '234906970687',
  displayPhone: '+234 906 970 687',
  physicalAddress: '123 Main Street, Asaba, Delta State, Nigeria',
  openingHours: 'Mon - Sat: 8:00 AM – 6:00 PM (Sunday Closed)',
  pickupSlots: [
    '9:00 AM – 11:00 AM',
    '11:00 AM – 1:00 PM',
    '1:00 PM – 3:00 PM',
    '3:00 PM – 5:00 PM'
  ]
};

export const INITIAL_DELIVERY_AREAS: DeliveryArea[] = [
  { id: 'asaba', name: 'Asaba (Central & Environs)', fee: 15000, isCovered: true, note: 'Same-day / next-day delivery available' },
  { id: 'okpanam', name: 'Okpanam Road / Okpanam Town', fee: 12000, isCovered: true },
  { id: 'ibusa', name: 'Ibusa / Asaba-Benin Expressway', fee: 15000, isCovered: true },
  { id: 'ogwashi', name: 'Ogwashi-Uku', fee: 20000, isCovered: true },
  { id: 'onitsha', name: 'Onitsha / Bridge Head / Fegge', fee: 25000, isCovered: true },
  { id: 'warri', name: 'Warri / Effurun / Delta Central', fee: 35000, isCovered: true },
  { id: 'benin', name: 'Benin City / Edo State', fee: 40000, isCovered: true },
  { id: 'lagos', name: 'Lagos & Western States (Freight Courier)', fee: 55000, isCovered: true },
  { id: 'custom', name: 'Other Location in Nigeria (Custom Rate)', fee: 0, isCovered: false, note: 'Please contact us on WhatsApp to confirm delivery availability and charges.' }
];

export const CATEGORIES: Category[] = [
  {
    id: 'beds',
    name: 'Beds',
    image: '/src/assets/images/bed_executive_luxury_1794158921338.jpg',
    itemCount: 18,
    subcategories: ['All', 'Executive Beds', 'Adult Beds', "Children's Beds", 'Bunk Beds', 'Bed Frames', 'Bedside Furniture', 'Wardrobes', 'Bedroom Sets']
  },
  {
    id: 'tvs',
    name: 'TVs',
    image: '/src/assets/images/tv_smart_4k_1794158922347.jpg',
    itemCount: 14,
    subcategories: ['All', '32-inch TVs', '43-inch TVs', '50-inch TVs', '55-inch TVs', '65-inch TVs', 'Smart TVs', 'Android TVs', 'LED TVs']
  },
  {
    id: 'fridges',
    name: 'Fridges',
    image: '/src/assets/images/refrigerator_double_door_1794158922549.jpg',
    itemCount: 12,
    subcategories: ['All', 'Table-top Refrigerators', 'Mini Refrigerators', 'Single-door Refrigerators', 'Double-door Refrigerators', 'Large-capacity Refrigerators']
  },
  {
    id: 'glass-tables',
    name: 'Glass Tables',
    image: '/src/assets/images/dining_glass_table_1794158922064.jpg',
    itemCount: 10,
    subcategories: ['All', 'Executive Dining Sets', 'Glass Dining Tables', 'Centre Tables', 'Side Tables']
  },
  {
    id: 'fans',
    name: 'Fans',
    image: '/src/assets/images/standing_fan_modern_1794158941438.jpg',
    itemCount: 9,
    subcategories: ['All', 'Standing Fans', 'Rechargeable Fans', 'Solar Fans', 'Table Fans']
  },
  {
    id: 'appliances',
    name: 'Other Appliances',
    image: '/src/assets/images/home_appliances_set_1794158943111.jpg',
    itemCount: 16,
    subcategories: ['All', 'Blenders', 'Gas Cookers', 'Electric Irons', 'Microwaves', 'Other Household Appliances']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- BEDS ---
  {
    id: 'bed-01',
    name: 'Executive Bed',
    category: 'beds',
    subcategory: 'Executive Beds',
    description: 'Comfortable and stylish executive upholstered bed frame crafted for contemporary Nigerian homes. Features plush deep-tufted headboard, solid hardwood internal reinforcement, and premium fabric finish.',
    price: 350000,
    originalPrice: 400000,
    images: [
      '/src/assets/images/bed_executive_luxury_1794158921338.jpg',
      '/src/assets/images/hero_living_room_1794158920760.jpg'
    ],
    sizes: ['6x6 ft', '6x7 ft', '7x7 ft (King)'],
    colors: [
      { name: 'Royal Navy', hex: '#0A2558' },
      { name: 'Charcoal Grey', hex: '#333333' },
      { name: 'Warm Beige', hex: '#D8C7B5' },
      { name: 'Classic Brown', hex: '#5A3D28' }
    ],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isNew: true
  },
  {
    id: 'bed-02',
    name: 'Adult Bed',
    category: 'beds',
    subcategory: 'Adult Beds',
    description: 'Solid wooden master bed frame with cushioned ergonomic headboard and supportive orthopedic base slats. Built to endure with high moisture resistance.',
    price: 220000,
    originalPrice: 250000,
    images: [
      '/src/assets/images/bed_executive_luxury_1794158921338.jpg'
    ],
    sizes: ['4.5x6 ft', '6x6 ft'],
    colors: [
      { name: 'Natural Oak', hex: '#B8860B' },
      { name: 'Rich Mahogany', hex: '#4A1515' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    inStock: true,
    stockCount: 12,
    isFeatured: true
  },
  {
    id: 'bed-03',
    name: "Children's Bed",
    category: 'beds',
    subcategory: "Children's Beds",
    description: 'Vibrant and safe low-profile bed designed specifically for children and young students. Rounded smooth edges and non-toxic scratch-resistant polish.',
    price: 180000,
    originalPrice: 210000,
    images: [
      '/src/assets/images/bunk_bed_children_1794158941824.jpg'
    ],
    sizes: ['3.5x6 ft', '4x6 ft'],
    colors: [
      { name: 'Sky Blue', hex: '#60A5FA' },
      { name: 'Pastel Pink', hex: '#F472B6' },
      { name: 'Natural Pine', hex: '#E5D0B1' }
    ],
    inStock: true,
    stockCount: 6,
    isFeatured: true
  },
  {
    id: 'bed-04',
    name: 'Bunk Bed',
    category: 'beds',
    subcategory: 'Bunk Beds',
    description: 'Heavy-duty dual-level bunk bed frame with built-in reinforced safety ladder and top guard rails. Can easily be separated into two single beds if desired.',
    price: 250000,
    originalPrice: 280000,
    images: [
      '/src/assets/images/bunk_bed_children_1794158941824.jpg'
    ],
    sizes: ['Standard 3x6 ft Dual'],
    colors: [
      { name: 'Natural Pine & Blue', hex: '#7AA0C2' },
      { name: 'Walnut Finish', hex: '#5C4033' }
    ],
    inStock: true,
    stockCount: 5,
    isFeatured: true
  },
  {
    id: 'bed-05',
    name: 'Royal Padded Master Bed Frame',
    category: 'beds',
    subcategory: 'Executive Beds',
    description: 'Luxury wingback bed frame adorned with velvet upholstery, gold trim metallic studs, and high-density foam backing for grand master suites.',
    price: 495000,
    originalPrice: 560000,
    images: [
      '/src/assets/images/bed_executive_luxury_1794158921338.jpg'
    ],
    sizes: ['6x6 ft', '6x7 ft Super King'],
    colors: [
      { name: 'Deep Emerald', hex: '#064E3B' },
      { name: 'Midnight Navy', hex: '#071B49' }
    ],
    inStock: true,
    stockCount: 4,
    isFeatured: false
  },
  {
    id: 'bed-06',
    name: 'Modern 3-Door Bedroom Wardrobe',
    category: 'beds',
    subcategory: 'Wardrobes',
    description: 'Spacious 3-door wardrobe with built-in dressing mirror, 4 deep hanging rods, and lockable internal jewelry and watch drawer.',
    price: 310000,
    originalPrice: 340000,
    images: [
      '/src/assets/images/hero_living_room_1794158920760.jpg'
    ],
    sizes: ['Standard 6ft x 6ft'],
    colors: [
      { name: 'Matte Grey & Ash', hex: '#4B5563' },
      { name: 'Warm Oak', hex: '#A27B5C' }
    ],
    inStock: true,
    stockCount: 7,
    isFeatured: false
  },

  // --- TELEVISIONS ---
  {
    id: 'tv-01',
    name: '55-inch 4K UHD Smart TV',
    category: 'tvs',
    subcategory: '55-inch TVs',
    description: 'Stunning 4K Ultra High Definition screen with HDR10+ dynamic range, built-in Netflix, YouTube, Prime Video, and Bluetooth 5.0 wireless audio.',
    price: 680000,
    originalPrice: 750000,
    images: [
      '/src/assets/images/tv_smart_4k_1794158922347.jpg'
    ],
    sizes: ['55 Inch'],
    colors: [
      { name: 'Matte Black', hex: '#111827' }
    ],
    inStock: true,
    stockCount: 9,
    brand: 'SmartVision Ultra',
    isFeatured: true,
    isNew: true
  },
  {
    id: 'tv-02',
    name: '43-inch Smart Android TV',
    category: 'tvs',
    subcategory: '43-inch TVs',
    description: 'Crisp Full HD LED display with Google TV OS, voice remote control, Chromecast built-in, and triple HDMI ports for DSTV and game consoles.',
    price: 340000,
    originalPrice: 380000,
    images: [
      '/src/assets/images/tv_smart_4k_1794158922347.jpg'
    ],
    sizes: ['43 Inch'],
    colors: [
      { name: 'Obsidian Black', hex: '#000000' }
    ],
    inStock: true,
    stockCount: 14,
    brand: 'Android LED Pro',
    isFeatured: true
  },
  {
    id: 'tv-03',
    name: '32-inch Frameless Smart TV',
    category: 'tvs',
    subcategory: '32-inch TVs',
    description: 'Perfect for bedrooms and dining spaces. Low power consumption, energy-saving generator friendly, and crystal-clear sound projection.',
    price: 245000,
    originalPrice: 275000,
    images: [
      '/src/assets/images/tv_smart_4k_1794158922347.jpg'
    ],
    sizes: ['32 Inch'],
    colors: [
      { name: 'Black', hex: '#111827' }
    ],
    inStock: true,
    stockCount: 11,
    isFeatured: true
  },
  {
    id: 'tv-04',
    name: '65-inch Cinema Curve 4K TV',
    category: 'tvs',
    subcategory: '65-inch TVs',
    description: 'Grand home theater 65-inch 120Hz refresh rate panel with cinematic Dolby Atmos sound and ultra-thin bezel design.',
    price: 890000,
    originalPrice: 980000,
    images: [
      '/src/assets/images/tv_smart_4k_1794158922347.jpg'
    ],
    sizes: ['65 Inch'],
    colors: [
      { name: 'Titanium Grey', hex: '#374151' }
    ],
    inStock: true,
    stockCount: 3,
    isFeatured: false
  },

  // --- REFRIGERATORS ---
  {
    id: 'fridge-01',
    name: 'Double-Door Frost-Free Refrigerator',
    category: 'fridges',
    subcategory: 'Double-door Refrigerators',
    description: 'Spacious 280-liter double-door refrigerator with top freezer compartment, multi-air flow cooling, and energy-saving inverter compressor suited for Nigerian voltage fluctuation.',
    price: 480000,
    originalPrice: 530000,
    images: [
      '/src/assets/images/refrigerator_double_door_1794158922549.jpg'
    ],
    sizes: ['280 Litres', '350 Litres'],
    colors: [
      { name: 'Brushed Silver', hex: '#CBD5E1' },
      { name: 'Mirror Black', hex: '#1E293B' }
    ],
    inStock: true,
    stockCount: 6,
    isFeatured: true
  },
  {
    id: 'fridge-02',
    name: 'Table-Top Compact Refrigerator',
    category: 'fridges',
    subcategory: 'Table-top Refrigerators',
    description: 'Compact 90-liter bedside and office tabletop fridge with ice box compartment, adjustable shelves, and super quiet operation.',
    price: 145000,
    originalPrice: 165000,
    images: [
      '/src/assets/images/refrigerator_double_door_1794158922549.jpg'
    ],
    sizes: ['90 Litres'],
    colors: [
      { name: 'Stainless Silver', hex: '#94A3B8' },
      { name: 'Pearl White', hex: '#F8FAFC' }
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: true
  },
  {
    id: 'fridge-03',
    name: 'Single-Door Fast-Freeze Fridge',
    category: 'fridges',
    subcategory: 'Single-door Refrigerators',
    description: 'Reliable 150-liter single door refrigerator with deep freezer box, vegetable crisper drawer, and durable door racks.',
    price: 195000,
    originalPrice: 220000,
    images: [
      '/src/assets/images/refrigerator_double_door_1794158922549.jpg'
    ],
    sizes: ['150 Litres'],
    colors: [
      { name: 'Metallic Grey', hex: '#64748B' }
    ],
    inStock: true,
    stockCount: 8,
    isFeatured: false
  },

  // --- GLASS TABLES ---
  {
    id: 'table-01',
    name: 'Executive Glass Dining Set (6 Chairs)',
    category: 'glass-tables',
    subcategory: 'Executive Dining Sets',
    description: '12mm tempered shatter-resistant glass dining tabletop supported by an interlocking architectural gold and matte black metal base, accompanied by 6 ergonomic padded grey dining chairs.',
    price: 580000,
    originalPrice: 650000,
    images: [
      '/src/assets/images/dining_glass_table_1794158922064.jpg'
    ],
    sizes: ['6 Seater (180cm x 90cm)'],
    colors: [
      { name: 'Gold & Grey Chairs', hex: '#D4AF37' },
      { name: 'Black & Navy Chairs', hex: '#1E3A8A' }
    ],
    inStock: true,
    stockCount: 4,
    isFeatured: true,
    isNew: true
  },
  {
    id: 'table-02',
    name: 'Modern Glass Centre Table',
    category: 'glass-tables',
    subcategory: 'Centre Tables',
    description: 'Chic dual-tier coffee table with clear tempered glass top and lower shelf for magazines and remotes. Accented with brass gold geometric frame.',
    price: 140000,
    originalPrice: 170000,
    images: [
      '/src/assets/images/hero_living_room_1794158920760.jpg',
      '/src/assets/images/dining_glass_table_1794158922064.jpg'
    ],
    sizes: ['100cm x 60cm'],
    colors: [
      { name: 'Champagne Gold', hex: '#E6C687' },
      { name: 'Matte Black', hex: '#262626' }
    ],
    inStock: true,
    stockCount: 10,
    isFeatured: true
  },
  {
    id: 'table-03',
    name: 'Tempered Glass Side & Lamp Table',
    category: 'glass-tables',
    subcategory: 'Side Tables',
    description: 'Compact circular side table with thick tempered smoked glass surface and sturdy tripod legs for bedside and couch ends.',
    price: 65000,
    originalPrice: 80000,
    images: [
      '/src/assets/images/dining_glass_table_1794158922064.jpg'
    ],
    sizes: ['50cm Diameter'],
    colors: [
      { name: 'Smoked Black', hex: '#1C1917' },
      { name: 'Polished Brass', hex: '#CA8A04' }
    ],
    inStock: true,
    stockCount: 14,
    isFeatured: false
  },

  // --- FANS ---
  {
    id: 'fan-01',
    name: 'Heavy-Duty 18-inch Standing Fan',
    category: 'fans',
    subcategory: 'Standing Fans',
    description: 'Industrial-strength 18-inch pedestal standing fan with 100% pure copper motor, 3 heavy metal blades, and wide-angle oscillation for maximum breeze in hot weather.',
    price: 38000,
    originalPrice: 45000,
    images: [
      '/src/assets/images/standing_fan_modern_1794158941438.jpg'
    ],
    sizes: ['18 Inch Blade'],
    colors: [
      { name: 'Black & Chrome', hex: '#1E293B' }
    ],
    inStock: true,
    stockCount: 25,
    brand: 'OX Master Air',
    isFeatured: true
  },
  {
    id: 'fan-02',
    name: 'Solar Rechargeable Fan with LED Light',
    category: 'fans',
    subcategory: 'Solar Fans',
    description: 'All-in-one solar and AC rechargeable standing fan with built-in lithium battery (up to 12 hours run time), USB mobile phone charging port, and night LED light.',
    price: 85000,
    originalPrice: 98000,
    images: [
      '/src/assets/images/standing_fan_modern_1794158941438.jpg'
    ],
    sizes: ['16 Inch with Solar Kit'],
    colors: [
      { name: 'Arctic White', hex: '#F1F5F9' },
      { name: 'Midnight Black', hex: '#0F172A' }
    ],
    inStock: true,
    stockCount: 18,
    brand: 'Lontor Power Breeze',
    isFeatured: true
  },
  {
    id: 'fan-03',
    name: 'High-Velocity Desk Table Fan',
    category: 'fans',
    subcategory: 'Table Fans',
    description: 'Compact yet powerful 12-inch table fan with 3-speed rotary switch and safety finger-proof mesh grill.',
    price: 32000,
    originalPrice: 38000,
    images: [
      '/src/assets/images/standing_fan_modern_1794158941438.jpg'
    ],
    sizes: ['12 Inch Desk'],
    colors: [
      { name: 'Black', hex: '#18181B' }
    ],
    inStock: true,
    stockCount: 16,
    isFeatured: false
  },

  // --- OTHER HOME APPLIANCES ---
  {
    id: 'app-01',
    name: 'Master Multi-Speed Blender with Dry Mill',
    category: 'appliances',
    subcategory: 'Blenders',
    description: 'High-torque commercial grade kitchen blender with 1.5L unbreakable polycarbonate jar, stainless steel 6-point blades, and heavy-duty seed and spice dry grinder.',
    price: 42000,
    originalPrice: 48000,
    images: [
      '/src/assets/images/home_appliances_set_1794158943111.jpg'
    ],
    sizes: ['1.5 Litre Bowl'],
    colors: [
      { name: 'Brushed Silver & Black', hex: '#475569' }
    ],
    inStock: true,
    stockCount: 22,
    brand: 'MasterChef Pro',
    isFeatured: true
  },
  {
    id: 'app-02',
    name: '4-Burner Glass-Top Table Gas Cooker',
    category: 'appliances',
    subcategory: 'Gas Cookers',
    description: 'Sleek tempered black glass gas table cooker with auto-ignition, heavy cast iron pan supports, and blue-flame high efficiency brass burners.',
    price: 115000,
    originalPrice: 130000,
    images: [
      '/src/assets/images/home_appliances_set_1794158943111.jpg'
    ],
    sizes: ['4 Burner Table Top'],
    colors: [
      { name: 'Black Tempered Glass', hex: '#0F172A' }
    ],
    inStock: true,
    stockCount: 11,
    isFeatured: true
  },
  {
    id: 'app-03',
    name: '20L Digital Microwave Oven with Grill',
    category: 'appliances',
    subcategory: 'Microwaves',
    description: '20-liter digital microwave with quick defrost, 8 auto-cook menus, digital clock display, and child safety lock.',
    price: 98000,
    originalPrice: 112000,
    images: [
      '/src/assets/images/home_appliances_set_1794158943111.jpg'
    ],
    sizes: ['20 Litres'],
    colors: [
      { name: 'Silver & Mirror Door', hex: '#64748B' }
    ],
    inStock: true,
    stockCount: 7,
    isFeatured: true
  },
  {
    id: 'app-04',
    name: 'Heavy-Duty Dry & Steam Electric Iron',
    category: 'appliances',
    subcategory: 'Electric Irons',
    description: 'Non-stick ceramic soleplate iron with variable heat thermostat, steam boost, and comfortable ergonomic handle for smooth pressing.',
    price: 26000,
    originalPrice: 32000,
    images: [
      '/src/assets/images/home_appliances_set_1794158943111.jpg'
    ],
    sizes: ['Standard 1200W'],
    colors: [
      { name: 'Ocean Blue', hex: '#0284C7' }
    ],
    inStock: true,
    stockCount: 30,
    isFeatured: false
  }
];
