import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaMoneyBillWave, FaTags, FaSignOutAlt,
  FaChartBar, FaCheckCircle, FaClock, FaSearch,
  FaEye, FaEyeSlash, FaPlus, FaTrash, FaCopy,
  FaBars, FaTimes, FaShieldAlt, FaDatabase,
  FaSun, FaMoon, FaChevronDown, FaChevronUp, FaLink, FaEdit
} from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// ─── Types ─────────────────────────────────────────────────────────────
interface Registration {
  name: string;
  email: string;
  phone: string;
  course: string;
  college: string;
  city: string;
  timestamp?: string;
  referralCode?: string;
}

interface Payment {
  name: string;
  email: string;
  phone: string;
  transactionId: string;
  course: string;
  planTitle: string;
  planAmount: string;
  timestamp?: string;
  referralCode?: string;
}

interface RefCode {
  _id?: string;
  code: string;
  discount: string;
  planType?: string; // "all" | "one-time" | "inst-1" | "inst-2"
  active: boolean;
  created: string;
  uses: number;
  creator?: string; // username of sub-admin or "admin"
}

interface SubAdmin {
  id: string;
  name: string;
  username: string;
  password: string;
  status: "Active" | "Suspended";
  created: string;
}

// ─── Plan Configuration ────────────────────────────────────────────────
interface PlanConfig {
  _id?: string;
  courseName: string;
  courseTagline: string;
  oneTimePrice: number | string;
  oneTimeOriginalPrice: number | string;
  installment1Price: number | string;
  installment2Price: number | string;
  discountPercent: number | string;
  oneTimeDiscountPercent?: number | string;
  installment1DiscountPercent?: number | string;
  installment2DiscountPercent?: number | string;
  oneTimeFeatures: string[];
  installmentFeatures: string[];
}

const DEFAULT_PLAN_CONFIG: PlanConfig = {
  courseName: "MERN Stack",
  courseTagline: "Full Stack Web Development",
  oneTimePrice: 6000,
  oneTimeOriginalPrice: 15000,
  installment1Price: 3200,
  installment2Price: 3200,
  discountPercent: 10,
  oneTimeDiscountPercent: 10,
  installment1DiscountPercent: 10,
  installment2DiscountPercent: 10,
  oneTimeFeatures: [
    "Full MERN Stack Course Access",
    "Practical Hands-on Training",
    "100% Placement Assistance",
    "Course Completion Certificate",
    "Save Extra using Referral Codes",
  ],
  installmentFeatures: [
    "Full MERN Stack Course Access",
    "Practical Hands-on Training",
    "100% Placement Assistance",
    "Course Completion Certificate",
  ],
};

const loadPlanConfig = (): PlanConfig => {
  try {
    const s = localStorage.getItem("bg_plan_config");
    if (!s) return DEFAULT_PLAN_CONFIG;
    const parsed = JSON.parse(s);
    return {
      ...DEFAULT_PLAN_CONFIG,
      ...parsed,
      oneTimeDiscountPercent: parsed.oneTimeDiscountPercent ?? parsed.discountPercent ?? 10,
      installment1DiscountPercent: parsed.installment1DiscountPercent ?? parsed.discountPercent ?? 10,
      installment2DiscountPercent: parsed.installment2DiscountPercent ?? parsed.discountPercent ?? 10,
    };
  } catch { return DEFAULT_PLAN_CONFIG; }
};

const savePlanConfig = (cfg: PlanConfig) => {
  try {
    localStorage.setItem("bg_plan_config", JSON.stringify(cfg));
  } catch (e) { console.error(e); }
};


// ─── Admin Credentials (Simple static auth — change as needed) ─────────
const ADMIN_USER = "chetanmohane27@gmail.com";
const ADMIN_PASS = "Admin123";

// ─── Google Sheet IDs (Registration + Payment webhooks already connected) ──
const REG_WEBHOOK = "https://script.google.com/macros/s/AKfycbzXSYriLalntsTXoZXKA_zdLDv6rilyh071w3NvLpnkLsF8smoeoRBPaTdHSsiPVvNCfw/exec";
const PAY_WEBHOOK = "https://script.google.com/macros/s/AKfycbzSxVBbkCBHI2KN5KlKMB8RHWMszFf8Rh_ILHFCN68w_Eoma1hjEiqho27HuG0SSyIOwA/exec";

// ─── Default Referral Codes (stored in localStorage) ───────────────────
const DEFAULT_CODES: RefCode[] = [
  { code: "BEANGATE10", discount: "10%", active: true, created: "2024-07-01", uses: 0 },
  { code: "MERN10",     discount: "10%", active: true, created: "2024-07-01", uses: 0 },
  { code: "REF10",      discount: "10%", active: true, created: "2024-07-01", uses: 0 },
];

// ─── Helpers ────────────────────────────────────────────────────────────
const loadCodes = (): RefCode[] => {
  try {
    const s = localStorage.getItem("bg_ref_codes");
    return s ? JSON.parse(s) : DEFAULT_CODES;
  } catch { return DEFAULT_CODES; }
};

const saveCodes = (codes: RefCode[]) =>
  localStorage.setItem("bg_ref_codes", JSON.stringify(codes));

// Calculate remaining dues for a student (based on course fees and partial payments)
const getRemainingBalance = (email: string, phone: string, payments: Payment[]): string => {
  const studentPayments = payments.filter(p => p.email.toLowerCase() === email.toLowerCase() || p.phone === phone);
  if (studentPayments.length === 0) return "₹0";

  // Check if any payment is "One-Time" or "2nd Installment" / "Final"
  const hasFullPayment = studentPayments.some(p => 
    p.planTitle.toLowerCase().includes("one-time") || 
    p.planTitle.toLowerCase().includes("2nd") || 
    p.planTitle.toLowerCase().includes("final") || 
    p.planTitle.toLowerCase().includes("second")
  );
  
  if (hasFullPayment) return "₹0";
  
  // If they only have 1st Installment(s)
  const firstInstallmentPayment = studentPayments.find(p => p.planTitle.toLowerCase().includes("1st") || p.planTitle.toLowerCase().includes("first"));
  if (firstInstallmentPayment) {
    const amt = parseInt(firstInstallmentPayment.planAmount.replace(/[₹,]/g, ""));
    if (amt <= 2880) return "₹2,880";
    return "₹3,200";
  }
  
  return "₹0";
};

// ─── MOCK DATA (since Google Scripts need server-side fetch workaround) ──
// In production, replace with actual GET endpoints from your Apps Script
const MOCK_REGISTRATIONS: Registration[] = [
  { name: "Ravi Patel", email: "ravi@example.com", phone: "9876543210", course: "MERN Stack", college: "BUIT", city: "Bhopal", timestamp: "2024-07-10 10:22" },
  { name: "Sunita Verma", email: "sunita@example.com", phone: "9812341234", course: "Frontend Developer", college: "PDPS College", city: "Indore", timestamp: "2024-07-10 11:05" },
  { name: "Mohit Sharma", email: "mohit@example.com", phone: "9911223344", course: "MERN Stack", college: "Other", city: "Jabalpur", timestamp: "2024-07-10 14:40" },
];

const MOCK_PAYMENTS: Payment[] = [
  { name: "Ravi Patel", email: "ravi@example.com", phone: "9876543210", transactionId: "UPI123456789012", course: "MERN Stack", planTitle: "One-Time", planAmount: "₹6,000", timestamp: "2024-07-10 10:35" },
  { name: "Sunita Verma", email: "sunita@example.com", phone: "9812341234", transactionId: "UPI987654321000", course: "Frontend Developer", planTitle: "1st Installment", planAmount: "₹3,200", timestamp: "2024-07-10 11:22" },
];

