
import React, { useState, useEffect } from 'react';
import { Layout, Button, StickyFooter, SelectCard, Input, ScrollPicker, Toggle } from './UI';
import { UserData } from '../types';
import { motion } from 'framer-motion';
import { 
  Instagram, Facebook, Youtube, Monitor, Users, 
  Target, Ban, Search, CheckCircle2, ChevronRight, Activity, 
  Watch, Circle, Grip, LayoutGrid, Scale, Utensils, Dumbbell, Apple, Mail,
  Dot,
  EllipsisVertical
} from 'lucide-react';
import { Repeat, Pizza, Clock, Lightbulb } from "lucide-react";

interface StepProps {
  data: UserData;
  updateData: (fields: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
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






// 1. Gender
export const GenderStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  return (
    <Layout 
      title="Choose your Gender" 
      subtitle="This will be used to calibrate your custom plan."
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

// 1.5. Workouts (New)
export const WorkoutsStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const options = [
    { value: '0-2', label: 'Occasional workouts', icon: <Dot size={20} className="fill-current"/> },
    { value: '3-5', label: 'Regular workouts', icon: <EllipsisVertical size={20} className="fill-current"/> },
    { value: '6+', label: 'Dedicated athlete', icon: <Grip size={20} className="fill-current"/> },
  ];

  return (
    <Layout 
      title="How many workouts do you do per week?" 
      subtitle="This will be used to calibrate your custom plan."
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
        <Button onClick={onNext} disabled={!data.workoutFrequency}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};

// 2. Source
export const SourceStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const sources = [
    { id: 'Instagram', icon: <Instagram /> },
    { id: 'Facebook', icon: <Facebook /> },
    { id: 'TikTok', icon: <span className="font-bold">Tk</span> },
    { id: 'Youtube', icon: <Youtube /> },
    { id: 'Google', icon: <Search /> },
    { id: 'Friend or family', icon: <Users /> },
  ];

  return (
    <Layout 
      title="Where did you hear about us?"
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-6">
        {sources.map((s) => (
          <SelectCard 
            key={s.id}
            label={s.id}
            icon={s.icon}
            selected={data.source === s.id}
            onClick={() => updateData({ source: s.id })}
          />
        ))}
      </div>
      <StickyFooter>
        <Button onClick={onNext} disabled={!data.source}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};



// 4. Info Results (Static)
export const InfoResultsStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => (
  <Layout 
    title="Shapemate creates long-term results"
    progress={progress}
    onBack={onBack}
  >

    <div className="mt-10 rounded-xl p-6 border border-gray-200">
        {/* Replace SVG with graph image */}
        <div className="relative w-full flex items-center justify-center">
          <img 
            src="/assets/graph.png"
            alt="Progress Graph"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
    </div>

    <StickyFooter>
      <Button onClick={onNext}>Continue</Button>
    </StickyFooter>

  </Layout>
);




// 5. Measurements (Wheel Pickers)
export const MeasurementsStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('metric');

  // Ranges
  const cmRange = Array.from({ length: 151 }, (_, i) => 100 + i);
  const kgRange = Array.from({ length: 221 }, (_, i) => 30 + i);

  const lbsRange = Array.from({ length: 401 }, (_, i) => 50 + i);

  // For imperial height picker
  const imperialHeightOptions = [];
  for (let f = 3; f <= 7; f++) {
    for (let i = 0; i <= 11; i++) {
      imperialHeightOptions.push(`${f}' ${i}"`);
    }
  }

  // State
  const [cm, setCm] = useState(
    data.height.unit === 'cm' && data.height.value ? parseInt(data.height.value) : 170
  );
  const [kg, setKg] = useState(
    data.weight.unit === 'kg' && data.weight.value ? parseInt(data.weight.value) : 70
  );

  const [impHeightStr, setImpHeightStr] = useState("5' 9\"");
  const [lbs, setLbs] = useState(150);

  // Sync data upward
  useEffect(() => {
    if (unit === 'metric') {
      updateData({
        height: { value: cm.toString(), unit: 'cm' },
        weight: { value: kg.toString(), unit: 'kg' }
      });
    } else {
      updateData({
        height: { value: impHeightStr, unit: 'ft' },
        weight: { value: lbs.toString(), unit: 'lbs' }
      });
    }
  }, [cm, kg, impHeightStr, lbs, unit]);

  return (
    <Layout
      title="Height & weight"
      subtitle="This will be used to calibrate your custom plan."
      progress={progress}
      onBack={onBack}
    >
      {/* Unit Switch */}
      <div className="flex justify-center mb-10 mt-6">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1">
          {['Imperial', 'Metric'].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u.toLowerCase() as any)}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                unit === u.toLowerCase()
                  ? 'bg-white shadow-md text-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 px-2">
        {/* Height */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-4">Height</h3>

          {unit === 'metric' ? (
            <ScrollPicker
              className="no-horizontal-pan"
              items={cmRange}
              value={cm}
              onChange={(v) => setCm(v as number)}
              label="cm"
            />
          ) : (
            <ScrollPicker
              className="no-horizontal-pan"
              items={imperialHeightOptions}
              value={impHeightStr}
              onChange={(v) => setImpHeightStr(v as string)}
            />
          )}
        </div>

        {/* Weight */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold text-lg mb-4">Weight</h3>

          {unit === 'metric' ? (
            <ScrollPicker
              className="no-horizontal-pan"
              items={kgRange}
              value={kg}
              onChange={(v) => setKg(v as number)}
              label="kg"
            />
          ) : (
            <ScrollPicker
              className="no-horizontal-pan"
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
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 100 + i).reverse(); // 2024 down to 1924

    // Parse existing date or default
    const defaultDate = data.birthDate ? new Date(data.birthDate) : new Date(2000, 0, 1);

    const [selectedMonth, setSelectedMonth] = useState(months[defaultDate.getMonth()]);
    const [selectedDay, setSelectedDay] = useState(defaultDate.getDate());
    const [selectedYear, setSelectedYear] = useState(defaultDate.getFullYear());

    useEffect(() => {
        const monthIndex = months.indexOf(selectedMonth);

        const maxDays = new Date(selectedYear, monthIndex + 1, 0).getDate();
        const validDay = Math.min(selectedDay, maxDays);
        if (validDay !== selectedDay) setSelectedDay(validDay);

        const dateString = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
        updateData({ birthDate: dateString });
    }, [selectedMonth, selectedDay, selectedYear]);

    return (
        <Layout
            title="When were you born?"
            subtitle="This will be used to calibrate your custom plan."
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


// 7. Goal
export const GoalStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => (
  <Layout title="What is your goal?" subtitle="This helps us generate a plan for your calorie intake." progress={progress} onBack={onBack}>
    <div className="mt-6 space-y-4">
        {['Lose weight', 'Maintain', 'Gain weight'].map(goal => (
             <SelectCard key={goal} label={goal} selected={data.goal === goal} onClick={() => updateData({ goal })} />
        ))}
    </div>
    <StickyFooter>
      <Button onClick={onNext} disabled={!data.goal}>Continue</Button>
    </StickyFooter>
  </Layout>
);

// 8. Obstacles
export const ObstaclesStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {

    const obstacles = [
        {
            label: 'Lack of consistency',
            icon: Repeat
        },
        {
            label: 'Unhealthy eating habits',
            icon: Pizza
        },
        {
            label: 'Lack of support',
            icon: Users
        },
        {
            label: 'Busy schedule',
            icon: Clock
        },
        {
            label: 'Lack of meal inspiration',
            icon: Lightbulb
        }
    ];

    const toggle = (obs: string) => {
        const newObs = data.obstacles.includes(obs) 
            ? data.obstacles.filter(o => o !== obs)
            : [...data.obstacles, obs];
        updateData({ obstacles: newObs });
    };

    return (
        <Layout title="What's stopping you from reaching your goals?" progress={progress} onBack={onBack}>
            <div className="mt-6 space-y-4">
                {obstacles.map(({ label, icon: Icon }) => {
                    const selected = data.obstacles.includes(label);
                    return (
                        <SelectCard
                            key={label}
                            label={label}
                            icon={
                                <Icon 
                                    size={20} 
                                    className={selected ? "text-white" : "text-gray-500"} 
                                />
                            }
                            selected={selected}
                            onClick={() => toggle(label)}
                        />
                    );
                })}
            </div>

            <StickyFooter>
                <Button onClick={onNext} disabled={data.obstacles.length === 0}>
                    Continue
                </Button>
            </StickyFooter>
        </Layout>
    );
};

// 9. Diet
export const DietStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => (
    <Layout title="Do you follow a specific diet?" progress={progress} onBack={onBack}>
        <div className="mt-6 space-y-4">
            {[
                { l: 'Classic', i: '🍗' },
                { l: 'Pescatarian', i: '🐟' },
                { l: 'Vegetarian', i: '🥗' },
                { l: 'Vegan', i: '🌱' },
            ].map(d => (
                <SelectCard key={d.l} label={d.l} icon={<span className="text-xl">{d.i}</span>} selected={data.diet === d.l} onClick={() => updateData({ diet: d.l })} />
            ))}
        </div>
        <StickyFooter>
          <Button onClick={onNext} disabled={!data.diet}>Continue</Button>
        </StickyFooter>
    </Layout>
);

// 10. Accomplish
export const AccomplishStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => (
    <Layout title="What would you like to accomplish?" progress={progress} onBack={onBack}>
        <div className="mt-6 space-y-4">
            {[
                { l: 'Eat and live healthier', i: '🍎' },
                { l: 'Boost my energy and mood', i: '✨' },
                { l: 'Stay motivated and consistent', i: '💪' },
                { l: 'Feel better about my body', i: '🧘' },
            ].map(d => (
                <SelectCard key={d.l} label={d.l} icon={<span className="text-xl">{d.i}</span>} selected={data.accomplishment === d.l} onClick={() => updateData({ accomplishment: d.l })} />
            ))}
        </div>
        <StickyFooter>
          <Button onClick={onNext} disabled={!data.accomplishment}>Continue</Button>
        </StickyFooter>
    </Layout>
);

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
                <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-8 relative overflow-hidden">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl"
                    >
                        🤝
                    </motion.div>
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full" />
                </div>

                {/* Text */}
                <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                    We use your data only to personalize your Shapemate experience.
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
  const leftApps = [{ src: "/assets/strava.png", alt: "Strava" }];
  const rightApps = [{ src: "/assets/whoopDark.png", alt: "Whoop" }];

  return (
    <Layout
      title="Connect to Strava or Whoop"
      subtitle="Sync your daily activity between ShapeMate and your fitness apps."
      progress={progress}
      onBack={onBack}
    >
      <div className="mt-10 px-5">
        <motion.div
          className="relative rounded-xl border border-[#D3D3D6]
            bg-[#F6F2F2] p-6 shadow-[0_10px_20px_rgba(31,61,43,0.15)]
            backdrop-blur-md overflow-hidden w-full h-[300px]"
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

            {/* left curved line */}
            <motion.path
              d="M120 130 C200 130, 250 130, 300 130"
              stroke="url(#flowLine)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* right curved line */}
            <motion.path
              d="M300 130 C350 130, 400 130, 480 130"
              stroke="url(#flowLine)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </svg>

          {/* left icon */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col">
            {leftApps.map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="w-16 h-16 rounded-xl bg-white flex items-center justify-center
                  shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E5E5]"
              >
                <img
                  src={app.src}
                  alt={app.alt}
                  className="w-8 h-8 object-contain"
                />
              </motion.div>
            ))}
          </div>

          {/* right icon */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col">
            {rightApps.map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="w-16 h-16 rounded-xl bg-white flex items-center justify-center
                  shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#E5E5E5]"
              >
                <img
                  src={app.src}
                  alt={app.alt}
                  className="w-8 h-8 object-contain"
                />
              </motion.div>
            ))}
          </div>

          {/* center Shapemate icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2
              w-20 h-20 bg-white rounded-xl flex items-center justify-center
              shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-[#E5E5E5]"
          >
            <img
              src="/assets/logoDark.png"
              alt="ShapeMate"
              className="w-10 h-10 object-contain"
            />
          </motion.div>

          {/* center glow */}
          <div className="absolute inset-0 rounded-xl 
            bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_70%)]" />
        </motion.div>
      </div>

      <StickyFooter>
        <div className="space-y-3">
          <Button onClick={onNext}>Continue</Button>
          <Button variant="ghost" onClick={onNext}>Not now</Button>
        </div>
      </StickyFooter>
    </Layout>
  );
};





// 15. Rating (Rebuilt exactly like screenshot)
export const RatingStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => (
  <Layout title="Our Rating" progress={progress} onBack={onBack}>
    <div className="flex flex-col items-center w-full">

      {/* Rating Box */}
      <div className="mt-10 w-full px-6">
        <div className="w-full bg-white border border-gray-200 rounded-3xl py-5 px-6 flex flex-col items-center shadow-sm">

          {/* Top rating row */}
          <div className="flex items-center gap-3 mb-1">
            <img src="/assets/laurel-left.png" alt="" className="w-6 opacity-80" />
            <span className="text-xl font-semibold text-gray-800">4.8</span>
            <span className="text-xl text-[#D09000]">★★★★★</span>
            <img src="/assets/laurel-right.png" alt="" className="w-6 opacity-80" />
          </div>

          <p className="text-xs text-gray-500 font-medium">200+ Mates</p>
        </div>
      </div>

      {/* Headline */}
      <h2 className="mt-14 text-2xl font-bold text-center text-black px-6 leading-snug">
        Shapemate was made for<br />people like you
      </h2>

      {/* User Images */}
      <div className="flex items-center gap-3 mt-6 mb-2">
        <img src="https://picsum.photos/80?1" className="w-14 h-14 rounded-full object-cover" />
        <img src="https://picsum.photos/80?2" className="w-14 h-14 rounded-full object-cover" />
        <img src="https://picsum.photos/80?3" className="w-14 h-14 rounded-full object-cover" />
      </div>

      <p className="text-xs text-gray-500 mb-10 font-medium"> Our Users</p>

      {/* Review Card */}
      <div className="w-full px-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          
          {/* User header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img
                src="https://picsum.photos/200/200?random=92"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold text-gray-900 text-sm">Jake Sullivan</span>
            </div>

            <span className="text-[#D09000] text-base">★★★★★</span>
          </div>

          {/* Review Text */}
          <p className="text-gray-600 text-sm leading-relaxed">
            I lost 15 lbs in 2 months. I was about to go on Ozempic but decided to give this app a shot and it worked :)
          </p>
        </div>
      </div>

    </div>

    <StickyFooter>
      <Button onClick={onNext}>Continue</Button>
    </StickyFooter>
  </Layout>
);


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
            <span className="font-bold text-lg">Weighing</span>
          </div>
          <Toggle checked={data.notificationPreferences.weighing} onChange={() => toggle('weighing')} />
        </div>

