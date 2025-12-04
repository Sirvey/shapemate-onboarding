// App.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INITIAL_DATA, UserData, StepType } from './types';
import {
  WelcomeStep, NameStep, GenderStep, WorkoutsStep, SourceStep, InfoResultsStep, MeasurementsStep,
  BirthdayStep, GoalStep, ObstaclesStep, DietStep, AccomplishStep,
  TrustStep, ConnectAppsStep, RatingStep,
  NotificationsStep, ReferralStep, GeneratingStep, EmailSignupStep
} from './components/OnboardingSteps';
import { ResultsStep, DashboardStep, PaywallHook, PaywallTrial, PaywallPromo } from './components/ComplexScreens';
import { supabase } from './supabaseClient';
import { generateNutritionPlan } from './geminiClient';


// Hilfsfunktionen für Konvertierungen und Mapping
const parseImperialHeightToCm = (value: string): number | null => {
  const match = value.match(/(\d+)\s*'\s*(\d+)\s*"?/);
  if (!match) return null;
  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

const convertWeightToKg = (weight: { value: string; unit: 'kg' | 'lbs' }): number | null => {
  const numeric = parseFloat(weight.value);
  if (Number.isNaN(numeric)) return null;
  return weight.unit === 'kg'
    ? numeric
    : Math.round(numeric * 0.45359237 * 10) / 10;
};

const mapGoalToCode = (goal: string | undefined): string | null => {
  switch (goal) {
    case 'Lose weight':
      return 'ziel_fettabbau';
    case 'Maintain':
      return 'ziel_allgemeinfitness';
    case 'Gain weight':
      return 'ziel_muskelaufbau';
    default:
      return null;
  }
};

const mapGenderToCode = (gender: string | undefined): string | null => {
  if (gender === 'Male') return 'gender_m';
  if (gender === 'Female') return 'gender_w';
  return null;
};


// Steps definition array
const FLOW = [
  StepType.WELCOME,
  StepType.NAME,
  StepType.GENDER,
  StepType.WORKOUTS,
  StepType.SOURCE,
  StepType.INFO_RESULTS,
  StepType.MEASUREMENTS,
  StepType.BIRTHDAY,
  StepType.GOAL,
  StepType.OBSTACLES,
  StepType.DIET,
  StepType.ACCOMPLISHMENT,
  StepType.TRUST,
  StepType.CONNECT_APPS,
  StepType.RATING,
  StepType.NOTIFICATIONS,
  StepType.REFERRAL,
  StepType.GENERATING,
  StepType.RESULTS,
  StepType.DASHBOARD,
  StepType.EMAIL_SIGNUP,
  StepType.PAYWALL_HOOK,
  StepType.PAYWALL_TRIAL,
];

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
  const [showPromo, setShowPromo] = useState(false);

  const [sender, setSender] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Gemini States
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Token aus URL holen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token =
      params.get('token') ||
      params.get('t') ||
      params.get('auth') ||
      null;

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

      setSender(data.sender as string);
    };

    loadSender();
  }, []);

  const updateData = (fields: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...fields }));
  };


  // GEMINI: Berechnung der Nährwerte
  const runGeminiPlan = async () => {
    try {
      setPlanLoading(true);
      setPlanError(null);

      const plan = await generateNutritionPlan(userData);

      setUserData(prev => ({
        ...prev,
        aiPlan: plan,
      }));
    } catch (e) {
      console.error(e);
      setPlanError('We could not generate your personalized plan. Please try again.');
      throw e;
    } finally {
      setPlanLoading(false);
    }
  };


  // Speichern im Backend
  const submitOnboardingToSupabase = async () => {
    if (!sender) return;

    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      const genderCode = mapGenderToCode(userData.gender);

      const heightCm =
        userData.height.unit === 'cm'
          ? parseInt(userData.height.value || '0', 10)
          : userData.height.unit === 'ft'
            ? parseImperialHeightToCm(userData.height.value)
            : null;

      const weightKg = convertWeightToKg(userData.weight);

      const { error: stammdatenError } = await supabase
        .from('stammdaten')
        .update({
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          gender: genderCode,
          referral_source: userData.source || null,
          groesse: heightCm,
          geburtsdatum: userData.birthDate || null,
          goal: mapGoalToCode(userData.goal),
          diet: userData.diet || null,
          referral_code: userData.referralCode || null,
          mail: userData.email || null,
        })
        .eq('sender', sender);

      if (stammdatenError) throw stammdatenError;

      if (weightKg != null) {
        const { error: weightError } = await supabase
          .from('user_weights')
          .insert({
            sender,
            weight: weightKg,
          });
        if (weightError) throw weightError;
      }

      const prefs = userData.notificationPreferences;
      const reminderMappings = [
        { key: 'weighing', type: 'weighing' },
        { key: 'meal', type: 'meal' },
        { key: 'workout', type: 'workout' },
      ];

      for (const r of reminderMappings) {
        const active = prefs[r.key] ? 'X' : null;

        const { error: reminderError } = await supabase
          .from('erinnerungen')
          .update({ active })
          .eq('sender', sender)
          .eq('type', r.type);

        if (reminderError) throw reminderError;
      }

    } catch (err: any) {
      setSubmitError(err.message || 'Unexpected error while saving onboarding data');
      throw err;
    } finally {
      setLoadingSubmit(false);
    }
  };


  // nextStep Logik
  const nextStep = async () => {
    const currentStepType = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];

    if (currentStepType === StepType.EMAIL_SIGNUP) {
      try {
        await submitOnboardingToSupabase();
      } catch {
        return;
      }
    }

    if (currentStepIndex < FLOW.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      alert('Flow completed');
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const triggerPromo = () => setShowPromo(true);

  const currentStepType = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];

  const progress = Math.min(100, Math.round((currentStepIndex / 18) * 100));

  const renderStep = () => {
    const commonProps = {
      data: userData,
      updateData,
      onNext: nextStep,
      onBack: prevStep,
      progress,
    };

    switch (currentStepType) {
      case StepType.WELCOME: return <WelcomeStep {...commonProps} />;
      case StepType.NAME: return <NameStep {...commonProps} />;
      case StepType.GENDER: return <GenderStep {...commonProps} />;
      case StepType.WORKOUTS: return <WorkoutsStep {...commonProps} />;
      case StepType.SOURCE: return <SourceStep {...commonProps} />;
      case StepType.INFO_RESULTS: return <InfoResultsStep {...commonProps} />;
      case StepType.MEASUREMENTS: return <MeasurementsStep {...commonProps} />;
      case StepType.BIRTHDAY: return <BirthdayStep {...commonProps} />;
      case StepType.GOAL: return <GoalStep {...commonProps} />;
      case StepType.OBSTACLES: return <ObstaclesStep {...commonProps} />;
      case StepType.DIET: return <DietStep {...commonProps} />;
      case StepType.ACCOMPLISHMENT: return <AccomplishStep {...commonProps} />;
      case StepType.TRUST: return <TrustStep {...commonProps} />;
      case StepType.CONNECT_APPS: return <ConnectAppsStep {...commonProps} />;
      case StepType.RATING: return <RatingStep {...commonProps} />;
      case StepType.NOTIFICATIONS: return <NotificationsStep {...commonProps} />;
      case StepType.REFERRAL: return <ReferralStep {...commonProps} />;

      // *** HERE: Gemini is executed ***
      case StepType.GENERATING:
        return (
          <GeneratingStep
            {...commonProps}
            generatePlan={runGeminiPlan}
            isGenerating={planLoading}
            error={planError}
          />
        );

      case StepType.RESULTS:
        return <ResultsStep data={userData} onNext={nextStep} />;

      case StepType.DASHBOARD:
        return <DashboardStep data={userData} onNext={nextStep} />;

      case StepType.EMAIL_SIGNUP:
        return <EmailSignupStep {...commonProps} />;

      case StepType.PAYWALL_HOOK:
        return <PaywallHook onNext={nextStep} />;

      case StepType.PAYWALL_TRIAL:
        return <PaywallTrial onNext={nextStep} onBack={prevStep} onExit={triggerPromo} />;

      case StepType.PAYWALL_PROMO:
        return <PaywallPromo onNext={() => alert('Offer claimed')} />;

      default:
        return <div>Unknown step</div>;
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans text-gray-900">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden relative">

        {submitError && (
          <div className="absolute top-0 left-0 right-0 bg-red-50 text-red-700 text-xs px-3 py-2 z-30">
            {submitError}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={showPromo ? 'promo' : currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className={`${loadingSubmit ? 'opacity-60 pointer-events-none' : ''} h-full`}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
