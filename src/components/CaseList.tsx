"use client";

import React from 'react';
import { PatientCase } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface CaseListProps {
  cases: PatientCase[];
}

const CaseList: React.FC<CaseListProps> = ({ cases }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-slate-700">Casos Clínicos</h2>
      {cases.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <i className="fa-solid fa-folder-open text-4xl mb-2"></i>
          <p>No hay casos registrados aún.</p>
        </div>
      ) : (
        cases.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 py-3">
              <CardTitle className="text-sm flex justify-between">
                <span>{c.patientName}</span>
                <span className="text-slate-400 font-normal">{new Date(c.date).toLocaleDateString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {c.diagnosis.map((d, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {d}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic">"{c.notes}"</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CaseList;