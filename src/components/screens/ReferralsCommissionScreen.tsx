import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ReferralDeal, ReferralStage } from '../../types';

export const ReferralsCommissionScreen: React.FC<{
  onOpenOrgDetail: (orgId: string) => void;
}> = ({ onOpenOrgDetail }) => {
  const { currentRole, can, referrals, updateReferralStage, createReferral, formatCurrency } = useData();

  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState(250000);
  const [dealPct, setDealPct] = useState(2.5);
  const [dealFromOrg, setDealFromOrg] = useState('SteelPeak Ltd');
  const [dealToOrg, setDealToOrg] = useState('Bharat Forge & Heavy Alloys');

  const STAGES: ReferralStage[] = [
    'Lead Identified',
    'Qualified Commercial',
    'Deal Signed',
    'Commission Invoiced',
    'Commission Paid',
  ];

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle) return;

    createReferral({
      deal_title: dealTitle,
      from_org: dealFromOrg,
      to_org: dealToOrg,
      value_gbp: dealValue,
      commission_pct: dealPct,
      stage: 'Lead Identified',
    });

    setIsNewDealOpen(false);
    setDealTitle('');
  };

  const totalPipeline = referrals.reduce((sum, r) => sum + r.value_gbp, 0);
  const totalCommission = referrals.reduce((sum, r) => sum + r.commission_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Bilateral Trade Referrals & Commission Pipeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Chamber Success Fees
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track cross-border commercial joint ventures, supplier agreements, and chamber success-fee commissions.
          </p>
        </div>

        <button
          onClick={() => setIsNewDealOpen(true)}
          className="px-3.5 py-2 bg-ink text-cream hover:bg-ink-2 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Bilateral Deal
        </button>
      </div>

      {/* Pipeline KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Total Deal Volume</span>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(totalPipeline)}</p>
          <span className="text-[11px] text-slate-500">{referrals.length} active cross-border negotiations</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Total Chamber Commission</span>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{formatCurrency(totalCommission)}</p>
          <span className="text-[11px] text-slate-500">Average fee: 2.5%</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Deals Concluded & Paid</span>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {referrals.filter((r) => r.stage === 'Commission Paid').length} of {referrals.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">100% SLA settlement rate</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = referrals.filter((r) => r.stage === stage);
          const stageTotal = stageDeals.reduce((sum, r) => sum + r.value_gbp, 0);

          return (
            <div
              key={stage}
              className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 flex flex-col min-w-[220px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight">
                  {stage}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  {stageDeals.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-semibold mb-3">
                Vol: {formatCurrency(stageTotal)}
              </div>

              <div className="space-y-3 flex-1">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-cream border border-line rounded-lg p-3.5  space-y-2.5 hover:border-amber-400 transition-all text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 leading-snug">{deal.deal_title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {deal.from_org} ➔ {deal.to_org}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Deal Size:</span>
                        <strong className="text-slate-900">{formatCurrency(deal.value_gbp)}</strong>
                      </div>
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Chamber Fee ({deal.commission_pct}%):</span>
                        <span>{formatCurrency(deal.commission_amount)}</span>
                      </div>
                    </div>

                    {/* Move Stage Selector */}
                    <div className="pt-2 border-t border-slate-100">
                      <select
                        value={deal.stage}
                        onChange={(e) =>
                          updateReferralStage(deal.id, e.target.value as ReferralStage)
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 py-1 px-1.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move to: {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Deal Modal */}
      {isNewDealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-md  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Log Cross-Border Referral Deal
              </h3>
              <button
                onClick={() => setIsNewDealOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Deal / Agreement Title</label>
                <input
                  type="text"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  placeholder="e.g. Specialized Alloy Turbine Blades Supply Contract"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Referring Org (UK)</label>
                  <input
                    type="text"
                    value={dealFromOrg}
                    onChange={(e) => setDealFromOrg(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Org (India)</label>
                  <input
                    type="text"
                    value={dealToOrg}
                    onChange={(e) => setDealToOrg(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Value (£ GBP)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chamber Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dealPct}
                    onChange={(e) => setDealPct(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewDealOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Add to Referral Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const IntroductionsScreen: React.FC = () => {
  const { currentRole, can, introductions, updateIntroductionStatus } = useData();

  const canApprove = can('approve_intros_blogs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Bilateral Matchmaking & Warm Introductions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
              {introductions.length} Intro Requests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified warm introductions facilitated directly by NPH / YABA Chamber executive staff.
          </p>
        </div>
      </div>

      {/* Introductions Queue Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Requester & Company</th>
                <th className="px-4 py-3">Target Partner / Sector</th>
                <th className="px-4 py-3">Objective & Notes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Chamber Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {introductions.map((intro) => (
                <tr key={intro.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">{intro.from_person_name}</p>
                    <p className="text-[11px] text-slate-500">{intro.from_org_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {new Date(intro.created_at).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">{intro.to_org_or_person}</p>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold mt-1 inline-block">
                      {intro.target_sector}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 max-w-sm">
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {intro.message}
                    </p>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        intro.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : intro.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : intro.status === 'Requested'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {intro.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    {canApprove ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateIntroductionStatus(intro.id, 'Approved')}
                          disabled={intro.status === 'Approved' || intro.status === 'Completed'}
                          className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateIntroductionStatus(intro.id, 'Completed')}
                          disabled={intro.status === 'Completed'}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Mark Intro Made
                        </button>
                        <button
                          onClick={() => updateIntroductionStatus(intro.id, 'Declined')}
                          className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Chamber Facilitated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
