import React from 'react';
import { useData } from '../../context/DataContext';

export const DemoBanner: React.FC<{ onOpenSheetViewer: () => void }> = ({ onOpenSheetViewer }) => {
  const { currentRole, currency, setCurrency, resetAllData } = useData();

  return (
    <div className="bg-[#1a3650] text-[#e8e0d0] text-[12px] px-4 py-2 flex flex-wrap items-center justify-between gap-2">
      <p>
        <span className="font-semibold text-cream">Demonstration.</span>{' '}
        Sample records only. Checkout is simulated. Viewing as{' '}
        <span className="font-semibold text-cream">{currentRole}</span>.
      </p>
      <div className="flex items-center gap-2">
        <div className="inline-flex border border-[#3d5a73] rounded">
          <button
            onClick={() => setCurrency('GBP')}
            className={`px-2 py-0.5 text-[11px] font-semibold ${currency === 'GBP' ? 'bg-cream text-ink' : 'text-[#c5cdd6]'}`}
          >
            £ GBP
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2 py-0.5 text-[11px] font-semibold ${currency === 'INR' ? 'bg-cream text-ink' : 'text-[#c5cdd6]'}`}
          >
            ₹ INR
          </button>
        </div>
        <button type="button" onClick={onOpenSheetViewer} className="underline-offset-2 hover:underline hidden sm:inline">
          Data tables
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset sample data?')) resetAllData();
          }}
          className="underline-offset-2 hover:underline hidden sm:inline"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
