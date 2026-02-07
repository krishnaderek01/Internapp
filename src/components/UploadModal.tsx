"use client";

import React, { useState } from 'react';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      patientName: name,
      diagnosis: diagnosis.split(',').map(d => d.trim()),
      medications: [],
      notes: 'Nuevo caso ingresado manualmente.',
      age: 30,
      gender: 'M'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Nuevo Caso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre Paciente</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Diagnósticos (sep. por coma)</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm" 
              value={diagnosis} 
              onChange={e => setDiagnosis(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 font-bold">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;