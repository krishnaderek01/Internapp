"use client";

import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Loader2, Camera, FileUp, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/genai";

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiCleaning, setIsAiCleaning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanTextWithAI = async (rawText: string) => {
    setIsAiCleaning(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY no encontrada. Usando mapeo básico.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Act as a medical scribe. Correct and structure this messy OCR text from a clinical document.
      Return ONLY a JSON object with the following structure:
      {
        "patientName": "string",
        "diagnosis": ["string"],
        "medications": [{"name": "string", "dose": "string"}],
        "evolution": "string",
        "notes": "string"
      }
      
      Messy OCR text:
      ${rawText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (handling potential markdown blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setName(data.patientName || '');
        setDiagnosis(data.diagnosis?.join(', ') || '');
        setNotes(data.evolution || data.notes || '');
      }
    } catch (error) {
      console.error("AI Cleaning Error:", error);
    } finally {
      setIsAiCleaning(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.type.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file, 'spa');
        await cleanTextWithAI(text);
      } else {
        alert("Por ahora, usa imágenes o fotos para el procesamiento con IA.");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Error al procesar la imagen.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      patientName: name,
      diagnosis: diagnosis.split(',').map(d => d.trim()).filter(d => d),
      medications: [],
      notes: notes || 'Caso ingresado mediante OCR e IA.',
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
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>

        {(isProcessing || isAiCleaning) && (
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg">
            {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles className="animate-pulse" size={16} />}
            <span className="text-xs font-bold">
              {isProcessing ? "Leyendo imagen..." : "IA estructurando datos médicos..."}
            </span>
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
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Diagnósticos</label>
            <input 
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={diagnosis} 
              onChange={e => setDiagnosis(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Evolución / Notas</label>
            <textarea 
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none" 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
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