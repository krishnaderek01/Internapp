export type AppTab = 'cases' | 'vademecum' | 'pathology' | 'insights' | 'chat' | 'profile';

export interface MedicationVariation {
  dosage: string;
  presentation: string;
  detectedAt: string;
  patientAge: number;
}

export interface Medication {
  name: string;
  family: string;
  subfamily?: string;
  addedAt: string;
  adultVariations: MedicationVariation[];
  pediatricVariations: MedicationVariation[];
  mechanism: string;
}

export interface Pathology {
  name: string;
  frequency: number;
  description?: string;
  treatment?: string;
}

export interface PatientCase {
  id: string;
  date: string;
  patientName: string;
  diagnosis: string[];
  medications: Array<{
    name: string;
    dose?: string;
    presentation?: string;
    family?: string;
    subfamily?: string;
  }>;
  evolution: string;
  notes: string;
  vitals?: {
    pa?: string;
    fc?: string;
    fr?: string;
    temp?: string;
    sat?: string;
  };
  age: number;
  gender: string;
}