import React, { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface OfferProps {
  selectedPlanId: string;
  setSelectedPlanId: (val: string) => void;
  appliedDiscount: boolean;
  setAppliedDiscount: (val: boolean) => void;
}

const Offer = ({
  selectedPlanId,
  setSelectedPlanId,
  appliedDiscount,
  setAppliedDiscount
}: OfferProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    college: "",
    city: "",
    plan: selectedPlanId,
  });

  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState(appliedDiscount ? "BEANGATE10" : "");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(appliedDiscount ? "Referral code applied! 10% Discount saved." : "");

  // Sync selectedPlanId prop with formData state
  useEffect(() => {
    setFormData((prev) => ({ ...prev, plan: selectedPlanId }));
  }, [selectedPlanId]);

  // Sync appliedDiscount prop with state messages
  useEffect(() => {
    if (appliedDiscount) {
      if (!referralCode) {
        setReferralCode("BEANGATE10");
      }
      setPromoSuccess("Referral code applied! 10% Discount saved.");
      setPromoError("");
    } else {
      setReferralCode("");
      setPromoSuccess("");
    }
  }, [appliedDiscount]);

  const handleApplyReferral = async () => {
    let parsed: any[] = [];
    try {
      const res = await fetch("/api/refcodes");
      if (res.ok) {
        parsed = await res.json();
      }
    } catch (e) {}

    if (!parsed || parsed.length === 0) {
      try {
        const stored = localStorage.getItem("bg_ref_codes");
        if (stored) parsed = JSON.parse(stored);
      } catch (e) {}
    }

    const inputCode = referralCode.trim().toUpperCase();
    if (!inputCode) return;

    const matchedCode = parsed.find((c: any) => c.code && c.code.trim().toUpperCase() === inputCode);
    const isFallbackDefault = ["BEANGATE10", "REF10", "MERN10"].includes(inputCode);

    if (matchedCode) {
      if (!matchedCode.active || (matchedCode.uses || 0) > 0) {
        setPromoError("This referral code has already been used.");
        setPromoSuccess("");
        setAppliedDiscount(false);
      } else {
        const pType = matchedCode.planType || "all";
        const currentPlan = formData.plan || selectedPlanId || "one-time";
        if (pType !== "all" && pType !== currentPlan) {
          const planNames: Record<string, string> = {
            "one-time": "One-Time Payment Plan",
            "inst-1": "1st Installment Plan",
            "inst-2": "2nd Installment Plan"
          };
          setPromoError(`This referral code is valid only for ${planNames[pType] || pType}.`);
          setPromoSuccess("");
          setAppliedDiscount(false);
          return;
        }

        setAppliedDiscount(true);
        setPromoSuccess(`Referral code applied! ${matchedCode.discount || "Discount saved."}`);
        setPromoError("");
      }
    } else if (isFallbackDefault) {
      setAppliedDiscount(true);
      setPromoSuccess("Referral code applied! 10% Discount saved.");
      setPromoError("");
    } else {
      setPromoError("Invalid referral code.");
      setPromoSuccess("");
      setAppliedDiscount(false);
    }
  };

  const handleRemoveReferral = () => {
    setAppliedDiscount(false);
    setReferralCode("");
    setPromoSuccess("");
    setPromoError("");
  };

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [enrolledCount, setEnrolledCount] = useState(32); // Fallback so seatsLeft = 18

  // Real-time End of Day Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Real Seats Count
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await fetch("/api/registrations");
        if (res.ok) {
          const data = await res.json();
          setEnrolledCount(data.length);
          localStorage.setItem("bg_registrations", JSON.stringify(data));
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        const stored = localStorage.getItem("bg_registrations");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setEnrolledCount(Array.isArray(parsed) ? parsed.length : 32);
          } catch {
            setEnrolledCount(32);
          }
        }
      }
    };
    fetchRegistrations();
  }, []);

  const totalSeats = 50;
  const seatsLeft = Math.max(0, totalSeats - enrolledCount);
  const seatsPercentage = Math.min(100, Math.round((enrolledCount / totalSeats) * 100));

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      if (errors[name]) setErrors({ ...errors, [name]: false });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) setErrors({ ...errors, [name]: false });

    if (name === "plan") {
      setSelectedPlanId(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.phone.trim() || formData.phone.length !== 10) newErrors.phone = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.course) newErrors.course = true;
    if (!formData.college) newErrors.college = true;
    if (!formData.city) newErrors.city = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus("error");
      return;
    }

    // Redirect to checkout carrying registration details
    navigate("/payment", {
      state: {
        registrationData: formData,
        planId: formData.plan,
        discountApplied: appliedDiscount,
        referralCode: appliedDiscount ? referralCode.trim().toUpperCase() : ""
      }
    });
  };

  const getPlanCfg = () => {
    try {
      const s = localStorage.getItem("bg_plan_config");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  };

  const [adminCfg, setAdminCfg] = useState<any>(getPlanCfg());

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/planconfig");
        if (res.ok) {
          const data = await res.json();
          if (data && data.courseName) setAdminCfg(data);
        }
      } catch (e) {}
    };
    fetchConfig();
    const handleUpdate = () => setAdminCfg(getPlanCfg());
    window.addEventListener("planConfigUpdated", handleUpdate);
    return () => window.removeEventListener("planConfigUpdated", handleUpdate);
  }, []);

  const oneTimePrice = adminCfg?.oneTimePrice ?? 6000;
  const originalPrice = adminCfg?.oneTimeOriginalPrice ?? 15000;
  const inst1Price = adminCfg?.installment1Price ?? 3200;

  const defaultDiscPct = adminCfg?.discountPercent ?? 10;
  const oneTimeDiscPct = adminCfg?.oneTimeDiscountPercent ?? defaultDiscPct;
  const inst1DiscPct = adminCfg?.installment1DiscountPercent ?? defaultDiscPct;

  const discOneTime = Math.round(oneTimePrice * (1 - oneTimeDiscPct / 100));
  const discInst1 = Math.round(inst1Price * (1 - inst1DiscPct / 100));

  const isOneTime = formData.plan === "one-time";
  const basePrice = isOneTime ? oneTimePrice : inst1Price;
  const currentDiscPct = isOneTime ? oneTimeDiscPct : inst1DiscPct;

  const currentPrice = appliedDiscount ? Math.round(basePrice * (1 - currentDiscPct / 100)) : basePrice;
  const saveAmount = Math.max(0, originalPrice - currentPrice);
  const savePercent = Math.round((saveAmount / originalPrice) * 100);


  return (
    <section id="reviews" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 items-stretch">
          
          {/* LEFT: INFO & OFFERS (Matching the screenshot exactly with optimized spacing) */}
          <div className="flex-1 bg-gradient-to-br from-blue-950 via-cyan-950 to-[#0b111e] text-white px-6 py-10 md:px-10 md:py-12 flex flex-col justify-between relative overflow-hidden border-r border-white/5">
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              
              <div>
                {/* Header Title with confetti popper */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <h2 className="text-2xl font-extrabold text-white tracking-wider uppercase font-sans">
                    SPECIAL OFFER
                  </h2>
                  <span className="text-2xl">🎉</span>
                </div>

                {/* Price Details Card Container (White Box) */}
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl text-center">
                  <div className="grid grid-cols-2 items-center relative">
                    {/* Left Side */}
                    <div className="text-center">
                      <p className="text-gray-400 text-[11px] font-semibold tracking-wide uppercase mb-1">Actual Price</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-400 line-through">₹15,000</p>
                    </div>
                    {/* Divider */}
                    <div className="absolute left-1/2 top-1 bottom-1 w-[1px] bg-gray-200 -translate-x-1/2"></div>
                    {/* Right Side */}
                    <div className="text-center">
                      <p className="text-gray-900 text-[11px] font-extrabold tracking-wide uppercase mb-1">Today Only</p>
                      <p className="text-2xl sm:text-3xl font-black text-[#ff6600]">
                        ₹{currentPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Thin divider */}
                  <div className="w-full h-[1px] bg-gray-100 my-4"></div>
                  
                  {/* Savings Badge */}
                  <div className="inline-block bg-[#ffcc00] text-gray-950 text-[11px] font-extrabold px-6 py-2 rounded-full tracking-wide">
                    You Save ₹{saveAmount.toLocaleString()} ({savePercent}% OFF)
                  </div>
                </div>

                {/* Timers block */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "HOURS", val: timeLeft.hours },
                    { label: "MINUTES", val: timeLeft.minutes },
                    { label: "SECONDS", val: timeLeft.seconds },
                  ].map((t) => (
                    <div key={t.label} className="bg-white/[0.04] border border-white/10 rounded-2xl py-4 px-1 text-center shadow-md">
                      <span className="block text-2xl font-extrabold text-white tracking-tight font-sans">
                        {String(t.val).padStart(2, "0")}
                      </span>
                      <span className="block text-[8px] uppercase font-bold text-gray-400 mt-1.5 tracking-wider">{t.label}</span>
                    </div>
                  ))}
                </div>

                {/* Hurry Alert Text */}
                <p className="text-center text-xs font-bold text-white mb-2 tracking-wide leading-relaxed">
                  Hurry! Offer ends soon. Limited Seats Available!
                </p>
              </div>

              {/* Batch Highlights (Fills vertical space beautifully with marketing bullets) */}
              <div className="space-y-2.5 text-xs text-gray-300 border-t border-white/5 pt-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[#ff6600] font-bold">✓</span> Live Practical Interactive Classes
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff6600] font-bold">✓</span> Corporate-Level Industry Projects
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff6600] font-bold">✓</span> 1-on-1 Doubt Solving & Placement Support
                </div>
              </div>

              {/* Seats Progress Block (Positioned at bottom) */}
              <div className="text-left bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-[#ff6600] rounded-full transition-all duration-1000" style={{ width: `${seatsPercentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-yellow-400 tracking-wide">{seatsLeft} / {totalSeats} Seats Left</span>
                  <span className="text-red-400 text-[10px] uppercase tracking-wider animate-pulse">Selling Fast!</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: REGISTER NOW FORM */}
          <div className="flex-1 p-8 md:p-12 text-left">
            <h3 className="text-2xl font-black text-gray-900 mb-2">REGISTER NOW</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Fill in your correct student credentials to proceed to secure batch payment and seat reservation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.name ? 'text-red-500' : 'text-gray-700'}`}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.name ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-700'}`}>Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="XXXXXXXXXX"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.phone ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.email ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.course ? 'text-red-500' : 'text-gray-700'}`}>Select Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.course ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  >
                    <option value="">Select Course</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="MERN Stack">MERN Stack</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.college ? 'text-red-500' : 'text-gray-700'}`}>College / University *</label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.college ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  >
                    <option value="">Select College</option>
                    <option value="PDPS College">PDPS College</option>
                    <option value="BUIT">BUIT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${errors.city ? 'text-red-500' : 'text-gray-700'}`}>City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none text-sm text-gray-900 transition-colors ${errors.city ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-1 focus:ring-orange-500'}`}
                  >
                    <option value="">Select City</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Indore">Indore</option>
                    <option value="Jabalpur">Jabalpur</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Payment Plan</label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none"
                >
                  <option value="one-time">One-Time Payment Plan ({appliedDiscount ? `₹${discOneTime.toLocaleString("en-IN")}` : `₹${oneTimePrice.toLocaleString("en-IN")}`})</option>
                  <option value="inst-1">Flexible Installment Plan ({appliedDiscount ? `₹${discInst1.toLocaleString("en-IN")}` : `₹${inst1Price.toLocaleString("en-IN")}`})</option>
                </select>
              </div>

              {/* Referral Code Field */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-left">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Referral Code (Optional) - Save 10% Instantly
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter referral code (e.g. BEANGATE10)"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    disabled={appliedDiscount}
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none text-xs focus:border-orange-500/40 transition duration-300"
                  />
                  {appliedDiscount ? (
                    <button
                      type="button"
                      onClick={handleRemoveReferral}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyReferral}
                      disabled={!referralCode}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white text-xs font-black rounded-xl transition shrink-0 cursor-pointer border-none"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="text-red-400 text-[10px] mt-1 font-bold">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-green-600 text-[10px] mt-1 font-bold">{promoSuccess}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-orange text-white py-3.5 rounded-xl font-extrabold hover:bg-orange-600 transition shadow-md shadow-orange-500/10 cursor-pointer"
              >
                PROCEED TO PAYMENT &amp; REGISTER →
              </button>
        
              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mt-2 font-medium">
                <FaLock className="text-green-500 shrink-0 text-xs" /> Your details are safe with us. We will never share your data.
              </p>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Offer;
