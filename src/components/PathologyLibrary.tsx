"use client";

import React, { useState } from 'react';
import { Pathology } from '../types';
import { Card, CardContent } from './ui/card';
import { ChevronRight, Save, X } from 'lucide-react';

interface PathologyLibraryProps {
  pathologies: Pathology[];
  onUpdate: (name: string, data: Partial<Pathology>) => void;
}

const PathologyLibrary: React.FC<PathologyLibraryProps> = ({ pathologies, onUpdate }) => {
  const [selectedPath, setSelectedPath] = useState<Pathology | null>(null);
  const [notes, setNotes] = useState('');

  const handleOpenNotes = (path: Pathology) => {
    setSelectedPath(path);
    setNotes(path.description || '');
  };

  const handleSaveNotes = () => {
    if (selectedPath) {
      onUpdate(selectedPath.name, { description: notes });
      // Note: Supabase integration will be added here once configured
      alert("Nota guardada localmente. Configura Supabase para sincronización en la nube.");
      setSelectedPath(null);
    }
  };

  return (
    <div className="p-4 relative h-full">
      <h2 className="text-lg font-bold text-slate-700 mb-4">Biblioteca de Patologías</h2>
      <div className="grid grid-cols-1 gap-3">
        {pathologies.sort((a, b) => b.frequency - a.frequency).map((path) => (
          <div 
            key={path.name} 
            onClick={() => handleOpenNotes(path)}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-200 transition-colors"
          >
            <div>
              <h3 className="font-bold text-slate-800">{path.name}</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-bold">
                {path.frequency} {path.frequency === 1 ? 'caso' : 'casos'}
              </span>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
          </div>
        ))}
      </div>

      {selectedPath && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">{selectedPath.name}</h2>
              <button onClick={() => setSelectedPath(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Notas Personales</label>
              <textarea 
                className="w-full h-48 border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50"
                placeholder="Escribe aquí tus apuntes, esquemas de tratamiento o perlas clínicas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button 
              onClick={handleSaveNotes}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Save size={18} />
              Guardar Apuntes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathologyLibrary;