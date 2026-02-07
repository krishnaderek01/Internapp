"use client";

import React from 'react';
import { Pathology } from '../types';

interface PathologyLibraryProps {
  pathologies: Pathology[];
  onUpdate: (name: string, data: Partial<Pathology>) => void;
}

const PathologyLibrary: React.FC<PathologyLibraryProps> = ({ pathologies }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-slate-700 mb-4">Biblioteca de Patologías</h2>
      <div className="grid grid-cols-1 gap-3">
        {pathologies.sort((a, b) => b.frequency - a.frequency).map((path) => (
          <div key={path.name} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{path.name}</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-bold">
                {path.frequency} {path.frequency === 1 ? 'caso' : 'casos'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathologyLibrary;