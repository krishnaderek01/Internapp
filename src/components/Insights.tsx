"use client";

import React from 'react';
import { PatientCase } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InsightsProps {
  cases: PatientCase[];
}

const Insights: React.FC<InsightsProps> = ({ cases }) => {
  const diagnosisCounts = cases.reduce((acc: any, c) => {
    c.diagnosis.forEach(d => {
      acc[d] = (acc[d] || 0) + 1;
    });
    return acc;
  }, {});

  const data = Object.entries(diagnosisCounts)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-slate-700 mb-4">Estadísticas</h2>
      <div className="bg-white p-4 rounded-xl border shadow-sm h-64">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Top 5 Diagnósticos</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} fontSize={10} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Insights;