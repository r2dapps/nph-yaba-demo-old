import React from 'react';
import { useData } from '../../context/DataContext';
import { Plane, Send } from 'lucide-react';
import { isStaffRole } from '../../types';
import { Btn, PageHeader, Panel, StatusPill } from '../ui';

export const DashboardScreen: React.FC<{
  onOpenOrgDetail: (orgId: string) => void;
  onOpenPersonDetail: (personId: string) => void;
}> = ({ onOpenOrgDetail }) => {
  const {
    currentUser,
    currentRole,
    can,
    setActiveTab,
    organisations,
    memberships,
    events,
    missions,
    tasks,
    referrals,
    auditLogs,
    formatCurrency,
    completeTask,
  } = useData();

  const isStaff = isStaffRole(currentRole);
  const userOrg = organisations.find((o) => o.id === currentUser.organisation_id);
  const userMembership = memberships.find((m) => m.organisation_id === currentUser.organisation_id);
  const activeMembers = organisations.filter((o) => o.status === 'Active').length;
  const graceMembers = organisations.filter((o) => o.status === 'Grace').length;
  const totalReferralGbp = referrals.reduce((sum, r) => sum + r.value_gbp, 0);
  const totalCommissionGbp = referrals.reduce((sum, r) => sum + r.commission_amount, 0);
  const upcomingEventsCount = events.filter((e) => e.status === 'Upcoming').length;
  const openTasks = tasks.filter((t) => t.status === 'Pending');
  const breachedTasks = openTasks.filter((t) => t.breached);
  const firstName = currentUser.full_name.split(' ')[0];

  return (
    <div className="space-y-8">
      <PageHeader
        kicker={userOrg?.name || 'NPH / YABA'}
        title={`Welcome, ${firstName}`}
        description={
          isStaff
            ? 'Membership, missions and introductions across the UK–India corridor. Sample figures for this demonstration.'
            : 'Your organisation membership, seats, missions and introductions.'
        }
        actions={
          isStaff ? (
            <>
              {can('approve_suspend_members') && (
                <Btn variant="primary" onClick={() => setActiveTab('registrations')}>
                  Review applications
                </Btn>
              )}
              <Btn onClick={() => setActiveTab('reports')}>Reports</Btn>
            </>
          ) : (
            <>
              <Btn variant="primary" onClick={() => setActiveTab('introductions')}>
                <Send className="w-4 h-4" />
                Request an introduction
              </Btn>
              <Btn onClick={() => setActiveTab('missions')}>
                <Plane className="w-4 h-4" />
                Trade missions
              </Btn>
            </>
          )
        }
      />

      {isStaff && breachedTasks.length > 0 && (
        <div className="border border-rose-200 bg-rose-50 text-alert rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm">
            <strong>{breachedTasks.length} task{breachedTasks.length === 1 ? '' : 's'}</strong> past SLA.{' '}
            {breachedTasks[0].title}
          </p>
          <Btn variant="danger" onClick={() => setActiveTab('workflow')}>
            Open queue
          </Btn>
        </div>
      )}

      {isStaff ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Active organisations',
              value: String(activeMembers),
              hint: `${graceMembers} in grace · ${organisations.length} on file`,
              go: 'members',
            },
            {
              label: 'Membership revenue (demo)',
              value: formatCurrency(36800, 3864000),
              hint: 'Next renewals 30 September',
              go: 'orders',
            },
            {
              label: 'Referral pipeline',
              value: formatCurrency(totalReferralGbp),
              hint: `Commission ${formatCurrency(totalCommissionGbp)}`,
              go: 'referrals',
            },
            {
              label: 'Upcoming events',
              value: String(upcomingEventsCount),
              hint: `${missions.filter((m) => m.status === 'Open').length} missions open`,
              go: 'events',
            },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setActiveTab(s.go)}
              className="text-left bg-cream border border-line rounded-lg p-5 hover:border-ink transition-colors"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{s.label}</p>
              <p className="font-display text-2xl font-semibold text-ink mt-2">{s.value}</p>
              <p className="text-xs text-muted mt-2">{s.hint}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-cream border border-line rounded-lg p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Membership</p>
            <p className="font-display text-xl font-semibold mt-2">{userOrg?.name}</p>
            <p className="text-sm text-muted mt-1">
              {userMembership?.tier} · {userMembership?.status} · renews {userMembership?.renew_on}
            </p>
            <p className="text-xs text-muted mt-3">
              Seats {userMembership?.seats_used ?? 3} of {userMembership?.seats_total ?? 5}
            </p>
          </div>
          <div className="bg-cream border border-line rounded-lg p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Mission</p>
            <p className="font-display text-xl font-semibold mt-2">Clean Tech India</p>
            <p className="text-sm text-muted mt-1">Mumbai · Pune · Bengaluru · Nov 2026</p>
            <button type="button" className="text-sm font-semibold mt-3 underline" onClick={() => setActiveTab('missions')}>
              View itinerary
            </button>
          </div>
          <div className="bg-cream border border-line rounded-lg p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Introductions</p>
            <p className="font-display text-xl font-semibold mt-2">1 made</p>
            <p className="text-sm text-muted mt-1">Midlands EV Drive Systems</p>
            <button type="button" className="text-sm font-semibold mt-3 underline" onClick={() => setActiveTab('introductions')}>
              Request another
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isStaff && (
            <Panel
              title="Tasks"
              action={
                <button type="button" className="text-sm font-semibold underline" onClick={() => setActiveTab('workflow')}>
                  All ({openTasks.length})
                </button>
              }
            >
              <ul className="divide-y divide-line">
                {openTasks.slice(0, 4).map((task) => (
                  <li key={task.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusPill tone={task.breached ? 'alert' : 'warn'}>
                          {task.breached ? 'SLA missed' : `${task.sla_hours}h SLA`}
                        </StatusPill>
                        <span className="text-sm font-semibold">{task.title}</span>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {task.assignee_role} · due {new Date(task.due_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <Btn onClick={() => completeTask(task.id)}>Done</Btn>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel
            title="Trade missions"
            action={
              <button type="button" className="text-sm font-semibold underline" onClick={() => setActiveTab('missions')}>
                Calendar
              </button>
            }
          >
            <div className="divide-y divide-line">
              {missions.map((m) => (
                <div key={m.id} className="px-5 py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <StatusPill>{m.country}</StatusPill>
                      <h3 className="font-display text-lg font-semibold mt-2">{m.title}</h3>
                      <p className="text-xs text-muted mt-1">
                        {new Date(m.start_date).toLocaleDateString('en-GB')} – {new Date(m.end_date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <p className="font-semibold shrink-0">{formatCurrency(m.price_gbp, m.price_inr)}</p>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{m.itinerary_summary}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.key_sectors.map((sec) => (
                      <StatusPill key={sec}>{sec}</StatusPill>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Directory">
            <ul className="divide-y divide-line">
              {organisations.slice(0, 5).map((org) => (
                <li key={org.id}>
                  <button
                    type="button"
                    onClick={() => onOpenOrgDetail(org.id)}
                    className="w-full text-left px-5 py-3 hover:bg-paper flex items-center justify-between gap-2"
                  >
                    <span>
                      <span className="block text-sm font-semibold">{org.name}</span>
                      <span className="block text-xs text-muted">
                        {org.sector} · {org.city}
                      </span>
                    </span>
                    <StatusPill tone={org.membership_tier === 'Premier' ? 'brass' : 'neutral'}>{org.membership_tier}</StatusPill>
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-3">
              <Btn className="w-full" onClick={() => setActiveTab('directory')}>
                Full directory
              </Btn>
            </div>
          </Panel>

          {isStaff && (
            <Panel
              title="Activity"
              action={
                <button type="button" className="text-sm font-semibold underline" onClick={() => setActiveTab('security')}>
                  Log
                </button>
              }
            >
              <ul className="px-5 py-3 space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <li key={log.id} className="text-xs border-l-2 border-brass pl-3">
                    <p className="text-muted">{new Date(log.at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    <p className="font-medium text-ink mt-0.5">{log.details}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
};
