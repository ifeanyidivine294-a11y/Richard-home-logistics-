export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  stockCount?: number;
  brand?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  unitPrice: number;
}

export type OrderType = 'delivery' | 'pickup';

export interface DeliveryDetails {
  state: string;
  city: string;
  address: string;
  nearestBusStop: string;
  deliveryAreaId: string;
  additionalInstructions?: string;
  deliveryFee: number;
}

export interface PickupDetails {
  preferredDate: string;
  preferredTime: string;
  pickupPhone: string;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
}

export type OrderStatus =
  | 'New'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'Processing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled'
  | 'Pending WhatsApp Confirmation';

export interface Order {
  id: string;
  reference: string;
  customerId?: string;
  customer: CustomerInfo;
  items: CartItem[];
  orderType: OrderType;
  delivery?: DeliveryDetails;
  pickup?: PickupDetails;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  whatsAppMessage: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  fee: number;
  isCovered: boolean;
  note?: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  savedAddress: string;
  savedNearestBusStop?: string;
  role?: 'customer' | 'admin';
  isGuest?: boolean;
}

export interface BusinessSettings {
  storeName: string;
  tagline: string;
  whatsAppNumber: string; // e.g. "234906970687"
  displayPhone: string;   // e.g. "+234 906 970 687"
  physicalAddress: string;
  openingHours: string;
  pickupSlots: string[];
}

export interface HomepageBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  active: boolean;
}

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'pricing'
  | 'add-product'
  | 'categories'
  | 'delivery'
  | 'orders'
  | 'banners'
  | 'profile';
