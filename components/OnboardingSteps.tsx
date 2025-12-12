
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, StickyFooter, SelectCard, Input, ScrollPicker, Toggle } from './UI';
import { UserData } from '../types';
import { motion } from 'framer-motion';
import { 
  Instagram, Facebook, Youtube, Monitor, Users, 
  Target, Ban, Search, CheckCircle2, ChevronRight, Activity, Fish, Salad, Leaf,
  Watch, Circle, Grip, LayoutGrid, Scale, Utensils, Dumbbell, Apple, Mail,
  Dot,
  EllipsisVertical
} from 'lucide-react';
import { Repeat, Pizza, Clock, Lightbulb, X, AlertCircle } from "lucide-react";
import { supabase } from "../supabaseClient";

interface StepProps {
  data: UserData;
  updateData: (patch: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;

  // nur für GeneratingStep genutzt
  generatePlan?: () => Promise<void>;
  isGenerating?: boolean;
  error?: string | null;
}


export const WelcomeStep: React.FC<StepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* Logo oben rechts */}
      <div className="absolute top-4 right-4 z-20">
        <img
          src="/assets/logoDark.png"
          alt="Shapemate Logo"
          className="w-10 h-10 opacity-90"
        />
      </div>

      {/* Centered but slightly higher */}
      <div className="flex flex-col items-center justify-center px-4 flex-1 -mt-10">

        {/* Mockup */}
        <img
          src="/assets/iphone13.png"
          alt="App Preview"
          className="w-[160px] object-contain mb-4"
        />

        {/* Claim */}
        <p className="text-2xl font-semibold text-gray-700 tracking-tight text-center mt-5">
          Fitness &amp; Health made easy
        </p>
      </div>

      {/* Sticky Footer */}
      <StickyFooter>
        <Button onClick={onNext}>Get Started</Button>
      </StickyFooter>
    </div>
  );
};

// 0.1 Name Step
export const NameStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const isValid = data.firstName?.trim() && data.lastName?.trim();

  return (
    <Layout 
      title="What's your name?"
      subtitle="We personalize your experience"
      progress={progress}
      showBack={true}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">

        <Input
          placeholder="First name"
          value={data.firstName}
          onChange={(e) => updateData({ firstName: e.target.value })}
        />

        <Input
          placeholder="Last name"
          value={data.lastName}
          onChange={(e) => updateData({ lastName: e.target.value })}
        />

      </div>

      <StickyFooter>
        <Button onClick={onNext} disabled={!isValid}>
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};





// 1. Gender
export const GenderStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  return (
    <Layout 
      title="What's your Gender?" 
      subtitle="This helps us calculate accurate calorie and macro goals."
      progress={progress}
      showBack={true}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">
        {['Male', 'Female'].map((g) => (
          <SelectCard 
            key={g} 
            label={g} 
            selected={data.gender === g} 
            onClick={() => updateData({ gender: g })} 
          />
        ))}
      </div>
      <StickyFooter>
        <Button onClick={onNext} disabled={!data.gender}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};

// 1.5 Workouts (Updated Modern Icon Design)
export const WorkoutsStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  progress,
}) => {
  const options = [
    {
      value: "0-2",
      label: "Occasional workouts",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center 
            shadow-sm 
            border border-gray-200
          "
        >
          <Dot size={22} className="text-gray-700" />
        </div>
      ),
    },
    {
      value: "3-5",
      label: "Regular workouts",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center 
            shadow-sm 
            border border-gray-200
          "
        >
          <EllipsisVertical size={22} className="text-gray-700" />
        </div>
      ),
    },
    {
      value: "6+",
      label: "Dedicated athlete",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center 
            shadow-sm 
            border border-gray-200
          "
        >
          <Grip size={22} className="text-gray-700" />
        </div>
      ),
    },
  ];

  return (
    <Layout
      title="How many workouts do you do per week?"
      subtitle="This helps us calibrate your fitness level."
      progress={progress}
      showBack={true}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">
        {options.map((opt) => (
          <SelectCard
            key={opt.value}
            label={opt.value}
            subLabel={opt.label}
            icon={opt.icon}
            selected={data.workoutFrequency === opt.value}
            onClick={() => updateData({ workoutFrequency: opt.value })}
            className="py-6"
          />
        ))}
      </div>

      <StickyFooter>
        <Button onClick={onNext} disabled={!data.workoutFrequency}>
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};


