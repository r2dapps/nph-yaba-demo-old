import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Send,
  Plus,
  Mail,
  Users,
  CheckCircle,
  Clock,
  Zap,
  Play,
  Pause,
  AlertCircle,
  Check,
} from 'lucide-react';
import { EmailCampaign, AutomationJourney, WorkflowTask } from '../../types';

export const CampaignsScreen: React.FC = () => {
  const { campaigns, sendTestCampaign } = useData();

  const [testEmail, setTestEmail] = useState('marketing@nph-demo.org');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Campaigns & Targeted Broadcasts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              Segmented Bilateral Distribution
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliver sector-specific newsletters, trade mission advisories, and policy whitepapers.
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-cream border border-line rounded-lg p-6  hover: transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {camp.segment}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {camp.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">{camp.name || (camp as any).title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subject: <strong className="text-slate-800">{camp.subject_line}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Recipients / Sent</span>
                  <strong className="text-slate-900">
                    {((camp as any).recipients_count ?? camp.sent ?? 0).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Scheduled / Sent</span>
                  <strong className="text-slate-900">
                    {new Date(camp.scheduled_at).toLocaleDateString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => sendTestCampaign(camp.id, testEmail)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Test Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AutomationsScreen: React.FC = () => {
  const { automations, toggleAutomation } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Automation Journeys & Life-Cycle Triggers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              6 Core Chamber Workflows
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications, onboarding welcome sequences, grace payment dunning, and visa checklist reminders.
          </p>
        </div>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className={`border rounded-2xl p-5  transition-all flex items-start justify-between gap-4 ${
              auto.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${
                    auto.is_active ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{auto.name}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {auto.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span>Trigger: {auto.trigger}</span>
                <span>·</span>
                <span>{auto.executions_count} Executions</span>
              </div>
            </div>

            <button
              onClick={() => toggleAutomation(auto.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                auto.is_active
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {auto.is_active ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Active
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Paused
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const WorkflowSlaScreen: React.FC = () => {
  const { tasks, completeTask, formatCurrency } = useData();

  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const breachedCount = tasks.filter((t) => t.breached && t.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Workflow & SLA Compliance Queue
            </h1>
            {breachedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                {breachedCount} SLA Breaches Detected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational service level agreements across all staff departments with automated countdown timers.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cream border border-line rounded-lg px-3 py-2 text-xs font-bold text-slate-700 "
          >
            <option value="ALL">All Tasks ({tasks.length})</option>
            <option value="Pending">Pending SLA ({tasks.filter((t) => t.status === 'Pending').length})</option>
            <option value="Completed">Completed ({tasks.filter((t) => t.status === 'Completed').length})</option>
          </select>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Task Title & Details</th>
                <th className="px-4 py-3">Assigned Staff Role</th>
                <th className="px-4 py-3">SLA Window</th>
                <th className="px-4 py-3">Target Due Timestamp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    task.breached && task.status === 'Pending' ? 'bg-rose-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {task.id}</p>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">
                      {task.assignee_role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-slate-700">
                    {task.sla_hours} Hours Target
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-800">
                      {new Date(task.due_at).toLocaleDateString()} at{' '}
                      {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.breached
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status === 'Completed'
                        ? 'Completed'
                        : task.breached
                        ? 'BREACHED'
                        : 'On Schedule'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    {task.status === 'Pending' ? (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs  transition-colors"
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">Resolved</span>
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
