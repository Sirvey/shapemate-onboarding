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
} from "lucide-react";
import { UserData } from "../types";

interface Props {
  data: UserData;
  onNext: () => void;
  onBack?: () => void;
}

/* -------------------------------------------------------
   19. RESULTS — "Loading bar" screen after Generating
------------------------------------------------------- */
export const ResultsStep: React.FC<Props> = ({ data, onNext }) => {
  const [progress, setProgress] = useState(0);

  const plan = data.aiPlan;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout showBack={false} noPadding>
      <div className="px-6 pt-4">
        {/* Top Nav Indicators */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-gray-400">
            <ArrowRight className="rotate-180" />
          </button>

          <div className="flex gap-2">
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-8 h-1 bg-gray-200 rounded-full" />
            <div className="w-8 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="w-6" />
        </div>

        {/* Progress Counter */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-2">{progress}%</div>
          <h2 className="text-lg font-bold">We’re setting everything up for you</h2>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <p className="text-xs text-right text-gray-400 mt-1">
            Finalizing your custom nutrition plan...
          </p>
        </div>

        {/* Summary preview */}
        <div className="bg-black text-white rounded-2xl p-6 mb-4">
          <h3 className="text-xs text-gray-400 mb-4">
            Daily recommendation for you
          </h3>

          <div className="space-y-3">
            {[
              `Calories: ${plan?.targetCalories ?? "..."}`,
              `Carbs: ${plan?.carbsGrams ?? "..."} g`,
              `Protein: ${plan?.proteinGrams ?? "..."} g`,
              `Fats: ${plan?.fatsGrams ?? "..."} g`,
              "Health Score: AI estimated",
            ].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-medium">{item}</span>
                <CheckCircle2 size={16} className="text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <StickyFooter>
        <Button onClick={onNext}>Continue</Button>
      </StickyFooter>
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
    <Layout showBack={true} onBack={onBack} noPadding>
      <div className="px-6 pt-4 pb-32">
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
      className={`relative w-20 h-20 mx-auto border-4 border-${ringColor} rounded-full flex items-center justify-center`}
    >
      <span className="font-bold text-lg">
        {value}
        <span className="text-xs ml-1">{unit}</span>
      </span>
    </div>

    <div className="absolute bottom-2 right-2 text-gray-300">✏️</div>
  </div>
);


/* -------------------------------------------------------
   PAYWALL COMPONENTS (unchanged functionality)
------------------------------------------------------- */

// Free Hook
export const PaywallHook: React.FC<Props> = ({ onNext }) => (
  <div className="flex flex-col h-full bg-white relative">
    <div className="px-6 text-center mt-8">
      <h1 className="text-2xl font-black mb-1">We want you to</h1>
      <h1 className="text-2xl font-black mb-6">try ShapeMate for free.</h1>

      <div className="relative mx-auto w-72 h-[430px] mb-8">
        <img
          src="/assets/iphone1.png"
          alt="ShapeMate Mockup"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-sm font-bold mb-6">
        <CheckCircle2 size={16} /> No Payment Due Now
      </div>
    </div>

    <div className="mt-auto p-6 bg-white border-t border-gray-100">
      <Button onClick={onNext} className="mb-3">
        Try for €0.00
      </Button>
      <p className="text-center text-xs text-gray-400">
        Just €49.90 per year (€4.15/mo)
      </p>
    </div>
  </div>
);


// Trial Explainer
export const PaywallTrial: React.FC<
  Props & { onExit: () => void }
> = ({ onNext, onBack, onExit }) => {
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4">
        <button onClick={onBack}>
          <ArrowRight className="rotate-180 text-gray-400" />
        </button>
        <button onClick={onExit} className="text-xs text-gray-400">
          Restore
        </button>
      </div>

      <div className="px-6">
        <h1 className="text-2xl font-black mb-8 text-center">
          Start your 3-day FREE<br />trial to continue.
        </h1>

        <div className="space-y-8 relative pl-4 border-l-2 border-gray-100 ml-4">
          {/* Timeline */}
          <TimelineItem
            icon={<Lock size={16} />}
            color="orange"
            title="Today"
            text="Unlock all premium features instantly."
          />

          <TimelineItem
            icon={<Zap size={16} />}
            color="orange"
            title="In 2 Days – Reminder"
            text="We’ll remind you that your free trial is ending."
          />

          <TimelineItem
            icon={<Utensils size={16} />}
            color="black"
            title="In 3 Days – Billing Starts"
            text="You’ll be charged unless cancelled before the deadline."
          />
        </div>
      </div>

      {/* Plans */}
      <div className="mt-auto p-6">
        <PlanSelect plan={plan} setPlan={setPlan} />

        <div className="flex items-center justify-center gap-2 text-xs font-bold mb-4">
          <CheckCircle2 size={12} /> No Payment Due Now
        </div>

        <Button onClick={onNext}>Start My 3-Day Free Trial</Button>
        <p className="text-center text-[10px] text-gray-400 mt-3">
          3 days free, then €49.90 per year (€4.15/mo)
        </p>
      </div>
    </div>
  );
};


// Exit Promo
export const PaywallPromo: React.FC<Props> = ({ onNext }) => (
  <div className="flex flex-col h-full bg-white relative">
    <div className="flex justify-end p-4">
      <button onClick={onNext}>
        <X className="text-gray-400" />
      </button>
    </div>

    <div className="px-6 text-center mt-4">
      <h1 className="text-2xl font-black mb-2">One Time Offer</h1>
      <p className="text-gray-500 text-sm mb-8">You will never see this again</p>

      <div className="bg-gray-100 rounded-[2rem] p-8 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="absolute top-10 left-4 text-xl">🎉</div>
        <div className="absolute top-4 right-10 text-xl">✨</div>
        <div className="absolute bottom-10 right-4 text-xl">🎁</div>

        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm relative">
          <Gift size={32} className="text-orange-400" />
        </div>

        <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
          80% off
        </div>
        <span className="text-xs text-gray-500 ml-2">discount 🙌</span>

        <div className="bg-white rounded-xl py-3 px-6 mt-4 shadow-sm">
          <span className="font-bold">Only $1.66 / month</span>
        </div>

        <p className="text-[10px] text-gray-400 mt-2">Lowest price ever</p>
      </div>
    </div>

    <div className="mt-auto p-6">
      <Button onClick={onNext}>Claim your limited offer now!</Button>
    </div>
  </div>
);


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
      badge="3 DAYS FREE"
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
