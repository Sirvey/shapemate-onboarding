import React, { useState, useEffect } from "react";
import { Layout, Button, StickyFooter } from "./UI";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  Utensils,
  Zap,
  Salad,
  X,
  Lock,
  Gift,
  ArrowRight,
  Check,
} from "lucide-react";
import { UserData } from "../types";
import confetti from "canvas-confetti";
import { generateNutritionPlan } from "../openaiClient";
import LoadingBar from "./LoadingBar";
import { Sparkle } from "./Sparkle";


export const AlreadyRegisteredScreen: React.FC = () => {
  const handleClose = () => {
    // WhatsApp WebView Close
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage("close");
      return;
    }

    // Fallback Browser
    window.location.href = "https://wa.me/";
  };

  return (
    <div className="h-screen w-full bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-2xl font-semibold mb-4">
          You are already registered
        </h1>

        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          This onboarding link has already been used.
          For security reasons, the onboarding process can only be completed once.
        </p>

        <button
          onClick={handleClose}
          className="w-full rounded-xl bg-black py-3 text-white font-medium"
        >
          Back to WhatsApp
        </button>
      </motion.div>
    </div>
  );
};

interface ResultsProps {
  data: UserData;
  onNext: () => void;
  generatePlan: () => Promise<void>;
}


/* -------------------------------------------------------
   19. RESULTS mit Vitality LoadingBar und Confetti
------------------------------------------------------- */

export const ResultsStep: React.FC<ResultsProps> = ({
  data,
  onNext,
  generatePlan,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const messages = [
    "Calculating your daily calories",
    "Balancing carbs, protein and fats",
    "Checking your workouts and goals",
    "Finalizing your personal plan",
  ];

  // 🔹 OpenAI Plan ausführen
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await generatePlan();
      } catch (e) {
        console.error("OpenAI plan generation failed:", e);
      } finally {
        if (!cancelled) {
          setIsLoaded(true);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 Status Messages rotieren
  useEffect(() => {
    if (isLoaded) return;

    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoaded]);

  // 🔹 Confetti + Success
  useEffect(() => {
    if (!isLoaded) return;

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.3 },
      });
      setShowSuccess(true);
    }, 600);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  return (
    <Layout showBack={false} noPadding>
      <div className="px-6 pt-16 pb-10 flex flex-col items-center text-center">

        {!showSuccess && (
          <>
            <LoadingBar message={messages[statusIndex]} size={170} />
            <p className="text-xs text-gray-400 mt-6 max-w-xs">
              We are creating your personalized nutrition plan based on your data.
            </p>
          </>
        )}

        {showSuccess && (
          <div className="bg-black text-white rounded-2xl p-6 mt-4 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-1">Your plan is ready</h3>
            <p className="text-sm text-gray-300 mb-4">
              Calories and macros have been calculated successfully.
            </p>
            <CheckCircle2 size={28} className="mx-auto" />
          </div>
        )}
      </div>

      {showSuccess && (
        <StickyFooter>
          <Button onClick={onNext}>Show Results</Button>
        </StickyFooter>
      )}
    </Layout>
  );
};







/* -------------------------------------------------------
   20. FINAL DASHBOARD — uses *real* Gemini macro data
------------------------------------------------------- */
export const DashboardStep: React.FC<Props> = ({ data, onNext, onBack }) => {
  const plan = data.aiPlan;

  const calories = Math.round(plan?.targetCalories ?? 0);
  const protein = Math.round(plan?.proteinGrams ?? 0);
  const carbs = Math.round(plan?.carbsGrams ?? 0);
  const fats = Math.round(plan?.fatsGrams ?? 0);

  return (
    <Layout hideHeader={true} noPadding>
      <div className="px-6 pt-0 pb-24 mt-[-8px]">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-black text-white rounded-full p-1">
            <CheckCircle2 size={24} fill="white" className="text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Congratulations<br />your custom plan is ready!
        </h1>

        <p className="text-center text-sm mb-6">Your daily recommended intake:</p>

        <div className="text-center text-3xl font-bold mb-8">
          {calories} kcal
        </div>

        {/* Macro cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">Daily breakdown</h3>
            <span className="text-xs text-gray-400">Based on your goals</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CALORIES */}
            <MacroCard
              label="Calories"
              icon={<Flame size={14} />}
              value={`${calories}`}
              unit="kcal"
              ringColor="gray-200"
            />

            {/* CARBS */}
            <MacroCard
              label="Carbs"
              icon={<Utensils size={14} />}
              value={`${carbs}`}
              unit="g"
              ringColor="orange-100"
            />

            {/* PROTEIN */}
            <MacroCard
              label="Protein"
              icon={<Zap size={14} />}
              value={`${protein}`}
              unit="g"
              ringColor="red-100"
            />

            {/* FATS */}
            <MacroCard
              label="Fats"
              icon={<Salad size={14} />}
              value={`${fats}`}
              unit="g"
              ringColor="blue-100"
            />
          </div>

          {/* Health Score (AI-based placeholder) */}
          <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-bold">
              <div className="text-red-500">❤️</div> AI Health Score
            </div>
            <div className="font-bold">
              {Math.round((protein + carbs + fats) / 100) || 7}/10
            </div>
          </div>
        </div>
      </div>

      <StickyFooter>
        <Button onClick={onNext}>Let's get started!</Button>
      </StickyFooter>
    </Layout>
  );
};


