import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  UserProfile,
  DeliveryArea,
  BusinessSettings,
  CategoryId,
  OrderType,
  CustomerInfo,
  DeliveryDetails,
  PickupDetails,
  OrderStatus,
  HomepageBanner,
  AdminTab
} from '../types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_AREAS,
  INITIAL_BUSINESS_SETTINGS
} from '../data/mockData';
import { generateOrderReference, buildWhatsAppMessage } from '../utils/formatters';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType
} from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const DEFAULT_BANNER: HomepageBanner = {
  id: 'banner-01',
  title: 'Make Your Home Beautiful',
  subtitle: 'Quality Furniture & Appliances at Great Prices.',
  imageUrl: '/src/assets/images/hero_living_room_1794158920760.jpg',
  ctaText: 'Shop Now',
  active: true
};

const ADMIN_EMAILS = [
  'chukwudebeifeanyi6@gmail.com',
  'admin@richardhomelogistics.com'
];

interface AppContextType {
  // Store Data
  products: Product[];
  categories: Category[];
  deliveryAreas: DeliveryArea[];
  businessSettings: BusinessSettings;
  banner: HomepageBanner;
  cart: CartItem[];
  favourites: string[];
  orders: Order[];
  allOrders: Order[]; // For Admin View
  user: UserProfile | null;
  firebaseAuthUser: FirebaseUser | null;
  isAdmin: boolean;

  // View & Portal Navigation
  currentPortal: 'customer' | 'admin';
  setCurrentPortal: (portal: 'customer' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  activeTab: 'home' | 'categories' | 'favourites' | 'cart' | 'account' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'categories' | 'favourites' | 'cart' | 'account' | 'orders' | 'profile') => void;
  selectedCategory: CategoryId | null;
  setSelectedCategory: (cat: CategoryId | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (sub: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderFormOpen: boolean;
  setIsOrderFormOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  activeOrderForWhatsApp: Order | null;
  setActiveOrderForWhatsApp: (order: Order | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authViewMode: 'login' | 'register' | 'forgot' | 'splash';
  setAuthViewMode: (mode: 'login' | 'register' | 'forgot' | 'splash') => void;
  isOrderReadyModalOpen: boolean;
  setIsOrderReadyModalOpen: (open: boolean) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  deviceMode: 'mobile-frame' | 'responsive';
  setDeviceMode: (mode: 'mobile-frame' | 'responsive') => void;
  toasts: ToastMessage[];

  // Ordering Actions
  directOrderProduct: CartItem | null;
  startDirectOrder: (product: Product, quantity?: number, size?: string, color?: string) => void;
  openCartOrderForm: () => void;
  submitOrder: (params: {
    customer: CustomerInfo;
    orderType: OrderType;
    delivery?: DeliveryDetails;
    pickup?: PickupDetails;
    deliveryFee: number;
    itemsToOrder?: CartItem[];
  }) => Order;

  // Cart Operations
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Favourites
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;

  // Authentication
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Admin CRUD Operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductPrice: (productId: string, newPrice: number) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addDeliveryArea: (area: DeliveryArea) => Promise<void>;
  updateDeliveryAreaFee: (id: string, newFee: number) => Promise<void>;
  deleteDeliveryArea: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  updateHomepageBanner: (banner: HomepageBanner) => Promise<void>;
  updateBusinessSettings: (settings: BusinessSettings) => Promise<void>;

  // Notification helper
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(INITIAL_DELIVERY_AREAS);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(INITIAL_BUSINESS_SETTINGS);
  const [banner, setBanner] = useState<HomepageBanner>(DEFAULT_BANNER);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rhl_cart');
      if (saved) return JSON.parse(saved);
      // Pre-seed with Executive Bed (350k) and Smart TV 55" (650k) = ₦1,000,000 as seen in user's mockup!
      const bed = INITIAL_PRODUCTS.find((p) => p.id === 'bed-01');
      const tv = INITIAL_PRODUCTS.find((p) => p.id === 'tv-01');
      const initialItems: CartItem[] = [];
      if (bed) {
        initialItems.push({
          id: 'cart-1',
          product: bed,
          quantity: 1,
          selectedSize: 'Queen',
          selectedColor: 'Royal Navy',
          unitPrice: bed.price,
        });
      }
      if (tv) {
        initialItems.push({
          id: 'cart-2',
          product: tv,
          quantity: 1,
          selectedSize: '55 Inch',
          selectedColor: 'Matte Black',
          unitPrice: tv.price,
        });
      }
      return initialItems;
    } catch {
      return [];
    }
  });

