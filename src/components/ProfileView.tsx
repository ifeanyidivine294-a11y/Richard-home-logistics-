import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Settings, Smartphone, Clock, MessageSquare, LogOut, Edit2, Check, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminSettingsModal } from './AdminSettingsModal';
import { ApkGuideModal } from './ApkGuideModal';
import { BrandLogo } from './BrandLogo';

export const ProfileView: React.FC = () => {
  const {
    user,
    isAdmin,
    setCurrentPortal,
    updateUserProfile,
    logout,
    setIsAuthModalOpen,
    setAuthViewMode,
    businessSettings
  } = useApp();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile edit state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.savedAddress || '');
  const [busStop, setBusStop] = useState(user?.savedNearestBusStop || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      phoneNumber: phone,
      savedAddress: address,
      savedNearestBusStop: busStop
    });
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-4 pb-24 space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#071B49] text-white flex items-center justify-center font-black text-lg">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {user?.fullName || 'Guest Customer'}
              </h2>
              <p className="text-xs text-slate-500">
                {user?.email || 'Browsing as Guest'}
              </p>
            </div>
          </div>

          {user && !user.isGuest && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-[#FF8500] hover:text-[#d97000] flex items-center gap-1 p-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          )}
        </div>

        {/* Profile Info or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Saved Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Main Street, Asaba"
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Nearest Bus Stop / Landmark</label>
              <input
                type="text"
                value={busStop}
                onChange={(e) => setBusStop(e.target.value)}
                placeholder="e.g. Holy Family Bus Stop"
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Profile Details
            </button>
          </form>
        ) : (
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user?.phoneNumber || '+234 906 970 687'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user?.savedAddress || '123 Main Street, Asaba, Delta State'}</span>
            </div>
            {user?.savedNearestBusStop && (
              <div className="text-[11px] text-slate-500 pl-5.5">
                Landmark: {user.savedNearestBusStop}
              </div>
            )}
          </div>
        )}

        {/* Guest sign in prompt */}
        {(!user || user.isGuest) && (
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setAuthViewMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 bg-[#FF8500] hover:bg-[#ff941a] text-white text-xs font-bold rounded-xl transition shadow-2xs"
            >
              Sign In or Register Account
            </button>
          </div>
        )}
      </div>

      {/* Showroom & Business Details */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BrandLogo size="sm" showTagline={false} />
          <div>
            <h3 className="text-xs font-bold text-slate-900">Showroom & Store Location</h3>
            <p className="text-[10px] text-slate-500">Asaba, Delta State, Nigeria</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#FF8500] shrink-0 mt-0.5" />
            <span>{businessSettings.physicalAddress}</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-[#071B49] shrink-0 mt-0.5" />
            <span>{businessSettings.openingHours}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <a
            href={`https://wa.me/${businessSettings.whatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Line
          </a>
          <a
            href={`tel:${businessSettings.whatsAppNumber}`}
            className="py-2.5 px-3 bg-[#071B49] hover:bg-[#0c2763] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" /> Call Store
          </a>
        </div>
      </div>

      {/* Admin Portal Gateway Card */}
      {isAdmin ? (
        <div className="bg-gradient-to-r from-[#071B49] to-[#0c2763] text-white rounded-2xl p-4 shadow-md space-y-2.5 border-2 border-[#FF8500]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF8500] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                👑
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FF8500]">
                  Administrator Portal
                </h3>
                <p className="text-[11px] text-slate-300">
                  Signed in as: <span className="font-semibold text-white">{user?.email}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPortal('admin')}
              className="px-3.5 py-2 bg-[#FF8500] hover:bg-[#ff941a] text-white font-black text-xs rounded-xl shadow-xs transition active:scale-95"
            >
              Open Dashboard →
            </button>
          </div>
          <p className="text-[10px] text-slate-300">
            Full access to Manage Products, Bulk Price Updates, Categories, Delivery Settings, View WhatsApp Orders, and Homepage Banners.
          </p>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Store Staff & Administrators</h4>
            <p className="text-[10px] text-slate-500">Sign in with an admin account to manage inventory & orders</p>
          </div>
          <button
            onClick={() => {
              setAuthViewMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#071B49] text-white text-[11px] font-bold rounded-lg hover:bg-[#0c2763] transition"
          >
            Admin Login
          </button>
        </div>
      )}

      {/* Administrative and Technical Management Tools */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Store Management & Developer Tools
        </h3>

        <button
          onClick={() => {
            if (isAdmin) {
              setCurrentPortal('admin');
            } else {
              setIsAdminModalOpen(true);
            }
          }}
          className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-left flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF8500]/10 text-[#FF8500] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-[#FF8500]">
                Store Owner / Admin Panel
              </span>
              <span className="text-[10px] text-slate-500">
                Edit product prices, delivery zones & phone number
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400">→</span>
        </button>

        <button
          onClick={() => setIsApkModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-50 border border-slate-100 text-left flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#071B49]/10 text-[#071B49] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block group-hover:text-[#071B49]">
                Android APK & Firebase Setup
              </span>
              <span className="text-[10px] text-slate-500">
                Capacitor packaging commands & Firestore security rules
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400">→</span>
        </button>
      </div>

      {/* Sign Out Button */}
      {user && !user.isGuest && (
        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      )}

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* APK Guide Modal */}
      <ApkGuideModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
};
