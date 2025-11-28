
import React, { useState, useEffect } from 'react';
import { Layout, Button, StickyFooter, SelectCard, Input, ScrollPicker, Toggle } from './UI';
import { UserData } from '../types';
import { motion } from 'framer-motion';
import { 
  Instagram, Facebook, Youtube, Monitor, Users, 
  Target, Ban, Search, CheckCircle2, ChevronRight, Activity, 
  Watch, Circle, Grip, LayoutGrid, Scale, Utensils, Dumbbell, Apple, Mail
} from 'lucide-react';

interface StepProps {
  data: UserData;
  updateData: (fields: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
  progress: number;
}

// 0. Welcome Screen
export const WelcomeStep: React.FC<StepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-white relative p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mb-8 shadow-xl">
           <Activity size={48} className="text-white" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight mb-4">ShapeMate</h1>
        <p className="text-lg text-gray-500 font-medium max-w-xs leading-relaxed">
          Your personal AI-powered plan to reach your dream body.
        </p>
      </div>
      
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
    { value: '0-2', label: 'Occasional workouts', icon: <Circle size={20} className="fill-current"/> },
    { value: '3-5', label: 'Regular workouts', icon: <Grip size={20} className="fill-current"/> },
    { value: '6+', label: 'Dedicated athlete', icon: <LayoutGrid size={20} className="fill-current"/> },
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
    { id: 'TV', icon: <Monitor /> },
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

// 3. History
export const HistoryStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => (
  <Layout title="Have you tried other calorie tracking apps?" progress={progress} onBack={onBack}>
    <div className="mt-32 space-y-4">
      <SelectCard label="No" icon={<Ban size={20}/>} selected={data.triedOthers === false} onClick={() => updateData({ triedOthers: false })} />
      <SelectCard label="Yes" icon={<CheckCircle2 size={20}/>} selected={data.triedOthers === true} onClick={() => updateData({ triedOthers: true })} />
    </div>
    <StickyFooter>
      <Button onClick={onNext}>Continue</Button>
    </StickyFooter>
  </Layout>
);

// 4. Info Results (Static)
export const InfoResultsStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => (
  <Layout title="ShapeMate creates long-term results" progress={progress} onBack={onBack}>
    <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-500 mb-4 text-sm">Your weight</h3>
        {/* Mock Chart */}
        <div className="relative h-48 w-full">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                <path d="M0,20 Q20,10 50,40 T100,45" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0,20 Q40,20 60,35 T100,45" fill="none" stroke="black" strokeWidth="3" />
                <circle cx="0" cy="20" r="3" fill="white" stroke="black" strokeWidth="2" />
                <circle cx="100" cy="45" r="3" fill="white" stroke="black" strokeWidth="2" />
            </svg>
            <div className="absolute top-1/2 left-1/4 bg-black text-white text-xs px-2 py-1 rounded-md transform -translate-y-1/2">
                ShapeMate
            </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>Month 1</span>
            <span>Month 6</span>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600 leading-relaxed">
            80% of ShapeMate users maintain their weight loss even 6 months later
        </p>
    </div>
    <StickyFooter>
      <Button onClick={onNext}>Continue</Button>
    </StickyFooter>
  </Layout>
);

// 5. Measurements (Wheel Pickers)
export const MeasurementsStep: React.FC<StepProps> = ({ data, updateData, onNext, onBack, progress }) => {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('metric');

  // Range Generators
  const cmRange = Array.from({ length: 151 }, (_, i) => 100 + i); // 100 - 250 cm
  const kgRange = Array.from({ length: 221 }, (_, i) => 30 + i); // 30 - 250 kg
  
  const ftRange = Array.from({ length: 5 }, (_, i) => 4 + i); // 4 - 8 ft
  const inRange = Array.from({ length: 12 }, (_, i) => i); // 0 - 11 in
  const lbsRange = Array.from({ length: 401 }, (_, i) => 50 + i); // 50 - 450 lbs

  // Parsed State for Pickers
  const [cm, setCm] = useState(data.height.unit === 'cm' && data.height.value ? parseInt(data.height.value) : 170);
  const [kg, setKg] = useState(data.weight.unit === 'kg' && data.weight.value ? parseInt(data.weight.value) : 70);
  
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(9);
  const [lbs, setLbs] = useState(150);

  // Update Parent Data on Change
  useEffect(() => {
    if (unit === 'metric') {
      updateData({ 
        height: { value: cm.toString(), unit: 'cm' },
        weight: { value: kg.toString(), unit: 'kg' }
      });
    } else {
      updateData({ 
        height: { value: `${ft}'${inch}"`, unit: 'ft' },
        weight: { value: lbs.toString(), unit: 'lbs' }
      });
    }
  }, [cm, kg, ft, inch, lbs, unit]);

  const imperialHeightOptions = [];
  for(let f = 3; f <= 7; f++) {
    for(let i = 0; i < 12; i++) {
        imperialHeightOptions.push(`${f}' ${i}"`);
    }
  }
  
  const [impHeightStr, setImpHeightStr] = useState("5' 9\"");

  useEffect(() => {
    if (unit === 'imperial') {
       const parts = impHeightStr.replace('"','').split("' ");
       updateData({ 
          height: { value: impHeightStr, unit: 'ft' },
          weight: { value: lbs.toString(), unit: 'lbs' }
       });
    }
  }, [impHeightStr, lbs, unit]);


  return (
    <Layout title="Height & weight" subtitle="This will be used to calibrate your custom plan." progress={progress} onBack={onBack}>
      <div className="flex justify-center mb-10 mt-6">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1 relative z-20">
          {['Imperial', 'Metric'].map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u.toLowerCase() as any)}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                unit === u.toLowerCase() ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-4 px-2">
          {/* Height Column */}
          <div className="flex-1 flex flex-col items-center">
             <h3 className="font-bold text-lg mb-4">Height</h3>
             {unit === 'metric' ? (
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

          {/* Weight Column */}
          <div className="flex-1 flex flex-col items-center">
             <h3 className="font-bold text-lg mb-4">Weight</h3>
             {unit === 'metric' ? (
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
        // Construct YYYY-MM-DD
        const monthIndex = months.indexOf(selectedMonth);
        // Simple day validation
        const maxDays = new Date(selectedYear, monthIndex + 1, 0).getDate();
        const validDay = Math.min(selectedDay, maxDays);
        if (validDay !== selectedDay) setSelectedDay(validDay);

        const dateString = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`;
        updateData({ birthDate: dateString });
    }, [selectedMonth, selectedDay, selectedYear]);

    return (
        <Layout title="When were you born?" subtitle="This will be used to calibrate your custom plan." progress={progress} onBack={onBack}>
            <div className="mt-12 px-2">
                <div className="flex gap-2 justify-center">
                    {/* Month Picker */}
                    <div className="w-32 flex-shrink-0">
                        <ScrollPicker 
                            items={months} 
                            value={selectedMonth} 
                            onChange={(v) => setSelectedMonth(v as string)} 
                        />
                    </div>
                    {/* Day Picker */}
                    <div className="w-20 flex-shrink-0">
                        <ScrollPicker 
                            items={days} 
                            value={selectedDay} 
                            onChange={(v) => setSelectedDay(v as number)} 
                        />
                    </div>
                    {/* Year Picker */}
                    <div className="w-24 flex-shrink-0">
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
        'Lack of consistency',
        'Unhealthy eating habits',
        'Lack of support',
        'Busy schedule',
        'Lack of meal inspiration'
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
                {obstacles.map(obs => (
                     <SelectCard 
                        key={obs} 
                        label={obs} 
                        icon={data.obstacles.includes(obs) ? <Ban size={20} className="text-white"/> : <Ban size={20}/>}
                        selected={data.obstacles.includes(obs)} 
                        onClick={() => toggle(obs)} 
                    />
                ))}
            </div>
            <StickyFooter>
              <Button onClick={onNext} disabled={data.obstacles.length === 0}>Continue</Button>
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

// 11. Trust (Interstitial)
export const TrustStep: React.FC<StepProps> = ({ onNext }) => {
    // Auto advance
    React.useEffect(() => {
        const timer = setTimeout(onNext, 2500);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
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
            <h2 className="text-2xl font-bold mb-2">Thank you for trusting us</h2>
            <p className="text-gray-500 text-sm">Now let's personalize ShapeMate for you...</p>
            
            <div className="mt-12 bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                 <div className="text-left">
                     <div className="text-[10px] text-gray-400 font-bold uppercase">Your privacy and security matter to us</div>
                     <div className="text-[10px] text-gray-500">We promise to always keep your personal information private and secure.</div>
                 </div>
            </div>
            
            <StickyFooter>
                <Button disabled={true} className="bg-opacity-50">Continue</Button>
            </StickyFooter>
        </div>
    );
};

// 12. Connect Apps
export const ConnectAppsStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => (
    <Layout title="Connect to Strava or Whoop" subtitle="Sync your daily activity between ShapeMate and your fitness apps." progress={progress} onBack={onBack}>
        <div className="mt-12 flex justify-center">
             <div className="bg-gray-50 rounded-3xl p-8 w-full max-w-[280px] aspect-square flex flex-col items-center justify-center relative">
                 {/* Mock Flow Diagram */}
                 <div className="flex items-center gap-6 mb-4">
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-12 h-12 bg-[#FC4C02] rounded-xl text-white flex items-center justify-center shadow-md">
                             <Activity size={24} /> {/* Strava-like color/icon */}
                         </div>
                         <div className="text-[10px] font-bold text-gray-500">Strava</div>
                     </div>
                     
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-12 h-12 bg-black rounded-xl text-white flex items-center justify-center shadow-md">
                             <Watch size={24} /> {/* Whoop-like color/icon */}
                         </div>
                         <div className="text-[10px] font-bold text-gray-500">Whoop</div>
                     </div>
                 </div>
                 <div className="absolute bottom-8 text-3xl animate-bounce">❤️</div>
             </div>
        </div>
        <StickyFooter>
            <div className="space-y-3">
                <Button onClick={onNext}>Continue</Button>
                <Button variant="ghost" onClick={onNext}>Not now</Button>
            </div>
        </StickyFooter>
    </Layout>
);


// 15. Rating
export const RatingStep: React.FC<StepProps> = ({ onNext, onBack, progress }) => (
    <Layout title="Give us a rating" progress={progress} onBack={onBack}>
         <div className="mt-8 flex flex-col items-center">
             <div className="flex gap-2 text-4xl text-yellow-400 mb-8">
                 {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
             </div>
             <h3 className="font-bold text-sm mb-4">ShapeMate was made for people like you</h3>
             <div className="flex -space-x-3 mb-8">
                 {[1,2,3].map(i => (
                     <img key={i} src={`https://picsum.photos/50/50?random=${i}`} className="w-10 h-10 rounded-full border-2 border-white" />
                 ))}
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] border-2 border-white">+2M</div>
             </div>
             
             {/* Review Card */}
             <div className="bg-gray-800 text-white p-4 rounded-2xl text-xs leading-relaxed max-w-xs mx-auto mb-4 relative">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 bg-gray-600 rounded-full overflow-hidden">
                        <img src="https://picsum.photos/30/30?random=10" />
                     </div>
                     <span className="font-bold">Marley Bryle</span>
                     <span className="text-yellow-400">★★★★★</span>
                 </div>
                 "I lost 15 lbs in 2 months! I was about to go on Ozempic but decided to give this app a shot and it worked :)"
             </div>
             <div className="bg-gray-500 text-white p-4 rounded-2xl text-xs leading-relaxed max-w-[280px] mx-auto opacity-60">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 bg-gray-400 rounded-full" />
                     <span className="font-bold">Sonny Marcos</span>
                     <span className="text-yellow-400">★★★★★</span>
                 </div>
                 "The time I have saved by just taking..."
             </div>
         </div>
         <StickyFooter>
             <Button onClick={onNext}>Continue</Button>
         </StickyFooter>
    </Layout>
);

// 16. Notifications (Updated with Toggles)
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
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                  <Scale size={20} />
                </div>
                <span className="font-bold text-lg">Weighing</span>
              </div>
              <Toggle checked={data.notificationPreferences.weighing} onChange={() => toggle('weighing')} />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                  <Utensils size={20} />
                </div>
                <span className="font-bold text-lg">Meal Tracking</span>
              </div>
              <Toggle checked={data.notificationPreferences.meal} onChange={() => toggle('meal')} />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                  <Dumbbell size={20} />
                </div>
                <span className="font-bold text-lg">Workout Tracking</span>
              </div>
              <Toggle checked={data.notificationPreferences.workout} onChange={() => toggle('workout')} />
            </div>
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

// 21. Email Signup (New)
export const EmailSignupStep: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  return (
    <Layout showBack={false} title="Save your progress">
      <div className="mt-12 flex flex-col gap-4">
         {/* Apple Login (Mock) */}
         <button className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-3 font-semibold">
           <Apple fill="white" size={22} />
           Sign in with Apple
         </button>

         {/* Google Login (Mock) */}
         <button className="w-full h-14 bg-white border-2 border-gray-200 text-gray-900 rounded-full flex items-center justify-center gap-3 font-semibold hover:bg-gray-50 transition-colors" onClick={onNext}>
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
         </button>

         <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-gray-200 flex-1"/>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"/>
         </div>
         
         {/* Email Input */}
         <Input 
           placeholder="Enter your email"
           value={data.email} 
           onChange={(e) => updateData({ email: e.target.value })}
           type="email"
         />
      </div>

      <StickyFooter>
         <Button onClick={onNext} disabled={!data.email && true /* For mock, button enabled only by google login usually, but here we allow email too */}>Continue</Button>
      </StickyFooter>
    </Layout>
  );
};
