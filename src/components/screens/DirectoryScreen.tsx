import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  BookOpen,
  Search,
  Building2,
  Users,
  MapPin,
  Globe,
  ExternalLink,
  Send,
  Filter,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { isStaffRole } from '../../types';

export const DirectoryScreen: React.FC<{
  onOpenOrgDetail: (orgId: string) => void;
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenOrgDetail, onOpenPersonDetail }) => {
  const { currentRole, organisations, people, setActiveTab, createIntroduction } = useData();

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [introModalOrg, setIntroModalOrg] = useState<string | null>(null);
  const [introMessage, setIntroMessage] = useState('');

  const isStaff = isStaffRole(currentRole);

  const sectors = Array.from(new Set(organisations.map((o) => o.sector)));

  const filteredOrgs = organisations.filter((org) => {
    if (countryFilter !== 'ALL' && org.country !== countryFilter) return false;
    if (sectorFilter !== 'ALL' && org.sector !== sectorFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        org.name.toLowerCase().includes(q) ||
        org.sector.toLowerCase().includes(q) ||
        org.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendIntroRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introModalOrg) return;
    const target = organisations.find((o) => o.id === introModalOrg);
    if (!target) return;

    createIntroduction({
      from_person_id: 'per_007',
      from_person_name: 'Aisha Begum (SteelPeak Ltd)',
      from_org_name: 'SteelPeak Ltd',
      to_org_or_person: `${target.name} (${target.sector})`,
      message: introMessage || `We would like to request an exploratory bilateral commercial dialogue with ${target.name}.`,
      target_sector: target.sector,
    });

    setIntroModalOrg(null);
    setIntroMessage('');
    setActiveTab('introductions');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              UK - India Bilateral Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Verified Chamber Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified companies, heavy engineering exporters, tech partners, and bilateral trade agencies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream border border-line rounded-lg p-4  space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, trade interests, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

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

          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Regions (UK & India)</option>
              <option value="United Kingdom">United Kingdom (Northern Powerhouse / London)</option>
              <option value="India">India (Mumbai / Bengaluru / New Delhi / Gujarat)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map((org) => {
          const orgPeople = people.filter((p) => p.organisation_id === org.id);
          return (
            <div
              key={org.id}
              className="bg-cream border border-line rounded-lg p-5  hover: transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      org.membership_tier === 'Premier'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : org.membership_tier === 'Corporate'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {org.membership_tier} Partner
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {org.city}, {org.country}
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => onOpenOrgDetail(org.id)}
                    className="text-base font-semibold text-slate-900 hover:text-blue-700 cursor-pointer"
                  >
                    {org.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{org.sector}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Corridor:</span>
                    <strong className="text-slate-800 font-semibold">{org.trade_corridor || 'UK - India Direct'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Key Contacts:</span>
                    <span className="text-slate-800 font-medium">{orgPeople.length} Linked Members</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenOrgDetail(org.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setIntroModalOrg(org.id)}
                  className="px-3.5 py-2 rounded-xl bg-ink text-cream hover:bg-ink-2 text-xs font-bold  transition-colors flex items-center gap-1"
                  title="Request verified introduction via Chamber"
                >
                  <Send className="w-3.5 h-3.5" />
                  Intro
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Intro Request Modal */}
      {introModalOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-lg  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-600" />
                Request Matchmaking Introduction
              </h3>
              <button
                onClick={() => setIntroModalOrg(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSendIntroRequest} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Target Organisation:</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {organisations.find((o) => o.id === introModalOrg)?.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {organisations.find((o) => o.id === introModalOrg)?.sector}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Introduction Message & Objectives
                </label>
                <textarea
                  value={introMessage}
                  onChange={(e) => setIntroMessage(e.target.value)}
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  placeholder="Outline the bilateral synergy, products/services of interest, or joint venture opportunities..."
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your introduction request will be routed to the NPH / YABA Membership Team for verification and direct warm outreach.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIntroModalOrg(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Submit Introduction Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const MyCompanyScreen: React.FC<{
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenPersonDetail }) => {
  const {
    currentUser,
    currentRole,
    organisations,
    people,
    memberships,
    orders,
    inviteTeamMember,
    removeTeamMember,
    updateOrganisation,
    formatCurrency,
  } = useData();

  const userOrg =
    organisations.find((o) => o.id === currentUser.organisation_id) || organisations[1]; // Default to SteelPeak Ltd
  const userMembership = memberships.find((m) => m.organisation_id === userOrg.id);
  const companyPeople = people.filter((p) => p.organisation_id === userOrg.id);
  const companyOrders = orders.filter((o) => o.organisation_id === userOrg.id);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newRoleAtCompany, setNewRoleAtCompany] = useState<any>('Decision Maker');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newFirstName) return;

    inviteTeamMember(userOrg.id, {
      first_name: newFirstName,
      last_name: newLastName,
      email: newEmail,
      job_title: newJobTitle || 'Executive Delegate',
      role_at_company: newRoleAtCompany,
      phone: '+44 114 290 8800',
      skills: ['International Trade', 'Export Sales'],
      export_interests: ['India Corridors'],
      bio: 'Team member at SteelPeak Ltd.',
      consent_email: true,
      is_influencer: false,
      is_decision_maker: true,
    });

    setIsInviteModalOpen(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewJobTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white  flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Company Admin Portal
            </span>
            <span className="text-xs text-slate-400">· {userOrg.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">{userOrg.name}</h1>
          <p className="text-xs text-slate-300">
            {userOrg.sector} · {userOrg.city}, {userOrg.country}
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs space-y-1.5 min-w-[220px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Membership Tier:</span>
            <strong className="text-amber-400">{userMembership?.tier || 'Corporate'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Seats Utilisation:</span>
            <strong className="text-emerald-400">
              {companyPeople.length} of {userMembership?.seats_total || 5} Used
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Renews On:</span>
            <span className="text-slate-200">{userMembership?.renew_on}</span>
          </div>
        </div>
      </div>

      {/* Team Seats Management Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Allocated Team Seats & Roles ({companyPeople.length}/{userMembership?.seats_total || 5})
            </h3>
            <p className="text-xs text-slate-500">
              Manage corporate colleagues with access to roundtables, webinar masterclasses, and mission registrations.
            </p>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-3.5 py-2 bg-ink text-cream hover:bg-ink-2 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Assign New Seat
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Member Name & Email</th>
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Company Role</th>
                <th className="px-4 py-3">Decision Maker</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyPeople.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-700">
                        {person.first_name[0]}{person.last_name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {person.first_name} {person.last_name}
                        </p>
                        <p className="text-[11px] text-slate-500">{person.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-slate-800">{person.job_title}</td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {person.role_at_company}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {person.is_decision_maker ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPersonDetail(person.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                      >
                        Profile
                      </button>
                      {currentRole === 'Company Admin' && person.email !== currentUser.email && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove seat for ${person.first_name} ${person.last_name}?`)) {
                              removeTeamMember(person.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Orders & Invoices */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Company Billing History & Invoices
          </h3>
          <p className="text-xs text-slate-500">
            Past membership subscriptions, trade mission deposits, and add-on packages.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {companyOrders.map((ord) => (
            <div key={ord.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{ord.invoice_number}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {ord.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{ord.items_summary}</p>
                <p className="text-[11px] text-slate-400">
                  {new Date(ord.created_at).toLocaleDateString()} · Buyer: {ord.buyer_name}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(ord.total)}
                </span>
                <span className="block text-[11px] text-slate-500">{ord.gateway}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-md  p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Assign Corporate Team Seat
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. Marcus"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  placeholder="m.vance@steelpeak-demo.co.uk"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. Head of Metallurgy Procurement"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role at Company</label>
                <select
                  value={newRoleAtCompany}
                  onChange={(e) => setNewRoleAtCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold"
                >
                  <option value="Director">Director</option>
                  <option value="Decision Maker">Decision Maker</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-lg "
                >
                  Assign Seat & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
