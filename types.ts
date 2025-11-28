
export type UnitSystem = 'imperial' | 'metric';

export interface UserData {
  gender: string;
  workoutFrequency: string;
  source: string;
  triedOthers: boolean;
  height: { value: string; unit: 'ft' | 'cm' };
  weight: { value: string; unit: 'lbs' | 'kg' };
  birthDate: string;
  goal: string;
  obstacles: string[];
  diet: string;
  accomplishment: string;
  caloriesBack: boolean;
  rollover: boolean;
  rating: number;
  referralCode: string;
  notificationPreferences: {
    weighing: boolean;
    meal: boolean;
    workout: boolean;
  };
  email: string;
}

export const INITIAL_DATA: UserData = {
  gender: '',
  workoutFrequency: '',
  source: '',
  triedOthers: false,
  height: { value: '', unit: 'cm' },
  weight: { value: '', unit: 'kg' },
  birthDate: '',
  goal: '',
  obstacles: [],
  diet: '',
  accomplishment: '',
  caloriesBack: true,
  rollover: false,
  rating: 0,
  referralCode: '',
  notificationPreferences: {
    weighing: true,
    meal: true,
    workout: true
  },
  email: ''
};

export enum StepType {
  WELCOME = 'WELCOME',
  GENDER = 'GENDER',
  WORKOUTS = 'WORKOUTS',
  SOURCE = 'SOURCE',
  HISTORY = 'HISTORY',
  INFO_RESULTS = 'INFO_RESULTS',
  MEASUREMENTS = 'MEASUREMENTS',
  BIRTHDAY = 'BIRTHDAY',
  GOAL = 'GOAL',
  OBSTACLES = 'OBSTACLES',
  DIET = 'DIET',
  ACCOMPLISHMENT = 'ACCOMPLISHMENT',
  TRUST = 'TRUST',
  CONNECT_APPS = 'CONNECT_APPS',
  RATING = 'RATING',
  NOTIFICATIONS = 'NOTIFICATIONS',
  REFERRAL = 'REFERRAL',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  DASHBOARD = 'DASHBOARD',
  EMAIL_SIGNUP = 'EMAIL_SIGNUP',
  PAYWALL_HOOK = 'PAYWALL_HOOK',
  PAYWALL_TRIAL = 'PAYWALL_TRIAL',
  PAYWALL_PROMO = 'PAYWALL_PROMO'
}
