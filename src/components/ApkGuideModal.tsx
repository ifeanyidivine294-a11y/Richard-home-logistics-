import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, Database, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const capacitorCommands = `# 1. Build web production bundle
npm run build

# 2. Install Capacitor core & Android CLI
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 3. Initialize Capacitor app
npx cap init "Richard Home Logistics" "com.richardhome.logistics" --web-dir dist

# 4. Add Android native platform
npx cap add android

# 5. Sync web build into Android project
npx cap sync android

# 6. Open Android Studio to build unsigned or signed release APK / AAB
npx cap open android`;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customer profile security
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Favourites security
    match /favourites/{favId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }

    // Orders security
    match /orders/{orderId} {
      allow create: if true; // Allows guests and customers to submit order requests
      allow read: if request.auth != null && (request.auth.uid == resource.data.customerId || request.auth.token.admin == true);
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    // Public read-only catalogue and delivery areas (managed only by admin)
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /deliveryAreas/{areaId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /businessSettings/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#071B49] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF8500] flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">
                Android APK & Firebase Documentation
              </h2>
              <p className="text-[11px] text-slate-300">
                Packaging instructions and production Firestore security rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Section 1: Android APK */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4 text-[#FF8500]" />
                1. Build Android APK using Capacitor
              </h3>
              <button
                onClick={() => copyCode(capacitorCommands, 'cap')}
                className="text-[11px] font-bold text-[#FF8500] hover:text-[#e07500] flex items-center gap-1"
              >
                {copiedSection === 'cap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'cap' ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Run these commands to generate a standalone native Android project and APK for Google Play Store or APK distribution:
            </p>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed">
              {capacitorCommands}
            </pre>
          </div>

          {/* Section 2: Firestore Security Rules */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Database className="w-4 h-4 text-[#16A34A]" />
                2. Firestore Security Rules (firestore.rules)
              </h3>
              <button
                onClick={() => copyCode(firestoreRules, 'rules')}
                className="text-[11px] font-bold text-[#FF8500] hover:text-[#e07500] flex items-center gap-1"
              >
                {copiedSection === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'rules' ? 'Copied' : 'Copy Rules'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Ensures customers can only read/edit their own data, while catalogue prices and business settings remain protected:
            </p>
            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto font-mono text-[10px] leading-relaxed">
              {firestoreRules}
            </pre>
          </div>

          {/* Section 3: WhatsApp Testing */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. WhatsApp Business Integration Verified
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              The application connects directly to WhatsApp number <strong>+234 906 970 687</strong>. Each generated order includes delivery fees, landmark instructions or pickup times, and a unique reference code.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#071B49] text-white text-xs font-bold rounded-lg hover:bg-[#0c2869] transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
