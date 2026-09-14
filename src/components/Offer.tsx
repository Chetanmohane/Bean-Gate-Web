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
    <section id="register" className="py-14 bg-gray-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* COLUMN 1: Fee Summary Card (Left) */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between text-left shadow-sm">
            <div>
              <h3 className="text-base font-black text-gray-900 leading-snug mb-3">
                Start Your Journey Today
              </h3>
              
              <h2 className="text-4xl font-black text-[#ff5500] tracking-tight mb-1">
                ₹{currentPrice.toLocaleString()}
              </h2>
              
              <p className="text-xs font-extrabold text-gray-700 mb-3">
                One-Time Course Fee
              </p>

              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold border border-blue-100 mb-6">
                No Hidden Charges
              </span>
            </div>

            {/* 4 Bottom Bullet Icons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-center">
              <div className="bg-gray-50 p-2.5 rounded-xl flex flex-col items-center">
                <span className="text-blue-500 text-base mb-1">♾️</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Lifetime Access to Resources</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl flex flex-col items-center">
                <span className="text-orange-500 text-base mb-1">💻</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Practical Live Projects</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl flex flex-col items-center">
                <span className="text-purple-500 text-base mb-1">📜</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Certificate of Completion</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl flex flex-col items-center">
                <span className="text-emerald-500 text-base mb-1">🎧</span>
                <span className="text-[9px] font-bold text-gray-700 leading-tight">Support &amp; Guidance</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Register Now Form (Center) */}
          <div className="lg:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-left shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Register Now</h3>
              <p className="text-xs text-gray-500 font-semibold mb-5">
                Enter your details to continue with your enrollment.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${errors.name ? 'text-red-500' : 'text-gray-700'}`}>Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none text-xs text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-700'}`}>Mobile Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none text-xs text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your WhatsApp number"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none text-xs text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${errors.city ? 'text-red-500' : 'text-gray-700'}`}>City*</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:outline-none text-xs text-gray-900 ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Qualification*</label>
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-xs text-gray-900"
                    >
                      <option value="">Select your qualification</option>
                      <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                      <option value="BCA / MCA">BCA / MCA</option>
                      <option value="B.Sc / M.Sc">B.Sc / M.Sc</option>
                      <option value="Other Degree">Other Degree</option>
                    </select>
                  </div>
                </div>

                {/* Referral Code optional bar */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Referral Code (Optional)"
                    value={referralCode}
                    onChange={(e) => {
                      setReferralCode(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    disabled={appliedDiscount}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 outline-none text-xs"
                  />
                  {appliedDiscount ? (
                    <button
                      type="button"
                      onClick={handleRemoveReferral}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyReferral}
                      disabled={!referralCode}
                      className="px-3 py-1.5 bg-[#ff5500] text-white text-xs font-bold rounded-lg disabled:opacity-50 cursor-pointer shrink-0 border-none"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoSuccess && <p className="text-green-600 text-[10px] font-bold">{promoSuccess}</p>}
                {promoError && <p className="text-red-500 text-[10px] font-bold">{promoError}</p>}

                {/* Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="terms" defaultChecked className="accent-[#ff5500]" />
                  <label htmlFor="terms" className="text-[10px] text-gray-600 font-semibold">
                    I agree to the <span className="underline">Terms &amp; Conditions</span> and <span className="underline">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff5500] hover:bg-[#e64d00] text-white py-3 rounded-lg font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer border-none"
                >
                  CONTINUE TO PAYMENT →
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 3: Blue Guarantee Card (Right) */}
          <div className="lg:col-span-3 bg-[#051329] text-white rounded-2xl p-6 flex flex-col justify-between text-left shadow-lg">
            <div className="space-y-6">
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 text-sm">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white mb-0.5">Secure Payment</h4>
                  <p className="text-[10px] text-gray-400 font-medium">100% Safe &amp; Secure</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 shrink-0 text-sm">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white mb-0.5">Instant Access</h4>
                  <p className="text-[10px] text-gray-400 font-medium">After Enrollment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 text-sm">
                  🎧
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white mb-0.5">24/7 Support</h4>
                  <p className="text-[10px] text-gray-400 font-medium">For Students</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 shrink-0 text-sm">
                  👥
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white mb-0.5">Join Thousands of</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Happy Learners</p>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-white/10 text-[10px] text-gray-400 text-center font-medium">
              Need assistance? Call +91 9301970707
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Offer;
