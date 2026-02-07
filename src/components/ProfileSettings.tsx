"use client";

import React from 'react';

interface ProfileSettingsProps {
  onBackup: (data?: any) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBackup }) => {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl mb-4">
          <i className="fa-solid fa-user-doctor"></i>
        </div>
        <h2 className="text-xl font-bold">Dr. Interno</h2>
        <p className="text-slate-400 text-sm">Hospital Clínico</p>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => onBackup()}
          className="w-full flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-download text-blue-600"></i>
            <span className="font-medium">Exportar Datos</span>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300"></i>
        </button>
        
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Nota:</strong> Todos tus datos se guardan localmente en este dispositivo para garantizar la privacidad del paciente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;