// App.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INITIAL_DATA, UserData, StepType } from './types';

import {
  WelcomeStep, NameStep, GenderStep, WorkoutsStep, SourceStep,
  MeasurementsStep, BirthdayStep, GoalStep, DietStep, TrustStep, ConnectAppsStep, RatingStep,
  NotificationsStep, ReferralStep, EmailSignupStep
} from './components/OnboardingSteps';

import {
  ResultsStep,
  DashboardStep,
  PaywallHook,
  PaywallPromo
} from './components/ComplexScreens';

import { supabase } from './supabaseClient';
import { generateNutritionPlan } from './openaiClient';


// -------------------------------------------------------------
// Helpers
// -------------------------------------------------------------

const parseImperialHeightToCm = (value: string): number | null => {
  const match = value.match(/(\d+)\s*'\s*(\d+)\s*"?/);
  if (!match) return null;
  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);
  return Math.round((feet * 12 + inches) * 2.54);
};

const convertWeightToKg = (weight: { value: string; unit: 'kg' | 'lbs' }): number | null => {
  const num = parseFloat(weight.value);
  if (Number.isNaN(num)) return null;
  return weight.unit === 'kg' ? num : Math.round(num * 0.45359237 * 10) / 10;
};

const mapGoalToCode = (goal?: string): string | null => {
  switch (goal) {
    case 'Lose weight': return 'ziel_fettabbau';
    case 'Maintain': return 'ziel_allgemeinfitness';
    case 'Gain weight': return 'ziel_muskelaufbau';
    default: return null;
  }
};

const mapGenderToCode = (gender?: string): string | null => {
  if (gender === 'Male') return 'gender_m';
  if (gender === 'Female') return 'gender_w';
  return null;
};


// -------------------------------------------------------------
// Onboarding Flow  (NO GENERATING STEP ANYMORE)
// -------------------------------------------------------------

const FLOW = [
  StepType.WELCOME,
  StepType.NAME,
  StepType.GENDER,
  StepType.WORKOUTS,
  StepType.SOURCE,
  StepType.MEASUREMENTS,
  StepType.BIRTHDAY,
  StepType.GOAL,
  StepType.DIET,
  StepType.TRUST,
  StepType.CONNECT_APPS,
  StepType.RATING,
  StepType.NOTIFICATIONS,
  StepType.REFERRAL,

  // DIRECTLY → RESULTS (AI RUNS HERE)
  StepType.RESULTS,

  StepType.DASHBOARD,
  StepType.EMAIL_SIGNUP,
  StepType.PAYWALL_HOOK,
];


export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);

  const [showPromo, setShowPromo] = useState(false);
  const [sender, setSender] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // OpenAI states (formerly "Gemini")
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);


  // -------------------------------------------------------------
  // Load Sender from registration_tokens
  // -------------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('t') || params.get('auth');

    if (!token) {
      setSubmitError('Missing token in onboarding link.');
      return;
    }

    const loadSender = async () => {
      const { data, error } = await supabase
        .from('registration_tokens')
        .select('sender')
        .eq('token', token)
        .single();

      if (error || !data) {
        setSubmitError('Could not find a registration for this link.');
        return;
      }

      setSender(data.sender);
    };

    loadSender();
  }, []);


  // -------------------------------------------------------------
  // Update Form Data
  // -------------------------------------------------------------
  const updateData = (fields: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...fields }));
  };


  // -------------------------------------------------------------
  // OpenAI Nutrition Plan
  // -------------------------------------------------------------
  const runOpenAIPlan = async () => {
    try {
      setPlanLoading(true);
      setPlanError(null);

      const plan = await generateNutritionPlan(userData);

      setUserData(prev => ({ ...prev, aiPlan: plan }));
      return plan;

    } catch (e) {
      console.error(e);
      setPlanError("We could not generate your personalized plan. Please try again.");
      throw e;

    } finally {
      setPlanLoading(false);
    }
  };


  // -------------------------------------------------------------
