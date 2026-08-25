import React from 'react';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Tags,
  BookOpen,
  Briefcase,
  FileCheck2,
  Calendar,
  Plane,
  Video,
  ShoppingBag,
  Receipt,
  FileText,
  Mail,
  Network,
  TrendingUp,
  Send,
  Zap,
  Clock,
  BarChart3,
  ShieldCheck,
  UploadCloud,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  rolesAllowed?: UserRole[];
  category: string;
}

export const Sidebar: React.FC<{
  onOpenSheetViewer: () => void;
  onNavigate?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ onOpenSheetViewer, onNavigate, collapsed, onToggleCollapse }) => {
  const { currentRole, activeTab, setActiveTab, tasks, registrations, introductions, blogs, cart } = useData();

  const pendingSlaCount = tasks.filter((t) => t.status === 'Pending' && t.breached).length;
  const pendingRegsCount = registrations.filter((r) => r.status === 'Submitted').length;
  const pendingIntrosCount = introductions.filter((i) => i.status === 'Requested').length;
  const pendingBlogsCount = blogs.filter((b) => b.status === 'Submitted').length;

  const go = (id: string) => {
    setActiveTab(id);
    onNavigate?.();
  };

  const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, category: 'Overview' },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      category: 'Membership',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Read-only'],
    },
    {
      id: 'organisations',
      label: 'Organisations',
      icon: Building2,
      category: 'Membership',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Marketing Manager', 'Events Manager', 'Finance', 'Read-only'],
    },
    { id: 'directory', label: 'Directory', icon: BookOpen, category: 'Membership' },
    {
      id: 'my-company',
      label: 'My organisation',
      icon: Briefcase,
      category: 'Membership',
      rolesAllowed: ['Company Admin', 'Member', 'Member / Delegate'],
    },
    {
      id: 'plans',
      label: 'Plans & fees',
      icon: Tags,
      category: 'Membership',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Finance', 'Read-only'],
    },
    {
      id: 'registrations',
      label: 'Approvals',
      icon: FileCheck2,
      badge: pendingRegsCount > 0 ? pendingRegsCount : undefined,
      category: 'Membership',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Events Manager'],
    },
    { id: 'events', label: 'Events', icon: Calendar, category: 'Trade' },
    { id: 'missions', label: 'Trade missions', icon: Plane, category: 'Trade' },
    { id: 'webinars', label: 'Webinars', icon: Video, category: 'Trade' },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined, category: 'Finance' },
    {
      id: 'orders',
      label: 'Orders',
      icon: Receipt,
      category: 'Finance',
      rolesAllowed: ['Super Admin', 'Finance', 'Read-only', 'Company Admin', 'Member', 'Member / Delegate'],
    },
    {
      id: 'referrals',
      label: 'Referrals',
      icon: TrendingUp,
      category: 'Finance',
      rolesAllowed: ['Super Admin', 'Finance', 'Read-only'],
    },
    {
      id: 'introductions',
      label: 'Introductions',
      icon: Network,
      badge: pendingIntrosCount > 0 ? pendingIntrosCount : undefined,
      category: 'Network',
    },
    {
      id: 'blogs',
      label: 'Articles',
      icon: FileText,
      badge: pendingBlogsCount > 0 ? pendingBlogsCount : undefined,
      category: 'Network',
    },
    {
      id: 'newsletter',
      label: 'Newsletter credits',
      icon: Mail,
      category: 'Network',
      rolesAllowed: ['Super Admin', 'Marketing Manager', 'Read-only', 'Company Admin'],
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: Send,
      category: 'Network',
      rolesAllowed: ['Super Admin', 'Marketing Manager', 'Read-only'],
    },
    {
      id: 'automations',
      label: 'Journeys',
      icon: Zap,
      category: 'Network',
      rolesAllowed: ['Super Admin', 'Marketing Manager'],
    },
    {
      id: 'workflow',
      label: 'Tasks & SLA',
      icon: Clock,
      badge: pendingSlaCount > 0 ? pendingSlaCount : undefined,
      category: 'Operations',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Marketing Manager', 'Events Manager', 'Finance', 'Read-only'],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      category: 'Operations',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Marketing Manager', 'Events Manager', 'Finance', 'Read-only'],
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      category: 'Operations',
      rolesAllowed: ['Super Admin'],
    },
    {
      id: 'migration',
      label: 'Data import',
      icon: UploadCloud,
      category: 'Operations',
      rolesAllowed: ['Super Admin', 'Membership Manager', 'Finance'],
    },
  ];

  const visibleItems = NAV_ITEMS.filter((item) => !item.rolesAllowed || item.rolesAllowed.includes(currentRole));
  const categories = Array.from(new Set(visibleItems.map((item) => item.category)));

  return (
    <aside
      className={`bg-cream border-r border-line flex flex-col h-full transition-[width] duration-200 ${
        collapsed ? 'w-[4.25rem]' : 'w-[17.5rem]'
      }`}
    >
      <div className={`hidden lg:flex border-b border-line ${collapsed ? 'justify-center p-2' : 'justify-end px-2 py-2'}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 rounded-md hover:bg-paper text-ink"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {categories.map((category) => (
          <div key={category} className="mb-4">
            {!collapsed && (
              <h3 className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{category}</h3>
            )}
            <ul className="space-y-0.5">
              {visibleItems
                .filter((item) => item.category === category)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => go(item.id)}
                        title={item.label}
                        className={`w-full flex items-center rounded-md text-[13px] ${
                          collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                        } ${isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-paper'}`}
                      >
                        <span className={`flex items-center min-w-0 ${collapsed ? '' : 'gap-2.5'}`}>
                          <Icon className="w-4 h-4 shrink-0 opacity-80" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </span>
                        {!collapsed && item.badge != null && (
                          <span
                            className={`text-[10px] font-semibold min-w-5 h-5 px-1 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-brass text-ink' : 'bg-paper text-ink border border-line'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-2 border-t border-line">
        <button
          type="button"
          onClick={onOpenSheetViewer}
          title="Sample data tables"
          className={`w-full flex items-center rounded-md border border-line hover:bg-paper text-ink text-xs font-semibold ${
            collapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
          }`}
        >
          <Database className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sample data tables</span>}
        </button>
      </div>
    </aside>
  );
};