/* -------------------------------------------------------
   MacroCard Component — used in dashboard
------------------------------------------------------- */
const MacroCard = ({
  label,
  icon,
  value,
  unit,
  ringColor,
}: {
  label: string;
  icon: React.ReactNode;
  value: string | number;
  unit: string;
  ringColor: string;
}) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative">
    <div className="flex items-center gap-2 text-xs font-bold mb-2">
      {icon} {label}
    </div>

    <div
      className={`relative w-20 h-20 mx-auto border-4 border-gray-200 border-orange-100 rounded-full flex items-center justify-center`}
    >
      <span className="font-bold text-lg">
        {value}
        <span className="text-xs ml-1">{unit}</span>
      </span>
    </div>
  </div>
);


export const PaywallHook: React.FC<Props> = ({ onNext }) => {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  // Stripe checkout links
  const STRIPE_MONTHLY = "https://buy.stripe.com/6oEbJQ8es1ducFifZ8";
  const STRIPE_YEARLY = "https://buy.stripe.com/6oU3cv49R9rh8Ad7YUaR20f";

  const handlePremiumClick = () => {
    if (plan === "monthly") {
      window.location.href = STRIPE_MONTHLY;
    } else {
      window.location.href = STRIPE_YEARLY;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Logo */}
      <div className="px-6 text-center mt-6 mb-6">
        <img
          src="/assets/logoBig.png"
          alt="Shapemate Logo"
          className="w-40 mx-auto"
        />
      </div>

      {/* VIDEO – smaller smartphone size */}
      <div
        className="
          relative mx-auto 
          w-[220px]
          h-[440px]
          mb-12 
          overflow-hidden 
          rounded-[2rem]
          shadow-xl 
          border border-gray-200
          bg-black
        "
      >
        <video
          src="/assets/flow.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* PAYWALL CONTENT */}
      <div className="p-6 bg-white border-t border-gray-100">

        {/* PLAN SELECT */}
        <PlanSelect plan={plan} setPlan={setPlan} />

        {/* PREMIUM BUTTON — redirects to correct Stripe link */}
        <button
          onClick={handlePremiumClick}
          className="
            w-full 
            py-4 
            rounded-full 
            bg-black 
            text-white 
            text-sm 
            font-bold
            mb-3
          "
        >
          Start with Premium →
        </button>

        {/* BASIC VERSION BUTTON — still opens Exit Promo */}
        <button
          onClick={onNext}
          className="
            w-full 
            py-3 
            rounded-full 
            border border-gray-300 
            text-gray-700 
            text-sm 
            font-medium
            bg-gray-50 
            hover:bg-gray-100 
            transition-colors
          "
        >
          Start for free with Basic Version
        </button>

      </div>
    </div>
  );
};




// Allow WhatsApp WebView bridge without TypeScript errors
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (msg: string) => void;
    };
  }
}


interface Props {
  onNext: () => void;
}


