import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

// Read plan config saved by Admin Panel (localStorage)
const getPlanCfg = () => {
  try {
    const s = localStorage.getItem("bg_plan_config");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

interface PricingProps {
  selectedPlanId: string;
  setSelectedPlanId: (val: string) => void;
  appliedDiscount: boolean;
  setAppliedDiscount: (val: boolean) => void;
}

const Pricing = ({
  selectedPlanId,
  setSelectedPlanId,
  appliedDiscount,
  setAppliedDiscount
}: PricingProps) => {
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  useEffect(() => {
    if (appliedDiscount) {
      if (!promoCode) {
        setPromoCode("BEANGATE10");
      }
      setPromoSuccess("Referral code applied! 10% Discount saved.");
      setPromoError("");
    } else {
      setPromoCode("");
      setPromoSuccess("");
    }
  }, [appliedDiscount]);

  const handleApplyPromo = async () => {
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

    const inputCode = promoCode.trim().toUpperCase();
    if (!inputCode) return;

    const matchedCode = parsed.find((c: any) => c.code && c.code.trim().toUpperCase() === inputCode);
    const isFallbackDefault = ["BEANGATE10", "REF10", "MERN10"].includes(inputCode);

    if (matchedCode) {
      if (!matchedCode.active || (matchedCode.uses || 0) > 0) {
        setPromoError("This referral code has already been used.");
        setPromoSuccess("");
        setAppliedDiscount(false);
      } else {
        setAppliedDiscount(true);
        const pType = matchedCode.planType || "all";
        let msg = "Referral code applied! Discount saved.";
        if (pType === "one-time") msg = `Referral code applied! (${oneTimeDiscPct}% OFF for One-Time Plan)`;
        else if (pType === "inst-1") msg = `Referral code applied! (${inst1DiscPct}% OFF for 1st Installment)`;
        else if (pType === "inst-2") msg = `Referral code applied! (${inst2DiscPct}% OFF for 2nd Installment)`;
        setPromoSuccess(msg);
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

  const handleRemovePromo = () => {
    setAppliedDiscount(false);
    setPromoCode("");
    setPromoSuccess("");
    setPromoError("");
  };

  const [adminCfg, setAdminCfg] = useState<any>(getPlanCfg());

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/planconfig");
      if (res.ok) {
        const data = await res.json();
        if (data && data.courseName) {
          setAdminCfg(data);
          try { localStorage.setItem("bg_plan_config", JSON.stringify(data)); } catch (e) {}
        }
      }
    } catch (e) {
      console.warn("Pricing could not fetch planconfig from API:", e);
    }
  };

  useEffect(() => {
    fetchConfig();
    const handleUpdate = () => {
      setAdminCfg(getPlanCfg());
      fetchConfig();
    };
    window.addEventListener("planConfigUpdated", handleUpdate);
    return () => window.removeEventListener("planConfigUpdated", handleUpdate);
  }, []);

  // Read admin-configured plan data (falls back to defaults)
  const oneTimePrice   = adminCfg?.oneTimePrice        ?? 6000;
  const originalPrice  = adminCfg?.oneTimeOriginalPrice ?? 15000;
  const inst1Price     = adminCfg?.installment1Price    ?? 3200;
  const inst2Price     = adminCfg?.installment2Price    ?? 3200;

  const defaultDiscPct = adminCfg?.discountPercent      ?? 10;
  const oneTimeDiscPct = adminCfg?.oneTimeDiscountPercent ?? defaultDiscPct;
  const inst1DiscPct   = adminCfg?.installment1DiscountPercent ?? defaultDiscPct;
  const inst2DiscPct   = adminCfg?.installment2DiscountPercent ?? defaultDiscPct;

  const oneTimeFeats   = adminCfg?.oneTimeFeatures      ?? ["Full MERN Stack Course Access","Practical Hands-on Training","100% Placement Assistance","Course Completion Certificate","Save Extra using Referral Codes"];
  const instFeats      = adminCfg?.installmentFeatures  ?? ["Full MERN Stack Course Access","Practical Hands-on Training","100% Placement Assistance","Course Completion Certificate"];

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const discOneTime = Math.round(oneTimePrice * (1 - oneTimeDiscPct / 100));
  const discInst1   = Math.round(inst1Price * (1 - inst1DiscPct / 100));
  const discInst2   = Math.round(inst2Price * (1 - inst2DiscPct / 100));

  const plans = [
    {
      id: "one-time",
      title: "One-Time Payment Plan",
      price: appliedDiscount ? fmt(discOneTime) : fmt(oneTimePrice),
      originalPrice: fmt(originalPrice),
      description: "Pay the full course fee upfront and get a flat discount.",
      badge: appliedDiscount ? `${oneTimeDiscPct}% Code Applied` : "Best Value",
      badgeColor: appliedDiscount ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-orange-500/10 text-orange-400 border-orange-500/20",
      cardStyle: "from-[#121f3d]/90 to-[#081021]/90 border-orange-500/25 hover:border-orange-500/60 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      titleColor: "group-hover:text-orange-400",
      iconColor: "text-orange-400",
      features: oneTimeFeats,
      buttonText: "Enroll & Proceed",
      buttonStyle: "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/20",
    },
    {
      id: "inst-1",
      title: "Flexible Installment Plan",
      price: appliedDiscount ? fmt(discInst1) : fmt(inst1Price),
      originalPrice: null,
      description: "Pay in easy monthly installments while learning.",
      badge: appliedDiscount ? `${inst1DiscPct}% Code Applied` : "Most Flexible",
      badgeColor: appliedDiscount ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/20",
      cardStyle: "from-[#121f3d]/90 to-[#081021]/90 border-blue-500/25 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      titleColor: "group-hover:text-blue-400",
      iconColor: "text-blue-400",
      features: [
        appliedDiscount
          ? `1st Installment: ${fmt(discInst1)} (${inst1DiscPct}% OFF applied)`
          : `1st Installment: ${fmt(inst1Price)} (Pay now to start)`,
        appliedDiscount
          ? `2nd Installment: ${fmt(discInst2)} (${inst2DiscPct}% OFF applied)`
          : `2nd Installment: ${fmt(inst2Price)} (Pay after 30 days)`,
        ...instFeats,
      ],
      buttonText: "Enroll with 1st Installment",
      buttonStyle: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20",
    },
  ];


  const handleEnroll = (planId: string) => {
    setSelectedPlanId(planId);
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-[#050c18] text-white relative overflow-hidden" id="pricing">
      {/* Background blobs / glows */}
      <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-orange-400 text-xs font-bold tracking-widest uppercase border border-orange-500/20 px-4 py-1.5 rounded-full bg-orange-500/10"
          >
            Pricing Plans
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight leading-none"
          >
            Affordable Fees &amp; Flexible Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-gray-400 mt-3 max-w-lg mx-auto leading-relaxed"
          >
            Choose your preferred plan and proceed to fill the registration form below.
          </motion.p>
        </div>

        {/* Promo Code Input */}
        <div className="max-w-md mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0b1329]/50 border border-white/10 rounded-2xl p-4 shadow-xl"
          >
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-2.5 text-center">
              Referral Code - Save 10% Instantly
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Referral Code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoError("");
                }}
                disabled={appliedDiscount}
                className="w-full px-3.5 py-2.5 bg-[#050c18] border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none text-xs"
              />
              {appliedDiscount ? (
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="px-5 py-2.5 bg-red-500/15 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition duration-300 shrink-0 cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={!promoCode}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-700 disabled:to-gray-800 text-white text-xs font-bold rounded-xl transition duration-300 shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              )}
            </div>
            {promoError && (
              <p className="text-red-400 text-[10px] mt-1.5 font-bold text-center">{promoError}</p>
            )}
            {promoSuccess && (
              <p className="text-green-400 text-[10px] mt-1.5 font-bold text-center">{promoSuccess}</p>
            )}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-b ${plan.cardStyle} backdrop-blur-xl rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group`}
            >
              {plan.id === "one-time" && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
              )}
              {plan.id === "inst-1" && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
              )}

              <div>
                {/* Plan Badge */}
                <div className="flex justify-between items-center mb-5">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>

                {/* Plan Name & Price */}
                <h3 className={`text-base font-extrabold text-white ${plan.titleColor} transition-colors duration-300 mb-1.5`}>
                  {plan.title}
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-2 mb-5 border-b border-white/5 pb-4">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-sm text-gray-500 line-through font-medium">{plan.originalPrice}</span>
                  )}
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 font-semibold">
                    {plan.id === "one-time" ? "/ full batch" : "/ installment"}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                      <FaCheck className={`${plan.iconColor} mt-0.5 shrink-0 text-[10px]`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleEnroll(plan.id)}
                className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-extrabold text-center transition duration-300 shadow-md cursor-pointer ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
