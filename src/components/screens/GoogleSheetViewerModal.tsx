import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileSpreadsheet,
  Download,
  Search,
  X,
  Database,
  ExternalLink,
  Layers,
  Check,
  RefreshCw,
} from 'lucide-react';
import { SheetTabName } from '../../types';

interface GoogleSheetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS: SheetTabName[] = [
  'Organisations',
  'People',
  'Locations',
  'Memberships',
  'MembershipPlans',
  'Events',
  'TradeMissions',
  'Webinars',
  'Registrations',
  'ShopProducts',
  'Orders',
  'OrderItems',
  'BlogPosts',
  'NewsletterCredits',
  'Introductions',
  'Referrals',
  'Campaigns',
  'Automations',
  'WorkflowTasks',
  'TradeDocuments',
  'AuditLog',
  'AppUsers',
];

export const GoogleSheetViewerModal: React.FC<GoogleSheetViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    organisations,
    people,
    locations,
    memberships,
    plans,
    events,
    missions,
    webinars,
    registrations,
    products,
    orders,
    blogs,
    newsletterCredits,
    introductions,
    referrals,
    campaigns,
    automations,
    tasks,
    tradeDocuments,
    auditLogs,
    users,
    exportSheetCSV,
  } = useData();

  const [activeTab, setActiveTab] = useState<SheetTabName>('Organisations');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const getTabData = (): any[] => {
    switch (activeTab) {
      case 'Organisations':
        return organisations;
      case 'People':
        return people;
      case 'Locations':
        return locations;
      case 'Memberships':
        return memberships;
      case 'MembershipPlans':
        return plans;
      case 'Events':
        return events;
      case 'TradeMissions':
        return missions;
      case 'Webinars':
        return webinars;
      case 'Registrations':
        return registrations;
      case 'ShopProducts':
        return products;
      case 'Orders':
        return orders;
      case 'BlogPosts':
        return blogs;
      case 'NewsletterCredits':
        return newsletterCredits;
      case 'Introductions':
        return introductions;
      case 'Referrals':
        return referrals;
      case 'Campaigns':
        return campaigns;
      case 'Automations':
        return automations;
      case 'WorkflowTasks':
        return tasks;
      case 'TradeDocuments':
        return tradeDocuments;
      case 'AuditLog':
        return auditLogs;
      case 'AppUsers':
        return users;
      default:
        return organisations;
    }
  };

  const rawData = getTabData();
  const columns = rawData.length > 0 ? Object.keys(rawData[0]) : [];

  const filteredData = rawData.filter((row) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-cream border border-line rounded-lg w-full max-w-6xl max-h-[92vh]  flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Sample data tables
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-memory demonstration records (same shape as a spreadsheet export).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSheetCSV(activeTab)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download {activeTab}.csv
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Row */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto select-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white '
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Search & Meta Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab} rows...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing <strong>{filteredData.length}</strong> of <strong>{rawData.length}</strong> rows · {columns.length} columns
          </span>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 border-r border-slate-800 w-12 text-center text-slate-500">#</th>
                {columns.map((col) => (
                  <th key={col} className="px-3 py-2 border-r border-slate-800 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-400 select-none bg-slate-50 text-[11px]">
                    {idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 border-r border-slate-100 whitespace-nowrap max-w-xs truncate text-slate-800 text-[11px]"
                      title={String(row[col])}
                    >
                      {typeof row[col] === 'boolean'
                        ? row[col]
                          ? 'TRUE'
                          : 'FALSE'
                        : Array.isArray(row[col])
                        ? row[col].join(', ')
                        : String(row[col] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Active Tab: <strong className="text-emerald-400">{activeTab}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