// Save onboarding → Supabase
// -------------------------------------------------------------
const submitOnboardingToSupabase = async (): Promise<boolean> => {
  if (!sender) return false;

  setLoadingSubmit(true);
  setSubmitError(null);

  try {
    const genderCode = mapGenderToCode(userData.gender);

    const safeNumberOrNull = (v: any) => {
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      if (!s) return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    const heightCm =
      userData.height.unit === "cm"
        ? safeNumberOrNull(userData.height.value)
        : (parseImperialHeightToCm(userData.height.value) ?? null);

    const weightKg = (() => {
      const w = convertWeightToKg(userData.weight);
      return Number.isFinite(Number(w)) ? Number(w) : null;
    })();

    const plan = userData.aiPlan;
    const kcal_bedarf = plan ? Math.round(plan.targetCalories ?? 0) : null;
    const carbs_main = plan ? Math.round(plan.carbsGrams ?? 0) : null;
    const protein_main = plan ? Math.round(plan.proteinGrams ?? 0) : null;
    const fat_main = plan ? Math.round(plan.fatsGrams ?? 0) : null;

    // 1) stammdaten update (inkl. testabo + macros)
    const { error: stammdatenError } = await supabase
      .from("stammdaten")
      .update({
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        gender: genderCode,
        referral_source: userData.source,
        groesse: heightCm,
        geburtsdatum: userData.birthDate,
        goal: mapGoalToCode(userData.goal),
        diet: userData.diet,
        referral_code: userData.referralCode,
        mail: userData.email,

        abomodell: "testabo",
        kcal_bedarf,
        carbs_main,
        protein_main,
        fat_main,
      })
      .eq("sender", sender);

    if (stammdatenError) throw stammdatenError;

    // 2) weight insert (optional)
    if (weightKg != null) {
      const { error: weightError } = await supabase
        .from("user_weights")
        .insert({ sender, weight: weightKg });

      if (weightError) throw weightError;
    }

    // 3) reminders: benutze UPSERT statt UPDATE, damit es nie "ins Leere" läuft
    // 3) reminders: UPDATE pro type (robust, kein Unique-Constraint nötig)
const prefs = userData.notificationPreferences;
const reminderList = [
  { type: "weighing", active: prefs.weighing ? "X" : null },
  { type: "meal", active: prefs.meal ? "X" : null },
  { type: "workout", active: prefs.workout ? "X" : null },
];

for (const row of reminderList) {
  const { error } = await supabase
    .from("erinnerungen")
    .update({ active: row.active })
    .eq("sender", sender)
    .eq("type", row.type);

  if (error) throw error;
}


    return true;
  } catch (err: any) {
  console.error("submitOnboardingToSupabase failed:", err);
  setSubmitError(err?.message || "Unexpected error while saving onboarding data");
  return false;
} finally {
    setLoadingSubmit(false);
  }
};





  // -------------------------------------------------------------
  // Step Navigation
  // -------------------------------------------------------------
  const nextStep = async () => {
  const current = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];

  if (current === StepType.EMAIL_SIGNUP) {
    const ok = await submitOnboardingToSupabase();

    if (!ok) {
      return; // ⛔ bleib im Step + zeige Fehler
    }

    setSubmitError(null); // ✅ WICHTIG: Error explizit löschen
  }

  if (currentStepIndex < FLOW.length - 1) {
    setCurrentStepIndex(idx => idx + 1);
  } else {
    alert("Flow completed");
  }
};


  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(idx => idx - 1);
  };

  const currentStepType = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];
  const triggerPromo = () => setShowPromo(true);

  const progress = Math.min(100, Math.round((currentStepIndex / 18) * 100));


  // -------------------------------------------------------------
  // Render Step
  // -------------------------------------------------------------
  const renderStep = () => {
    const props = {
      data: userData,
      updateData,
      onNext: nextStep,
      onBack: prevStep,
      progress,
    };

    switch (currentStepType) {
      case StepType.WELCOME: return <WelcomeStep {...props} />;
      case StepType.NAME: return <NameStep {...props} />;
      case StepType.GENDER: return <GenderStep {...props} />;
      case StepType.WORKOUTS: return <WorkoutsStep {...props} />;
      case StepType.SOURCE: return <SourceStep {...props} />;
      case StepType.MEASUREMENTS: return <MeasurementsStep {...props} />;
      case StepType.BIRTHDAY: return <BirthdayStep {...props} />;
      case StepType.GOAL: return <GoalStep {...props} />;
      case StepType.DIET: return <DietStep {...props} />;
      case StepType.TRUST: return <TrustStep {...props} />;
      case StepType.CONNECT_APPS: return <ConnectAppsStep {...props} />;
      case StepType.RATING: return <RatingStep {...props} />;
      case StepType.NOTIFICATIONS: return <NotificationsStep {...props} />;
      case StepType.REFERRAL: return <ReferralStep {...props} />;

      // RESULTS now performs the AI call
      case StepType.RESULTS:
        return (
          <ResultsStep
            data={userData}
            onNext={nextStep}
            generatePlan={runOpenAIPlan}
            planLoading={planLoading}
            planError={planError}
          />
        );

      case StepType.DASHBOARD:
        return <DashboardStep data={userData} onNext={nextStep} />;

      case StepType.EMAIL_SIGNUP:
        return <EmailSignupStep {...props} />;

      case StepType.PAYWALL_HOOK:
        return <PaywallHook onNext={triggerPromo} />;

      case StepType.PAYWALL_PROMO:
        return <PaywallPromo onNext={() => alert("Offer claimed")} />;

      default:
        return <div>Unknown step</div>;
    }
  };


  // -------------------------------------------------------------
  // Render App Shell
  // -------------------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden relative">

        {submitError && (
          <div className="absolute top-0 left-0 right-0 bg-red-50 text-red-700 text-xs px-3 py-2 z-30">
            {submitError}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={showPromo ? "promo" : currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`${loadingSubmit ? "opacity-60 pointer-events-none" : ""} h-full`}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
