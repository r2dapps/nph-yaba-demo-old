import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Plane,
  Calendar,
  MapPin,
  Users,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Download,
  Info,
  Shield,
  FileText,
} from 'lucide-react';
import { TradeMission } from '../../types';

export const TradeMissionsScreen: React.FC<{
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenPersonDetail }) => {
  const {
    currentUser,
    currentRole,
    can,
    missions,
    tradeDocuments,
    toggleDocumentStatus,
    createRegistration,
    addToCart,
    formatCurrency,
    setActiveTab,
  } = useData();

  const [activeTabMissionId, setActiveTabMissionId] = useState(missions[0]?.id || 'mis_001');
  const [activeSection, setActiveSection] = useState<'itinerary' | 'delegates' | 'documents' | 'corridor'>(
    'itinerary'
  );

  const selectedMission = missions.find((m) => m.id === activeTabMissionId) || missions[0];

  const handleApplyDelegation = (m: TradeMission) => {
    addToCart({
      id: m.id,
      title: `Mission Delegation Pass: ${m.title}`,
      type: 'Mission',
      unit_price_gbp: m.price_gbp,
      unit_price_inr: m.price_inr,
      quantity: 1,
    });
    setActiveTab('shop');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Bilateral Trade Missions & Delegations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              UK High Commission Supported
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured trade delegations connecting UK regional manufacturers and innovators with industrial powerhouses across India.
          </p>
        </div>
      </div>

      {/* Mission Selector Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
        {missions.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTabMissionId(m.id)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTabMissionId === m.id
                ? 'border-amber-500 text-slate-950 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{m.title}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
              {m.country}
            </span>
          </button>
        ))}
      </div>

      {selectedMission && (
        <div className="space-y-6">
          {/* Mission Hero Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-800  flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                  {selectedMission.status} Mission
                </span>
                <span className="text-xs text-slate-400">· Destination: {selectedMission.country}</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">{selectedMission.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedMission.itinerary_summary}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  {new Date(selectedMission.start_date).toLocaleDateString()} –{' '}
                  {new Date(selectedMission.end_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  {selectedMission.delegates_count || 14} of {selectedMission.capacity} delegates confirmed
                </span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 text-right space-y-3 flex-shrink-0 min-w-[240px]">
              <div>
                <span className="text-xs text-slate-400 block">Delegate Investment</span>
                <span className="text-2xl font-semibold text-amber-400">
                  {formatCurrency(selectedMission.price_gbp, selectedMission.price_inr)}
                </span>
                <span className="text-[11px] text-slate-400 block">excl. flights & visas</span>
              </div>

              <button
                onClick={() => handleApplyDelegation(selectedMission)}
                className="w-full py-2.5 rounded-xl bg-ink text-cream hover:bg-ink-2 font-semibold text-xs  transition-all flex items-center justify-center gap-1.5"
              >
                Apply for Mission Pass
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveSection('itinerary')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'itinerary' ? 'bg-white text-slate-950 ' : 'hover:text-slate-900'
              }`}
            >
              5-Day Itinerary & Schedule
            </button>
            <button
              onClick={() => setActiveSection('documents')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'documents' ? 'bg-white text-slate-950 ' : 'hover:text-slate-900'
              }`}
            >
              Delegate Documents Checklist ({tradeDocuments.filter((d) => d.uploaded).length}/{tradeDocuments.length})
            </button>
            <button
              onClick={() => setActiveSection('delegates')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'delegates' ? 'bg-white text-slate-950 ' : 'hover:text-slate-900'
              }`}
            >
              Confirmed Delegation Roster
            </button>
          </div>

          {/* Tab 1: Itinerary */}
          {activeSection === 'itinerary' && (
            <div className="bg-cream border border-line rounded-lg p-6  space-y-6">
              <h3 className="font-semibold text-slate-900 text-base">
                Official Bilateral Itinerary & Business Program
              </h3>

              <div className="space-y-4">
                {[
                  {
                    day: 'Day 1 (Nov 15)',
                    title: 'Arrival in Mumbai & British Deputy High Commission Reception',
                    location: 'Taj Mahal Palace, Colaba, Mumbai',
                    desc: 'Executive welcome briefing, security check, and evening cocktail reception with British High Commission commercial counsellors.',
                  },
                  {
                    day: 'Day 2 (Nov 16)',
                    title: 'Bilateral Clean Tech & EV Supply Chain Summit',
                    location: 'World Trade Center, Mumbai',
                    desc: 'Pre-matched 1-on-1 meetings with Indian tier-1 manufacturers, state energy development agencies, and chamber members.',
                  },
                  {
                    day: 'Day 3 (Nov 17)',
                    title: 'Industrial Hub Site Visits (Pune Automotive Corridor)',
                    location: 'Pune Industrial Park, Maharashtra',
                    desc: 'Factory tours of advanced forging and robotics facilities with direct procurement directors.',
                  },
                  {
                    day: 'Day 4 (Nov 18)',
                    title: 'Bengaluru Tech & Innovation Roundtable',
                    location: 'Leela Palace, Bengaluru',
                    desc: 'Joint venture pitches and MoU signings with bilateral technology incubators and clean tech investors.',
                  },
                  {
                    day: 'Day 5 (Nov 19)',
                    title: 'Chamber Concluding Banquet & Press Briefing',
                    location: 'ITC Gardenia, Bengaluru',
                    desc: 'Signing ceremony for bilateral trade agreements and departure back to the UK.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start gap-4"
                  >
                    <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold sm:w-32 flex-shrink-0 text-center sm:text-left">
                      {item.day}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.location}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Document Checklist */}
          {activeSection === 'documents' && (
            <div className="bg-cream border border-line rounded-lg p-6  space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  Mission Compliance & Document Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Required credentials for Indian consular business visas, chamber clearance, and hotel bookings.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {tradeDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          doc.uploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{doc.title}</p>
                          {doc.required && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {doc.uploaded
                            ? `Uploaded: ${doc.file_name} on ${new Date(doc.uploaded_at!).toLocaleDateString()}`
                            : 'Pending submission from delegate'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDocumentStatus(doc.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        doc.uploaded
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {doc.uploaded ? 'Uploaded ✓' : 'Upload Document'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Delegation Roster */}
          {activeSection === 'delegates' && (
            <div className="bg-cream border border-line rounded-lg p-6  space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">
                Confirmed Delegation Members ({selectedMission.delegates_count || 14} Executives)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Aisha Begum', title: 'Managing Director', org: 'SteelPeak Ltd', sector: 'Specialist Alloys' },
                  { name: 'Li Wei Chen', title: 'VP Trade Strategy', org: 'Orbit Exports', sector: 'Consumer Goods' },
                  { name: 'Dr. Marcus Vance', title: 'Head of Procurement', org: 'SteelPeak Ltd', sector: 'Metallurgy' },
                  { name: 'Sunil Mehta', title: 'Director of Operations', org: 'Trans-Oceanic Freight', sector: 'Logistics' },
                  { name: 'Hannah Scott', title: 'Commercial Delegate', org: 'SteelPeak Ltd', sector: 'Industrial Supply' },
                ].map((del, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{del.name}</p>
                    <p className="text-slate-600 font-medium">{del.title}</p>
                    <p className="text-slate-500 text-[11px]">{del.org} · {del.sector}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Visa Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const WebinarsScreen: React.FC = () => {
  const { webinars, createRegistration, formatCurrency } = useData();

  const handleJoinLive = (web: any) => {
    alert(`Connecting to Chamber Live Studio for "${web.title}"...\n(Zoom / Teams bilateral meeting stream simulator)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Webinars & Bilateral Masterclasses
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              On-Demand & Live Streams
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Practical masterclasses on UK-India FTA tariffs, export compliance, cross-border payments, and supply chain localization.
          </p>
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webinars.map((web) => (
          <div
            key={web.id}
            className="bg-cream border border-line rounded-lg p-6  hover: transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {web.status} Masterclass
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {web.attendees_count} Registered
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">{web.title}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {new Date(web.date_time).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at 14:00 GMT (19:30 IST)
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Keynote Speaker & Host
                </span>
                <p className="font-bold text-slate-800">{web.speaker}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{web.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">
                Included in Member Plan
              </span>

              <button
                onClick={() => handleJoinLive(web)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Join Live Stream
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
