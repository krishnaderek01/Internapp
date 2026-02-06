
import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, PatientCase, Medication, Pathology, MedicationVariation } from './types';
import CaseList from './components/CaseList';
import Vademecum from './components/Vademecum';
import PathologyLibrary from './components/PathologyLibrary';
import Insights from './components/Insights';
import ChatAssistant from './components/ChatAssistant';
import UploadModal from './components/UploadModal';
import ProfileSettings from './components/ProfileSettings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('cases');
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const savedCases = localStorage.getItem('med_cases');
    const savedMeds = localStorage.getItem('med_vademecum');
    const savedPaths = localStorage.getItem('med_pathologies');
    
    if (savedCases) setCases(JSON.parse(savedCases));
    if (savedMeds) setMedications(JSON.parse(savedMeds));
    if (savedPaths) setPathologies(JSON.parse(savedPaths));
  }, []);

  const saveToStorage = (newCases: PatientCase[], newMeds: Medication[], newPaths: Pathology[]) => {
    localStorage.setItem('med_cases', JSON.stringify(newCases));
    localStorage.setItem('med_vademecum', JSON.stringify(newMeds));
    localStorage.setItem('med_pathologies', JSON.stringify(newPaths));
  };

  const handleAddCase = useCallback((newCase: any) => {
    const patientAge = newCase.age || 0;
    const isPediatric = patientAge < 15;

    const fullCase: PatientCase = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      patientName: newCase.patientName || 'Paciente Anonimizado',
      diagnosis: newCase.diagnosis || [],
      medications: newCase.medications || [],
      evolution: newCase.evolution || '',
      notes: newCase.notes || '',
      vitals: newCase.vitals,
      age: patientAge,
      gender: newCase.gender
    };

    const updatedCases = [fullCase, ...cases];
    setCases(updatedCases);

    const newMedsList = [...medications];
    fullCase.medications.forEach(medInfo => {
      const medName = medInfo.name;
      const variation: MedicationVariation = {
        dosage: medInfo.dose || 'No espec.',
        presentation: medInfo.presentation || 'No espec.',
        detectedAt: new Date().toISOString(),
        patientAge: patientAge
      };
      
      const existingIdx = newMedsList.findIndex(m => m.name.toLowerCase() === medName.toLowerCase());
      
      if (existingIdx >= 0) {
        const med = newMedsList[existingIdx];
        const targetList = isPediatric ? med.pediatricVariations : med.adultVariations;
        const alreadyHasVar = targetList.some(v => v.dosage === variation.dosage && v.presentation === variation.presentation);
        
        if (!alreadyHasVar) {
          targetList.push(variation);
        }
        // Update family info if missing
        if (!med.family) med.family = medInfo.family || 'Otros';
        if (!med.subfamily) med.subfamily = medInfo.subfamily;
      } else {
        newMedsList.push({
          name: medName,
          family: medInfo.family || 'Otros',
          subfamily: medInfo.subfamily,
          addedAt: new Date().toISOString(),
          adultVariations: isPediatric ? [] : [variation],
          pediatricVariations: isPediatric ? [variation] : [],
          mechanism: ''
        });
      }
    });
    setMedications(newMedsList);

    const newPathsList = [...pathologies];
    fullCase.diagnosis.forEach(diag => {
      const existing = newPathsList.find(p => p.name.toLowerCase() === diag.toLowerCase());
      if (existing) existing.frequency += 1;
      else newPathsList.push({ name: diag, frequency: 1 });
    });
    setPathologies(newPathsList);

    saveToStorage(updatedCases, newMedsList, newPathsList);
    setIsUploadOpen(false);
  }, [cases, medications, pathologies]);

  const updateMedication = (name: string, data: Partial<Medication>) => {
    const updated = medications.map(m => m.name === name ? { ...m, ...data } : m);
    setMedications(updated);
    saveToStorage(cases, updated, pathologies);
  };

  const updatePathology = (name: string, data: Partial<Pathology>) => {
    const updated = pathologies.map(p => p.name === name ? { ...p, ...data } : p);
    setPathologies(updated);
    saveToStorage(cases, medications, updated);
  };

  const handleBackup = (importedData?: any) => {
    if (importedData) {
      setCases(importedData.cases);
      setMedications(importedData.meds);
      setPathologies(importedData.paths);
      saveToStorage(importedData.cases, importedData.meds, importedData.paths);
    } else {
      const data = { cases, meds: medications, paths: pathologies };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medintern_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      <header className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0 shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-stethoscope"></i> MedIntern CL
        </h1>
        <button onClick={() => setIsUploadOpen(true)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10">
          <i className="fa-solid fa-plus"></i>
        </button>
      </header>
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-20 bg-slate-50">
        {activeTab === 'cases' && <CaseList cases={cases} />}
        {activeTab === 'vademecum' && <Vademecum medications={medications} onUpdate={updateMedication} />}
        {activeTab === 'pathology' && <PathologyLibrary pathologies={pathologies} onUpdate={updatePathology} />}
        {activeTab === 'insights' && <Insights cases={cases} />}
        {activeTab === 'chat' && <ChatAssistant context={cases.map(c => c.notes).join('\n')} />}
        {activeTab === 'profile' && <ProfileSettings onBackup={handleBackup} />}
      </main>
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 text-slate-400 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {[
          { tab: 'cases', icon: 'fa-folder-open', label: 'Casos' },
          { tab: 'vademecum', icon: 'fa-pills', label: 'Vademécum' },
          { tab: 'pathology', icon: 'fa-book-medical', label: 'Estudio' },
          { tab: 'chat', icon: 'fa-robot', label: 'IA' },
          { tab: 'profile', icon: 'fa-user-doctor', label: 'Perfil' }
        ].map(item => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab as AppTab)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.tab ? 'text-blue-600' : 'hover:text-slate-600'}`}>
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onSuccess={handleAddCase} />}
    </div>
  );
};

export default App;
