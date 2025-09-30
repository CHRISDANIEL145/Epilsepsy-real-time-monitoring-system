
export enum UserRole {
  Patient = 'Patient',
  Doctor = 'Doctor',
  Caregiver = 'Caregiver',
  Admin = 'Admin',
}

export enum EpilepsyState {
  Normal = 'Normal',
  Preictal = 'Preictal',
  Ictal = 'Ictal',
  Postictal = 'Postictal',
}

export interface EegDataPoint {
  time: number;
  value: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  photoUrl: string;
}

export interface Prediction {
    state: EpilepsyState;
    timestamp: number;
}