// 2. Source (Updated Modern Icon Design)
export const SourceStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  progress,
}) => {
  const sources = [
    { id: "Instagram", icon: <Instagram size={20} className="text-gray-700" /> },
    { id: "Facebook", icon: <Facebook size={20} className="text-gray-700" /> },
    { id: "TikTok", icon: <span className="font-bold text-lg text-gray-700">Tk</span> },
    { id: "Youtube", icon: <Youtube size={20} className="text-gray-700" /> },
    { id: "Google", icon: <Search size={20} className="text-gray-700" /> },
    { id: "Friend or family", icon: <Users size={20} className="text-gray-700" /> },
  ];

  return (
    <Layout
      title="Where did you hear about us?"
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">
        {sources.map((s) => (
          <SelectCard
            key={s.id}
            label={s.id}
            icon={
              <div
                className="
                  w-10 h-10 
                  bg-white 
                  rounded-full 
                  flex items-center justify-center
                  shadow-sm 
                  border border-gray-200
                "
              >
                {s.icon}
              </div>
            }
            selected={data.source === s.id}
            onClick={() => updateData({ source: s.id })}
          />
        ))}
      </div>

      <StickyFooter>
        <Button onClick={onNext} disabled={!data.source}>
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};




export const MeasurementsStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  progress
}) => {

  const [unit, setUnit] = useState<'imperial' | 'metric'>('metric');

  // VALUE LISTS
  const cmRange = Array.from({ length: 151 }, (_, i) => 100 + i);
  const kgRange = Array.from({ length: 221 }, (_, i) => 30 + i);
  const lbsRange = Array.from({ length: 401 }, (_, i) => 50 + i);

  const imperialHeightOptions: string[] = [];
  for (let f = 3; f <= 7; f++) {
    for (let i = 0; i <= 11; i++) {
      imperialHeightOptions.push(`${f}' ${i}"`);
    }
  }

  // FIXED DEFAULTS  
  const DEFAULT_CM = 175;
  const DEFAULT_KG = 80;
  const DEFAULT_IMP = `5' 9"`;
  const DEFAULT_LBS = 176;

  // We MUST initialize completely independent of "data"
  const [cm, setCm] = useState(DEFAULT_CM);
  const [kg, setKg] = useState(DEFAULT_KG);
  const [impHeightStr, setImpHeightStr] = useState(DEFAULT_IMP);
  const [lbs, setLbs] = useState(DEFAULT_LBS);

  // Prevent immediate overwrite on first render
  const didMount = useRef(false);

  // Sync upward ONLY after mount
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (unit === "metric") {
      updateData({
        height: { value: String(cm), unit: "cm" },
        weight: { value: String(kg), unit: "kg" }
      });
    } else {
      updateData({
        height: { value: impHeightStr, unit: "ft" },
        weight: { value: String(lbs), unit: "lbs" }
      });
    }
  }, [cm, kg, impHeightStr, lbs, unit]);


  // When user switches unit → reset defaults (like every fitness app)
  useEffect(() => {
    if (unit === "metric") {
      setCm(DEFAULT_CM);
      setKg(DEFAULT_KG);
    } else {
      setImpHeightStr(DEFAULT_IMP);
      setLbs(DEFAULT_LBS);
    }
  }, [unit]);


  return (
    <Layout
      title="Your Height & weight"
      subtitle="This will be used to calibrate your custom plan."
      progress={progress}
      onBack={onBack}
    >

      {/* UNIT SWITCH */}
      <div className="flex justify-center mb-10 mt-6">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1">
          {["Imperial", "Metric"].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u.toLowerCase() as any)}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                unit === u.toLowerCase()
                  ? "bg-white shadow-md text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* TWO PICKERS SIDE BY SIDE */}
      <div className="flex gap-4 px-2">

        {/* HEIGHT */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-4">Height</h3>
          {unit === "metric" ? (
            <ScrollPicker
              items={cmRange}
              value={cm}
              onChange={(v) => setCm(v as number)}
              label="cm"
            />
          ) : (
            <ScrollPicker
              items={imperialHeightOptions}
              value={impHeightStr}
              onChange={(v) => setImpHeightStr(v as string)}
            />
          )}
        </div>

        {/* WEIGHT */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-4">Weight</h3>
          {unit === "metric" ? (
            <ScrollPicker
              items={kgRange}
              value={kg}
              onChange={(v) => setKg(v as number)}
              label="kg"
            />
          ) : (
            <ScrollPicker
              items={lbsRange}
              value={lbs}
              onChange={(v) => setLbs(v as number)}
              label="lbs"
            />
          )}
        </div>

      </div>

      <StickyFooter>
        <Button onClick={onNext}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};





// 6. Birthday (Wheel Pickers)
export const BirthdayStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
    // Generate Dates
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 100 + i).reverse();

    // -------------------------------------------------
    // DEFAULT DATE → 01 January 2005
    // -------------------------------------------------
    const DEFAULT_BIRTHDATE = new Date(2005, 0, 1);

    // Parse existing or apply default
    const userDate = data.birthDate ? new Date(data.birthDate) : DEFAULT_BIRTHDATE;

    const [selectedMonth, setSelectedMonth] = useState(months[userDate.getMonth()]);
    const [selectedDay, setSelectedDay] = useState(userDate.getDate());
    const [selectedYear, setSelectedYear] = useState(userDate.getFullYear());

    // Sync changes upward
    useEffect(() => {
        const monthIndex = months.indexOf(selectedMonth);

        // Ensure correct days per month
        const maxDays = new Date(selectedYear, monthIndex + 1, 0).getDate();
        const validDay = Math.min(selectedDay, maxDays);
        if (validDay !== selectedDay) setSelectedDay(validDay);

        // Format YYYY-MM-DD
        const dateString = `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(validDay).padStart(2, "0")}`;
        updateData({ birthDate: dateString });

    }, [selectedMonth, selectedDay, selectedYear]);

    return (
        <Layout
            title="When's your birthday?"
            subtitle="We only use this to calculate your age for health metrics and goals."
            progress={progress}
            onBack={onBack}
        >
            <div className="mt-12 px-2">
                <div className="flex gap-2 justify-center">
                    
                    {/* Month Picker */}
                    <div className="w-32 flex-shrink-0 no-horizontal-pan">
                        <ScrollPicker
                            items={months}
                            value={selectedMonth}
                            onChange={(v) => setSelectedMonth(v as string)}
                        />
                    </div>

                    {/* Day Picker */}
                    <div className="w-20 flex-shrink-0 no-horizontal-pan">
                        <ScrollPicker
                            items={days}
                            value={selectedDay}
                            onChange={(v) => setSelectedDay(v as number)}
                        />
                    </div>

                    {/* Year Picker */}
                    <div className="w-24 flex-shrink-0 no-horizontal-pan">
                        <ScrollPicker
                            items={years}
                            value={selectedYear}
                            onChange={(v) => setSelectedYear(v as number)}
                        />
                    </div>

                </div>
            </div>

            <StickyFooter>
                <Button onClick={onNext} disabled={!data.birthDate}>Continue</Button>
            </StickyFooter>
        </Layout>
    );
};



