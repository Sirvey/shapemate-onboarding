
import React, { useState } from 'react';
import { Layout, Button, StickyFooter } from './UI';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Flame, Utensils, Zap, Salad, X, ShieldCheck, Lock, Gift, ArrowRight 
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';

interface Props {
  onNext: () => void;
  onBack?: () => void;
}

// 19. Results
export const ResultsStep: React.FC<Props> = ({ onNext }) => {
    const [progress, setProgress] = useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(78), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Layout showBack={false} title="" noPadding={true}>
            <div className="px-6 pt-4">
                <div className="flex justify-between items-center mb-6">
                    <button className="text-gray-400"><ArrowRight className="rotate-180"/></button>
                    <div className="flex gap-2">
                        <div className="w-8 h-1 bg-black rounded-full" />
                        <div className="w-8 h-1 bg-gray-200 rounded-full" />
                        <div className="w-8 h-1 bg-gray-200 rounded-full" />
                    </div>
                    <div className="w-6" />
                </div>

                <div className="text-center mb-8">
                    <div className="text-6xl font-bold mb-2 transition-all duration-1000 ease-out">
                        {progress}%
                    </div>
                    <h2 className="text-lg font-bold">We're setting everything up for you</h2>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-red-400 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-xs text-right text-gray-400 mt-1">Finalizing results...</p>
                </div>

                <div className="bg-black text-white rounded-2xl p-6 mb-4">
                    <h3 className="text-xs text-gray-400 mb-4">Daily recommendation for</h3>
                    <div className="space-y-3">
                        {['Calories', 'Carbs', 'Protein', 'Fats', 'Health Score'].map(item => (
                            <div key={item} className="flex justify-between items-center">
                                <span className="text-sm font-medium"> - {item}</span>
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

// 20. Final Results Dashboard
export const DashboardStep: React.FC<Props> = ({ onNext }) => {
    return (
        <Layout showBack={true} onBack={() => {}} noPadding>
            <div className="px-6 pt-4 pb-32">
                <div className="flex justify-center mb-6">
                     <div className="bg-black text-white rounded-full p-1">
                         <CheckCircle2 size={24} fill="white" className="text-black" />
                     </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-2">Congratulations<br/>your custom plan is ready!</h1>
                <p className="text-center text-sm mb-6">You should maintain:</p>
                
                <div className="text-center text-xl font-bold mb-8">694 lbs</div> {/* Placeholder based on screenshot visual weirdness or specific data */}

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                         <h3 className="font-bold text-sm">Daily recommendation</h3>
                         <span className="text-xs text-gray-400">You can edit this anytime</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative">
                            <div className="flex items-center gap-2 text-xs font-bold mb-2"><Flame size={14}/> Calories</div>
                            <div className="relative w-20 h-20 mx-auto border-4 border-gray-100 rounded-full flex items-center justify-center">
                                <span className="font-bold">8241</span>
                                <div className="absolute top-0 right-0 w-3 h-3 bg-black rounded-full" />
                            </div>
                            <div className="absolute bottom-2 right-2 text-gray-300">✏️</div>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative">
                            <div className="flex items-center gap-2 text-xs font-bold mb-2"><Utensils size={14}/> Carbs</div>
                            <div className="relative w-16 h-16 mx-auto border-4 border-orange-100 rounded-full flex items-center justify-center">
                                <span className="font-bold">476g</span>
                            </div>
                             <div className="absolute bottom-2 right-2 text-gray-300">✏️</div>
                        </div>
                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative">
                            <div className="flex items-center gap-2 text-xs font-bold mb-2"><Zap size={14}/> Protein</div>
                             <div className="relative w-16 h-16 mx-auto border-4 border-red-100 rounded-full flex items-center justify-center">
                                <span className="font-bold">694g</span>
                            </div>
                        </div>
                         <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative">
                            <div className="flex items-center gap-2 text-xs font-bold mb-2"><Salad size={14}/> Fats</div>
                             <div className="relative w-16 h-16 mx-auto border-4 border-blue-100 rounded-full flex items-center justify-center">
                                <span className="font-bold">173g</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <div className="text-red-500">❤️</div> Health Score
                        </div>
                        <div className="font-bold">7/10</div>
                    </div>
                </div>
            </div>
            <StickyFooter>
                <Button onClick={onNext}>Let's get started!</Button>
            </StickyFooter>
        </Layout>
    );
};

// --- PAYWALL COMPONENTS ---

// A: Free Hook
export const PaywallHook: React.FC<Props> = ({ onNext }) => (
  <div className="flex flex-col h-full bg-white relative">

    <div className="px-6 text-center mt-8">
      <h1 className="text-2xl font-black mb-1">We want you to</h1>
      <h1 className="text-2xl font-black mb-6">try ShapeMate for free.</h1>

      {/* Larger iPhone Mockup */}
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
      <Button onClick={onNext} className="mb-3">Try for €0.00</Button>
      <p className="text-center text-xs text-gray-400">Just €49.90 per year (€4.15/mo)</p>
    </div>
  </div>
);


// Paywall B: Trial Explainer
export const PaywallTrial: React.FC<Props & {onExit: () => void}> = ({ onNext, onBack, onExit }) => {
    const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex justify-between items-center p-4">
                <button onClick={onBack}><ArrowRight className="rotate-180 text-gray-400" /></button>
                <button onClick={onExit} className="text-xs text-gray-400">Restore</button>
            </div>

            <div className="px-6">
                <h1 className="text-2xl font-black mb-8 text-center">Start your 3-day FREE<br/>trial to continue.</h1>
                
                <div className="space-y-8 relative pl-4 border-l-2 border-gray-100 ml-4">
                    <div className="relative">
                        <div className="absolute -left-[25px] top-0 bg-orange-100 p-1.5 rounded-full text-orange-600"><Lock size={16} /></div>
                        <h3 className="font-bold text-sm">Today</h3>
                        <p className="text-xs text-gray-500 leading-tight">Unlock all the app's features like AI calorie scanning and more.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[25px] top-0 bg-orange-100 p-1.5 rounded-full text-orange-600"><Zap size={16} /></div>
                        <h3 className="font-bold text-sm">In 2 Days - Reminder</h3>
                        <p className="text-xs text-gray-500 leading-tight">We'll send you a reminder that your trial is ending soon.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[25px] top-0 bg-black p-1.5 rounded-full text-white"><Utensils size={16} /></div>
                        <h3 className="font-bold text-sm">In 3 Days - Billing Starts</h3>
                        <p className="text-xs text-gray-500 leading-tight">You'll be charged on Apr 14, 2025 unless you cancel anytime before.</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-6">
                <div className="flex gap-4 mb-4">
                    <button 
                        onClick={() => setPlan('monthly')}
                        className={`flex-1 p-4 rounded-xl border-2 text-left relative ${plan === 'monthly' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    >
                        <div className="text-[10px] text-gray-500">Monthly</div>
                        <div className="font-bold text-sm">€9.90 /mo</div>
                        {plan === 'monthly' && <div className="absolute top-2 right-2 w-4 h-4 border-2 border-black rounded-full"><div className="w-2 h-2 bg-black rounded-full m-0.5"/></div>}
                        {plan !== 'monthly' && <div className="absolute top-2 right-2 w-4 h-4 border-2 border-gray-300 rounded-full"/>}
                    </button>
                    
                    <button 
                        onClick={() => setPlan('yearly')}
                        className={`flex-1 p-4 rounded-xl border-2 text-left relative ${plan === 'yearly' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded">3 DAYS FREE</div>
                        <div className="text-[10px] text-gray-500">Yearly</div>
                        <div className="font-bold text-sm">€4.15/mo</div>
                         {plan === 'yearly' && <div className="absolute top-2 right-2 w-4 h-4 border-2 border-black rounded-full"><div className="w-2 h-2 bg-black rounded-full m-0.5"/></div>}
                        {plan !== 'yearly' && <div className="absolute top-2 right-2 w-4 h-4 border-2 border-gray-300 rounded-full"/>}
                    </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold mb-4">
                    <CheckCircle2 size={12} /> No Payment Due Now
                </div>
                
                <Button onClick={onNext}>Start My 3-Day Free Trial</Button>
                <p className="text-center text-[10px] text-gray-400 mt-3">3 days free, then €49.90 per year (€4.15/mo)</p>
            </div>
        </div>
    );
};

// Paywall C: Exit Promo
export const PaywallPromo: React.FC<Props> = ({ onNext }) => {
    return (
         <div className="flex flex-col h-full bg-white relative">
            <div className="flex justify-end p-4">
                <button onClick={onNext}><X className="text-gray-400" /></button>
            </div>
            
            <div className="px-6 text-center mt-4">
                <h1 className="text-2xl font-black mb-2">One Time Offer</h1>
                <p className="text-gray-500 text-sm mb-8">You will never see this again</p>
                
                {/* Promo Card */}
                <div className="bg-gray-100 rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                         style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    
                    {/* Floating elements mock */}
                    <div className="absolute top-10 left-4 text-xl">🎉</div>
                    <div className="absolute top-4 right-10 text-xl">✨</div>
                    <div className="absolute bottom-10 right-4 text-xl">🎁</div>
                    
                    <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm z-10 relative">
                        <Gift size={32} className="text-orange-400" />
                    </div>
                    
                    <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">80% off</div>
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
};
