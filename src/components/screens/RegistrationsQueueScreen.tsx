import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Building2,
  Calendar,
  Plane,
  Video,
  User,
  Shield,
  Download,
} from 'lucide-react';
import { Registration } from '../../types';

export const RegistrationsQueueScreen: React.FC<{
  onOpenOrgDetail: (orgId: string) => void;
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenOrgDetail, onOpenPersonDetail }) => {
  const { currentRole, can, registrations, updateRegistrationStatus, exportSheetCSV, formatCurrency } = useData();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const canApprove = can('approve_registrations');

  const filteredRegistrations = registrations.filter((r) => {
    if (typeFilter !== 'ALL' && r.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const pName = (r as any).person_name || r.applicant_name || '';
      const oName = (r as any).organisation_name || r.applicant_org || '';
      const iTitle = (r as any).item_title || r.related_title || '';
      return (
        pName.toLowerCase().includes(q) ||
        oName.toLowerCase().includes(q) ||
        iTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = registrations.filter((r) => r.status === 'Submitted').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Registrations & Approvals Queue
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Process delegate applications for bilateral trade summits, roundtable events, and membership inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSheetCSV('Registrations')}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Queue CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-cream border border-line rounded-lg p-4  space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registrant, organisation, event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Application Types</option>
              <option value="Event">Roundtables & In-Person Events</option>
              <option value="Mission">Bilateral Trade Mission Delegations</option>
              <option value="Webinar">Digital Webinars & Masterclasses</option>
              <option value="Membership">Membership Applications</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted (Pending Review)</option>
              <option value="Approved">Approved / Confirmed</option>
              <option value="Waitlist">Waitlisted (Capacity Reached)</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Registrant & Organisation</th>
                <th className="px-4 py-3">Event / Mission Target</th>
                <th className="px-4 py-3">Type & Applied Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg) => {
                const personName = (reg as any).person_name || reg.applicant_name || 'Delegate';
                const orgName = (reg as any).organisation_name || reg.applicant_org || 'Member Org';
                const personId = (reg as any).person_id || reg.applicant_person_id;
                const orgId = (reg as any).organisation_id || 'org_steelpeak';
                const itemTitle = (reg as any).item_title || reg.related_title || reg.type;
                const itemId = (reg as any).item_id || reg.related_id;
                const appliedDate = (reg as any).created_at || reg.submitted_at || new Date().toISOString();

                return (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div>
                        <p
                          onClick={() => onOpenPersonDetail(personId)}
                          className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer text-sm"
                        >
                          {personName}
                        </p>
                        <p
                          onClick={() => onOpenOrgDetail(orgId)}
                          className="text-[11px] text-slate-500 hover:text-blue-700 cursor-pointer font-medium"
                        >
                          {orgName}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{itemTitle}</p>
                      <span className="text-[10px] font-mono text-slate-400">{itemId}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.type === 'Mission'
                            ? 'bg-purple-100 text-purple-800'
                            : reg.type === 'Event'
                            ? 'bg-blue-100 text-blue-800'
                            : reg.type === 'Webinar'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {reg.type}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        {new Date(appliedDate).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          reg.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reg.status === 'Submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : reg.status === 'Waitlist'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {canApprove ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'Approved')}
                            disabled={reg.status === 'Approved'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              reg.status === 'Approved'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'Waitlist')}
                            disabled={reg.status === 'Waitlist'}
                            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold"
                          >
                            Waitlist
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(reg.id, 'Rejected')}
                            disabled={reg.status === 'Rejected'}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Staff Approval Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
