import { CartItem, CustomerInfo, DeliveryDetails, PickupDetails, OrderType } from '../types';

/**
 * Formats a number into Nigerian Naira currency format (e.g. ₦350,000)
 */
export function formatNaira(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

/**
 * Generates an authentic order reference (e.g. RHL-8291-ASB)
 */
export function generateOrderReference(city = 'ASB'): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  const prefix = city.slice(0, 3).toUpperCase();
  return `RHL-${random}-${prefix || 'NG'}`;
}

export interface BuildWhatsAppMessageParams {
  reference: string;
  customer: CustomerInfo;
  items: CartItem[];
  orderType: OrderType;
  delivery?: DeliveryDetails;
  pickup?: PickupDetails;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

/**
 * Generates the clean WhatsApp order confirmation message
 * Excludes delivery fields for pickup orders, and pickup fields for delivery orders.
 */
export function buildWhatsAppMessage(params: BuildWhatsAppMessageParams): string {
  const {
    reference,
    customer,
    items,
    orderType,
    delivery,
    pickup,
    subtotal,
    deliveryFee,
    grandTotal
  } = params;

  let message = `RICHARD HOME LOGISTICS — NEW ORDER\n\n`;
  message += `Order Reference: ${reference}\n\n`;

  // Customer Details
  message += `CUSTOMER DETAILS\n`;
  message += `Full Name: ${customer.fullName}\n`;
  message += `Phone Number: ${customer.phoneNumber}\n`;
  if (customer.email) {
    message += `Email: ${customer.email}\n`;
  }
  if (orderType === 'delivery' && delivery?.address) {
    message += `Delivery Address: ${delivery.address}, ${delivery.city || ''} ${delivery.state || ''}\n`;
  }
  message += `\n`;

  // Order Items
  message += `ORDER ITEMS\n\n`;
  items.forEach((item, index) => {
    const itemSubtotal = item.unitPrice * item.quantity;
    message += `${index + 1}. Product: ${item.product.name}\n`;
    message += `   Category: ${item.product.category.toUpperCase()}\n`;
    message += `   Type: ${item.product.subcategory}\n`;
    if (item.selectedSize) {
      message += `   Size: ${item.selectedSize}\n`;
    }
    if (item.selectedColor) {
      message += `   Colour: ${item.selectedColor}\n`;
    }
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Unit Price: ${formatNaira(item.unitPrice)}\n`;
    message += `   Subtotal: ${formatNaira(itemSubtotal)}\n\n`;
  });

  // Order Summary
  message += `ORDER SUMMARY\n`;
  message += `Product Subtotal: ${formatNaira(subtotal)}\n`;
  message += `Delivery/Pickup: ${orderType === 'delivery' ? 'Deliver to me' : 'I will pick up'}\n`;
  message += `Delivery Fee: ${orderType === 'delivery' ? (deliveryFee > 0 ? formatNaira(deliveryFee) : 'To be confirmed on WhatsApp') : '₦0 (Store Pickup)'}\n`;
  message += `Grand Total: ${formatNaira(grandTotal)}\n\n`;

  // Dynamic Delivery or Pickup section
  if (orderType === 'delivery' && delivery) {
    message += `DELIVERY DETAILS\n`;
    message += `Town / Area: ${delivery.city || 'Asaba'}\n`;
    message += `Full Address: ${delivery.address}\n`;
    message += `Nearest Bus Stop: ${delivery.nearestBusStop}\n`;
    if (delivery.additionalInstructions?.trim()) {
      message += `Additional Instructions: ${delivery.additionalInstructions}\n`;
    }
    message += `\n`;
  } else if (orderType === 'pickup' && pickup) {
    message += `PICKUP DETAILS\n`;
    message += `Preferred Date: ${pickup.preferredDate}\n`;
    message += `Preferred Time: ${pickup.preferredTime}\n`;
    message += `Pickup Contact Phone: ${pickup.pickupPhone || customer.phoneNumber}\n\n`;
  }

  message += `CUSTOMER CONFIRMATION:\n`;
  message += `I confirm that these order details are correct.\n\n`;
  message += `Please confirm availability and the next steps for payment and fulfilment.`;

  return message;
}

/**
 * Creates wa.me link with encoded text
 */
export function createWhatsAppUrl(phoneWithoutPlus: string, message: string): string {
  const cleanPhone = phoneWithoutPlus.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
