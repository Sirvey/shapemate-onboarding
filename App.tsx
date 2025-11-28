// App.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { INITIAL_DATA, UserData, StepType } from './types';
import {
  WelcomeStep, GenderStep, WorkoutsStep, SourceStep, HistoryStep, InfoResultsStep, MeasurementsStep,
  BirthdayStep, GoalStep, ObstaclesStep, DietStep, AccomplishStep,
  TrustStep, ConnectAppsStep, RatingStep,
  NotificationsStep, ReferralStep, GeneratingStep, EmailSignupStep
} from './components/OnboardingSteps';
import { ResultsStep, DashboardStep, PaywallHook, PaywallTrial, PaywallPromo } from './components/ComplexScreens';
import { supabase } from './supabaseClient';

// Hilfsfunktionen für Konvertierungen und Mapping
const parseImperialHeightToCm = (value: string): number | null => {
  // Erwartetes Format: 5'9" oder 5' 9"
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
  if (weight.unit === 'kg') return numeric;
  // lbs → kg
  return Math.round(numeric * 0.45359237 * 10) / 10;
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

// Steps definition array to manage order and progress easily
const FLOW = [
  StepType.WELCOME,
  StepType.GENDER,
  StepType.WORKOUTS,
  StepType.SOURCE,
  StepType.HISTORY,
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
  StepType.RESULTS,       // 19: Loading Bar
  StepType.DASHBOARD,     // 20: Dashboard
  StepType.EMAIL_SIGNUP,  // 21: Email/Login
  StepType.PAYWALL_HOOK,  // 22: Free Hook
  StepType.PAYWALL_TRIAL, // 23: Trial Explainer
  // PAYWALL_PROMO ist separate Exit-Intent Variante
];

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
  const [showPromo, setShowPromo] = useState(false);

  const [sender, setSender] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Token aus URL holen und sender aus registration_tokens laden
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      console.error('No token in URL. Expected ?token=EXAMPLETOKEN123');
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
        console.error('Could not resolve sender from token', error);
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

  // zentrale Funktion zum Speichern in Supabase
  const submitOnboardingToSupabase = async () => {
    if (!sender) {
      console.error('submitOnboardingToSupabase called without sender');
      return;
    }

    setLoadingSubmit(true);
    setSubmitError(null);

    try {
      // 1. Stammdaten vorbereiten
      const genderCode = mapGenderToCode(userData.gender);
      const heightCm =
        userData.height?.unit === 'cm'
          ? (() => {
              const val = parseInt(userData.height.value || '', 10);
              return Number.isNaN(val) ? null : val;
            })()
          : userData.height?.unit === 'ft'
            ? parseImperialHeightToCm(userData.height.value)
            : null;

      const weightKg = userData.weight
        ? convertWeightToKg(userData.weight as any)
        : null;

      const birthDate = userData.birthDate || null;
      const goalCode = mapGoalToCode(userData.goal);
      const referralSource = userData.source || null;
      const diet = userData.diet || null;
      const referralCode = userData.referralCode || null;
      const email = userData.email || null;

      // 1) stammdaten updaten, keine neue Zeile
      const { error: stammdatenError } = await supabase
        .from('stammdaten')
        .update({
          gender: genderCode,
          referral_source: referralSource,
          groesse: heightCm,
          geburtsdatum: birthDate,
          goal: goalCode,
          diet,
          referral_code: referralCode,
          mail: email,
        })
        .eq('sender', sender);

      if (stammdatenError) {
        console.error('Error updating stammdaten', stammdatenError);
        throw stammdatenError;
      }

      // 2) user_weights. immer neue Zeile mit sender
      if (weightKg != null) {
        const { error: weightError } = await supabase
          .from('user_weights')
          .insert({
            sender,
            weight: weightKg,
          });

        if (weightError) {
          console.error('Error inserting user_weights', weightError);
          throw weightError;
        }
      }

      // 3) Erinnerungen je nach notificationPreferences
      // Annahme: Tabelle hat Spalten sender, type, active
      const prefs = userData.notificationPreferences || {
        weighing: false,
        meal: false,
        workout: false,
      };

      const reminderMappings = [
        { key: 'weighing' as const, type: 'weighing' },
        { key: 'meal' as const, type: 'meal' },
        { key: 'workout' as const, type: 'workout' },
      ];

      for (const r of reminderMappings) {
        const active = prefs[r.key] ? 'X' : null;

        const { error: reminderError } = await supabase
          .from('erinnerungen')
          .update({ active })
          .eq('sender', sender)
          .eq('type', r.type);

        if (reminderError) {
          console.error('Error updating erinnerungen', r.type, reminderError);
          throw reminderError;
        }
      }

      // 4) Newsletter Subscription
      if (email) {
        const { error: newsletterError } = await supabase
          .from('newsletter_subscribers')
          .upsert(
            { email },
            { onConflict: 'email' } // email als unique Key vorausgesetzt
          );

        if (newsletterError) {
          console.error('Error upserting newsletter_subscribers', newsletterError);
          throw newsletterError;
        }
      }

      console.log('Onboarding data successfully stored in Supabase');
    } catch (err: any) {
      setSubmitError(err.message ?? 'Unexpected error while saving onboarding data');
      throw err;
    } finally {
      setLoadingSubmit(false);
    }
  };

  // nextStep angepasst. beim EMAIL_SIGNUP Step wird Supabase persist ausgeführt
  const nextStep = async () => {
    const currentStepType = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];

    // Trigger Supabase Speichern beim Übergang von EmailSignup zur nächsten View
    if (currentStepType === StepType.EMAIL_SIGNUP) {
      try {
        await submitOnboardingToSupabase();
      } catch {
        // Bei Fehler nicht weiter navigieren
        return;
      }
    }

    if (currentStepIndex < FLOW.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // End of flow. hier könntest du später noch spezifisches Verhalten definieren
      alert('Flow completed');
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const triggerPromo = () => {
    setShowPromo(true);
  };

  const currentStepType = showPromo ? StepType.PAYWALL_PROMO : FLOW[currentStepIndex];

  // Progress nur für Onboarding Steps
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
      case StepType.GENDER: return <GenderStep {...commonProps} />;
      case StepType.WORKOUTS: return <WorkoutsStep {...commonProps} />;
      case StepType.SOURCE: return <SourceStep {...commonProps} />;
      case StepType.HISTORY: return <HistoryStep {...commonProps} />;
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
      case StepType.GENERATING: return <GeneratingStep {...commonProps} />;
      case StepType.RESULTS: return <ResultsStep onNext={nextStep} />;
      case StepType.DASHBOARD: return <DashboardStep onNext={nextStep} />;
      case StepType.EMAIL_SIGNUP: return <EmailSignupStep {...commonProps} />;
      case StepType.PAYWALL_HOOK: return <PaywallHook onNext={nextStep} />;
      case StepType.PAYWALL_TRIAL: return <PaywallTrial onNext={nextStep} onBack={prevStep} onExit={triggerPromo} />;
      case StepType.PAYWALL_PROMO: return <PaywallPromo onNext={() => alert('Offer claimed')} />;
      default: return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans text-gray-900">
      <div className="w-full max-w-md h-screen bg-white shadow-2xl overflow-hidden relative">
        {/* Optional: einfache Fehlermeldung für Token / Submit */}
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`h-full ${loadingSubmit ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