// Exit Promo — 3-Day Free Trial Offer (Yearly €4.15/mo)
export const PaywallPromo: React.FC<Props> = ({ onNext }) => {

  // WhatsApp WebView close logic
  const closeWebview = () => {
  // 1) ANDROID WhatsApp WebView (funktioniert dort)
  if (window.ReactNativeWebView?.postMessage) {
    try {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: "close" })
      );
      return;
    } catch (e) {
      console.warn("Android closeWebView failed", e);
    }
  }

  // 2) iOS + Fallback → direkt zurück in den Shapemate Chat
  window.location.href = "https://wa.me/491776883447";
};


  const handleNoThanks = () => {
    closeWebview();
  };

  const STRIPE_TRIAL =
    "https://buy.stripe.com/4gMaEXbCj0UL17LdjeaR20e";

  const handleStartTrial = () => {
    window.location.href = STRIPE_TRIAL;
  };

  return (
    <div className="min-h-full bg-white flex flex-col items-center text-gray-900">

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md px-6 pb-8 flex flex-col items-center">

        {/* Headline */}
        <h1 className="text-3xl font-extrabold mb-8 mt-6 text-center tracking-tight">
          Your one-time offer
        </h1>

        {/* Hero Section */}
<div className="relative mb-8 w-full flex justify-center items-center">

  {/* Sparkles Left */}
  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 flex flex-col items-end gap-2">
    <Sparkle className="w-8 h-8 rotate-12" fill="#7C7F82" />
    <Sparkle className="w-12 h-12 -mr-4" fill="#1F3D2B" />
    <Sparkle className="w-5 h-5" fill="#323232" />
  </div>

  {/* Sparkles Right */}
  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 flex flex-col items-start gap-1">
    <Sparkle className="w-10 h-10 -ml-2 mb-2" fill="#1F3D2B" />
    <Sparkle className="w-7 h-7" fill="#7C7F82" />
    <Sparkle className="w-5 h-5 mt-2 ml-4" fill="#323232" />
  </div>

  {/* Offer Box */}
  <div
  className="
    relative
    z-10
    w-64
    h-40
    p-8
    rounded-2xl
    flex
    flex-col
    justify-center
    items-center
    text-white
    shine
  "
  style={{
    background: "linear-gradient(180deg, #1F3D2B 0%, #3A5B46 100%)",
    boxShadow: "0 12px 24px rgba(44, 74, 53, 0.45)",
  }}
>



    <div className="text-4xl font-bold tracking-wider mb-1">
      3-DAY
    </div>
    <div className="text-3xl font-bold tracking-wider">
      FREE TRIAL
    </div>
    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
  </div>
</div>


        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-2xl line-through decoration-2 font-bold">
            €9.90
          </span>
          <span className="text-2xl font-light text-gray-600">
            €4.15 / mo
          </span>
        </div>

        {/* Description */}
        <p className="text-center text-gray-500 text-sm px-4 mb-10 leading-relaxed">
          Save 60% with yearly plan.<br />
          Once you close this offer, it’s gone forever.
        </p>

        {/* Plan Card */}
        <div className="w-full border-2 border-black rounded-xl overflow-hidden mb-8 bg-white">
          <div className="bg-[#1C1C1E] text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest">
            3-Day Free Trial
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold text-lg">Yearly Plan</span>
              <span className="text-gray-500 text-sm mt-0.5">
                €4.15 / mo
              </span>
            </div>
            <div className="font-bold text-lg">
              €4.15
            </div>
          </div>
        </div>

        {/* CTA Buttons — UNVERÄNDERTE LOGIK */}
        <div className="w-full mt-auto">

          {/* PRIMARY */}
          <button
            onClick={handleStartTrial}
            className="
              w-full
              py-4
              rounded-full
              bg-black
              text-white
              text-sm
              font-bold
              mb-3
            "
          >
            Start Free 3-Day Trial →
          </button>

          {/* SECONDARY */}
          <button
            onClick={handleNoThanks}
            className="
              w-full
              py-3
              rounded-full
              border
              border-gray-300
              text-gray-700
              text-sm
              font-medium
              bg-gray-50
              hover:bg-gray-100
              transition-colors
            "
          >
            No Thanks
          </button>
        </div>

        {/* Footer Trust */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>No Commitment. Cancel Anytime</span>
        </div>

      </main>
    </div>
  );
};








/* -------------------------------------------------------
   Small reusable components for cleaner code
------------------------------------------------------- */

const TimelineItem = ({
  icon,
  color,
  title,
  text,
}: {
  icon: React.ReactNode;
  color: "orange" | "black";
  title: string;
  text: string;
}) => (
  <div className="relative">
    <div
      className={`absolute -left-[25px] top-0 p-1.5 rounded-full ${
        color === "orange" ? "bg-orange-100 text-orange-600" : "bg-black text-white"
      }`}
    >
      {icon}
    </div>
    <h3 className="font-bold text-sm">{title}</h3>
    <p className="text-xs text-gray-500 leading-tight">{text}</p>
  </div>
);


const PlanSelect = ({
  plan,
  setPlan,
}: {
  plan: "monthly" | "yearly";
  setPlan: (p: "monthly" | "yearly") => void;
}) => (
  <div className="flex gap-4 mb-4">
    {/* MONTHLY PLAN */}
    <PlanOption
      selected={plan === "monthly"}
      onClick={() => setPlan("monthly")}
      price="€9.90/mo"
      label="Monthly"
    />

    {/* YEARLY PLAN */}
    <PlanOption
      selected={plan === "yearly"}
      onClick={() => setPlan("yearly")}
      price="€4.15/mo"
      label="Yearly"
      badge="SAVE 60%"
    />
  </div>
);


const PlanOption = ({
  selected,
  onClick,
  price,
  label,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  price: string;
  label: string;
  badge?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 p-4 rounded-xl border-2 text-left relative ${
      selected ? "border-black bg-gray-50" : "border-gray-200"
    }`}
  >
    {badge && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded">
        {badge}
      </div>
    )}

    <div className="text-[10px] text-gray-500">{label}</div>
    <div className="font-bold text-sm">{price}</div>

    {/* Radio button indicator */}
    <div
      className={`absolute top-2 right-2 w-4 h-4 border-2 rounded-full ${
        selected ? "border-black" : "border-gray-300"
      }`}
    >
      {selected && (
        <div className="w-2 h-2 bg-black rounded-full m-0.5" />
      )}
    </div>
  </button>
);
