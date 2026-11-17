import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  PlusCircle,
  FolderTree,
  Truck,
  ClipboardList,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Crown,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  Save,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatNaira } from '../utils/formatters';
import { Product, OrderStatus, Category, DeliveryArea } from '../types';

export const AdminPortal: React.FC = () => {
  const {
    products,
    categories,
    deliveryAreas,
    businessSettings,
    banner,
    allOrders,
    user,
    setCurrentPortal,
    adminTab,
    setAdminTab,
    logout,
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
    showToast
  } = useApp();

  // Search in products
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'beds');
  const [newProdSubcategory, setNewProdSubcategory] = useState('Executive Beds');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(250000);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState<number>(300000);
  const [newProdSize, setNewProdSize] = useState('6x6 ft');
  const [newProdColors, setNewProdColors] = useState('Royal Navy, Charcoal');
  const [newProdBrand, setNewProdBrand] = useState('Richard Home');
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdImages, setNewProdImages] = useState('/src/assets/images/bed_executive_luxury_1794158921338.jpg');
  const [newProdFeatured, setNewProdFeatured] = useState(true);

  // New Category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubcategories, setNewCatSubcategories] = useState('All, Standard, Luxury');
  const [newCatImage, setNewCatImage] = useState('/src/assets/images/bed_executive_luxury_1794158921338.jpg');

  // New Delivery Area state
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaFee, setNewAreaFee] = useState<number>(15000);
  const [newAreaNote, setNewAreaNote] = useState('');

  // Banner edit state
  const [bannerTitle, setBannerTitle] = useState(banner.title);
  const [bannerSubtitle, setBannerSubtitle] = useState(banner.subtitle);
  const [bannerImage, setBannerImage] = useState(banner.imageUrl);

  // Store settings edit state
  const [storePhone, setStorePhone] = useState(businessSettings.displayPhone);
  const [storeWhatsApp, setStoreWhatsApp] = useState(businessSettings.whatsAppNumber);
  const [storeAddress, setStoreAddress] = useState(businessSettings.physicalAddress);
  const [storeHours, setStoreHours] = useState(businessSettings.openingHours);

  // Image Upload helper (converts uploaded file to local Data URL for immediate display & Firestore)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
          showToast('Image uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalOrdersCount = allOrders.length;
  const newOrdersCount = allOrders.filter((o) => o.status === 'New' || o.status === 'Awaiting Confirmation').length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }
    const colorArray = newProdColors.split(',').map((c) => ({
      name: c.trim(),
      hex: '#0A2558',
    }));
    const sizeArray = newProdSize.split(',').map((s) => s.trim());

    await addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      subcategory: newProdSubcategory.trim() || 'General',
      description: newProdDesc.trim(),
      price: Number(newProdPrice),
      originalPrice: newProdOrigPrice ? Number(newProdOrigPrice) : undefined,
      images: [newProdImages],
      sizes: sizeArray,
      colors: colorArray,
      inStock: Number(newProdStock) > 0,
      stockCount: Number(newProdStock),
      brand: newProdBrand.trim() || undefined,
      isFeatured: newProdFeatured,
      isNew: true,
    });

    // Reset
    setNewProdName('');
    setNewProdDesc('');
    setAdminTab('products');
  };

  const handleSaveEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const subs = newCatSubcategories.split(',').map((s) => s.trim()).filter(Boolean);
    await addCategory({
      id: catId,
      name: newCatName.trim(),
      image: newCatImage,
      itemCount: 0,
      subcategories: subs.length > 0 ? subs : ['All'],
    });
    setNewCatName('');
  };

  const handleCreateDeliveryArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    const areaId = newAreaName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    await addDeliveryArea({
      id: areaId,
      name: newAreaName.trim(),
      fee: Number(newAreaFee),
      isCovered: true,
      note: newAreaNote.trim() || undefined,
    });
    setNewAreaName('');
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepageBanner({
      ...banner,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      imageUrl: bannerImage,
    });
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessSettings({
      ...businessSettings,
      displayPhone: storePhone,
      whatsAppNumber: storeWhatsApp.replace(/\D/g, ''),
      physicalAddress: storeAddress,
      openingHours: storeHours,
    });
  };

  const filteredAdminProducts = products.filter((p) => {
    if (!productSearch) return true;
    return (
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  return (
    <div className="flex-1 bg-[#F4F7FC] flex flex-col min-h-screen text-slate-800 pb-12">
      {/* Top Admin Header */}
      <div className="bg-[#071B49] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF8500] text-white flex items-center justify-center shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-tight text-white">
                  Admin Portal
                </span>
                <span className="text-[9px] bg-[#FF8500] text-white px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  Store Manager
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Richard Home Logistics — Asaba
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPortal('customer')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Switch to Public View
          </button>
        </div>
      </div>

      {/* Main Admin Layout: Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[53px] z-20 overflow-x-auto no-scrollbar shadow-xs">
        <div className="flex items-center gap-1 px-3 py-1.5 min-w-max text-xs font-bold text-slate-600">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'dashboard' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setAdminTab('products')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'products' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Manage Products
          </button>
          <button
            onClick={() => setAdminTab('pricing')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'pricing' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Update Prices
          </button>
          <button
            onClick={() => setAdminTab('add-product')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'add-product' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add New Product
          </button>
          <button
            onClick={() => setAdminTab('categories')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'categories' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> Manage Categories
          </button>
          <button
            onClick={() => setAdminTab('delivery')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'delivery' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Delivery Settings
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 relative ${
              adminTab === 'orders' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> View Orders
            {newOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {newOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setAdminTab('banners')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'banners' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Manage Banners
          </button>
          <button
            onClick={() => setAdminTab('profile')}
            className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
              adminTab === 'profile' ? 'bg-[#FF8500] text-white' : 'hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Profile Settings
          </button>
          <button
            onClick={() => logout()}
            className="py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 text-red-600 hover:bg-red-50 ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="p-4 space-y-4 max-w-6xl mx-auto w-full">
        {/* Signed In Banner */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs text-slate-600">
          <div>
            Signed in as:{' '}
            <strong className="text-[#071B49] font-mono">
              {user?.email || 'admin@richardhomelogistics.com'}
            </strong>{' '}
            (Administrator)
          </div>
          <button
            onClick={() => setCurrentPortal('customer')}
            className="text-[#FF8500] font-bold hover:underline"
          >
            Preview Public Store →
          </button>
        </div>

        {/* 1. DASHBOARD TAB */}
        {adminTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Total Products
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#071B49] mt-1 tabular-nums">
                  {totalProducts}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  {inStockProducts} In Stock
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Out of Stock
                </span>
                <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1 tabular-nums">
                  {outOfStockProducts}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Items requiring restock
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Categories
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#071B49] mt-1 tabular-nums">
                  {categories.length}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Active Catalogue Departments
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Total Orders
                </span>
                <div className="text-xl sm:text-2xl font-black text-[#FF8500] mt-1 tabular-nums">
                  {totalOrdersCount}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  {newOrdersCount} New Requests
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setAdminTab('add-product')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-[#071B49] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#FF8500]" /> Add New Product
              </button>
              <button
                onClick={() => setAdminTab('pricing')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-[#071B49] flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-[#FF8500]" /> Edit All Prices
              </button>
              <button
                onClick={() => setAdminTab('delivery')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-[#071B49] flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#FF8500]" /> Delivery Fees
              </button>
              <button
                onClick={() => setAdminTab('orders')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-[#071B49] flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4 text-[#FF8500]" /> View All Orders
              </button>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent WhatsApp Order Requests
                </h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs font-semibold text-[#FF8500] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {allOrders.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {allOrders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#071B49] flex items-center gap-2">
                          <span>{ord.reference}</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            ({ord.customer.fullName} · {ord.customer.phoneNumber})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ord.items.length} items · {ord.orderType === 'delivery' ? 'Doorstep Delivery' : 'Store Pickup'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#FF8500] tabular-nums">
                          {formatNaira(ord.grandTotal)}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No orders recorded yet. As customers order via WhatsApp, they will appear here.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. MANAGE PRODUCTS TAB */}
        {adminTab === 'products' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-sm font-bold text-slate-900">
                Product Inventory ({products.length})
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <button
                  onClick={() => setAdminTab('add-product')}
                  className="px-3 py-1.5 bg-[#FF8500] text-white rounded-lg text-xs font-bold hover:bg-[#ff941a] transition flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>
            </div>

            {/* Products Table/Cards */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="divide-y divide-slate-100">
                {filteredAdminProducts.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {p.category} · {p.subcategory} {p.brand ? `· ${p.brand}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-[#071B49] tabular-nums">
                            {formatNaira(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatNaira(p.originalPrice)}
                            </span>
                          )}
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-sm font-semibold ${
                              p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. UPDATE PRICES TAB */}
        {adminTab === 'pricing' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Quick Price Manager (Naira ₦)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Directly adjust selling prices to keep catalogue in sync with real market rates.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
              {products.map((prod) => (
                <div key={prod.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {prod.category} · {prod.subcategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">₦</span>
                    <input
                      type="number"
                      step="5000"
                      defaultValue={prod.price}
                      onBlur={(e) => {
                        const newPrice = Number(e.target.value);
                        if (newPrice > 0 && newPrice !== prod.price) {
                          updateProductPrice(prod.id, newPrice);
                        }
                      }}
                      className="w-28 text-right font-bold text-slate-900 border border-slate-300 rounded-lg py-1 px-2 text-xs focus:border-[#FF8500]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ADD NEW PRODUCT TAB */}
        {adminTab === 'add-product' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#FF8500]" /> Add New Product to Catalogue
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Royal King Padded Bed"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name (Optional)</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Richard Home Exclusive"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subcategory *</label>
                  <input
                    type="text"
                    required
                    value={newProdSubcategory}
                    onChange={(e) => setNewProdSubcategory(e.target.value)}
                    placeholder="e.g. Executive Beds"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Previous / Strikethrough Price (₦)</label>
                  <input
                    type="number"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={newProdSize}
                    onChange={(e) => setNewProdSize(e.target.value)}
                    placeholder="6x6 ft, 6x7 ft King"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Colours (comma separated)</label>
                  <input
                    type="text"
                    value={newProdColors}
                    onChange={(e) => setNewProdColors(e.target.value)}
                    placeholder="Navy, Charcoal, Beige"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detailed specifications, dimensions, and materials..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              {/* Image upload / photo selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Product Photograph (Upload from Device or paste URL)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={newProdImages}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, setNewProdImages)}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-[#071B49] hover:file:bg-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newProdImages}
                      onChange={(e) => setNewProdImages(e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full py-1 px-2 rounded-md border border-slate-200 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={newProdFeatured}
                  onChange={(e) => setNewProdFeatured(e.target.checked)}
                  className="accent-[#FF8500]"
                />
                <label htmlFor="featuredCheck" className="font-semibold text-slate-800 cursor-pointer">
                  Display as Featured Product on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdminTab('products')}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Product to Catalogue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. MANAGE CATEGORIES TAB */}
        {adminTab === 'categories' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Add New Category
              </h3>
              <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category Name (e.g. Wardrobes)"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newCatSubcategories}
                    onChange={(e) => setNewCatSubcategories(e.target.value)}
                    placeholder="Subcategories (comma-separated)"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#FF8500] text-white font-bold rounded-lg"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Categories list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{c.name}</h4>
                      <p className="text-[10px] text-slate-500">
                        {c.subcategories.join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${c.name}"?`)) {
                        deleteCategory(c.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. DELIVERY SETTINGS TAB */}
        {adminTab === 'delivery' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Add New Delivery Area & State
              </h3>
              <form onSubmit={handleCreateDeliveryArea} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <input
                    type="text"
                    required
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="Area / Town Name (e.g. Agbor, Delta State)"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={newAreaFee}
                    onChange={(e) => setNewAreaFee(Number(e.target.value))}
                    placeholder="Fee (₦)"
                    className="w-full py-2 px-3 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#FF8500] text-white font-bold rounded-lg"
                  >
                    Add Delivery Area
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
              {deliveryAreas.map((area) => (
                <div key={area.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{area.name}</h4>
                    {area.note && <p className="text-[10px] text-slate-400">{area.note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">₦</span>
                    <input
                      type="number"
                      step="1000"
                      defaultValue={area.fee}
                      onBlur={(e) => updateDeliveryAreaFee(area.id, Number(e.target.value))}
                      className="w-24 text-right font-bold text-[#071B49] border border-slate-300 rounded-lg py-1 px-2 text-xs"
                    />
                    <button
                      onClick={() => deleteDeliveryArea(area.id)}
                      className="p-1 rounded-md text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. VIEW ORDERS TAB */}
        {adminTab === 'orders' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Customer Orders Log ({allOrders.length})
            </h2>

            {allOrders.length > 0 ? (
              <div className="space-y-3">
                {allOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Reference</span>
                        <div className="font-mono font-black text-[#071B49]">{ord.reference}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold py-1 px-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-800"
                        >
                          <option value="New">New</option>
                          <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <strong>Customer:</strong> {ord.customer.fullName} ({ord.customer.phoneNumber})
                      </div>
                      <div>
                        <strong>Fulfillment:</strong> {ord.orderType === 'delivery' ? `Delivery (${ord.delivery?.city || 'Asaba'})` : 'Showroom Pick Up'}
                      </div>
                      {ord.delivery && (
                        <div className="sm:col-span-2 text-[11px] text-slate-500">
                          <strong>Address:</strong> {ord.delivery.address}, Bus Stop: {ord.delivery.nearestBusStop}
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg space-y-1">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-slate-600">
                          <span>{i.quantity}x {i.product.name} ({i.selectedSize || 'Std'})</span>
                          <span className="font-bold tabular-nums">{formatNaira(i.unitPrice * i.quantity)}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-slate-900">
                        <span>Total (including delivery {formatNaira(ord.deliveryFee)}):</span>
                        <span className="text-[#FF8500]">{formatNaira(ord.grandTotal)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <a
                        href={`https://wa.me/${ord.customer.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${ord.customer.fullName}, Richard Home Logistics here regarding your order ${ord.reference}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#16A34A] text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl text-center text-xs text-slate-400">
                No customer orders received yet.
              </div>
            )}
          </div>
        )}

        {/* 8. MANAGE BANNERS TAB */}
        {adminTab === 'banners' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FF8500]" /> Edit Homepage Promo Banner
            </h2>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtext / Supporting Text</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div className="w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                <img
                  src={bannerImage}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold rounded-xl shadow-xs"
              >
                Save Homepage Banner
              </button>
            </form>
          </div>
        )}

        {/* 9. STORE PROFILE SETTINGS TAB */}
        {adminTab === 'profile' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#FF8500]" /> Store Operations & WhatsApp Info
            </h2>

            <form onSubmit={handleSaveStoreSettings} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  WhatsApp Contact Number (digits only, e.g. 234906970687)
                </label>
                <input
                  type="text"
                  value={storeWhatsApp}
                  onChange={(e) => setStoreWhatsApp(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Phone Number</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Showroom Address</label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={storeHours}
                  onChange={(e) => setStoreHours(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold rounded-xl shadow-xs"
              >
                Save Store Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Product: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Original Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="accent-[#FF8500]"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-[#FF8500]"
                  />
                  Featured on Homepage
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF8500] text-white font-bold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