// 7. Goal (redesigned with matching icon style)
export const GoalStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  progress,
}) => {
  const goals = [
    {
      id: "Lose weight",
      label: "Fat Loss",
      sub: "Reduce body fat effectively",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center
            shadow-sm 
            border border-gray-200
          "
        >
          <Scale size={20} className="text-gray-700" />
        </div>
      ),
    },
    {
      id: "Maintain",
      label: "General Fitness",
      sub: "Improve overall health",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center
            shadow-sm 
            border border-gray-200
          "
        >
          <Activity size={20} className="text-gray-700" />
        </div>
      ),
    },
    {
      id: "Gain weight",
      label: "Muscle Building",
      sub: "Build lean muscle mass",
      icon: (
        <div
          className="
            w-10 h-10 
            bg-white 
            rounded-full 
            flex items-center justify-center
            shadow-sm 
            border border-gray-200
          "
        >
          <Dumbbell size={20} className="text-gray-700" />
        </div>
      ),
    },
  ];

  return (
    <Layout
      title="What is your goal?"
      subtitle="This helps us generate a plan tailored just for you."
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">
        {goals.map((g) => (
          <SelectCard
            key={g.id}
            label={g.label}
            subLabel={g.sub}
            icon={g.icon}
            selected={data.goal === g.id}
            onClick={() => updateData({ goal: g.id })}
          />
        ))}
      </div>

      <StickyFooter>
        <Button onClick={onNext} disabled={!data.goal}>
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};



