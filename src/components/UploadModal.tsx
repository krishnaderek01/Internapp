"use client";

import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Loader2, Camera, FileUp } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.type.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file, 'spa');
        processExtractedText(text);
      } else {
        // For PDF/Docx, we'd need more complex parsing, but for now we notify
        alert("El procesamiento de PDF/Docx requiere integración adicional. Por ahora, usa imágenes o fotos.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Error al procesar la imagen.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processExtractedText = (text: string) => {
    // Simple heuristic mapping
    const lines = text.split('\n');
    if (lines.length > 0) {
      // Try to find a name or diagnosis
      const possibleName = lines.find(l => l.toLowerCase().includes('nombre') || l.length > 5);
      if (possibleName) setName(possibleName.replace(/nombre:?/i, '').trim());
      
      const possibleDiag = lines.find(l => l.toLowerCase().includes('diag') || l.toLowerCase().includes('cie'));
      if (possibleDiag) setDiagnosis(possibleDiag.replace(/diagnóstico:?/i, '').trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      patientName: name,
      diagnosis: diagnosis.split(',').map(d => d.trim()),
      medications: [],
      notes: 'Caso ingresado mediante OCR/Manual.',
      age: 30,
      gender: 'M'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Nuevo Caso Clínico</h2>
        
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <Camera className="text-blue-600 mb-2" size={24} />
            <span className="text-[10px] font-bold uppercase">Cámara</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <FileUp className="text-blue-600 mb-2" size={24} />
            <span className="text-[10px] font-bold uppercase">Archivo</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.pdf,.docx" 
            onChange={handleFileChange}
          />
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
            <Loader2 className="animate-spin" size={16} />
            <span className="text-xs font-bold">Procesando texto con IA...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre Paciente</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Diagnósticos (sep. por coma)</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={diagnosis} 
              onChange={e => setDiagnosis(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 font-bold">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;