// ═══════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin }: { onLogin: (role: "admin" | "subadmin", name: string, codes: string[]) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check admin credentials
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("bg_admin_auth", "true");
      sessionStorage.setItem("bg_auth_role", "admin");
      onLogin("admin", "Administrator", []);
      setLoading(false);
      return;
    }

    // Check sub-admins via backend API
    try {
      const res = await fetch("/api/subadmins");
      if (res.ok) {
        const subadmins = await res.json();
        const matched = subadmins.find(
          (s: any) => s.username.toLowerCase() === username.toLowerCase() && s.password === password
        );

        if (matched) {
          if (matched.status === "Suspended") {
            setError("Your sub-admin account is suspended. Contact admin.");
          } else {
            sessionStorage.setItem("bg_admin_auth", "true");
            sessionStorage.setItem("bg_auth_role", "subadmin");
            sessionStorage.setItem("bg_subadmin_username", matched.username);
            sessionStorage.setItem("bg_subadmin_name", matched.name);
            onLogin("subadmin", matched.name, []);
          }
        } else {
          setError("Invalid username or password.");
        }
      } else {
        setError("Error connecting to server.");
      }
    } catch (err) {
      console.error("Error verifying subadmin:", err);
      setError("Network error. Backend might be down.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b18] via-[#0a1128] to-[#050b18] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 mb-4 shadow-lg shadow-indigo-500/10">
            <FaShieldAlt className="text-indigo-400 text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">BeanGate Admin</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Secure admin control panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 bg-transparent border-none cursor-pointer flex items-center p-0">
                  {showPass ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm font-semibold text-center mt-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition duration-200 mt-4 cursor-pointer border-none shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
              {loading ? "Authenticating..." : "Login to Admin Panel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════
const StatCard = ({ label, value, icon, iconBgClass }: { label: string; value: string | number; icon: React.ReactNode; iconBgClass: string }) => (
  <div className="flex items-center gap-4 p-5">
    <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center shrink-0 shadow-sm`}>
      {icon}
    </div>
    <div className="text-left">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mt-1.5">{value}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// PLANS TAB
// ═══════════════════════════════════════════════════════════════════════
const PlansTab = () => {
  const [cfg, setCfg] = useState<PlanConfig>(loadPlanConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const res = await fetch("/api/planconfig");
        if (res.ok) {
          const data = await res.json();
          if (data && data.courseName) {
            const merged: PlanConfig = {
              ...DEFAULT_PLAN_CONFIG,
              ...data,
              oneTimeDiscountPercent: data.oneTimeDiscountPercent ?? data.discountPercent ?? 10,
              installment1DiscountPercent: data.installment1DiscountPercent ?? data.discountPercent ?? 10,
              installment2DiscountPercent: data.installment2DiscountPercent ?? data.discountPercent ?? 10,
            };
            setCfg(merged);
            savePlanConfig(merged);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote plan config:", err);
      }
    };
    fetchRemoteConfig();
  }, []);

  const update = (key: keyof PlanConfig, value: string | number | string[]) =>
    setCfg(prev => ({ ...prev, [key]: value }));

  const updateDefaultDiscount = (val: string | number) => {
    setCfg(prev => ({
      ...prev,
      discountPercent: val,
      oneTimeDiscountPercent: val,
      installment1DiscountPercent: val,
      installment2DiscountPercent: val,
    }));
  };

  const updateFeature = (plan: "oneTimeFeatures" | "installmentFeatures", idx: number, val: string) => {
    const arr = [...cfg[plan]];
    arr[idx] = val;
    update(plan, arr);
  };

  const addFeature = (plan: "oneTimeFeatures" | "installmentFeatures") =>
    update(plan, [...cfg[plan], ""]);

  const removeFeature = (plan: "oneTimeFeatures" | "installmentFeatures", idx: number) =>
    update(plan, cfg[plan].filter((_, i) => i !== idx));

  const handleSave = async () => {
    const payload = {
      ...cfg,
      oneTimePrice: Number(cfg.oneTimePrice) || 0,
      oneTimeOriginalPrice: Number(cfg.oneTimeOriginalPrice) || 0,
      installment1Price: Number(cfg.installment1Price) || 0,
      installment2Price: Number(cfg.installment2Price) || 0,
      discountPercent: Number(cfg.discountPercent) || 0,
      oneTimeDiscountPercent: Number(cfg.oneTimeDiscountPercent !== undefined && cfg.oneTimeDiscountPercent !== "" ? cfg.oneTimeDiscountPercent : cfg.discountPercent) || 0,
      installment1DiscountPercent: Number(cfg.installment1DiscountPercent !== undefined && cfg.installment1DiscountPercent !== "" ? cfg.installment1DiscountPercent : cfg.discountPercent) || 0,
      installment2DiscountPercent: Number(cfg.installment2DiscountPercent !== undefined && cfg.installment2DiscountPercent !== "" ? cfg.installment2DiscountPercent : cfg.discountPercent) || 0,
    };

    savePlanConfig(payload as any);
    try {
      await fetch("/api/planconfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Error saving plan config to API:", e);
    }
    window.dispatchEvent(new Event("planConfigUpdated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const oneTimeDiscVal = cfg.oneTimeDiscountPercent !== undefined && cfg.oneTimeDiscountPercent !== "" ? cfg.oneTimeDiscountPercent : (cfg.discountPercent ?? 10);
  const inst1DiscVal   = cfg.installment1DiscountPercent !== undefined && cfg.installment1DiscountPercent !== "" ? cfg.installment1DiscountPercent : (cfg.discountPercent ?? 10);
  const inst2DiscVal   = cfg.installment2DiscountPercent !== undefined && cfg.installment2DiscountPercent !== "" ? cfg.installment2DiscountPercent : (cfg.discountPercent ?? 10);

  const numOneTimePrice = Number(cfg.oneTimePrice) || 0;
  const numOneTimeOriginalPrice = Number(cfg.oneTimeOriginalPrice) || 0;
  const numInst1Price = Number(cfg.installment1Price) || 0;
  const numInst2Price = Number(cfg.installment2Price) || 0;

  const numOneTimeDisc = Number(oneTimeDiscVal) || 0;
  const numInst1Disc   = Number(inst1DiscVal) || 0;
  const numInst2Disc   = Number(inst2DiscVal) || 0;

  const discountedOneTime = Math.round(numOneTimePrice * (1 - numOneTimeDisc / 100));
  const discountedInst1   = Math.round(numInst1Price * (1 - numInst1Disc / 100));
  const discountedInst2   = Math.round(numInst2Price * (1 - numInst2Disc / 100));

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition font-medium";
  const labelCls = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Course Plans & Pricing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Edit pricing plans and referral discounts — changes reflect live on the website instantly.</p>
        </div>
        <button onClick={handleSave}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer border-none flex items-center gap-2 shadow-md active:scale-[0.98] ${
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white shadow-indigo-500/10"
          }`}>
          {saved ? <><FaCheckCircle className="text-sm" /> Saved!</> : <><FaDatabase className="text-sm" /> Save Changes</>}
        </button>
      </div>

      {/* Course Info */}
      <Card className="p-6 mb-6 mt-6">
        <p className="text-sm font-extrabold text-slate-800 dark:text-white mb-4">Course Basic Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Course Name</label>
            <input className={inputCls} value={cfg.courseName} onChange={e => update("courseName", e.target.value)} placeholder="e.g. MERN Stack" />
          </div>
          <div>
            <label className={labelCls}>Course Tagline</label>
            <input className={inputCls} value={cfg.courseTagline} onChange={e => update("courseTagline", e.target.value)} placeholder="e.g. Full Stack Web Development" />
          </div>
        </div>
      </Card>

      {/* DEDICATED REFERRAL DISCOUNT SETTINGS CARD */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-7 rounded-full bg-violet-600"></div>
          <p className="text-sm font-extrabold text-slate-800 dark:text-white">🎯 Referral Discount Settings (%)</p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-semibold">
          Set official referral discount percentages for each plan type. Newly generated discount codes automatically use these rates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-indigo-50/70 dark:bg-indigo-500/5 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/15">
            <label className={labelCls + " text-indigo-700 dark:text-indigo-300 font-extrabold"}>One-Time Plan Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputCls + " bg-white dark:bg-slate-900 font-extrabold text-base"}
              value={oneTimeDiscVal}
              onChange={e => update("oneTimeDiscountPercent", e.target.value)}
            />
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-2">
              Base Fee After Code: ₹{discountedOneTime.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-500/5 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/15">
            <label className={labelCls + " text-blue-700 dark:text-blue-300 font-extrabold"}>1st Inst. Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputCls + " bg-white dark:bg-slate-900 font-extrabold text-base"}
              value={inst1DiscVal}
              onChange={e => update("installment1DiscountPercent", e.target.value)}
            />
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-2">
              1st Fee After Code: ₹{discountedInst1.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-purple-50/70 dark:bg-purple-500/5 p-4 rounded-2xl border border-purple-100 dark:border-purple-500/15">
            <label className={labelCls + " text-purple-700 dark:text-purple-300 font-extrabold"}>2nd Inst. Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputCls + " bg-white dark:bg-slate-900 font-extrabold text-base"}
              value={inst2DiscVal}
              onChange={e => update("installment2DiscountPercent", e.target.value)}
            />
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-2">
              2nd Fee After Code: ₹{discountedInst2.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-slate-100/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <label className={labelCls + " text-slate-700 dark:text-slate-300 font-extrabold"}>Default Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputCls + " bg-white dark:bg-slate-900 font-extrabold text-base"}
              value={cfg.discountPercent}
              onChange={e => updateDefaultDiscount(e.target.value)}
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
              Fallback discount rate
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ONE-TIME PLAN */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-8 rounded-full bg-indigo-500"></div>
            <p className="font-extrabold text-slate-800 dark:text-white text-sm">One-Time Payment Plan Pricing</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelCls}>Full Price (₹)</label>
              <input type="number" min="0" className={inputCls} value={cfg.oneTimePrice} onChange={e => update("oneTimePrice", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Original Price (₹)</label>
              <input type="number" min="0" className={inputCls} value={cfg.oneTimeOriginalPrice} onChange={e => update("oneTimeOriginalPrice", e.target.value)} />
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15 rounded-xl px-4 py-3 mb-5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            With {numOneTimeDisc}% referral code: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{discountedOneTime.toLocaleString("en-IN")}</span> (Base Fee)
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelCls + " mb-0"}>Features List</label>
              <button onClick={() => addFeature("oneTimeFeatures")} className="text-xs text-indigo-500 dark:text-indigo-400 font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-indigo-600">
                <FaPlus className="text-[9px]" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {cfg.oneTimeFeatures.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className={inputCls + " flex-1"} value={f} onChange={e => updateFeature("oneTimeFeatures", i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                  <button onClick={() => removeFeature("oneTimeFeatures", i)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 bg-transparent border-none cursor-pointer p-1 shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* INSTALLMENT PLAN */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-8 rounded-full bg-blue-500"></div>
            <p className="font-extrabold text-slate-800 dark:text-white text-sm">Flexible Installment Plan Pricing</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelCls}>1st Installment (₹)</label>
              <input type="number" min="0" className={inputCls} value={cfg.installment1Price} onChange={e => update("installment1Price", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>2nd Installment (₹)</label>
              <input type="number" min="0" className={inputCls} value={cfg.installment2Price} onChange={e => update("installment2Price", e.target.value)} />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/15 rounded-xl px-4 py-3 mb-5 text-xs font-semibold text-blue-700 dark:text-blue-400">
            With Referral Code: 1st <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{discountedInst1.toLocaleString("en-IN")}</span> ({numInst1Disc}% OFF) · 2nd <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{discountedInst2.toLocaleString("en-IN")}</span> ({numInst2Disc}% OFF)
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelCls + " mb-0"}>Features List</label>
              <button onClick={() => addFeature("installmentFeatures")} className="text-xs text-blue-500 dark:text-blue-400 font-bold flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-blue-600">
                <FaPlus className="text-[9px]" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {cfg.installmentFeatures.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className={inputCls + " flex-1"} value={f} onChange={e => updateFeature("installmentFeatures", i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                  <button onClick={() => removeFeature("installmentFeatures", i)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 bg-transparent border-none cursor-pointer p-1 shrink-0">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Preview bar */}
      <Card className="mt-6 px-6 py-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Live Preview (what students see)</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px] bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15 rounded-2xl px-5 py-4">
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">One-Time Plan</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{numOneTimePrice.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-400 line-through mt-0.5">₹{numOneTimeOriginalPrice.toLocaleString("en-IN")}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">With {numOneTimeDisc}% Code: ₹{discountedOneTime.toLocaleString("en-IN")}</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/15 rounded-2xl px-5 py-4">
            <p className="text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Installment Plan</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{numInst1Price.toLocaleString("en-IN")} <span className="text-xs text-slate-500">/ 1st</span></p>
            <p className="text-xs text-slate-500 mt-0.5">2nd: ₹{numInst2Price.toLocaleString("en-IN")}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">With Code: 1st ₹{discountedInst1.toLocaleString("en-IN")} · 2nd ₹{discountedInst2.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};



// ═══════════════════════════════════════════════════════════════════════
// REFERRAL CODES TAB (Admin view)
// ═══════════════════════════════════════════════════════════════════════
const ReferralTab = () => {
  const [codes, setCodes] = useState<RefCode[]>([]);
  const [planCfg, setPlanCfg] = useState<PlanConfig>(loadPlanConfig);

  useEffect(() => {
    fetch("/api/planconfig")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.courseName) setPlanCfg(prev => ({ ...prev, ...data }));
      })
      .catch(e => console.warn(e));

    fetch("/api/refcodes")
      .then(async res => {
        if (!res.ok) throw new Error("Server returned " + res.status);
        const data = await res.json();
        if (Array.isArray(data)) return data;
        throw new Error("Invalid format");
      })
      .then(data => setCodes(data))
      .catch(e => {
        console.warn("Falling back to local storage for ref codes...", e);
        try {
          const stored = localStorage.getItem("bg_ref_codes");
          if (stored) setCodes(JSON.parse(stored));
          else setCodes([
            { code: "BEANGATE10", discount: "10% OFF", planType: "all", active: true, created: "2024-07-01", uses: 0 },
            { code: "MERN10",     discount: "10% OFF", planType: "all", active: true, created: "2024-07-01", uses: 0 },
            { code: "REF10",      discount: "10% OFF", planType: "all", active: true, created: "2024-07-01", uses: 0 },
          ]);
        } catch {}
      });
  }, []);

  const [newCode, setNewCode] = useState("");
  const [selectedPlanType, setSelectedPlanType] = useState("all");
  const [copied, setCopied] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const defDisc = Number(planCfg.discountPercent) || 10;
  const oneTimeDisc = Number(planCfg.oneTimeDiscountPercent !== undefined && planCfg.oneTimeDiscountPercent !== "" ? planCfg.oneTimeDiscountPercent : defDisc) || defDisc;
  const inst1Disc = Number(planCfg.installment1DiscountPercent !== undefined && planCfg.installment1DiscountPercent !== "" ? planCfg.installment1DiscountPercent : defDisc) || defDisc;
  const inst2Disc = Number(planCfg.installment2DiscountPercent !== undefined && planCfg.installment2DiscountPercent !== "" ? planCfg.installment2DiscountPercent : defDisc) || defDisc;

  const filteredCodes = codes.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) || 
                          (c.creator || "admin").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterStatus !== "All") {
      if (filterStatus === "Available" && (!c.active || c.uses > 0)) return false;
      if (filterStatus === "Used" && (c.uses === 0 || !c.active)) return false;
      if (filterStatus === "Inactive" && c.active) return false;
    }

    if (c.created) {
      const cDate = new Date(c.created);
      if (startDate) {
        const sDate = new Date(startDate);
        if (cDate < sDate) return false;
      }
      if (endDate) {
        const eDate = new Date(endDate);
        if (cDate > eDate) return false;
      }
    }
    return true;
  });

  const handleDownloadCSV = () => {
    if (filteredCodes.length === 0) {
      alert("No data to download.");
      return;
    }
    const headers = ["Code", "Discount", "Creator", "Created Date", "Status", "Uses"];
    const rows = filteredCodes.map(c => {
      let status = "Inactive";
      if (c.active && c.uses === 0) status = "Available";
      else if (c.uses > 0) status = "Used";
      return [
        `"${c.code}"`,
        `"${c.discount}"`,
        `"${c.creator || "admin"}"`,
        `"${c.created}"`,
        `"${status}"`,
        `"${c.uses}"`
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `referral_codes_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addCode = async () => {
    let trimmed = newCode.trim().toUpperCase();
    if (!trimmed) {
      const hex = Math.random().toString(16).substr(2, 6).toUpperCase();
      trimmed = `BG-ADMIN-${hex}`;
    }
    if (codes.find((c) => c.code === trimmed)) return;

    let discountLabel = `${defDisc}% OFF`;
    if (selectedPlanType === "one-time") discountLabel = `${oneTimeDisc}% OFF (One-Time Plan)`;
    else if (selectedPlanType === "inst-1") discountLabel = `${inst1Disc}% OFF (1st Inst.)`;
    else if (selectedPlanType === "inst-2") discountLabel = `${inst2Disc}% OFF (2nd Inst.)`;

    const newCodeObj: RefCode = {
      code: trimmed,
      discount: discountLabel,
      planType: selectedPlanType,
      active: true,
      created: new Date().toISOString().split("T")[0],
      uses: 0,
      creator: "admin"
    };
    
    try {
      const res = await fetch("/api/refcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCodeObj)
      });
      if(res.ok) {
        const saved = await res.json();
        setCodes([...codes, saved]);
      } else {
        setCodes([...codes, newCodeObj]);
      }
    } catch(err) {
      console.error(err);
      setCodes([...codes, newCodeObj]);
    }
    
    setNewCode("");
  };

  const [editingCode, setEditingCode] = useState<RefCode | null>(null);
  const [editModalForm, setEditModalForm] = useState({
    code: "",
    discount: "",
    planType: "all",
    active: true
  });

  const openEditModal = (c: RefCode) => {
    setEditingCode(c);
    setEditModalForm({
      code: c.code,
      discount: c.discount,
      planType: c.planType || "all",
      active: c.active
    });
  };

  const saveEditCode = async () => {
    if (!editingCode) return;
    const trimmedCode = editModalForm.code.trim().toUpperCase();
    if (!trimmedCode) return;

    const updatedObj: RefCode = {
      ...editingCode,
      code: trimmedCode,
      discount: editModalForm.discount.trim() || `${defDisc}% OFF`,
      planType: editModalForm.planType,
      active: editModalForm.active
    };

    const id = editingCode._id;
    if (id) {
      try {
        const res = await fetch(`/api/refcodes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedObj)
        });
        if (res.ok) {
          const saved = await res.json();
          setCodes(codes.map(c => c._id === id ? saved : c));
        } else {
          setCodes(codes.map(c => c._id === id ? updatedObj : c));
        }
      } catch (e) {
        console.error(e);
        setCodes(codes.map(c => c._id === id ? updatedObj : c));
      }
    } else {
      setCodes(codes.map(c => c.code === editingCode.code ? updatedObj : c));
    }

    try {
      const stored = localStorage.getItem("bg_ref_codes");
      if (stored) {
        const all: RefCode[] = JSON.parse(stored);
        const updatedAll = all.map(c => (c._id && c._id === id) || c.code === editingCode.code ? updatedObj : c);
        localStorage.setItem("bg_ref_codes", JSON.stringify(updatedAll));
      }
    } catch (e) {}

    setEditingCode(null);
  };

  const toggleCode = async (idx: number) => {
    const codeObj = codes[idx];
    const id = codeObj._id;
    if(!id) return;

    try {
      const res = await fetch(`/api/refcodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !codeObj.active })
      });
      if(res.ok) {
        const updated = await res.json();
        setCodes(codes.map((c, i) => i === idx ? updated : c));
      }
    } catch(err) { console.error(err); }
  };

  const deleteCode = async (idx: number) => {
    const codeObj = codes[idx];
    const id = codeObj._id;
    if(!id) {
      setCodes(codes.filter((_, i) => i !== idx));
      return;
    }
    
    try {
      await fetch(`/api/refcodes/${id}`, { method: "DELETE" });
      setCodes(codes.filter((_, i) => i !== idx));
    } catch(err) { console.error(err); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Referral Codes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Generate &amp; manage discount codes assigned to specific payment plans or all plans. Each code is single-use.</p>

      {/* Add Code */}
      <Card className="p-6 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-3">Add New Code</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. SUMMER10"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-base outline-none focus:border-indigo-500 transition duration-200"
          />
          <select
            value={selectedPlanType}
            onChange={(e) => setSelectedPlanType(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200 font-semibold"
          >
            <option value="all">All Plans ({defDisc}% OFF)</option>
            <option value="one-time">One-Time Plan ({oneTimeDisc}% OFF)</option>
            <option value="inst-1">1st Installment ({inst1Disc}% OFF)</option>
            <option value="inst-2">2nd Installment ({inst2Disc}% OFF)</option>
          </select>
          <button onClick={addCode}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] shrink-0">
            <FaPlus className="text-xs" /> Add Code
          </button>
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col xl:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code or creator..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200" />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-48">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Used">Used</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
            
            <button 
              onClick={handleDownloadCSV}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Codes Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Discount &amp; Target Plan</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Creator</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white font-mono tracking-wider text-sm">{c.code}</span>
                      <button onClick={() => copyCode(c.code)} className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 bg-transparent border-none cursor-pointer p-0 flex items-center">
                        <FaCopy className="text-xs" />
                      </button>
                      {copied === c.code && <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Copied!</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                      {c.discount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">{c.creator || "admin"}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm font-medium">{c.created}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleCode(i)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer transition duration-200 ${c.active && c.uses === 0 ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10"}`}>
                      {c.active && c.uses === 0 ? "Available" : c.uses > 0 ? "Used" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(c)} className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer p-1" title="Edit Code & Discount">
                        <FaEdit className="text-sm" />
                      </button>
                      <button onClick={() => deleteCode(i)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition bg-transparent border-none cursor-pointer p-1" title="Delete Code">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCodes.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">No referral codes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* EDIT REFERRAL CODE MODAL */}
      {editingCode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>✏️ Edit Referral Code</span>
              <button onClick={() => setEditingCode(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm bg-transparent border-none cursor-pointer">✕</button>
            </h3>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Referral Code String</label>
                <input
                  type="text"
                  value={editModalForm.code}
                  onChange={(e) => setEditModalForm({ ...editModalForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Target Plan</label>
                <select
                  value={editModalForm.planType}
                  onChange={(e) => {
                    const pType = e.target.value;
                    let label = editModalForm.discount;
                    if (pType === "one-time") label = `${oneTimeDisc}% OFF (One-Time Plan)`;
                    else if (pType === "inst-1") label = `${inst1Disc}% OFF (1st Inst.)`;
                    else if (pType === "inst-2") label = `${inst2Disc}% OFF (2nd Inst.)`;
                    else if (pType === "all") label = `${defDisc}% OFF (All Plans)`;
                    setEditModalForm({ ...editModalForm, planType: pType, discount: label });
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold text-sm outline-none focus:border-indigo-500"
                >
                  <option value="all">All Plans ({defDisc}% OFF)</option>
                  <option value="one-time">One-Time Plan ({oneTimeDisc}% OFF)</option>
                  <option value="inst-1">1st Installment ({inst1Disc}% OFF)</option>
                  <option value="inst-2">2nd Installment ({inst2Disc}% OFF)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Discount Label / Text</label>
                <input
                  type="text"
                  value={editModalForm.discount}
                  onChange={(e) => setEditModalForm({ ...editModalForm, discount: e.target.value })}
                  placeholder="e.g. 15% OFF (One-Time Plan)"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={editModalForm.active ? "active" : "inactive"}
                  onChange={(e) => setEditModalForm({ ...editModalForm, active: e.target.value === "active" })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold text-sm outline-none focus:border-indigo-500"
                >
                  <option value="active">Active (Available)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setEditingCode(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditCode}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-md"
                >
                  Save Code Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SUB-ADMIN CODES TAB (Sub-Admin view — self-generation)
// ═══════════════════════════════════════════════════════════════════════
const SubAdminCodesTab = ({ username }: { username: string }) => {
  const [myCodes, setMyCodes] = useState<RefCode[]>(() => {
    try {
      const stored = localStorage.getItem("bg_ref_codes");
      if (!stored) return [];
      const all: RefCode[] = JSON.parse(stored);
      return all.filter(c => c.creator && c.creator.toLowerCase() === username.toLowerCase());
    } catch { return []; }
  });
  const [copied, setCopied] = useState("");
  const [generating, setGenerating] = useState(false);
  const [targetPlan, setTargetPlan] = useState("all");
  const [planCfg, setPlanCfg] = useState<PlanConfig>(loadPlanConfig);

  useEffect(() => {
    fetch("/api/planconfig")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.courseName) setPlanCfg(prev => ({ ...prev, ...data }));
      })
      .catch(e => console.warn(e));

    fetch("/api/refcodes")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data)) {
          const userCodes = data.filter((c: any) => c.creator && c.creator.toLowerCase() === username.toLowerCase());
          setMyCodes(userCodes);
        }
      })
      .catch(e => console.warn(e));
  }, [username]);

  const defDisc = Number(planCfg.discountPercent) || 10;
  const oneTimeDisc = Number(planCfg.oneTimeDiscountPercent !== undefined && planCfg.oneTimeDiscountPercent !== "" ? planCfg.oneTimeDiscountPercent : defDisc) || defDisc;
  const inst1Disc = Number(planCfg.installment1DiscountPercent !== undefined && planCfg.installment1DiscountPercent !== "" ? planCfg.installment1DiscountPercent : defDisc) || defDisc;
  const inst2Disc = Number(planCfg.installment2DiscountPercent !== undefined && planCfg.installment2DiscountPercent !== "" ? planCfg.installment2DiscountPercent : defDisc) || defDisc;

  const generateCode = () => {
    setGenerating(true);
    setTimeout(async () => {
      const hex = Math.random().toString(16).substr(2, 6).toUpperCase();
      const newCodeStr = `BG-${username.toUpperCase()}-${hex}`;

      let discountLabel = `${defDisc}% OFF`;
      if (targetPlan === "one-time") discountLabel = `${oneTimeDisc}% OFF (One-Time Plan)`;
      else if (targetPlan === "inst-1") discountLabel = `${inst1Disc}% OFF (1st Inst.)`;
      else if (targetPlan === "inst-2") discountLabel = `${inst2Disc}% OFF (2nd Inst.)`;

      const newEntry: RefCode = {
        code: newCodeStr,
        discount: discountLabel,
        planType: targetPlan,
        active: true,
        created: new Date().toISOString().split("T")[0],
        uses: 0,
        creator: username
      };

      try {
        const res = await fetch("/api/refcodes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry)
        });
        if (res.ok) {
          const saved = await res.json();
          setMyCodes(prev => [saved, ...prev]);
        } else {
          setMyCodes(prev => [newEntry, ...prev]);
        }
      } catch (e) {
        console.error("Error generating code:", e);
        setMyCodes(prev => [newEntry, ...prev]);
      }

      try {
        const stored = localStorage.getItem("bg_ref_codes");
        const allCodes: RefCode[] = stored ? JSON.parse(stored) : [];
        if (!allCodes.some(c => c.code === newCodeStr)) {
          localStorage.setItem("bg_ref_codes", JSON.stringify([...allCodes, newEntry]));
        }
      } catch (e) {}

      setGenerating(false);
    }, 400);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">My Referral Codes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
        Generate unique single-use referral codes for your students tied to specific payment plans.
      </p>

      {/* Generate Button Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Generate New Code</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Format: <span className="font-mono font-bold">BG-{username.toUpperCase()}-XXXXXX</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={targetPlan}
              onChange={(e) => setTargetPlan(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition font-semibold"
            >
              <option value="all">All Plans ({defDisc}% OFF)</option>
              <option value="one-time">One-Time Plan ({oneTimeDisc}% OFF)</option>
              <option value="inst-1">1st Installment ({inst1Disc}% OFF)</option>
              <option value="inst-2">2nd Installment ({inst2Disc}% OFF)</option>
            </select>
            <button
              onClick={generateCode}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-60 shrink-0"
            >
              {generating ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> : <FaPlus className="text-xs" />}
              Generate Code
            </button>
          </div>
        </div>
      </Card>

      {/* Codes Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Discount &amp; Target Plan</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {myCodes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">
                    No codes generated yet. Click "Generate Code" to create one.
                  </td>
                </tr>
              ) : (
                [...myCodes].reverse().map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white font-mono tracking-wider text-sm">{c.code}</span>
                        <button onClick={() => copyCode(c.code)} className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 bg-transparent border-none cursor-pointer p-0 flex items-center">
                          <FaCopy className="text-xs" />
                        </button>
                        {copied === c.code && <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase">Copied!</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                        {c.discount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm font-medium">{c.created}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                        c.uses > 0
                          ? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10"
                          : "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                      }`}>
                        {c.uses > 0 ? "✓ Used" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════
// SUB ADMINS TAB
// ═══════════════════════════════════════════════════════════════════════
const SubAdminsTab = ({ registrations, payments }: { registrations: Registration[]; payments: Payment[] }) => {
  const [subadmins, setSubadmins] = useState<SubAdmin[]>([]);
  const [form, setForm] = useState({ name: "", username: "", password: "", referralCode: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSubadmin, setExpandedSubadmin] = useState<string | null>(null);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/subadmins")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubadmins(data);
      })
      .catch(e => {
        console.warn("Falling back to local storage for subadmins...", e);
        const stored = localStorage.getItem("bg_subadmins");
        if (stored) setSubadmins(JSON.parse(stored));
      });
  }, []);

  // Get all referral codes created by a sub-admin
  const getSubadminCodes = (username: string): RefCode[] => {
    try {
      const stored = localStorage.getItem("bg_ref_codes");
      if (!stored) return [];
      const allCodes: RefCode[] = JSON.parse(stored);
      return allCodes.filter(c => c.creator && c.creator.toLowerCase() === username.toLowerCase());
    } catch { return []; }
  };

  // Get students referred by a sub-admin (students who used their referral codes)
  const getReferredStudents = (username: string) => {
    const codes = getSubadminCodes(username).map(c => c.code.trim().toUpperCase());
    if (codes.length === 0) return { referredRegs: [] as Registration[], referredPays: [] as Payment[] };

    const referredRegs = registrations.filter(
      r => r.referralCode && codes.includes(r.referralCode.trim().toUpperCase())
    );
    const referredPays = payments.filter(
      p => p.referralCode && codes.includes(p.referralCode.trim().toUpperCase())
    );
    return { referredRegs, referredPays };
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, username, password, referralCode } = form;
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    
    const finalRefCode = referralCode.trim() ? referralCode.trim().toUpperCase() : username.trim().toUpperCase() + "10";

    if (editingId) {
      if (subadmins.some(s => s._id !== editingId && s.id !== editingId && s.username.toLowerCase() === username.trim().toLowerCase())) {
        alert("Username already exists.");
        return;
      }
      const updatedData = { name: name.trim(), username: username.trim(), password: password.trim(), referralCode: finalRefCode };
      try {
        const res = await fetch(`/api/subadmins/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });
        if(res.ok) {
          const updatedServer = await res.json();
          setSubadmins(subadmins.map(s => (s._id === editingId || s.id === editingId) ? updatedServer : s));
        }
      } catch (err) {
        console.error(err);
      }
      setEditingId(null);
    } else {
      if (subadmins.some(s => s.username.toLowerCase() === username.trim().toLowerCase())) {
        alert("Username already exists.");
        return;
      }
      const newSub = {
        name: name.trim(),
        username: username.trim(),
        password: password.trim(),
        referralCode: finalRefCode,
        status: "Active",
        createdDate: new Date().toISOString().split("T")[0]
      };
      try {
        const res = await fetch(`/api/subadmins`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSub)
        });
        if(res.ok) {
          const saved = await res.json();
          setSubadmins([...subadmins, saved]);
        }
      } catch(err) {
        console.error(err);
      }
    }
    setForm({ name: "", username: "", password: "", referralCode: "" });
  };

  const handleEditClick = (sub: any) => {
    setForm({ name: sub.name, username: sub.username, password: sub.password, referralCode: sub.referralCode || "" });
    setEditingId(sub._id || sub.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatus = async (idx: number) => {
    const sub = subadmins[idx];
    const id = (sub as any)._id || sub.id;
    const newStatus = sub.status === "Active" ? "Suspended" : "Active";
    
    try {
      const res = await fetch(`/api/subadmins/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if(res.ok) {
        const updated = await res.json();
        setSubadmins(subadmins.map((s, i) => i === idx ? updated : s));
      }
    } catch(err) { console.error(err); }
  };

  const confirmDeleteSub = async () => {
    if (deleteConfirmIdx === null) return;
    const sub = subadmins[deleteConfirmIdx];
    const id = (sub as any)._id || sub.id;
    try {
      await fetch(`/api/subadmins/${id}`, { method: "DELETE" });
      setSubadmins(subadmins.filter((_, i) => i !== deleteConfirmIdx));
    } catch(err) { console.error(err); }
    setDeleteConfirmIdx(null);
  };

  const deleteSub = (idx: number) => {
    setDeleteConfirmIdx(idx);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Sub Admins</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Create and manage sub-admin accounts. Click on a sub-admin to view their referred students.</p>

      {/* Add / Edit Sub Admin */}
      <Card className="p-6 mb-6">
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-4">{editingId ? "Update Sub-Admin Account" : "Create Sub-Admin Account"}</p>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Username / Login ID</label>
              <input
                type="text"
                required
                placeholder="e.g. rahul123"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Password</label>
              <input
                type="text"
                required
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2 gap-3">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", username: "", password: "" }); }}
                className="px-6 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center gap-1.5 shadow-sm active:scale-[0.98]">
                Cancel
              </button>
            )}
            <button type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center gap-1.5 shadow-sm active:scale-[0.98]">
              {editingId ? <FaEdit className="text-xs" /> : <FaPlus className="text-xs" />} {editingId ? "Update Account" : "Create Account"}
            </button>
          </div>
        </form>
      </Card>

      {/* Sub Admins List with Referral Details */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Referrals</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subadmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">No sub-admin accounts created yet.</td>
                </tr>
              ) : (
                subadmins.map((s, idx) => {
                  const { referredRegs, referredPays } = getReferredStudents(s.username);
                  const subCodes = getSubadminCodes(s.username);
                  const isExpanded = expandedSubadmin === s.id;
                  // Get paid referred students (who have a matching payment)
                  const paidReferredStudents = referredRegs.filter(r =>
                    referredPays.some(p => p.email.toLowerCase() === r.email.toLowerCase() || p.phone === r.phone)
                  );
                  const totalReferredRevenue = referredPays.reduce((acc, p) => acc + parseInt(p.planAmount.replace(/[₹,]/g, "") || "0"), 0);

                  return (
                    <React.Fragment key={s.id}>
                      <tr
                        className={`border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition cursor-pointer ${isExpanded ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""}`}
                        onClick={() => setExpandedSubadmin(isExpanded ? null : s.id)}
                      >
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <FaChevronUp className="text-indigo-500 text-xs" /> : <FaChevronDown className="text-slate-400 text-xs" />}
                            {s.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">{s.username}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">{s.password}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              paidReferredStudents.length > 0
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                                : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10"
                            }`}>
                              <FaLink className="inline mr-1 text-[10px]" />
                              {paidReferredStudents.length} Student{paidReferredStudents.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                              {subCodes.length} Code{subCodes.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <button onClick={() => toggleStatus(idx)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer transition duration-200 ${s.status === "Active" ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" : "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}`}>
                            {s.status}
                          </button>
                        </td>
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEditClick(s)} className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition bg-transparent border-none cursor-pointer p-1">
                              <FaEdit className="text-sm" />
                            </button>
                            <button onClick={() => deleteSub(idx)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition bg-transparent border-none cursor-pointer p-1">
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Referral Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-0 py-0">
                            <div className="bg-slate-50/80 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                              {/* Summary Stats */}
                              <div className="px-8 pt-5 pb-4 flex flex-wrap gap-4">
                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 min-w-[140px]">
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Referral Codes</p>
                                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">{subCodes.length}</p>
                                </div>
                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 min-w-[140px]">
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Students Referred</p>
                                  <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{paidReferredStudents.length}</p>
                                </div>
                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3 min-w-[140px]">
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Revenue Generated</p>
                                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹{totalReferredRevenue.toLocaleString("en-IN")}</p>
                                </div>
                              </div>

                              {/* Referral Codes List */}
                              {subCodes.length > 0 && (
                                <div className="px-8 pb-3">
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Referral Codes</p>
                                  <div className="flex flex-wrap gap-2">
                                    {subCodes.map((c, ci) => (
                                      <span key={ci} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-lg border ${
                                        c.uses > 0
                                          ? "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10 line-through"
                                          : c.active
                                            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                            : "bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                      }`}>
                                        {c.code} {c.uses > 0 ? "(Used)" : c.active ? "(Active)" : "(Inactive)"}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Referred Students Table */}
                              <div className="px-8 pb-5">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-3 mt-2">Referred Students</p>
                                {paidReferredStudents.length === 0 ? (
                                  <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold py-3">No students referred yet by this sub-admin.</p>
                                ) : (
                                  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                                          {["Student Name", "Email", "Phone", "Course", "Referral Code", "Payment"].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {paidReferredStudents.map((r, ri) => {
                                          const studentPayment = referredPays.find(p => p.email.toLowerCase() === r.email.toLowerCase() || p.phone === r.phone);
                                          const totalPaid = referredPays
                                            .filter(p => p.email.toLowerCase() === r.email.toLowerCase())
                                            .reduce((acc, p) => acc + parseInt(p.planAmount.replace(/[₹,]/g, "") || "0"), 0);
                                          return (
                                            <tr key={ri} className="border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white text-sm">{r.name}</td>
                                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm">{r.email}</td>
                                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm font-mono">{r.phone}</td>
                                              <td className="px-4 py-3">
                                                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20">{r.course}</span>
                                              </td>
                                              <td className="px-4 py-3">
                                                <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">{r.referralCode}</span>
                                              </td>
                                              <td className="px-4 py-3">
                                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{totalPaid.toLocaleString("en-IN")}</span>
                                                {studentPayment && <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5 font-medium">({studentPayment.planTitle})</span>}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {deleteConfirmIdx !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Sub-Admin?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this Sub-Admin account? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmIdx(null)} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition text-sm cursor-pointer border-none"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteSub} 
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition text-sm cursor-pointer border-none shadow-md shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// REGISTRATIONS TAB
// ═══════════════════════════════════════════════════════════════════════
const RegistrationsTab = ({
  registrations,
  payments,
  onOpenModal,
  userRole,
  onDeleteRegistration,
  onEditRegistration
}: {
  registrations: Registration[];
  payments: Payment[];
  onOpenModal: () => void;
  userRole: "admin" | "subadmin";
  onDeleteRegistration: (email: string, phone: string, id?: string) => void;
  onEditRegistration: (oldEmail: string, oldPhone: string, updatedReg: Registration, id?: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<Registration | null>(null);
  const [filterCourse, setFilterCourse] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Only display registrations that have a matching payment record (by email or phone)
  const paidRegistrations = registrations.filter(r =>
    payments.some(p => p.email.toLowerCase() === r.email.toLowerCase() || p.phone === r.phone)
  );

  const uniqueCourses = Array.from(new Set(paidRegistrations.map(r => r.course))).filter(Boolean);

  const filtered = paidRegistrations.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase()) ||
                          r.course.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterCourse !== "All" && r.course !== filterCourse) return false;
    
    if (r.timestamp) {
      try {
        const rDate = new Date(r.timestamp);
        if (startDate) {
          const sDate = new Date(startDate);
          sDate.setHours(0, 0, 0, 0);
          if (rDate < sDate) return false;
        }
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (rDate > eDate) return false;
        }
      } catch (e) {
        // invalid date, skip filtering
      }
    }
    
    return true;
  });

  const handleDownloadCSV = () => {
    if (filtered.length === 0) {
      alert("No data to download.");
      return;
    }
    const headers = ["Name", "Email", "Phone", "Course", "College", "City", "Date", "Referral Code"];
    const rows = filtered.map(r => {
      let dateStr = "";
      try { dateStr = new Date(r.timestamp).toISOString().split("T")[0]; } catch(e) { dateStr = String(r.timestamp); }
      return [
        `"${r.name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.course}"`,
        `"${r.college || "N/A"}"`,
        `"${r.city || "N/A"}"`,
        `"${dateStr}"`,
        `"${r.referralCode || ""}"`
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Student Registrations</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">All students who filled the registration form.</p>

      {/* Search & Filters & Actions */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full xl:max-w-3xl">
            <div className="relative flex-1 max-w-sm">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or course..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200" />
            </div>
            <select 
              value={filterCourse} 
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full sm:w-48 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
            >
              <option value="All">All Courses</option>
              {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 w-full sm:w-auto">
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
              <span className="text-slate-400 self-center">-</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full xl:w-auto">
            <button onClick={handleDownloadCSV}
              className="px-5 py-2.5 w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center justify-center gap-2 shadow-md hover:shadow-slate-500/10 active:scale-[0.98]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download CSV
            </button>
            <button onClick={onOpenModal}
              className="px-5 py-2.5 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 active:scale-[0.98]">
              <FaPlus className="text-xs" /> Register Student
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {["Name", "Email", "Phone", "Course", "College", "City", "Time"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
                {userRole === "admin" && (
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-sm">{r.name}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">{r.email}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm font-mono">{r.phone}</td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">{r.course}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">{r.college}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">{r.city}</td>
                  <td className="px-5 py-4 text-slate-400 dark:text-slate-500 text-xs font-semibold">{r.timestamp}</td>
                  {userRole === "admin" && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingStudent(r)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition border-none cursor-pointer"
                          title="Edit Student"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => onDeleteRegistration(r.email, r.phone, (r as any)._id || (r as any).id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition border-none cursor-pointer"
                          title="Delete Student"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={userRole === "admin" ? 8 : 7} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Registration Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit Student Details</h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-transparent border-none cursor-pointer p-1"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingStudent) {
                  onEditRegistration(editingStudent.email, editingStudent.phone, editingStudent, (editingStudent as any)._id || (editingStudent as any).id);
                  setEditingStudent(null);
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Email ID</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Course</label>
                <select
                  value={editingStudent.course}
                  onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                >
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">College</label>
                <input
                  type="text"
                  value={editingStudent.college}
                  onChange={(e) => setEditingStudent({ ...editingStudent, college: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">City</label>
                <input
                  type="text"
                  value={editingStudent.city}
                  onChange={(e) => setEditingStudent({ ...editingStudent, city: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Referral Code</label>
                <input
                  type="text"
                  value={editingStudent.referralCode || ""}
                  onChange={(e) => setEditingStudent({ ...editingStudent, referralCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-xs font-bold rounded-xl transition cursor-pointer border-none shadow-sm"
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

// ═══════════════════════════════════════════════════════════════════════
// PAYMENTS TAB
// ═══════════════════════════════════════════════════════════════════════
const PaymentsTab = ({
  payments,
  onAddPayment,
  userRole
}: {
  payments: Payment[];
  onAddPayment: (student: { name: string; email: string; phone: string; course: string }) => void;
  userRole: "admin" | "subadmin";
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Deduplicate: show latest record per unique student (by email)
  const uniqueStudents = payments.reduce<Payment[]>((acc, p) => {
    if (!acc.some(x => x.email.toLowerCase() === p.email.toLowerCase())) acc.push(p);
    return acc;
  }, []);

  const filtered = uniqueStudents.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.email.toLowerCase().includes(search.toLowerCase()) ||
                          p.transactionId.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus !== "All") {
      const remaining = getRemainingBalance(p.email, p.phone, payments);
      const hasDues = remaining !== "₹0";
      if (filterStatus === "Cleared" && hasDues) return false;
      if (filterStatus === "Has Dues" && !hasDues) return false;
    }

    if (p.timestamp) {
      const pDateStr = p.timestamp.split(" ")[0]; // Get YYYY-MM-DD
      const pDate = new Date(pDateStr);
      if (startDate) {
        const sDate = new Date(startDate);
        if (pDate < sDate) return false;
      }
      if (endDate) {
        const eDate = new Date(endDate);
        if (pDate > eDate) return false;
      }
    }
    
    return true;
  });

  const handleDownloadCSV = () => {
    if (filtered.length === 0) {
      alert("No data to download.");
      return;
    }
    
    const headers = ["Name", "Email", "Phone", "Last UTR / TXN ID", "Plan", "Total Paid", "Remaining Dues", "Time"];
    const rows = filtered.map(p => {
      const remaining = getRemainingBalance(p.email, p.phone, payments);
      const totalPaid = payments
        .filter(x => x.email.toLowerCase() === p.email.toLowerCase())
        .reduce((acc, x) => acc + parseInt(x.planAmount.replace(/[₹,]/g, "") || "0"), 0);
      
      return [
        `"${p.name}"`, 
        `"${p.email}"`, 
        `"${p.phone}"`, 
        `"${p.transactionId}"`, 
        `"${p.planTitle}"`, 
        `"${totalPaid}"`, 
        `"${remaining}"`, 
        `"${p.timestamp}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Payment Records</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">All student payments. Use <span className="text-indigo-500 font-bold">Update Due</span> to record remaining installment payments.</p>

      {/* Search and Filters */}
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col xl:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or UTR..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200" />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-48">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Cleared">Cleared</option>
                <option value="Has Dues">Has Dues</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-indigo-500 transition duration-200"
              />
            </div>
            
            <button 
              onClick={handleDownloadCSV}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition duration-200 cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                {["Name", "Email", "Last UTR / TXN ID", "Plan", "Total Paid", "Remaining Dues", "Time"].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
                {userRole === "admin" && (
                  <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const remaining = getRemainingBalance(p.email, p.phone, payments);
                const hasDues = remaining !== "₹0";
                // Sum all payments for this student
                const totalPaid = payments
                  .filter(x => x.email.toLowerCase() === p.email.toLowerCase())
                  .reduce((acc, x) => acc + parseInt(x.planAmount.replace(/[₹,]/g, "") || "0"), 0);
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white text-sm">{p.name}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">{p.email}</td>
                    <td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-200 text-xs font-bold tracking-wider">{p.transactionId}</td>
                    <td className="px-5 py-4">
                      <span className="bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-500/20">{p.planTitle}</span>
                    </td>
                    <td className="px-5 py-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{totalPaid.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      {hasDues ? (
                        <span className="font-extrabold text-red-500 dark:text-red-400 text-sm">{remaining}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
                          <FaCheckCircle className="text-[10px]" /> Cleared
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-400 dark:text-slate-500 text-xs font-semibold">{p.timestamp}</td>
                    {userRole === "admin" && (
                      <td className="px-5 py-4">
                        {hasDues ? (
                          <button
                            onClick={() => onAddPayment({ name: p.name, email: p.email, phone: p.phone, course: p.course })}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-xs font-bold rounded-lg transition duration-150 cursor-pointer"
                          >
                            <FaPlus className="text-[10px]" /> Update Due
                          </button>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-xs font-semibold">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={userRole === "admin" ? 8 : 7} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 text-sm font-semibold">No payment records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════
const DashboardTab = ({ registrations, payments }: { registrations: Registration[], payments: Payment[] }) => {
  const refCodes = loadCodes();
  const activeCodes = refCodes.filter(c => c.active).length;

  // Only display registrations that have a matching payment record (by email or phone)
  const paidRegistrations = registrations.filter(r =>
    payments.some(p => p.email.toLowerCase() === r.email.toLowerCase() || p.phone === r.phone)
  );

  // Calculate total outstanding dues for all registered students who have paid something
  const totalOutstandingDues = paidRegistrations.reduce((acc, r) => {
    const regPayments = payments.filter(p => p.email.toLowerCase() === r.email.toLowerCase() || p.phone === r.phone);
    if (regPayments.length === 0) return acc;
    
    const balanceStr = getRemainingBalance(r.email, r.phone, payments).replace(/[₹,]/g, "");
    return acc + parseInt(balanceStr || "0");
  }, 0);

  return (
    <div>
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Dashboard Overview</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Quick summary of all students, payments and referral activity.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <Card className="hover:scale-[1.02] transition-transform duration-200"><StatCard label="Total Registrations" value={paidRegistrations.length} icon={<FaUsers className="text-blue-600 dark:text-blue-400 text-lg" />} iconBgClass="bg-blue-50 dark:bg-blue-500/10" /></Card>
        <Card className="hover:scale-[1.02] transition-transform duration-200"><StatCard label="Payments Received" value={payments.length} icon={<FaMoneyBillWave className="text-green-600 dark:text-green-400 text-lg" />} iconBgClass="bg-green-50 dark:bg-green-500/10" /></Card>
        <Card className="hover:scale-[1.02] transition-transform duration-200"><StatCard label="Active Ref Codes" value={activeCodes} icon={<FaTags className="text-indigo-600 dark:text-indigo-400 text-lg" />} iconBgClass="bg-indigo-50 dark:bg-indigo-500/10" /></Card>
        <Card className="hover:scale-[1.02] transition-transform duration-200"><StatCard label="Revenue (Est.)" value={"₹" + payments.reduce((acc, p) => acc + parseInt(p.planAmount.replace(/[₹,]/g, "")), 0).toLocaleString()} icon={<FaChartBar className="text-violet-600 dark:text-violet-400 text-lg" />} iconBgClass="bg-violet-50 dark:bg-violet-500/10" /></Card>
        <Card className="hover:scale-[1.02] transition-transform duration-200"><StatCard label="Outstanding Dues" value={"₹" + totalOutstandingDues.toLocaleString()} icon={<FaMoneyBillWave className="text-red-500 dark:text-red-400 text-lg" />} iconBgClass="bg-red-50 dark:bg-red-500/10" /></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Registrations</h3>
            <FaUsers className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {paidRegistrations.slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{r.email} · {r.course}</p>
                </div>
                <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 px-2.5 py-1 rounded-full font-bold">{r.city}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Payments</h3>
            <FaMoneyBillWave className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {payments.slice(0, 3).map((p, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-mono">{p.transactionId}</p>
                </div>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{p.planAmount}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════
const AdminPanel = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "subadmin">("admin");
  const [subadminName, setSubadminName] = useState("");
  const [subadminUsername, setSubadminUsername] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Stateful student registration lists backed by localStorage
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchRegistrationsAndPayments = async () => {
    try {
      const regRes = await fetch("/api/registrations");
      if (!regRes.ok) throw new Error("Registrations API returned " + regRes.status);
      const regData = await regRes.json();
      if (Array.isArray(regData)) {
        setRegistrations(regData);
      } else {
        throw new Error("Registrations API returned invalid format");
      }
    } catch (e) {
      console.warn("Falling back to local storage for registrations...", e);
      const stored = localStorage.getItem("bg_registrations");
      if (stored) {
        setRegistrations(JSON.parse(stored));
      } else {
        setRegistrations(MOCK_REGISTRATIONS);
      }
    }

    try {
      const payRes = await fetch("/api/payments");
      if (!payRes.ok) throw new Error("Payments API returned " + payRes.status);
      const payData = await payRes.json();
      if (Array.isArray(payData)) {
        setPayments(payData);
      } else {
        throw new Error("Payments API returned invalid format");
      }
    } catch (e) {
      console.warn("Falling back to local storage for payments...", e);
      const stored = localStorage.getItem("bg_payments");
      if (stored) {
        setPayments(JSON.parse(stored));
      } else {
        setPayments(MOCK_PAYMENTS);
      }
    }
  };

  const autoMigrateData = async () => {
    try {
      let migrated = false;
      const storedRegs = JSON.parse(localStorage.getItem("bg_registrations") || "[]");
      if (storedRegs.length > 0) {
        for(const reg of storedRegs) {
          if(!reg._id) await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reg) });
        }
        localStorage.removeItem("bg_registrations");
        migrated = true;
      }
      
      const storedPays = JSON.parse(localStorage.getItem("bg_payments") || "[]");
      if (storedPays.length > 0) {
        for(const pay of storedPays) {
          if(!pay._id) await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pay) });
        }
        localStorage.removeItem("bg_payments");
        migrated = true;
      }
      
      const storedSubs = JSON.parse(localStorage.getItem("bg_subadmins") || "[]");
      if (storedSubs.length > 0) {
        for(const sub of storedSubs) {
          if(!sub._id) await fetch("/api/subadmins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
            name: sub.name, username: sub.username, password: sub.password, referralCode: sub.username + "10", status: sub.status, createdDate: sub.created || new Date().toISOString().split("T")[0]
          })});
        }
        localStorage.removeItem("bg_subadmins");
        migrated = true;
      }
      
      const storedCodes = JSON.parse(localStorage.getItem("bg_ref_codes") || "[]");
      if (storedCodes.length > 0) {
        for(const code of storedCodes) {
          if(!code._id) await fetch("/api/refcodes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(code) });
        }
        localStorage.removeItem("bg_ref_codes");
        migrated = true;
      }

      if (migrated) {
        fetchRegistrationsAndPayments();
        // Disabling reload to make it fully seamless
      }
    } catch(e) {
      console.error("Silent migration failed", e);
    }
  };

  useEffect(() => {
    autoMigrateData().then(() => fetchRegistrationsAndPayments());
  }, []);

  const handleDeleteRegistration = async (email: string, phone: string, id?: string) => {
    if (id) setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetch(`/api/registrations/${deleteConfirmId}`, { method: "DELETE" });
      fetchRegistrationsAndPayments();
    } catch (e) {
      console.error("Failed to delete registration", e);
    }
    setDeleteConfirmId(null);
  };

  const handleEditRegistration = async (oldEmail: string, oldPhone: string, updatedReg: Registration, id?: string) => {
    if(!id) return;
    try {
      await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReg)
      });
      fetchRegistrationsAndPayments();
    } catch (e) {
      console.error("Failed to edit registration", e);
      alert("Error saving changes.");
    }
  };

  // Manual student registration modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "MERN Stack",
    college: "",
    city: "",
    payStatus: "Unpaid",
    payAmount: "0",
    transactionId: "",
    referralCode: ""
  });

  // Update due payment modal states
  const [isDueModalOpen, setIsDueModalOpen] = useState(false);
  const [dueForm, setDueForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    planTitle: "2nd Installment",
    amount: "3200",
    transactionId: ""
  });

  const openDueModal = (student: { name: string; email: string; phone: string; course: string }) => {
    setDueForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      planTitle: "2nd Installment",
      amount: "3200",
      transactionId: ""
    });
    setIsDueModalOpen(true);
  };

  const handleDueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueForm.transactionId) {
      alert("Please enter the UTR / Transaction ID.");
      return;
    }
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newPay = {
      name: dueForm.name,
      email: dueForm.email,
      phone: dueForm.phone,
      course: dueForm.course,
      planTitle: dueForm.planTitle,
      planAmount: "₹" + parseInt(dueForm.amount || "0").toLocaleString("en-IN"),
      transactionId: dueForm.transactionId,
      timestamp
    };
    try {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPay)
      });
      fetchRegistrationsAndPayments();
    } catch (e) { console.error(e); }
    setIsDueModalOpen(false);
    setDueForm({ name: "", email: "", phone: "", course: "", planTitle: "2nd Installment", amount: "3200", transactionId: "" });
  };

  useEffect(() => {
    if (sessionStorage.getItem("bg_admin_auth") === "true") {
      setIsAuthenticated(true);
      const role = (sessionStorage.getItem("bg_auth_role") || "admin") as "admin" | "subadmin";
      setUserRole(role);
      if (role === "subadmin") {
        setSubadminName(sessionStorage.getItem("bg_subadmin_name") || "");
        setSubadminUsername(sessionStorage.getItem("bg_subadmin_username") || "");
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("bg_admin_auth");
    sessionStorage.removeItem("bg_auth_role");
    sessionStorage.removeItem("bg_subadmin_username");
    sessionStorage.removeItem("bg_subadmin_name");
    setIsAuthenticated(false);
    setUserRole("admin");
    setSubadminName("");
    setSubadminUsername("");
  };

  const openRegistrationModal = () => {
    setModalForm({
      name: "",
      email: "",
      phone: "",
      course: "MERN Stack",
      college: "",
      city: "",
      payStatus: "Unpaid",
      payAmount: "0",
      transactionId: "",
      referralCode: ""
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name || !modalForm.email || !modalForm.phone) {
      alert("Please fill in name, email and phone number.");
      return;
    }

    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newReg = {
      name: modalForm.name,
      email: modalForm.email,
      phone: modalForm.phone,
      course: modalForm.course,
      college: modalForm.college || "N/A",
      city: modalForm.city || "N/A",
      timestamp,
      referralCode: modalForm.referralCode.trim().toUpperCase()
    };

    let newPay: any = null;
    if (modalForm.payStatus !== "Unpaid") {
      if (!modalForm.transactionId) {
        alert("Transaction/UTR ID is required for payment status.");
        return;
      }
      newPay = {
        name: modalForm.name,
        email: modalForm.email,
        phone: modalForm.phone,
        course: modalForm.course,
        planTitle: modalForm.payStatus,
        planAmount: "₹" + parseInt(modalForm.payAmount || "0").toLocaleString("en-IN"),
        transactionId: modalForm.transactionId,
        timestamp,
        referralCode: modalForm.referralCode.trim().toUpperCase()
      };
    }

    try {
      await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReg)
      });
      if (newPay) {
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPay)
        });
      }
      fetchRegistrationsAndPayments();
    } catch (e) { console.error(e); }

    setIsModalOpen(false);
    // Reset Form
    setModalForm({
      name: "",
      email: "",
      phone: "",
      course: "MERN Stack",
      college: "",
      city: "",
      payStatus: "Unpaid",
      payAmount: "0",
      transactionId: "",
      referralCode: ""
    });
  };

  if (!isAuthenticated) return (
    <LoginPage onLogin={(role, name, _codes) => {
      setIsAuthenticated(true);
      setUserRole(role);
      setSubadminName(name);
      setSubadminUsername(sessionStorage.getItem("bg_subadmin_username") || "");
      setActiveTab("dashboard");
    }} />
  );

  // Get all codes created by this sub-admin
  const getSubadminCreatorCodes = (): string[] => {
    try {
      const stored = localStorage.getItem("bg_ref_codes");
      if (!stored) return [];
      const allCodes: RefCode[] = JSON.parse(stored);
      return allCodes
        .filter(c => c.creator && c.creator.toLowerCase() === subadminUsername.toLowerCase())
        .map(c => c.code.trim().toUpperCase());
    } catch { return []; }
  };

  const subadminCreatorCodes = getSubadminCreatorCodes();

  const filteredRegistrations = userRole === "admin"
    ? registrations
    : registrations.filter(r => r.referralCode && subadminCreatorCodes.includes(r.referralCode.trim().toUpperCase()));

  const filteredPayments = userRole === "admin"
    ? payments
    : payments.filter(p => p.referralCode && subadminCreatorCodes.includes(p.referralCode.trim().toUpperCase()));

  const navItems = userRole === "admin"
    ? [
        { id: "dashboard",     label: "Dashboard",     icon: <FaChartBar /> },
        { id: "registrations", label: "Registrations", icon: <FaUsers /> },
        { id: "payments",      label: "Payments",      icon: <FaMoneyBillWave /> },
        { id: "plans",         label: "Plans",         icon: <FaTags /> },
        { id: "referrals",     label: "Referral Codes",icon: <FaTags /> },
        { id: "subadmins",     label: "Sub Admins",    icon: <FaShieldAlt /> },
      ]
    : [
        { id: "dashboard",     label: "Dashboard",     icon: <FaChartBar /> },
        { id: "registrations", label: "Registrations", icon: <FaUsers /> },
        { id: "payments",      label: "Payments",      icon: <FaMoneyBillWave /> },
        { id: "mycodes",       label: "My Codes",      icon: <FaTags /> },
      ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-300">

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#050b18] border-r border-white/5 flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shadow-lg shadow-indigo-500/5">
            <FaShieldAlt className="text-indigo-400 text-lg" />
          </div>
          <div>
            <p className="font-extrabold text-white text-base leading-none">BeanGate</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{userRole === "admin" ? "Admin Panel" : "Sub-Admin"}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white bg-transparent border-none cursor-pointer lg:hidden">
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer border-none text-left ${activeTab === item.id ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-white/5 space-y-2">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition duration-200 cursor-pointer border-none bg-transparent text-left">
            <FaDatabase className="text-sm" /> View Website
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition duration-200 cursor-pointer border-none bg-transparent text-left">
            <FaSignOutAlt className="text-sm" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="bg-white/80 dark:bg-[#0e1726]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-transparent border-none cursor-pointer lg:hidden flex items-center p-1">
              <FaBars className="text-lg" />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-900 dark:text-white text-base capitalize leading-tight">
                {activeTab === "dashboard" ? "Dashboard" 
                  : activeTab === "registrations" ? "Registrations" 
                  : activeTab === "payments" ? "Payments" 
                  : activeTab === "plans" ? "Plans & Pricing" 
                  : activeTab === "referrals" ? "Referral Codes"
                  : activeTab === "mycodes" ? "My Referral Codes"
                  : "Sub Admins"}
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                {userRole === "admin" ? "BeanGate IT Solutions Admin" : `Sub-Admin: ${subadminName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition duration-200 cursor-pointer border-none flex items-center justify-center" aria-label="Toggle theme">
              {theme === "dark" ? <FaSun className="text-yellow-500 text-sm" /> : <FaMoon className="text-indigo-600 text-sm" />}
            </button>

            {/* Badge */}
            <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl px-3.5 py-1.5 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FaShieldAlt className="text-indigo-400 text-[10px]" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {userRole === "admin" ? "Admin" : "Sub-Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {activeTab === "dashboard"      && <DashboardTab registrations={filteredRegistrations} payments={filteredPayments} />}
          {activeTab === "registrations"  && (
            <RegistrationsTab
              registrations={filteredRegistrations}
              payments={filteredPayments}
              onOpenModal={openRegistrationModal}
              userRole={userRole}
              onDeleteRegistration={handleDeleteRegistration}
              onEditRegistration={handleEditRegistration}
            />
          )}
          {activeTab === "payments"       && <PaymentsTab payments={filteredPayments} onAddPayment={openDueModal} userRole={userRole} />}
          {activeTab === "plans"          && userRole === "admin" && <PlansTab />}
          {activeTab === "referrals"      && userRole === "admin" && <ReferralTab />}
          {activeTab === "subadmins"      && userRole === "admin" && <SubAdminsTab registrations={registrations} payments={payments} />}
          {activeTab === "mycodes"        && userRole === "subadmin" && <SubAdminCodesTab username={subadminUsername} />}
        </main>

      </div>

      {/* ── Update Due Payment Modal ── */}
      {isDueModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Update Due Payment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Record the remaining installment paid by the student.</p>
              </div>
              <button onClick={() => setIsDueModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-transparent border-none cursor-pointer p-1">
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleDueSubmit} className="p-6 space-y-4">
              {/* Read-only student info */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Student Info</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{dueForm.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{dueForm.email} &nbsp;·&nbsp; {dueForm.phone}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{dueForm.course}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payment Type *</label>
                  <select value={dueForm.planTitle} onChange={e => {
                    const t = e.target.value;
                    setDueForm({...dueForm, planTitle: t, amount: t === "Final (Full Clearance)" ? "6000" : "3200"});
                  }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500">
                    <option value="2nd Installment">2nd Installment</option>
                    <option value="Final (Full Clearance)">Final (Full Clearance)</option>
                    <option value="Partial Payment">Partial Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount Paid (₹) *</label>
                  <input type="number" required min="1" value={dueForm.amount} onChange={e => setDueForm({...dueForm, amount: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">UTR / Transaction ID *</label>
                <input type="text" required value={dueForm.transactionId} onChange={e => setDueForm({...dueForm, transactionId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. UPI123456789012" />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
                <button type="button" onClick={() => setIsDueModalOpen(false)} className="px-5 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer bg-transparent transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition cursor-pointer border-none shadow-md shadow-indigo-500/10 active:scale-[0.98]">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Register New Student</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add student details and payment info manually.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-transparent border-none cursor-pointer p-1">
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Student Name *</label>
                  <input type="text" required value={modalForm.name} onChange={e => setModalForm({...modalForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                  <input type="email" required value={modalForm.email} onChange={e => setModalForm({...modalForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input type="tel" required value={modalForm.phone} onChange={e => setModalForm({...modalForm, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. 9876543210" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Course *</label>
                  <select value={modalForm.course} onChange={e => setModalForm({...modalForm, course: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500">
                    <option value="MERN Stack">MERN Stack Development</option>
                    <option value="Frontend Developer">Frontend Web Development</option>
                    <option value="UI/UX Design">UI/UX Design Course</option>
                    <option value="Python Data Science">Python Data Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">College / University</label>
                  <input type="text" value={modalForm.college} onChange={e => setModalForm({...modalForm, college: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. RGPV" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input type="text" value={modalForm.city} onChange={e => setModalForm({...modalForm, city: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. Bhopal" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Referral Code (Optional)</label>
                <input type="text" value={modalForm.referralCode} onChange={e => setModalForm({...modalForm, referralCode: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. BEANGATE10" />
              </div>

              <div className="border-t border-slate-100 dark:border-white/5 my-4 pt-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Payment Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payment Status *</label>
                    <select value={modalForm.payStatus} onChange={e => {
                      const status = e.target.value;
                      let amt = "0";
                      if (status === "One-Time") amt = "6000";
                      else if (status === "1st Installment") amt = "3200";
                      setModalForm({...modalForm, payStatus: status, payAmount: amt});
                    }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500">
                      <option value="Unpaid">Unpaid / Deferred</option>
                      <option value="One-Time">Paid (One-Time Plan)</option>
                      <option value="1st Installment">Paid (1st Installment)</option>
                    </select>
                  </div>
                  
                  {modalForm.payStatus !== "Unpaid" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount Paid (₹) *</label>
                      <input type="number" required value={modalForm.payAmount} onChange={e => setModalForm({...modalForm, payAmount: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" />
                    </div>
                  )}
                </div>

                {modalForm.payStatus !== "Unpaid" && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">UTR / Transaction ID *</label>
                    <input type="text" required value={modalForm.transactionId} onChange={e => setModalForm({...modalForm, transactionId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500" placeholder="e.g. UPI123456789012" />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer bg-transparent transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white text-sm font-bold rounded-xl transition cursor-pointer border-none shadow-md shadow-indigo-500/10 active:scale-[0.98]">Save Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1726] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Registration?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this student's registration? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition text-sm cursor-pointer border-none"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition text-sm cursor-pointer border-none shadow-md shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