        {/* MEAL TRACKING */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              <Utensils size={20} />
            </div>
            <span className="font-bold text-lg">Meal Tracking</span>
          </div>
          <Toggle checked={data.notificationPreferences.meal} onChange={() => toggle('meal')} />
        </div>

        {/* WORKOUT TRACKING */}
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
              <Dumbbell size={20} />
            </div>
            <span className="font-bold text-lg">Workout Tracking</span>
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
export const ReferralStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => (
    <Layout 
      title="Enter referral code (optional)" 
      subtitle="You can skip this step" 
      progress={progress} 
      onBack={onBack}
    >
         <div className="mt-8">
             <div className="relative flex items-center">
                <input 
                  type="text"
                  placeholder="Invite Code" 
                  className="w-full h-14 pl-4 pr-32 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none text-lg"
                  value={data.referralCode}
                  onChange={(e) => updateData({ referralCode: e.target.value })}
                />
                <button 
                  onClick={onNext}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Submit
                </button>
             </div>
         </div>
         
         <StickyFooter>
             <Button variant="secondary" onClick={onNext}>Skip</Button>
         </StickyFooter>
    </Layout>
);

// 18. Generating
export const GeneratingStep: React.FC<StepProps> = ({ onNext }) => {
    React.useEffect(() => {
        const timer = setTimeout(onNext, 3000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <Layout showBack={false} noPadding={true}>
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
                <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <div className="text-4xl animate-pulse">❤️</div>
                    {/* Particles */}
                    <motion.div animate={{ y: -20, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-10 right-10 text-xs">✨</motion.div>
                    <motion.div animate={{ y: -20, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute bottom-10 left-10 text-xs">✨</motion.div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-orange-500 fill-orange-100" />
                    <span className="text-xs font-bold text-gray-500">AI done!</span>
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-12">Time to generate your custom plan!</h2>
                
                <StickyFooter>
                    <Button disabled className="bg-black text-white">Continue</Button>
                </StickyFooter>
            </div>
        </Layout>
    );
};

// 21. Email Signup (Simplified – ONLY email input)
export const EmailSignupStep: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  return (
    <Layout showBack={false} title="Save your progress">
      <div className="mt-12 flex flex-col gap-6 px-2">

        {/* E-Mail Label */}
        <p className="text-gray-600 text-sm text-center px-4">
          Enter your email to save your progress and continue.
        </p>

        {/* Email Input */}
        <Input 
          placeholder="Enter your email"
          value={data.email} 
          onChange={(e) => updateData({ email: e.target.value })}
          type="email"
        />

      </div>

      <StickyFooter>
        <Button 
          onClick={onNext} 
          disabled={!data.email || data.email.trim().length === 0}
        >
          Continue
        </Button>
      </StickyFooter>
    </Layout>
  );
};

