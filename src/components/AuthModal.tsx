import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authViewMode,
    setAuthViewMode,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    loginWithGoogle,
    continueAsGuest
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot password
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const ok = await loginWithEmail(email.trim(), password);
      if (!ok) {
        setErrorMsg('Invalid email or password. Please verify your details.');
      }
    } catch {
      setErrorMsg('Sign-in encounter an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const ok = await registerWithEmail(fullName.trim(), email.trim(), phoneNumber.trim(), password);
      if (!ok) {
        setErrorMsg('Registration failed. The email address might already be in use.');
      }
    } catch {
      setErrorMsg('Registration error. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const ok = await sendPasswordReset(email.trim());
      if (ok) {
        setResetSent(true);
      } else {
        setErrorMsg('Could not find an account with that email.');
      }
    } catch {
      setErrorMsg('Unable to send password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. SPLASH SCREEN VIEW (from reference image) */}
        {authViewMode === 'splash' && (
          <div className="p-6 text-center space-y-6">
            <div className="pt-4 flex justify-center">
              <BrandLogo size="lg" showTagline={true} />
            </div>

            <div className="w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src="/src/assets/images/hero_living_room_1794158920760.jpg"
                alt="Living Room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setAuthViewMode('login')}
                className="w-full py-3 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold text-sm rounded-xl shadow-xs transition"
              >
                Login
              </button>

              <button
                onClick={() => setAuthViewMode('register')}
                className="w-full py-3 bg-[#071B49] hover:bg-[#0c2763] text-white font-bold text-sm rounded-xl transition"
              >
                Sign Up
              </button>

              <button
                onClick={() => loginWithGoogle()}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => continueAsGuest()}
                className="text-xs text-slate-500 hover:text-slate-800 underline font-medium pt-1"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}

        {/* 2. LOGIN VIEW (matching screenshot Screen 2) */}
        {authViewMode === 'login' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setAuthViewMode('splash')}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500">Sign in to your account</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg mb-3">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                  />
                </div>
              </div>

              <div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => setAuthViewMode('forgot')}
                    className="text-[11px] text-[#071B49] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold text-sm rounded-xl shadow-xs transition"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="relative my-4 text-center">
              <span className="bg-white px-2 text-[11px] text-slate-400 relative z-10">
                — or —
              </span>
              <div className="absolute inset-x-0 top-1/2 border-t border-slate-100" />
            </div>

            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthViewMode('register')}
                className="text-[#FF8500] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}

        {/* 3. REGISTER VIEW */}
        {authViewMode === 'register' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setAuthViewMode('login')}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Create Account
                </h2>
                <p className="text-xs text-slate-500">Join Richard Home Logistics</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg mb-3">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number (e.g. +234...)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create Password (min 6 chars)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF8500] hover:bg-[#ff941a] text-white font-bold text-sm rounded-xl shadow-xs transition mt-2"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => setAuthViewMode('login')}
                className="text-[#071B49] font-bold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        )}

        {/* 4. FORGOT PASSWORD VIEW */}
        {authViewMode === 'forgot' && (
          <div className="p-6 text-center">
            <div className="flex items-center gap-2 mb-4 text-left">
              <button
                onClick={() => setAuthViewMode('login')}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <h2 className="text-base font-bold text-slate-900">Reset Password</h2>
            </div>

            {resetSent ? (
              <div className="py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-xs text-slate-700">
                  A password reset link has been dispatched to <strong>{email}</strong>. Please check your inbox and spam folder.
                </p>
                <button
                  onClick={() => setAuthViewMode('login')}
                  className="w-full py-2.5 bg-[#071B49] text-white text-xs font-bold rounded-xl"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3 text-left">
                <p className="text-xs text-slate-500">
                  Enter your registered email address and we'll send you instructions to reset your password.
                </p>

                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF8500]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF8500] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
