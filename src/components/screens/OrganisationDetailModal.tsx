import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Building2,
  MapPin,
  Users,
  CreditCard,
  Lock,
  Globe,
  Mail,
  Phone,
  Shield,
  X,
  ExternalLink,
  Edit2,
  Check,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { Organisation, isStaffRole } from '../../types';

interface OrganisationDetailModalProps {
  orgId: string | null;
  onClose: () => void;
  onOpenPersonDetail: (personId: string) => void;
}

export const OrganisationDetailModal: React.FC<OrganisationDetailModalProps> = ({
  orgId,
  onClose,
  onOpenPersonDetail,
}) => {
  const {
    currentRole,
    can,
    organisations,
    people,
    locations,
    memberships,
    updateOrganisation,
    updateMembershipStatus,
    formatCurrency,
  } = useData();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [staffNotesDraft, setStaffNotesDraft] = useState('');

  if (!orgId) return null;

  const org = organisations.find((o) => o.id === orgId);
  if (!org) return null;

  const orgPeople = people.filter((p) => p.organisation_id === org.id);
  const orgLocations = locations.filter((l) => l.organisation_id === org.id);
  const orgMembership = memberships.find((m) => m.organisation_id === org.id);
  const canSeeStaffNotes = can('staff_only_notes');
  const canApproveSuspend = can('approve_suspend_members');

  const handleSaveNotes = () => {
    updateOrganisation({
      ...org,
      staff_notes: staffNotesDraft,
    });
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-cream border border-line rounded-lg w-full max-w-3xl max-h-[90vh]  flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-ink text-cream p-6 border-b border-ink-2 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {org.membership_tier} Member
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  org.status === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : org.status === 'Grace'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {org.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {org.id}</span>
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">{org.name}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>{org.sector}</span>
              <span>·</span>
              <span>{org.city}, {org.country}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Trade Corridor</span>
              <strong className="text-slate-900">{org.trade_corridor || 'UK - India Direct'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Annual Revenue</span>
              <strong className="text-slate-900">{org.annual_revenue || 'Undisclosed'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Employees</span>
              <strong className="text-slate-900">{org.employee_count || '10+'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Website</span>
              <a
                href={org.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 font-bold hover:underline flex items-center gap-1"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Membership Tier & Status Management (Staff Only) */}
          {canApproveSuspend && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Staff Membership Status Governance
                  </h4>
                </div>
                <span className="text-xs text-slate-500">
                  Renews on: <strong>{orgMembership?.renew_on || '2026-12-31'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => updateMembershipStatus(org.id, 'Active')}
                  disabled={org.status === 'Active'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    org.status === 'Active'
                      ? 'bg-emerald-600 text-white '
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  Approve / Set Active
                </button>
                <button
                  onClick={() => updateMembershipStatus(org.id, 'Grace')}
                  disabled={org.status === 'Grace'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    org.status === 'Grace'
                      ? 'bg-amber-600 text-white '
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  Place in Grace Period (Failed Pay)
                </button>
                <button
                  onClick={() => updateMembershipStatus(org.id, 'Suspended')}
                  disabled={org.status === 'Suspended'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    org.status === 'Suspended'
                      ? 'bg-rose-600 text-white '
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  Suspend Membership
                </button>
              </div>
            </div>
          )}

          {/* CRITICAL: Staff-Only Confidential Notes (Strictly hidden for Company Admin & Member!) */}
          {canSeeStaffNotes ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Staff-Only Internal Notes (Hidden from Member View)
                  </span>
                </div>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setStaffNotesDraft(org.staff_notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                )}
              </div>

              {!isEditingNotes ? (
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {org.staff_notes || 'No confidential staff notes entered yet.'}
                </p>
              ) : (
                <textarea
                  value={staffNotesDraft}
                  onChange={(e) => setStaffNotesDraft(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  placeholder="Enter confidential notes, referral deal status, or compliance history..."
                />
              )}
            </div>
          ) : null}

          {/* Locations & HQ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              Registered Offices & Locations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {orgLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{loc.city}, {loc.country}</span>
                    {loc.is_hq && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                        HQ
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members & Seats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Team Seats & Linked Contacts ({orgPeople.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {orgPeople.map((person) => (
                <div
                  key={person.id}
                  onClick={() => onOpenPersonDetail(person.id)}
                  className="p-3 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-700">
                      {person.first_name[0]}{person.last_name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {person.first_name} {person.last_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {person.job_title} · {person.role_at_company}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {person.is_decision_maker && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        Decision Maker
                      </span>
                    )}
                    <span className="text-blue-700 font-semibold hover:underline">
                      View Profile &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {orgMembership ? `Plan: ${orgMembership.tier} (${orgMembership.billing})` : 'Standard Tier'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface PersonDetailModalProps {
  personId: string | null;
  onClose: () => void;
  onOpenOrgDetail: (orgId: string) => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  personId,
  onClose,
  onOpenOrgDetail,
}) => {
  const { currentRole, can, people, organisations, updatePerson } = useData();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  if (!personId) return null;

  const person = people.find((p) => p.id === personId);
  if (!person) return null;

  const personOrg = organisations.find((o) => o.id === person.organisation_id);
  const canSeeStaffNotes = can('staff_only_notes');

  const handleSaveNotes = () => {
    updatePerson({
      ...person,
      staff_notes: notesDraft,
    });
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-cream border border-line rounded-lg w-full max-w-2xl max-h-[90vh]  flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-ink text-cream p-6 border-b border-ink-2 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-lg font-semibold text-amber-400 overflow-hidden">
              {person.first_name[0]}{person.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {person.role_at_company}
                </span>
                {person.is_decision_maker && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    Decision Maker
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white mt-0.5">
                {person.first_name} {person.last_name}
              </h2>
              <p className="text-xs text-slate-300">
                {person.job_title} ·{' '}
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrgDetail(person.organisation_id);
                  }}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  {personOrg?.name || 'Organisation'}
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block font-medium">Email Address</span>
              <a href={`mailto:${person.email}`} className="text-blue-700 font-bold hover:underline">
                {person.email}
              </a>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Direct Phone</span>
              <strong className="text-slate-900">{person.phone}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">GDPR / Email Consent</span>
              <span className="text-emerald-700 font-bold">
                {person.consent_email ? 'Verified (Opted-in)' : 'Pending'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Consent Recorded On</span>
              <strong className="text-slate-900">
                {new Date(person.consent_date).toLocaleDateString()}
              </strong>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Executive Bio</h4>
            <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {person.bio || 'No public bio provided.'}
            </p>
          </div>

          {/* Export Interests & Skills */}
          <div className="space-y-3">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Bilateral Trade & Export Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {person.export_interests.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Core Specialisms & Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {person.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Confidential Staff Notes (Staff Only) */}
          {canSeeStaffNotes ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider">
                    Staff-Only Confidential Notes
                  </span>
                </div>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setNotesDraft(person.staff_notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Save
                  </button>
                )}
              </div>

              {!isEditingNotes ? (
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {person.staff_notes || 'No confidential staff notes on file.'}
                </p>
              ) : (
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