// 9. Diet (Redesigned to match modern icon card style)

export const DietStep: React.FC<StepProps> = ({
  data,
  updateData,
  onNext,
  onBack,
  progress,
}) => {
  const diets = [
    {
      id: "Classic",
      label: "Classic",
      sub: "No specific dietary restriction",
      icon: <Utensils size={20} className="text-gray-700" />,
    },
    {
      id: "Pescatarian",
      label: "Pescatarian",
      sub: "Fish, plant-based foods",
      icon: <Fish size={20} className="text-gray-700" />,
    },
    {
      id: "Vegetarian",
      label: "Vegetarian",
      sub: "Plant-based, no meat",
      icon: <Salad size={20} className="text-gray-700" />,
    },
    {
      id: "Vegan",
      label: "Vegan",
      sub: "Strictly plant-based",
      icon: <Leaf size={20} className="text-gray-700" />,
    },
  ];

  return (
    <Layout
      title="Do you follow a specific diet?"
      subtitle="This helps us tailor your nutrition plan."
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-6 space-y-4">
        {diets.map((d) => (
          <SelectCard
            key={d.id}
            label={d.label}
            subLabel={d.sub}
            icon={
              <div
                className="
                  w-10 h-10 
                  bg-white 
                  rounded-full 
                  flex items-center justify-center
                  shadow-sm 
                  border border-gray-200
                "
              >
                {d.icon}
              </div>
            }
            selected={data.diet === d.id}
            onClick={() => updateData({ diet: d.id })}
          />
        ))}
      </div>

      <StickyFooter>
        <Button onClick={onNext} disabled={!data.diet}>
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};



// 11. Trust (Legal consent)
export const TrustStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => {
    const [checked, setChecked] = useState(false);

    return (
        <Layout
            title="Your privacy matters"
            subtitle="Please confirm that you agree to personalized data processing."
            progress={progress}
            onBack={onBack}
        >
            {/* Icon */}
            <div className="flex flex-col items-center mt-10 text-center px-4">
                <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center mb-8 relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl"
                    >
                        🤝
                    </motion.div>
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full" />
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                    Your information always stays private and secure.
                </p>

                {/* Consent Card */}
                <div className="mt-10 bg-gray-50 p-4 rounded-xl flex items-center gap-3 w-full max-w-sm">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                            className="w-5 h-5 accent-black"
                        />
                        <span className="text-left text-xs text-gray-600 leading-snug">
                            I agree that Shapemate may process my data to create
                            a personalized journey.
                        </span>
                    </label>
                </div>
            </div>

            <StickyFooter>
                <Button onClick={onNext} disabled={!checked}>
                    Continue
                </Button>
            </StickyFooter>
        </Layout>
    );
};


export const ConnectAppsStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => {
  const leftApps = [
    { src: "/assets/strava.png", alt: "Strava" },
    { src: "/assets/garminlight.png", alt: "Garmin" },
    { src: "/assets/whoopDark.png", alt: "Whoop" }
  ];

  const rightApps = [
    { src: "/assets/applehealthlight.png", alt: "Apple Health" },
    { src: "/assets/zwift.png", alt: "Zwift" },
    { src: "/assets/runnalight.png", alt: "Runna" }
  ];

  return (
    <Layout
      title="Connect your apps"
      subtitle="For even smarter recommendations you can sync your fitness apps. Just type Whoop or Strava in the chat."
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-10 px-5">
        {/* ---- CARD EXACTLY AS WEBSITE ---- */}
        <div
          className="relative rounded-xl border border-[#D3D3D6]
          bg-[#F6F2F2] p-6 shadow-[0_10px_20px_rgba(31,61,43,0.15)]
          backdrop-blur-md overflow-hidden w-full h-[250px]"
        >
          {/* curved connectors */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="flowLine" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C7C7C7" stopOpacity="0" />
                <stop offset="0.5" stopColor="#C7C7C7" stopOpacity="0.9" />
                <stop offset="1" stopColor="#C7C7C7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* left curved lines */}
            {leftApps.map((_, i) => {
              const y = 70 + i * 70;
              return (
                <motion.path
                  key={`l-${i}`}
                  d={`M110 ${y} C200 130, 250 130, 300 130`}
                  stroke="url(#flowLine)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 * i, ease: "easeOut" }}
                />
              );
            })}

            {/* right curved lines */}
            {rightApps.map((_, i) => {
              const y = 70 + i * 70;
              return (
                <motion.path
                  key={`r-${i}`}
                  d={`M300 130 C350 130, 400 ${y}, 490 ${y}`}
                  stroke="url(#flowLine)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 * i, ease: "easeOut" }}
                />
              );
            })}
          </svg>

          {/* left icons */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[210px]">
            {leftApps.map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="w-14 h-14 rounded-xl bg-white flex items-center justify-center
                shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E5E5]"
              >
                <img src={app.src} alt={app.alt} className="w-7 h-7 object-contain" />
              </motion.div>
            ))}
          </div>

          {/* right icons */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col justify-between h-[210px]">
            {rightApps.map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="w-14 h-14 rounded-xl bg-white flex items-center justify-center
                shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E5E5]"
              >
                <img src={app.src} alt={app.alt} className="w-7 h-7 object-contain" />
              </motion.div>
            ))}
          </div>

          {/* center WhatsApp icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute left-[40%] top-[40%] -translate-x-1/2 -translate-y-1/2
            w-16 h-16 bg-white rounded-xl flex items-center justify-center
            shadow-[0_8px_16px_rgba(37,211,102,0.25)] border border-[#E5E5E5]"
          >
            <img src="/assets/whatsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
          </motion.div>

          {/* center glow */}
          <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(37,211,102,0.06),transparent_70%)]" />
        </div>

        {/* INFO TEXT */}
        <p className="text-xs text-gray-500 text-center mt-4 px-4 leading-relaxed">
          Whoop and Strava are supported. <br /> More integrations are coming soon.
        </p>
      </div>

      {/* Continue button ONLY */}
      <StickyFooter>
        <Button onClick={onNext}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};