  // Favourites
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rhl_favourites');
      return saved ? JSON.parse(saved) : ['bed-01', 'tv-01'];
    } catch {
      return ['bed-01', 'tv-01'];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('rhl_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Auth & User Profile
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('rhl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Portal State & Navigation
  const [currentPortal, setCurrentPortal] = useState<'customer' | 'admin'>('customer');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'favourites' | 'cart' | 'account' | 'orders' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [activeOrderForWhatsApp, setActiveOrderForWhatsApp] = useState<Order | null>(null);
  const [directOrderProduct, setDirectOrderProduct] = useState<CartItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authViewMode, setAuthViewMode] = useState<'login' | 'register' | 'forgot' | 'splash'>('login');
  const [isOrderReadyModalOpen, setIsOrderReadyModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin authorization check - strictly requires active authenticated Firebase user
  const isAdmin = Boolean(
    firebaseAuthUser && (
      (firebaseAuthUser.email && ADMIN_EMAILS.includes(firebaseAuthUser.email.toLowerCase())) ||
      user?.role === 'admin'
    )
  );

  // Toast feedback helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseAuthUser(fbUser);
      if (fbUser) {
        const isUserAdmin = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '');
        const profile: UserProfile = {
          uid: fbUser.uid,
          fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
          email: fbUser.email || '',
          phoneNumber: fbUser.phoneNumber || '+234 906 970 687',
          savedAddress: user?.savedAddress || '123 Main Street, Asaba',
          savedNearestBusStop: user?.savedNearestBusStop || 'Holy Family Bus Stop',
          role: isUserAdmin ? 'admin' : 'customer',
          isGuest: false,
        };
        setUser(profile);

        // Sync with Firestore user document
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setUser({
              uid: fbUser.uid,
              fullName: data.fullName || profile.fullName,
              email: data.email || profile.email,
              phoneNumber: data.phoneNumber || profile.phoneNumber,
              savedAddress: data.savedAddress || profile.savedAddress,
              savedNearestBusStop: data.savedNearestBusStop || profile.savedNearestBusStop,
              role: data.role || (isUserAdmin ? 'admin' : 'customer'),
              isGuest: false,
            });
          } else {
            await setDoc(userDocRef, {
              ...profile,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, 'users');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore sync for Products
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => list.push(d.data() as Product));
          setProducts(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );
    return () => unsub();
  }, []);

  // 3. Real-time Firestore sync for Categories
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Category[] = [];
          snapshot.forEach((d) => list.push(d.data() as Category));
          setCategories(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories');
      }
    );
    return () => unsub();
  }, []);

  // 4. Real-time Firestore sync for Delivery Areas
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'deliveryAreas'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: DeliveryArea[] = [];
          snapshot.forEach((d) => list.push(d.data() as DeliveryArea));
          setDeliveryAreas(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'deliveryAreas');
      }
    );
    return () => unsub();
  }, []);

  // 5. Real-time Firestore sync for Business Settings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'businessSettings', 'main'),
      (snap) => {
        if (snap.exists()) {
          setBusinessSettings(snap.data() as BusinessSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'businessSettings/main');
      }
    );
    return () => unsub();
  }, []);

  // 6. Real-time Firestore sync for Homepage Banner
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'homepageBanners', 'main'),
      (snap) => {
        if (snap.exists()) {
          setBanner(snap.data() as HomepageBanner);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'homepageBanners/main');
      }
    );
    return () => unsub();
  }, []);

  // 7. Real-time Firestore sync for Orders
  useEffect(() => {
    // Only attach listener if Firebase Auth is ready and user is signed in
    if (!firebaseAuthUser) {
      setAllOrders([]);
      return;
    }

    if (isAdmin) {
      const unsub = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((d) => list.push(d.data() as Order));
          setAllOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsub();
    } else {
      const q = query(collection(db, 'orders'), where('customerId', '==', firebaseAuthUser.uid));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((d) => list.push(d.data() as Order));
          setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsub();
    }
  }, [isAdmin, firebaseAuthUser]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('rhl_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('rhl_favourites', JSON.stringify(favourites));
  }, [favourites]);
  useEffect(() => {
    localStorage.setItem('rhl_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    if (user) {
      localStorage.setItem('rhl_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rhl_user');
    }
  }, [user]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const chosenSize = size || product.sizes?.[0] || 'Standard';
    const chosenColor = color || product.colors?.[0]?.name || 'Standard';
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === chosenSize &&
        item.selectedColor === chosenColor
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
        product,
        quantity,
        selectedSize: chosenSize,
        selectedColor: chosenColor,
        unitPrice: product.price,
      };
      setCart([...cart, newItem]);
    }
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Direct Order vs Cart Order Flow (PART 4)
  const startDirectOrder = (product: Product, quantity = 1, size?: string, color?: string) => {
    const item: CartItem = {
      id: `direct-${Date.now()}`,
      product,
      quantity,
      selectedSize: size || product.sizes?.[0] || 'Standard',
      selectedColor: color || product.colors?.[0]?.name || 'Standard',
      unitPrice: product.price,
    };
    setDirectOrderProduct(item);
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  const openCartOrderForm = () => {
    setDirectOrderProduct(null);
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  // Order Submission
  const submitOrder = (params: {
    customer: CustomerInfo;
    orderType: OrderType;
    delivery?: DeliveryDetails;
    pickup?: PickupDetails;
    deliveryFee: number;
    itemsToOrder?: CartItem[];
  }): Order => {
    const items = params.itemsToOrder && params.itemsToOrder.length > 0
      ? params.itemsToOrder
      : directOrderProduct
      ? [directOrderProduct]
      : cart;

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const grandTotal = subtotal + params.deliveryFee;
    const reference = generateOrderReference(params.delivery?.city || 'ASB');

    const whatsAppMessage = buildWhatsAppMessage({
      reference,
      customer: params.customer,
      items,
      orderType: params.orderType,
      delivery: params.delivery,
      pickup: params.pickup,
      subtotal,
      deliveryFee: params.deliveryFee,
      grandTotal,
    });

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      reference,
      customerId: firebaseAuthUser?.uid || (user?.isGuest ? undefined : user?.uid),
      customer: params.customer,
      items,
      orderType: params.orderType,
      delivery: params.delivery,
      pickup: params.pickup,
      subtotal,
      deliveryFee: params.deliveryFee,
      grandTotal,
      status: 'New',
      createdAt: new Date().toISOString(),
      whatsAppMessage,
    };

    // Save to local state
    setOrders((prev) => [newOrder, ...prev]);
    setAllOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Save to Cloud Firestore
    const orderDocRef = doc(db, 'orders', newOrder.id);
    setDoc(orderDocRef, {
      ...newOrder,
      items: newOrder.items.map((i) => ({
        id: i.id,
        productId: i.product.id,
        productName: i.product.name,
        category: i.product.category,
        subcategory: i.product.subcategory,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        selectedSize: i.selectedSize || '',
        selectedColor: i.selectedColor || '',
      })),
    }).catch((err) => {
      console.warn('Firestore order save:', err);
    });

    // Clear cart if this was a cart order
    if (!directOrderProduct) {
      clearCart();
    }
    setDirectOrderProduct(null);

    // Close form and open "Order Ready!" celebration modal
    setIsOrderFormOpen(false);
    setIsOrderReadyModalOpen(true);

    return newOrder;
  };

  // Favourites
  const toggleFavourite = async (productId: string) => {
    if (favourites.includes(productId)) {
      setFavourites((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from favourites', 'info');
    } else {
      setFavourites((prev) => [...prev, productId]);
      showToast('Saved to favourites', 'success');
      if (firebaseAuthUser) {
        try {
          const favRef = doc(db, 'favourites', `${firebaseAuthUser.uid}_${productId}`);
          await setDoc(favRef, {
            userId: firebaseAuthUser.uid,
            productId,
            createdAt: new Date().toISOString(),
          });
        } catch {
          // offline
        }
      }
    }
  };

  const isFavourite = (productId: string) => favourites.includes(productId);

  // Authentication (PART 1)
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const isUserAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const profile: UserProfile = {
        uid: cred.user.uid,
        fullName: cred.user.displayName || email.split('@')[0],
        email: cred.user.email || email,
        phoneNumber: user?.phoneNumber || '+234 906 970 687',
        savedAddress: user?.savedAddress || '123 Main Street, Asaba',
        savedNearestBusStop: user?.savedNearestBusStop || 'Holy Family Bus Stop',
        role: isUserAdmin ? 'admin' : 'customer',
        isGuest: false,
      };
      setUser(profile);
      setIsAuthModalOpen(false);
      showToast('Signed in successfully!', 'success');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      let msg = 'Login failed. Please check your email and password.';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password.';
      } else if (code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again shortly.';
      }
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const registerWithEmail = async (fullName: string, email: string, phone: string, pass: string): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, { displayName: fullName.trim() });
      const isUserAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const profile: UserProfile = {
        uid: cred.user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        savedAddress: '123 Main Street, Asaba',
        savedNearestBusStop: 'Holy Family Bus Stop',
        role: isUserAdmin ? 'admin' : 'customer',
        isGuest: false,
      };
      setUser(profile);

      // Save user to Firestore
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        ...profile,
        createdAt: new Date().toISOString(),
      });

      setIsAuthModalOpen(false);
      showToast(`Welcome, ${fullName}! Account created.`, 'success');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      let msg = 'Registration failed. Please try again.';
      if (code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please login instead.';
      } else if (code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const isUserAdmin = ADMIN_EMAILS.includes(cred.user.email?.toLowerCase() || '');
      const profile: UserProfile = {
        uid: cred.user.uid,
        fullName: cred.user.displayName || 'Customer',
        email: cred.user.email || '',
        phoneNumber: cred.user.phoneNumber || '+234 906 970 687',
        savedAddress: '123 Main Street, Asaba',
        savedNearestBusStop: 'Holy Family Bus Stop',
        role: isUserAdmin ? 'admin' : 'customer',
        isGuest: false,
      };
      setUser(profile);
      setIsAuthModalOpen(false);
      showToast('Google sign-in successful!', 'success');
      return true;
    } catch (err: unknown) {
      console.warn('Google sign-in exception:', err);
      const code = (err as { code?: string }).code;
      let msg = 'Google sign-in failed. Please try again.';
      if (code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked. Please enable popups for this site.';
      } else if (code === 'auth/cancelled-popup-request') {
        msg = 'Sign-in window was closed.';
      }
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast(`Password reset link dispatched to ${email}`, 'success');
      return true;
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      let msg = 'Unable to send password reset email.';
      if (code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      }
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const continueAsGuest = () => {
    setUser({
      uid: 'guest_' + Date.now(),
      fullName: 'Guest Customer',
      email: '',
      phoneNumber: '',
      savedAddress: '',
      isGuest: true,
      role: 'customer',
    });
    setIsAuthModalOpen(false);
    showToast('Browsing as guest', 'info');
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // offline
    }
    setUser(null);
    setFirebaseAuthUser(null);
    setCurrentPortal('customer');
    showToast('Signed out', 'info');
  };

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...profileUpdate };
      setUser(updated);
      showToast('Profile updated', 'success');
      if (firebaseAuthUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseAuthUser.uid);
          await updateDoc(userDocRef, profileUpdate);
        } catch {
          // offline
        }
      }
    }
  };

  // Admin CRUD Operations (PART 3)
  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProd: Product = { ...prodData, id };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to catalogue!`, 'success');
    try {
      await setDoc(doc(db, 'products', id), newProd);
    } catch (err) {
      console.warn('Firestore add product:', err);
    }
  };

  const updateProduct = async (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    showToast(`Updated ${product.name}!`, 'success');
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      console.warn('Firestore update product:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted', 'info');
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product:', err);
    }
  };

  const updateProductPrice = async (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    showToast('Price updated in catalogue', 'success');
    try {
      await updateDoc(doc(db, 'products', productId), { price: newPrice });
    } catch (err) {
      console.warn('Firestore price update:', err);
    }
  };

  const addCategory = async (cat: Category) => {
    setCategories((prev) => [...prev, cat]);
    showToast(`Category ${cat.name} created!`, 'success');
    try {
      await setDoc(doc(db, 'categories', cat.id), cat);
    } catch (err) {
      console.warn('Firestore add category:', err);
    }
  };

  const updateCategory = async (cat: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    showToast(`Category ${cat.name} updated!`, 'success');
    try {
      await setDoc(doc(db, 'categories', cat.id), cat);
    } catch (err) {
      console.warn('Firestore update category:', err);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Category deleted', 'info');
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      console.warn('Firestore delete category:', err);
    }
  };

  const addDeliveryArea = async (area: DeliveryArea) => {
    setDeliveryAreas((prev) => [...prev, area]);
    showToast(`Added ${area.name} to delivery zones!`, 'success');
    try {
      await setDoc(doc(db, 'deliveryAreas', area.id), area);
    } catch (err) {
      console.warn('Firestore add delivery area:', err);
    }
  };

  const updateDeliveryAreaFee = async (id: string, newFee: number) => {
    setDeliveryAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, fee: newFee } : a))
    );
    showToast('Delivery fee updated', 'success');
    try {
      await updateDoc(doc(db, 'deliveryAreas', id), { fee: newFee });
    } catch (err) {
      console.warn('Firestore delivery fee update:', err);
    }
  };

  const deleteDeliveryArea = async (id: string) => {
    setDeliveryAreas((prev) => prev.filter((a) => a.id !== id));
    showToast('Delivery area removed', 'info');
    try {
      await deleteDoc(doc(db, 'deliveryAreas', id));
    } catch (err) {
      console.warn('Firestore delete delivery area:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to "${newStatus}"`, 'success');
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (err) {
      console.warn('Firestore order status update:', err);
    }
  };

  const updateHomepageBanner = async (newBanner: HomepageBanner) => {
    setBanner(newBanner);
    showToast('Homepage banner updated!', 'success');
    try {
      await setDoc(doc(db, 'homepageBanners', 'main'), newBanner);
    } catch (err) {
      console.warn('Firestore banner update:', err);
    }
  };

  const updateBusinessSettings = async (settings: BusinessSettings) => {
    setBusinessSettings(settings);
    showToast('Store settings saved', 'success');
    try {
      await setDoc(doc(db, 'businessSettings', 'main'), settings);
    } catch (err) {
      console.warn('Firestore settings update:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        deliveryAreas,
        businessSettings,
        banner,
        cart,
        favourites,
        orders,
        allOrders,
        user,
        firebaseAuthUser,
        isAdmin,

        currentPortal,
        setCurrentPortal,
        adminTab,
        setAdminTab,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,

        isCartOpen,
        setIsCartOpen,
        isOrderFormOpen,
        setIsOrderFormOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        activeOrderForWhatsApp,
        setActiveOrderForWhatsApp,
        directOrderProduct,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authViewMode,
        setAuthViewMode,
        isOrderReadyModalOpen,
        setIsOrderReadyModalOpen,
        activeOrder,
        setActiveOrder,
        deviceMode,
        setDeviceMode,
        toasts,

        startDirectOrder,
        openCartOrderForm,
        submitOrder,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,

        toggleFavourite,
        isFavourite,

        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        continueAsGuest,
        logout,
        updateUserProfile,

        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrice,
        addCategory,
        updateCategory,
        deleteCategory,
        addDeliveryArea,
        updateDeliveryAreaFee,
        deleteDeliveryArea,
        updateOrderStatus,
        updateHomepageBanner,
        updateBusinessSettings,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
