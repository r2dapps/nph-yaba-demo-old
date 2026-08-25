import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  Search,
  Filter,
  Shield,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Plus,
  ArrowUpDown,
  Download,
  Mail,
} from 'lucide-react';
import { Organisation } from '../../types';

export const MembersScreen: React.FC<{
  onOpenOrgDetail: (orgId: string) => void;
}> = ({ onOpenOrgDetail }) => {
  const {
    currentRole,
    can,
    organisations,
    memberships,
    updateMembershipStatus,
    exportSheetCSV,
    formatCurrency,
  } = useData();

  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const canApproveSuspend = can('approve_suspend_members');

  // Sectors list
  const sectors = Array.from(new Set(organisations.map((o) => o.sector)));

  const filteredOrgs = organisations.filter((org) => {
    if (tierFilter !== 'ALL' && org.membership_tier !== tierFilter) return false;
    if (statusFilter !== 'ALL' && org.status !== statusFilter) return false;
    if (sectorFilter !== 'ALL' && org.sector !== sectorFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        org.name.toLowerCase().includes(term) ||
        org.city.toLowerCase().includes(term) ||
        org.sector.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Members CRM & Organisations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {filteredOrgs.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bilateral corporate members, premier partners, and chamber affiliations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportSheetCSV('Organisations')}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-cream border border-line rounded-lg p-4  space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company, city, sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Membership Tiers</option>
              <option value="Premier">Premier Strategic Patron</option>
              <option value="Corporate">Corporate Trade Partner</option>
              <option value="Individual">Individual Professional</option>
              <option value="Student">Academic / Fellow</option>
              <option value="Free">Free Observer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Grace">Grace Period (Overdue Payment)</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Trade Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(tierFilter !== 'ALL' || statusFilter !== 'ALL' || sectorFilter !== 'ALL' || searchTerm) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            <button
              onClick={() => {
                setTierFilter('ALL');
                setStatusFilter('ALL');
                setSectorFilter('ALL');
                setSearchTerm('');
              }}
              className="text-blue-700 font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main CRM Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Organisation & Location</th>
                <th className="px-4 py-3">Sector & Corridor</th>
                <th className="px-4 py-3">Membership Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Renewal Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => {
                  const mem = memberships.find((m) => m.organisation_id === org.id);
                  return (
                    <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Location */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p
                            onClick={() => onOpenOrgDetail(org.id)}
                            className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer text-sm"
                          >
                            {org.name}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{org.city}, {org.country}</span>
                            <span>·</span>
                            <span className="font-mono text-slate-400">{org.id}</span>
                          </p>
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-900">{org.sector}</p>
                        <p className="text-[11px] text-slate-500">{org.trade_corridor || 'UK - India Direct'}</p>
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            org.membership_tier === 'Premier'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : org.membership_tier === 'Corporate'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {org.membership_tier}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {mem ? `${mem.seats_used || 1}/${mem.seats_total || 5} Seats Used` : '1 Seat'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            org.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : org.status === 'Grace'
                              ? 'bg-amber-100 text-amber-800'
                              : org.status === 'Pending'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              org.status === 'Active'
                                ? 'bg-emerald-600'
                                : org.status === 'Grace'
                                ? 'bg-amber-600'
                                : org.status === 'Pending'
                                ? 'bg-purple-600'
                                : 'bg-rose-600'
                            }`}
                          ></span>
                          {org.status}
                        </span>
                      </td>

                      {/* Renewal */}
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {mem?.renew_on || '2026-12-31'}
                        {org.status === 'Grace' && (
                          <span className="block text-[10px] text-rose-600 font-bold">
                            Payment Overdue
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenOrgDetail(org.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="View Organisation Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {canApproveSuspend && (
                            <>
                              {org.status === 'Grace' ? (
                                <button
                                  onClick={() => updateMembershipStatus(org.id, 'Active')}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                                  title="Approve / Re-activate"
                                >
                                  Resolve
                                </button>
                              ) : org.status === 'Active' ? (
                                <button
                                  onClick={() => updateMembershipStatus(org.id, 'Grace')}
                                  className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors"
                                  title="Simulate Failed Payment & Send Grace Reminder"
                                >
                                  Grace
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateMembershipStatus(org.id, 'Active')}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                                >
                                  Activate
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <p className="text-sm font-semibold">No organisations match the selected filters.</p>
                    <button
                      onClick={() => {
                        setTierFilter('ALL');
                        setStatusFilter('ALL');
                        setSectorFilter('ALL');
                        setSearchTerm('');
                      }}
                      className="mt-2 text-xs text-blue-700 font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