export const RatingStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => {
  const testimonials = [
    {
      text: "Shapemate completely changed the way I manage my workouts and nutrition - zero friction.",
      author: "Alex R.",
      handle: "@alexfit",
      img: "https://randomuser.me/api/portraits/men/33.jpg"
    },
    {
      text: "The simplest and most beautiful way to stay consistent. Logging on WhatsApp feels natural.",
      author: "Sophie M.",
      handle: "@sophiemoves",
      img: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      text: "I love how smooth everything - meals, workouts and habits - effortless.",
      author: "Daniel W.",
      handle: "@danielhybrid",
      img: "https://randomuser.me/api/portraits/men/36.jpg"
    },
    {
      text: "The UI is gorgeous. It motivates me to open it every day. That’s rare for fitness apps.",
      author: "Clara L.",
      handle: "@clararuns",
      img: "https://randomuser.me/api/portraits/women/55.jpg"
    },
    {
      text: "Health & Fitness + WhatsApp = perfection. I never forget to log or train anymore.",
      author: "Leo M.",
      handle: "@leobuilds",
      img: "https://randomuser.me/api/portraits/men/49.jpg"
    },
    {
      text: "Finally, a product that feels personal. Shapemate sounds like an actual coach.",
      author: "Lena K.",
      handle: "@lenaruns",
      img: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  const longTrack = [...testimonials, ...testimonials];

  return (
    <Layout title="Still not convinced?" progress={progress} onBack={onBack}>
      <div className="flex flex-col items-center w-full">

        {/* --- LOGO statt Rating Box --- */}
        <div className="mt-10 w-full px-6 flex justify-center">
          <img
            src="/assets/logoBig.png"
            className="w-40 h-auto opacity-90"
            alt="Shapemate Logo"
          />
        </div>

        {/* Smooth Infinite Auto-Scrolling Testimonials */}
        <div className="relative overflow-hidden h-[360px] w-full px-6 mt-12">
          <motion.div
            className="flex flex-col gap-4"
            animate={{ y: ["0%", "-50%"] }}
            transition={{
              duration: 50,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {longTrack.map((t, i) => (
              <div
                key={`a-${i}`}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={t.img} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{t.author}</span>
                      <p className="text-xs text-gray-500">{t.handle}</p>
                    </div>
                  </div>
                  <span className="text-[#D09000] text-base">★★★★★</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}

            {longTrack.map((t, i) => (
              <div
                key={`b-${i}`}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={t.img} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{t.author}</span>
                      <p className="text-xs text-gray-500">{t.handle}</p>
                    </div>
                  </div>
                  <span className="text-[#D09000] text-base">★★★★★</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </motion.div>

          {/* Fades */}
          <div className="pointer-events-none absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      </div>

      <StickyFooter>
        <Button onClick={onNext}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};






// 16. Notifications (Updated with Info Text)
export const NotificationsStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const toggle = (key: 'weighing' | 'meal' | 'workout') => {
    updateData({
      notificationPreferences: {
        ...data.notificationPreferences,
        [key]: !data.notificationPreferences[key]
      }
    });
  };

  return (
    <Layout title="Reach your goals with notifications" progress={progress} onBack={onBack}>
      <div className="mt-8 space-y-6">

        {/* WEIGHING */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              <Scale size={20} />
            </div>
            <span className="font-bold text-sm">Weighing</span>
          </div>
          <Toggle checked={data.notificationPreferences.weighing} onChange={() => toggle('weighing')} />
        </div>

        {/* MEAL TRACKING */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              <Utensils size={20} />
            </div>
            <span className="font-bold text-sm">Meal Tracking</span>
          </div>
          <Toggle checked={data.notificationPreferences.meal} onChange={() => toggle('meal')} />
        </div>

        {/* WORKOUT TRACKING */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              <Dumbbell size={20} />
            </div>
            <span className="font-bold text-sm">Workout Tracking</span>
          </div>
          <Toggle checked={data.notificationPreferences.workout} onChange={() => toggle('workout')} />
        </div>

        {/* INFO TEXT */}
        <p className="text-xs text-gray-500 text-center mt-3 px-6 leading-relaxed">
          Turn your notifications on or off at any time in your settings.
        </p>

      </div>

      <StickyFooter>
        <Button onClick={onNext}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};


// 17. Referral
export const ReferralStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const [referralInput, setReferralInput] = useState(data.referralCode || "");
  const [submittedCode, setSubmittedCode] = useState<string | null>(data.referralCode || null);
  const [submittedSource, setSubmittedSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const validateReferral = async () => {
    setError(null);
    setChecking(true);

    const trimmed = referralInput.trim();
    if (!trimmed) {
      setChecking(false);
      return;
    }

    // Query: referral_code + source
    const { data: match, error: dbError } = await supabase
      .from("referral_codes")
      .select("referral_code, source")
      .eq("referral_code", trimmed)
      .maybeSingle();

    setChecking(false);

    if (dbError) {
      console.error(dbError);
      setError("Something went wrong. Please try again.");
      return;
    }

    if (!match) {
      setError("This referral code does not exist.");
      return;
    }

    // Valid code
    setSubmittedCode(match.referral_code);
    setSubmittedSource(match.source);
    updateData({ referralCode: match.referral_code });
  };

  const removeCode = () => {
    setSubmittedCode(null);
    setSubmittedSource(null);
    updateData({ referralCode: "" });
  };

  const isContinueEnabled = Boolean(submittedCode);

  return (
    <Layout
      title="Enter referral code (optional)"
      subtitle="You can skip this step"
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-8 space-y-4">

        {/* Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Invite Code"
            className="w-full h-14 pl-4 pr-32 rounded-xl bg-gray-50 border-2
                       border-transparent focus:border-black focus:bg-white transition-all
                       outline-none text-lg"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value)}
          />

          <button
            onClick={validateReferral}
            disabled={checking}
            className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg text-sm font-bold transition-all
              ${checking ? 
                "bg-gray-300 text-gray-500" :
                "bg-gray-200 text-gray-700 hover:bg-black hover:text-white"
              }`}
          >
            Submit
          </button>
        </div>

        {/* Modern error message */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl animate-fadeIn">
            <AlertCircle size={18} className="mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Sticker-style badge */}
        {submittedCode && (
          <div
            className="flex items-center justify-between w-full
                       bg-black/5 border border-black/10 rounded-xl
                       px-4 py-3 text-base font-semibold text-gray-900 shadow-sm"
          >
            <span>
              {submittedCode}
              {submittedSource && (
                <span className="text-gray-500 ml-2">
                  – {submittedSource}
                </span>
              )}
            </span>

            <button
              onClick={removeCode}
              className="text-red-500 hover:text-red-700 transition"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

            <StickyFooter>
        {/* SKIP FIRST */}
        <Button variant="secondary" onClick={onNext}>
          Skip
        </Button>

        {/* CONTINUE BELOW */}
        <Button 
          onClick={onNext} 
          disabled={!isContinueEnabled} 
          className="mt-3"
        >
          Continue
        </Button>
      </StickyFooter>

    </Layout>
  );
};


// 21. Email Signup (Simple Email Input Only)
export const EmailSignupStep: React.FC<StepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  generatePlan, 
  isGenerating 
}) => {

  const email = data.email?.trim() || "";

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Basic email regex
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // -------------------------------------------------------------
  // Save onboarding → Supabase (wird hier injected von App.tsx)
  // -------------------------------------------------------------
  const handleSubmit = async () => {
    if (!isValidEmail) return;

    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      // submitOnboardingToSupabase kommt aus App.tsx via props.generatePlan?
      // In deinem System speichern wir alles hier:
      const success = await (generatePlan?.() ?? Promise.resolve(true));

      if (success) {
        onNext();       // ✔️ Weiter zum nächsten Step
      }

    } catch (err: any) {
      setSubmitError(err.message || "Unexpected error while saving onboarding data");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Layout showBack={false} title="Save your progress">
      <div className="mt-12 flex flex-col gap-6 px-2">

        {/* Error Banner */}
        {submitError && (
          <div className="w-full bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-center text-sm mb-2">
            {submitError}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm text-center px-4">
          Enter your email to save your progress.
        </p>

        {/* Email Input */}
        <Input
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          type="email"
        />

        {/* Modern Error Message */}
        {email.length > 0 && !isValidEmail && (
          <div className="text-center">
            <p className="text-red-500 text-xs font-medium bg-red-50 py-2 px-3 rounded-xl inline-block shadow-sm border border-red-200">
              Please enter a valid email address.
            </p>
          </div>
        )}

      </div>

      {/* Footer Button */}
      <StickyFooter>
        <Button
          onClick={handleSubmit}
          disabled={!isValidEmail || loadingSubmit}
        >
          {loadingSubmit ? "Saving..." : "Continue"}
        </Button>
      </StickyFooter>
    </Layout>
  );
};





