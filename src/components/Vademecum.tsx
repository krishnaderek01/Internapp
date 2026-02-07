"use client";

import React from 'react';
import { Medication } from '../types';

interface VademecumProps {
  medications: Medication[];
  onUpdate: (name: string, data: Partial<Medication>) => void;
}

const Vademecum: React.FC<VademecumProps> = ({ medications }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-slate-700 mb-4">Vademécum Personal</h2>
      <div className="space-y-3">
        {medications.map((med) => (
          <div key={med.name} className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-blue-600">{med.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{med.family} {med.subfamily && `| ${med.subfamily}`}</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2 rounded text-[11px]">
                <span className="font-bold block text-slate-500">Adultos</span>
                {med.adultVariations.length > 0 ? med.adultVariations[0].dosage : 'Sin datos'}
              </div>
              <div className="bg-blue-50 p-2 rounded text-[11px]">
                <span className="font-bold block text-blue-500">Pediátrico</span>
                {med.pediatricVariations.length > 0 ? med.pediatricVariations[0].dosage : 'Sin datos'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vademecum;