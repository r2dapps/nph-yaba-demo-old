import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Building2,
  Plane,
  CreditCard,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const ReportsScreen: React.FC = () => {
  const { organisations, memberships, referrals, events, missions, formatCurrency, exportSheetCSV } = useData();

  // Tier breakdown data
  const tierCounts: Record<string, number> = {};
  organisations.forEach((o) => {
    tierCounts[o.membership_tier] = (tierCounts[o.membership_tier] || 0) + 1;
  });
  const tierData = Object.keys(tierCounts).map((tier) => ({
    name: tier,
    value: tierCounts[tier],
  }));

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#64748b'];

  // Monthly Revenue Trend Data
  const revenueTrendData = [
    { month: 'Jan', gbp: 28400, inr: 2982000 },
    { month: 'Feb', gbp: 31200, inr: 3276000 },
    { month: 'Mar', gbp: 34800, inr: 3654000 },
    { month: 'Apr', gbp: 33500, inr: 3517500 },
    { month: 'May', gbp: 39800, inr: 4179000 },
    { month: 'Jun', gbp: 42800, inr: 4494000 },
  ];

  // Referral Deal stages data
  const referralPipelineData = [
    { stage: 'Lead', count: 2, value: 550000 },
    { stage: 'Qualified', count: 3, value: 1250000 },
    { stage: 'Signed', count: 2, value: 1850000 },
    { stage: 'Invoiced', count: 1, value: 310000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Chamber Intelligence & Executive Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              Interactive Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics for bilateral trade growth, membership retention, event engagement, and referral commissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSheetCSV('Organisations')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Executive Deck (CSV)
          </button>
        </div>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Active Member Base</span>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{organisations.length} Orgs</p>
          <span className="text-xs text-emerald-700 font-semibold">91.6% Retention Rate</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Annualized Run Rate</span>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(513600, 53928000)}</p>
          <span className="text-xs text-emerald-700 font-semibold">+18.5% YoY</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Bilateral Deal Pipeline</span>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{formatCurrency(3960000)}</p>
          <span className="text-xs text-slate-500">8 active trade deals</span>
        </div>

        <div className="bg-cream border border-line rounded-lg p-4 ">
          <span className="text-slate-500 text-xs font-bold uppercase">Delegates Deployed</span>
          <p className="text-2xl font-semibold text-purple-600 mt-1">42 Executives</p>
          <span className="text-xs text-slate-500">Across 3 trade missions</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Trend Line */}
        <div className="bg-cream border border-line rounded-lg p-6  space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Monthly Revenue Trajectory (GBP / INR)
            </h3>
            <span className="text-xs text-slate-400 font-medium">H1 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="gbp"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#d97706' }}
                  name="Monthly Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Member Tier Distribution Pie */}
        <div className="bg-cream border border-line rounded-lg p-6  space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              Membership Tier Mix
            </h3>
            <span className="text-xs text-slate-400 font-medium">All Members</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Referral Stage Volume Bar */}
        <div className="bg-cream border border-line rounded-lg p-6  space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Bilateral Deal Value by Stage Pipeline (£ GBP)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Chamber Facilitated</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referralPipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Deal Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityAuditScreen: React.FC = () => {
  const { auditLogs, users } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Security Governance & Platform Audit Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              Super Admin Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit stream of administrative actions, role overrides, status changes, and authentication events.
          </p>
        </div>
      </div>

      {/* Users & MFA Matrix */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Staff & Member User Accounts & MFA Enforcement
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">User Name & Email</th>
                <th className="px-4 py-3">Assigned Platform Role</th>
                <th className="px-4 py-3">MFA Status</th>
                <th className="px-4 py-3">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{u.full_name}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.mfa_enabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.mfa_enabled ? 'MFA Enforced (Authenticator)' : 'Optional'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono">
                    {new Date(u.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(u.last_login).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            Activity log
          </h3>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{log.entity_id}</span>
                </div>
                <p className="text-slate-600">{log.details}</p>
                <p className="text-[11px] text-slate-400">By {log.user_email}</p>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-400 flex-shrink-0">
                {new Date(log.at).toLocaleDateString()} at{' '}
                {new Date(log.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MigrationScreen: React.FC = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [reconciled, setReconciled] = React.useState(false);

  const handleSimulateRecon = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setReconciled(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Legacy Excel Data Migration & Reconciliation Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
              2,000-Row Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated schema mapping, duplicate email deduplication, and UK-India postal code normalization.
          </p>
        </div>
      </div>

      <div className="bg-cream border border-line rounded-lg p-6  space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Source Workbook</span>
            <p className="font-bold text-slate-900 text-sm">YABA_Legacy_Members_2020_2025.xlsx</p>
            <p className="text-slate-500">2,000 Rows · 18 Columns</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Target Destination</span>
            <p className="font-bold text-ink text-sm">Data model (24 tables)</p>
            <p className="text-emerald-700 font-semibold">Valid Schema Mapped</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Deduplication Engine</span>
            <p className="font-bold text-slate-900 text-sm">Email & VAT Hash Matching</p>
            <p className="text-slate-500">0 Collisions</p>
          </div>
        </div>

        {reconciled ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-emerald-950 text-base">
                  Reconciliation Complete: 2,000 Records Reconciled!
                </h4>
                <p className="text-xs text-emerald-800">
                  1,842 Active Members, 124 Historical Archives, 34 Grace Restorations.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <button
              onClick={handleSimulateRecon}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl bg-ink text-cream hover:bg-ink-2 font-semibold text-xs  transition-all"
            >
              {isProcessing ? 'Reconciling 2,000 Rows...' : 'Run 2,000-Row Migration Simulator'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
